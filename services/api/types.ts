/**
 * Shapes shared across the real backend's /v1 API. Mirrors the spec exactly
 * (field names, unions) so slices/sagas never need their own translation
 * layer. Kept separate from services/auth/types.ts, which models the local
 * mock account system (subscriptionStatus, emailVerified, etc.) that this
 * backend doesn't have.
 */

/** Shared error envelope for every non-streaming route. */
export type ApiErrorBody = {
  statusCode: number;
  message: string;
  issues?: unknown[];
  /** Only set by POST /auth/verify-email's 410 response — the deep link that
   * triggers it carries just a token, so this is the only way the caller
   * learns which address an expired link belonged to. */
  email?: string;
};

/** Thrown by httpClient for any non-2xx response; sagas catch this. */
export class ApiError extends Error {
  statusCode: number;
  issues?: unknown[];
  email?: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.issues = body.issues;
    this.email = body.email;
  }
}

/** What every auth-issuing route stores (tokenStore only ever needs this much). */
export type TokenPair = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

/** register/login/google/apple all return this; /auth/refresh returns just
 * a TokenPair — it doesn't re-report verification status. */
export type AuthSession = TokenPair & {
  emailVerified: boolean;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type VerifyEmailResult = { ok: true; email: string };

export type GoogleLoginInput = { idToken: string };

export type AppleLoginInput = {
  identityToken: string;
  /** Apple only ever sends the name on the account's first authorization. */
  firstName?: string;
  lastName?: string;
};

export type DomainId =
  | 'core_drivers'
  | 'social_architecture'
  | 'physical_vitality'
  | 'resource_awareness';

export type OnboardingCatalog = {
  catalogVersion: string;
  layerWeights: { behavior: number; thought: number; feeling: number };
  sequencing: Record<string, unknown>;
  sections: Array<{
    id: string;
    scoredForSequencing: boolean;
    questions: Array<{
      id: string;
      layer: 'behavior' | 'thought' | 'feeling';
      coding: 'standard' | 'reverse';
      text: string;
    }>;
  }>;
};

export type BasicProfile = {
  firstName: string;
  ageRange: string;
  gender: string;
  genderSelfDescribed: string | null;
  relationshipStatus: string;
  livingSituation: string;
  location: string;
  careerField: string;
  careerFieldOther: string | null;
  careerRole: string | null;
  retirementStatus: string;
  howLongRetired: string | null;
  primaryReasonForRetiring: string[];
  primaryReasonOther: string | null;
};

/** GET /v1/auth/me — the account's identity plus everything from
 * BasicProfile, defaulted (not merely absent) even before onboarding is
 * ever submitted, per auth.service.ts:100. */
export type MeResponse = {
  id: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
} & BasicProfile;

export type OnboardingResponseEntry = {
  questionId: string;
  rawScore: number;
  userText: string | null;
};

export type OnboardingSubmission = {
  basicProfile: BasicProfile;
  responses: OnboardingResponseEntry[];
};

export type DomainBand = 'Steady' | string;

export type DomainScore = {
  domain: DomainId;
  score: number;
  band: DomainBand;
};

export type OnboardingResult = {
  assessmentId: string;
  domainScores: DomainScore[];
  priorityOrder: DomainId[];
};

export type ChatStreamChunk =
  | { delta: string }
  | {
      done: true;
      clean: string;
      malformedCount: number;
      remindersChanged: boolean;
      safety: unknown;
      phase: string;
      sessionScenario: string;
    }
  | { error: string };

export type TaskStatus = 'scheduled' | 'completed';
export type ReviewOutcome = 'completed' | 'partial' | 'not_completed';

export type Task = {
  id: string;
  userId: string;
  title: string;
  note: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  status: TaskStatus;
  source: 'user' | string;
  domainId: DomainId | null;
  sessionId: string | null;
  ideaId: string | null;
  createdAt: string;
  completedAt: string | null;
  reviewReportedAt: string | null;
  reviewOutcome: ReviewOutcome | null;
  reviewNotes: string | null;
};

export type CreateTaskInput = {
  title: string;
  note?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  domainId?: DomainId;
};

export type ReviewTaskInput = {
  outcome: ReviewOutcome;
  notes?: string;
};

export type Reminder = {
  id: string;
  kind: 'action' | 'review' | 'reengagement';
  fireAtLocal: string;
  title: string;
  body: string;
  taskId: string;
};

export type ProgressPoint = { at: string; score: number; band: DomainBand };
export type CognitiveAlignmentPoint = { at: string; score: number };

export type Progress = {
  domains: Array<{ domain: DomainId; points: ProgressPoint[] }>;
  cognitiveAlignment: CognitiveAlignmentPoint[];
  overallWellbeing: ProgressPoint[];
};
