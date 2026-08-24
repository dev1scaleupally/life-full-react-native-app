import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DomainId } from '../../services/api/types';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export type ChatDomainState = {
  messages: ChatMessage[];
  /** id of the assistant message currently being streamed into, or null. */
  streamingMessageId: string | null;
  status: 'idle' | 'streaming' | 'error';
  error: string | null;
  /** Set when the stream's error line is "Domain ... is locked for this
   * user" — the spec's stand-in for a 403 on this route. */
  locked: boolean;
};

export type ChatState = Record<DomainId, ChatDomainState>;

const DOMAIN_IDS: DomainId[] = [
  'core_drivers',
  'social_architecture',
  'physical_vitality',
  'resource_awareness',
];

function emptyDomainState(): ChatDomainState {
  return { messages: [], streamingMessageId: null, status: 'idle', error: null, locked: false };
}

const initialState: ChatState = DOMAIN_IDS.reduce((state, domainId) => {
  state[domainId] = emptyDomainState();
  return state;
}, {} as ChatState);

const isDomainLockedMessage = (message: string) => /is locked for this user/i.test(message);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /** UI dispatches this; the saga owns turning it into an optimistic user
     * message plus a streaming assistant message. */
    messageSent: (
      state,
      action: PayloadAction<{ domainId: DomainId; text: string; clientMessageId: string }>,
    ) => {
      const domain = state[action.payload.domainId];
      domain.status = 'streaming';
      domain.error = null;
      domain.locked = false;
      domain.messages.push({ id: action.payload.clientMessageId, role: 'user', text: action.payload.text });
      const assistantId = `${action.payload.clientMessageId}:assistant`;
      domain.messages.push({ id: assistantId, role: 'assistant', text: '' });
      domain.streamingMessageId = assistantId;
    },
    deltaReceived: (state, action: PayloadAction<{ domainId: DomainId; delta: string }>) => {
      const domain = state[action.payload.domainId];
      const message = domain.messages.find(m => m.id === domain.streamingMessageId);
      if (message) message.text += action.payload.delta;
    },
    streamDone: (
      state,
      action: PayloadAction<{ domainId: DomainId; clean: string; phase: string; sessionScenario: string }>,
    ) => {
      const domain = state[action.payload.domainId];
      const message = domain.messages.find(m => m.id === domain.streamingMessageId);
      if (message) message.text = action.payload.clean;
      domain.streamingMessageId = null;
      domain.status = 'idle';
    },
    /** The `{"error": "..."}` line arriving mid-stream (HTTP 200 the whole
     * time) — includes the "domain is locked" case. */
    streamErrored: (state, action: PayloadAction<{ domainId: DomainId; message: string }>) => {
      const domain = state[action.payload.domainId];
      // Drop the empty assistant bubble that was never filled in.
      domain.messages = domain.messages.filter(m => m.id !== domain.streamingMessageId);
      domain.streamingMessageId = null;
      domain.status = 'error';
      domain.error = action.payload.message;
      domain.locked = isDomainLockedMessage(action.payload.message);
    },
    /** A real HTTP error before streaming started (400 bad domainId/text). */
    requestFailed: (state, action: PayloadAction<{ domainId: DomainId; message: string }>) => {
      const domain = state[action.payload.domainId];
      domain.messages = domain.messages.filter(m => m.id !== domain.streamingMessageId);
      domain.streamingMessageId = null;
      domain.status = 'error';
      domain.error = action.payload.message;
    },
  },
});

export const chatActions = chatSlice.actions;
