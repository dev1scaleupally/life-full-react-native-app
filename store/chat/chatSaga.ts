import type { PayloadAction } from '@reduxjs/toolkit';
import { END, eventChannel, type EventChannel } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import { streamChatMessage } from '../../services/api/chatApi';
import { ApiError, type ChatStreamChunk, type DomainId } from '../../services/api/types';
import { chatActions } from './chatSlice';

type ChatChannelEvent =
  | { kind: 'chunk'; chunk: Exclude<ChatStreamChunk, { error: string }> }
  | { kind: 'streamError'; message: string }
  | { kind: 'openError'; error: ApiError | Error };

function createChatChannel(
  domainId: DomainId,
  body: { text: string; clientMessageId: string },
): EventChannel<ChatChannelEvent> {
  return eventChannel(emit => {
    const { abort } = streamChatMessage(domainId, body, {
      onChunk: chunk => emit({ kind: 'chunk', chunk }),
      onStreamError: message => {
        emit({ kind: 'streamError', message });
        emit(END);
      },
      onOpenError: error => {
        emit({ kind: 'openError', error });
        emit(END);
      },
    });
    return abort;
  });
}

function* handleMessageSent(
  action: PayloadAction<{ domainId: DomainId; text: string; clientMessageId: string }>,
) {
  const { domainId, text, clientMessageId } = action.payload;
  const channel: EventChannel<ChatChannelEvent> = yield call(createChatChannel, domainId, {
    text,
    clientMessageId,
  });
  try {
    while (true) {
      const event: ChatChannelEvent = yield take(channel);
      if (event.kind === 'openError') {
        const message = event.error instanceof ApiError ? event.error.message : event.error.message;
        yield put(chatActions.requestFailed({ domainId, message }));
        return;
      }
      if (event.kind === 'streamError') {
        yield put(chatActions.streamErrored({ domainId, message: event.message }));
        return;
      }
      if ('delta' in event.chunk) {
        yield put(chatActions.deltaReceived({ domainId, delta: event.chunk.delta }));
      } else {
        yield put(
          chatActions.streamDone({
            domainId,
            clean: event.chunk.clean,
            phase: event.chunk.phase,
            sessionScenario: event.chunk.sessionScenario,
          }),
        );
        return;
      }
    }
  } finally {
    channel.close();
  }
}

export function* chatSaga() {
  // takeEvery: a message sent in one domain must not cancel a stream
  // already in flight in another (or a rapid double-send in the same one).
  yield takeEvery(chatActions.messageSent.type, handleMessageSent);
}
