/**
 * "Your reflections" — a single linear Likert survey across five sections.
 * Cognitive Alignment is an overall baseline, not one of the four scored
 * life domains (it's not part of `DomainId` in services/api/types.ts).
 *
 * Domain keys and question ids here are exactly GET /v1/onboarding/catalog's
 * section/question ids (cognitive_alignment/ca_q1../core_drivers/cd_q1../
 * social_architecture/sa_q1../physical_vitality/pv_q1../resource_awareness/
 * ra_q1..) — POST /v1/onboarding/responses identifies each answer by
 * `questionId`, so these must match the backend exactly; they're deliberately
 * NOT the same as tokens/theme.ts's `domains` keys (drivers/social/vitality/
 * resource), which are a separate, unrelated short-key convention used only
 * for that file's icon/color lookup.
 *
 * Every question carries the layer it measures (Feeling / Thought / Behavior)
 * and its effective scoring weight within its section — each section's
 * weights sum to 100. `reverseCoded` (whether a raw 1–5 answer should be
 * inverted to 6 - raw before scoring) mirrors the catalog's `coding` field
 * for every section — scoring itself still happens server-side; the app
 * never pre-reverses a rawScore before sending it.
 */

export type Layer = 'feeling' | 'thought' | 'behavior';

export type ReflectionQuestion = {
  id: string;
  text: string;
  layer: Layer;
  /** Effective weight within its section, as a percentage (sums to 100 per section). */
  weight: number;
  /** Whether a higher raw answer should be inverted (6 - raw) before scoring. */
  reverseCoded?: boolean;
};

export type ReflectionDomain = {
  key: string;
  name: string;
  questions: ReflectionQuestion[];
};

export const DOMAINS: ReflectionDomain[] = [
  {
    key: 'cognitive_alignment',
    name: 'Cognitive Alignment',
    questions: [
      {
        id: 'ca_q1',
        text: 'My overall experience of retirement has been more negative than positive.',
        layer: 'feeling',
        weight: 25,
        reverseCoded: true,
      },
      {
        id: 'ca_q2',
        text: 'I can picture what a fulfilling retirement looks like for me.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: false,
      },
      {
        id: 'ca_q3',
        text: 'My retirement has not unfolded the way I expected it to.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: true,
      },
      {
        id: 'ca_q4',
        text: 'I often spend a day without a clear sense of purpose.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: true,
      },
      {
        id: 'ca_q5',
        text: 'I make a point of trying new things since retiring rather than sticking to familiar routines.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: false,
      },
    ],
  },
  {
    key: 'core_drivers',
    name: 'Core Drivers',
    questions: [
      {
        id: 'cd_q1',
        text: 'Most mornings I wake up not knowing what I am looking forward to that day.',
        layer: 'feeling',
        weight: 25,
        reverseCoded: true,
      },
      {
        id: 'cd_q2',
        text: 'I believe there are still things ahead of me that will matter as much as my previous role did.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: false,
      },
      {
        id: 'cd_q3',
        text: 'Defining who I am outside of my professional identity has been a struggle since retiring.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: true,
      },
      {
        id: 'cd_q4',
        text: 'I find myself waiting for motivation to arrive rather than actively pursuing what interests me.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: true,
      },
      {
        id: 'cd_q5',
        text: 'I am intentional about how I spend my time each day.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: false,
      },
    ],
  },
  {
    key: 'social_architecture',
    name: 'Social Architecture',
    questions: [
      {
        id: 'sa_q1',
        text: 'Since retiring, my social world has felt lonelier than I expected.',
        layer: 'feeling',
        weight: 25,
        reverseCoded: true,
      },
      {
        id: 'sa_q2',
        text: 'I believe that investing in my social life will make a meaningful difference to my retirement experience.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: false,
      },
      {
        id: 'sa_q3',
        text: 'I am open to building new social connections at this stage of my life.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: false,
      },
      {
        id: 'sa_q4',
        text: 'Social situations feel less appealing to me than they used to.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: true,
      },
      {
        id: 'sa_q5',
        text: 'I am the one who typically reaches out to maintain my social connections.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: false,
      },
    ],
  },
  {
    key: 'physical_vitality',
    name: 'Physical Vitality',
    questions: [
      {
        id: 'pv_q1',
        text: 'My energy levels have been lower since retiring.',
        layer: 'feeling',
        weight: 25,
        reverseCoded: true,
      },
      {
        id: 'pv_q2',
        text: "I don't believe I can do much to improve my physical health and energy levels.",
        layer: 'thought',
        weight: 35,
        reverseCoded: true,
      },
      {
        id: 'pv_q3',
        text: 'I make a point of staying physically active as part of my daily routine.',
        layer: 'behavior',
        weight: 40,
        reverseCoded: false,
      },
    ],
  },
  {
    key: 'resource_awareness',
    name: 'Resource Awareness',
    questions: [
      {
        id: 'ra_q1',
        text: 'Financial uncertainty has been weighing on my retirement experience more than I expected.',
        layer: 'feeling',
        weight: 25,
        reverseCoded: true,
      },
      {
        id: 'ra_q2',
        text: 'I worry that my financial resources will run out before I do.',
        layer: 'thought',
        weight: 35,
        reverseCoded: true,
      },
      {
        id: 'ra_q3',
        text: 'I actively plan and budget for the activities and experiences I want in retirement.',
        layer: 'behavior',
        weight: 40,
        reverseCoded: false,
      },
    ],
  },
];

/** Raw 1–5 answer per question id, keyed by `ReflectionQuestion.id`. */
export type ReflectionAnswers = Record<string, number>;

export const LIKERT_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

/** Every question across every section, in display order, each tagged with its section. */
export const FLAT_QUESTIONS: {
  domain: ReflectionDomain;
  question: ReflectionQuestion;
}[] = DOMAINS.flatMap(domain =>
  domain.questions.map(question => ({ domain, question })),
);
