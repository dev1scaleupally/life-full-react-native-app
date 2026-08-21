/**
 * "Your reflections" — a single linear Likert survey across five sections.
 * Cognitive Alignment is an overall baseline; the other four map 1:1 to the
 * life domains in tokens/theme.ts's `domains` (same keys: drivers, social,
 * vitality, resource).
 *
 * Every question carries the layer it measures (Feeling / Thought / Behavior)
 * and its effective scoring weight within its section — each section's
 * weights sum to 100. `reverseCoded` (whether a raw 1–5 answer should be
 * inverted to 6 - raw before scoring) is only set where the spec gave it
 * explicitly: Core Drivers, via its worked example. The other four sections'
 * reverse-coding hasn't been specified yet — confirm it before any scoring
 * logic reads this field for them.
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
    key: 'cognitive',
    name: 'Cognitive Alignment',
    questions: [
      {
        id: 'cognitive-q1',
        text: 'My overall experience of retirement has been more negative than positive.',
        layer: 'feeling',
        weight: 25,
      },
      {
        id: 'cognitive-q2',
        text: 'I can picture what a fulfilling retirement looks like for me.',
        layer: 'thought',
        weight: 17.5,
      },
      {
        id: 'cognitive-q3',
        text: 'My retirement has not unfolded the way I expected it to.',
        layer: 'thought',
        weight: 17.5,
      },
      {
        id: 'cognitive-q4',
        text: 'I often spend a day without a clear sense of purpose.',
        layer: 'behavior',
        weight: 20,
      },
      {
        id: 'cognitive-q5',
        text: 'I make a point of trying new things since retiring rather than sticking to familiar routines.',
        layer: 'behavior',
        weight: 20,
      },
    ],
  },
  {
    key: 'drivers',
    name: 'Core Drivers',
    questions: [
      {
        id: 'drivers-q1',
        text: 'Most mornings I wake up not knowing what I am looking forward to that day.',
        layer: 'feeling',
        weight: 25,
        reverseCoded: true,
      },
      {
        id: 'drivers-q2',
        text: 'I believe there are still things ahead of me that will matter as much as my previous role did.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: false,
      },
      {
        id: 'drivers-q3',
        text: 'Defining who I am outside of my professional identity has been a struggle since retiring.',
        layer: 'thought',
        weight: 17.5,
        reverseCoded: true,
      },
      {
        id: 'drivers-q4',
        text: 'I find myself waiting for motivation to arrive rather than actively pursuing what interests me.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: true,
      },
      {
        id: 'drivers-q5',
        text: 'I am intentional about how I spend my time each day.',
        layer: 'behavior',
        weight: 20,
        reverseCoded: false,
      },
    ],
  },
  {
    key: 'social',
    name: 'Social Architecture',
    questions: [
      {
        id: 'social-q1',
        text: 'Since retiring, my social world has felt lonelier than I expected.',
        layer: 'feeling',
        weight: 25,
      },
      {
        id: 'social-q2',
        text: 'I believe that investing in my social life will make a meaningful difference to my retirement experience.',
        layer: 'thought',
        weight: 17.5,
      },
      {
        id: 'social-q3',
        text: 'I am open to building new social connections at this stage of my life.',
        layer: 'thought',
        weight: 17.5,
      },
      {
        id: 'social-q4',
        text: 'Social situations feel less appealing to me than they used to.',
        layer: 'behavior',
        weight: 20,
      },
      {
        id: 'social-q5',
        text: 'I am the one who typically reaches out to maintain my social connections.',
        layer: 'behavior',
        weight: 20,
      },
    ],
  },
  {
    key: 'vitality',
    name: 'Physical Vitality',
    questions: [
      {
        id: 'vitality-q1',
        text: 'My energy levels have been lower since retiring.',
        layer: 'feeling',
        weight: 25,
      },
      {
        id: 'vitality-q2',
        text: "I don't believe I can do much to improve my physical health and energy levels.",
        layer: 'thought',
        weight: 35,
      },
      {
        id: 'vitality-q3',
        text: 'I make a point of staying physically active as part of my daily routine.',
        layer: 'behavior',
        weight: 40,
      },
    ],
  },
  {
    key: 'resource',
    name: 'Resource Awareness',
    questions: [
      {
        id: 'resource-q1',
        text: 'Financial uncertainty has been weighing on my retirement experience more than I expected.',
        layer: 'feeling',
        weight: 25,
      },
      {
        id: 'resource-q2',
        text: 'I worry that my financial resources will run out before I do.',
        layer: 'thought',
        weight: 35,
      },
      {
        id: 'resource-q3',
        text: 'I actively plan and budget for the activities and experiences I want in retirement.',
        layer: 'behavior',
        weight: 40,
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
