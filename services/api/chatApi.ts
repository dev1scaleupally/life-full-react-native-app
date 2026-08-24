import { API_BASE_URL } from '../../config/apiConfig';
import { tokenStore } from './tokenStore';
import { ApiError, type ApiErrorBody, type ChatStreamChunk, type DomainId } from './types';

type NonErrorChatChunk = Exclude<ChatStreamChunk, { error: string }>;

export type ChatStreamHandlers = {
  /** One call per NDJSON delta/done line — the {"error": "..."} line is
   * routed to onStreamError instead. */
  onChunk: (chunk: NonErrorChatChunk) => void;
  /** The `{"error": "..."}` line — arrives mid-stream, HTTP 200. Also how a
   * locked domain shows up ({"error":"Domain \"...\" is locked..."}). */
  onStreamError: (message: string) => void;
  /** A real HTTP error (400 bad domainId/text, or a 401) that arrived
   * before any streaming started. */
  onOpenError: (error: ApiError | Error) => void;
};

/**
 * POSTs to /chat/:domainId/messages and feeds the NDJSON response back
 * through `handlers` as it arrives.
 *
 * React Native's `fetch` doesn't reliably expose a readable-stream body
 * reader, so this uses XMLHttpRequest instead: readyState 3 (LOADING)
 * fires repeatedly as data arrives, with `responseText` holding everything
 * received so far — the standard trick for consuming a streaming response
 * body in RN. Lines are buffered until a trailing '\n' completes them,
 * since a chunk boundary can land mid-line.
 */
export function streamChatMessage(
  domainId: DomainId,
  body: { text: string; clientMessageId: string },
  handlers: ChatStreamHandlers,
): { abort: () => void } {
  const xhr = new XMLHttpRequest();
  let readCursor = 0;
  let buffer = '';

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let chunk: ChatStreamChunk;
    try {
      chunk = JSON.parse(trimmed);
    } catch {
      // Malformed line from the server — the stream's own malformedCount
      // (in the final `done` chunk) is the source of truth for this, so
      // just drop it here rather than surfacing a client-side error.
      return;
    }
    if ('error' in chunk) {
      handlers.onStreamError(chunk.error);
    } else {
      handlers.onChunk(chunk);
    }
  };

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.LOADING && xhr.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    if (xhr.status !== 200) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        try {
          const errorBody: ApiErrorBody = JSON.parse(xhr.responseText);
          handlers.onOpenError(new ApiError(errorBody));
        } catch {
          handlers.onOpenError(new Error(`Chat request failed (status ${xhr.status})`));
        }
      }
      return;
    }

    buffer += xhr.responseText.slice(readCursor);
    readCursor = xhr.responseText.length;

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // last element is '' if buffer ended on '\n', else a partial line to keep
    lines.forEach(processLine);

    if (xhr.readyState === XMLHttpRequest.DONE && buffer) {
      processLine(buffer);
      buffer = '';
    }
  };

  xhr.open('POST', `${API_BASE_URL}/v1/chat/${domainId}/messages`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  const session = tokenStore.get();
  if (session?.accessToken) {
    xhr.setRequestHeader('Authorization', `Bearer ${session.accessToken}`);
  }
  xhr.send(JSON.stringify(body));

  return { abort: () => xhr.abort() };
}
