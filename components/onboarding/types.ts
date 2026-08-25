/**
 * "About you" onboarding — a linear, mostly-single-select questionnaire.
 * All answers live in one object owned by OnboardingFlow (see
 * ./OnboardingFlow.tsx) so navigating back never loses anything, and the
 * whole step sequence is data-driven from STEPS below rather than one
 * hand-written screen per question.
 *
 * Field names and every option `value` below are the exact strings
 * POST /v1/onboarding/responses expects (see `BasicProfile` in
 * services/api/types.ts, and GET /v1/onboarding/catalog's
 * `basicProfileFields` for the authoritative list) — labels can drift from
 * the catalog's copy, values can't.
 */
import type { BasicProfile } from '../../services/api/types';

export type Option = { value: string; label: string };

export type OnboardingAnswers = {
  firstName: string;
  ageRange: string | null;
  gender: string | null;
  genderSelfDescribed: string;
  relationshipStatus: string | null;
  livingSituation: string | null;
  /** Collected for UX ("tell us more" when livingSituation is "other"), but
   * BasicProfile has no field for it — the backend has nowhere to put this,
   * so it's deliberately never sent (see toBasicProfile below). */
  livingSituationOther: string;
  location: string | null;
  careerField: string | null;
  careerFieldOther: string;
  careerRole: string;
  retirementStatus: string | null;
  howLongRetired: string | null;
  primaryReasonForRetiring: string[];
  primaryReasonOther: string;
};

export const INITIAL_ANSWERS: OnboardingAnswers = {
  firstName: '',
  ageRange: null,
  gender: null,
  genderSelfDescribed: '',
  relationshipStatus: null,
  livingSituation: null,
  livingSituationOther: '',
  location: null,
  careerField: null,
  careerFieldOther: '',
  careerRole: '',
  retirementStatus: null,
  howLongRetired: null,
  primaryReasonForRetiring: [],
  primaryReasonOther: '',
};

type BaseStep = {
  id: string;
  /** Static title, or computed from the answers so far (e.g. step 9 rewording). */
  title: string | ((answers: OnboardingAnswers) => string);
  subtitle?: string;
  /** Step is skipped entirely (both forward and backward) when this returns false. */
  visible?: (answers: OnboardingAnswers) => boolean;
};

export type TextStepConfig = BaseStep & {
  type: 'text';
  key: keyof OnboardingAnswers;
  placeholder: string;
};

export type SingleSelectStepConfig = BaseStep & {
  type: 'single';
  key: keyof OnboardingAnswers;
  options: Option[];
  /** Shown only when the selected option's value matches this, e.g. "self_describe". */
  otherTextField?: { triggerValue: string; key: keyof OnboardingAnswers; placeholder: string };
  /** Shown once ANY option is selected, regardless of which. */
  secondaryTextField?: { key: keyof OnboardingAnswers; prompt: string; placeholder: string };
};

export type MultiSelectStepConfig = BaseStep & {
  type: 'multi';
  key: keyof OnboardingAnswers;
  options: Option[];
  otherTextField?: { triggerValue: string; key: keyof OnboardingAnswers; placeholder: string };
};

export type StepConfig = TextStepConfig | SingleSelectStepConfig | MultiSelectStepConfig;

export const STEPS: StepConfig[] = [
  {
    id: 'firstName',
    type: 'text',
    key: 'firstName',
    title: 'First, what should we call you?',
    subtitle: 'Just your first name — it keeps things warm between you and your guide.',
    placeholder: 'Your first name',
  },
  {
    id: 'ageRange',
    type: 'single',
    key: 'ageRange',
    title: 'Which age range are you in?',
    options: [
      { value: 'under_55', label: 'Under 55' },
      { value: '55_59', label: '55–59' },
      { value: '60_64', label: '60–64' },
      { value: '65_69', label: '65–69' },
      { value: '70_74', label: '70–74' },
      { value: '75_or_older', label: '75 or older' },
    ],
  },
  {
    id: 'gender',
    type: 'single',
    key: 'gender',
    title: 'How do you identify?',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'non_binary', label: 'Non-binary' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say' },
      { value: 'self_describe', label: 'Prefer to self-describe' },
    ],
    otherTextField: {
      triggerValue: 'self_describe',
      key: 'genderSelfDescribed',
      placeholder: "How you'd describe it",
    },
  },
  {
    id: 'relationshipStatus',
    type: 'single',
    key: 'relationshipStatus',
    title: "What's your relationship status?",
    options: [
      { value: 'married_partnered', label: 'Married or in a long-term partnership' },
      { value: 'single_never_married', label: 'Single — never married' },
      { value: 'divorced_separated', label: 'Divorced or separated' },
      { value: 'widowed', label: 'Widowed' },
      { value: 'complicated_other', label: "It's complicated / other" },
    ],
  },
  {
    id: 'livingSituation',
    type: 'single',
    key: 'livingSituation',
    title: 'Who do you live with?',
    options: [
      { value: 'alone', label: 'Alone' },
      { value: 'with_partner', label: 'With a partner or spouse' },
      { value: 'with_family', label: 'With family (children, siblings, or other relatives)' },
      { value: 'with_roommates', label: 'With roommates or housemates' },
      { value: 'retirement_community', label: 'In a retirement community' },
      { value: 'other', label: 'Other' },
    ],
    otherTextField: {
      triggerValue: 'other',
      key: 'livingSituationOther',
      placeholder: 'Tell us more',
    },
  },
  {
    id: 'location',
    type: 'single',
    key: 'location',
    title: 'Where do you live?',
    options: [
      { value: 'urban', label: 'Urban / city' },
      { value: 'suburban', label: 'Suburban' },
      { value: 'small_town_rural', label: 'Small town or rural' },
      { value: 'outside_country', label: 'Outside the country' },
    ],
  },
  {
    id: 'careerField',
    type: 'single',
    key: 'careerField',
    title: 'What was your primary career or profession?',
    options: [
      { value: 'business_finance_management', label: 'Business, finance, or management' },
      { value: 'medicine_healthcare', label: 'Medicine, healthcare, or life sciences' },
      { value: 'law_government', label: 'Law or government' },
      { value: 'education_academia', label: 'Education or academia' },
      { value: 'engineering_technology', label: 'Engineering or technology' },
      { value: 'creative', label: 'Creative fields (design, media, arts)' },
      { value: 'entrepreneurship', label: 'Entrepreneurship / business ownership' },
      { value: 'military_public_service', label: 'Military or public service' },
      { value: 'nonprofit_social', label: 'Non-profit or social sector' },
      { value: 'other', label: 'Other' },
    ],
    otherTextField: {
      triggerValue: 'other',
      key: 'careerFieldOther',
      placeholder: 'What field?',
    },
    secondaryTextField: {
      key: 'careerRole',
      prompt: 'In a word or two, what was your role?',
      placeholder: 'e.g. Regional sales manager',
    },
  },
  {
    id: 'retirementStatus',
    type: 'single',
    key: 'retirementStatus',
    title: 'What best describes where you are right now?',
    options: [
      { value: 'fully_retired', label: 'Fully retired' },
      { value: 'semi_retired', label: 'Semi-retired — I still work in some capacity' },
      { value: 'recently_stopped', label: "Recently stopped working but not sure I'd call it retirement yet" },
      { value: 'career_break', label: 'Taking a career break — may return to work' },
    ],
  },
  {
    id: 'howLongRetired',
    type: 'single',
    key: 'howLongRetired',
    title: answers =>
      answers.retirementStatus === 'semi_retired'
        ? 'How long have you been semi-retired?'
        : 'How long have you been retired?',
    options: [
      { value: 'less_than_6_months', label: 'Less than 6 months' },
      { value: '6_months_to_1_year', label: '6 months to 1 year' },
      { value: '1_to_2_years', label: '1 to 2 years' },
      { value: '2_to_5_years', label: '2 to 5 years' },
      { value: 'more_than_5_years', label: 'More than 5 years' },
    ],
    visible: answers =>
      answers.retirementStatus === 'fully_retired' || answers.retirementStatus === 'semi_retired',
  },
  {
    id: 'primaryReasonForRetiring',
    type: 'multi',
    key: 'primaryReasonForRetiring',
    title: 'What led you to retire?',
    subtitle: 'Select all that apply.',
    options: [
      { value: 'right_time', label: 'It was the right time — I was ready' },
      { value: 'financial_goal', label: 'I reached my financial goal' },
      { value: 'health_own', label: 'Health reasons — my own' },
      { value: 'health_family', label: 'Health reasons — caring for a family member' },
      { value: 'role_changed', label: 'My role or organization changed and it no longer felt right' },
      { value: 'pushed_out', label: 'I was pushed out or made redundant' },
      { value: 'partner_retired', label: 'My partner or spouse retired and we decided together' },
      { value: 'not_fully_retired', label: "I haven't fully retired yet — still figuring it out" },
      { value: 'other', label: 'Other' },
    ],
    otherTextField: {
      triggerValue: 'other',
      key: 'primaryReasonOther',
      placeholder: 'Tell us more',
    },
  },
];

export function resolveTitle(step: StepConfig, answers: OnboardingAnswers): string {
  return typeof step.title === 'function' ? step.title(answers) : step.title;
}

/** Walk from `from` in `direction`, skipping any step whose `visible` fails. */
export function nextVisibleIndex(
  from: number,
  direction: 1 | -1,
  answers: OnboardingAnswers,
): number {
  let i = from + direction;
  while (i >= 0 && i < STEPS.length && STEPS[i].visible && !STEPS[i].visible!(answers)) {
    i += direction;
  }
  return i;
}

/**
 * Whether the current step has a complete answer — Continue is disabled
 * until this is true. Secondary text fields (e.g. career "role") are always
 * optional even when shown; the "other" free-text tied to a specific option
 * is required once that option is the one selected.
 */
export function isStepValid(step: StepConfig, answers: OnboardingAnswers): boolean {
  if (step.type === 'text') {
    return String(answers[step.key] ?? '').trim().length > 0;
  }

  if (step.type === 'single') {
    const selected = answers[step.key] as string | null;
    if (!selected) return false;
    if (step.otherTextField && selected === step.otherTextField.triggerValue) {
      return String(answers[step.otherTextField.key] ?? '').trim().length > 0;
    }
    return true;
  }

  // multi
  const selectedValues = (answers[step.key] as string[]) ?? [];
  if (selectedValues.length === 0) return false;
  if (step.otherTextField && selectedValues.includes(step.otherTextField.triggerValue)) {
    return String(answers[step.otherTextField.key] ?? '').trim().length > 0;
  }
  return true;
}

/**
 * The display label for a stored option value (e.g. 'small_town_rural' ->
 * 'Small town or rural') — single source of truth off STEPS' own option
 * lists, so the Profile screen's "About You" section never has to duplicate
 * this copy. Falls back to the raw value for a text-step key (no options)
 * or an unrecognized value.
 */
export function optionLabel(key: keyof OnboardingAnswers, value: string | null): string | null {
  if (!value) return null;
  const step = STEPS.find(s => s.key === key && s.type !== 'text');
  if (!step || step.type === 'text') return value;
  return step.options.find(o => o.value === value)?.label ?? value;
}

/**
 * Every required field here is guaranteed non-null/non-empty by the time
 * OnboardingFlow's onComplete fires — isStepValid gates Continue on exactly
 * that. `livingSituationOther` has no home in BasicProfile (the backend
 * doesn't accept it), so it's the one answer collected here that never
 * leaves the device.
 */
export function toBasicProfile(answers: OnboardingAnswers): BasicProfile {
  return {
    firstName: answers.firstName.trim(),
    ageRange: answers.ageRange!,
    gender: answers.gender!,
    genderSelfDescribed: answers.gender === 'self_describe' ? answers.genderSelfDescribed.trim() || null : null,
    relationshipStatus: answers.relationshipStatus!,
    livingSituation: answers.livingSituation!,
    location: answers.location!,
    careerField: answers.careerField!,
    careerFieldOther: answers.careerField === 'other' ? answers.careerFieldOther.trim() || null : null,
    careerRole: answers.careerRole.trim() || null,
    retirementStatus: answers.retirementStatus!,
    howLongRetired: answers.howLongRetired,
    primaryReasonForRetiring: answers.primaryReasonForRetiring,
    primaryReasonOther: answers.primaryReasonForRetiring.includes('other')
      ? answers.primaryReasonOther.trim() || null
      : null,
  };
}
