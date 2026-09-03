/**
 * On-device port of the backend's onboarding scoring engine
 * (lifefull-app-backend/packages/engine/src/scoring.ts + contract.ts's
 * scoreBand). Same math, run entirely client-side, no network call — this is
 * what lets the results screen show real computed numbers before any account
 * exists (the retirement-reflection spec's "Pre-account data handling":
 * onboarding answers + computed results are buffered on-device until sign-up).
 *
 * POST /onboarding/responses re-derives the authoritative version of these
 * same numbers server-side once the user signs up and the buffered answers
 * are committed — this is only ever a preview, never the source of truth.
 * If the backend's scoring.ts ever changes, this needs to change with it.
 */
import { DOMAINS, type Layer, type ReflectionAnswers } from '../components/reflections/types';
import type { DomainId } from '../services/api/types';

/** Canonical domain order — also the tie-break order for prioritization.
 * Mirrors engine/src/scoring.ts's DOMAIN_ORDER exactly. */
const DOMAIN_ORDER: DomainId[] = [
  'core_drivers',
  'social_architecture',
  'physical_vitality',
  'resource_awareness',
];

/** GET /onboarding/catalog's layerWeights — behavior/thought/feeling.
 * Exported for utils/onboardingCatalogCheck.ts's drift check only — nothing
 * else outside this file should need these three. */
export const LAYER_WEIGHTS: Record<Layer, number> = { behavior: 0.4, thought: 0.35, feeling: 0.25 };

/** GET /onboarding/catalog's sequencing config. */
export const ANCHOR_BOOST: { section: DomainId; value: number } = { section: 'core_drivers', value: 0.5 };
export const FOCUS_AREA_OVERRIDE: { range: [number, number]; value: number } = { range: [1, 1.99], value: 1 };

export type ScoreBand = 'Focus area' | 'Building' | 'Steady' | 'Thriving';

/** Mirrors engine/src/contract.ts's scoreBand exactly. */
export function scoreBand(score: number): ScoreBand {
  if (score < 2) return 'Focus area';
  if (score < 3) return 'Building';
  if (score < 4) return 'Steady';
  return 'Thriving';
}

/** Reverse items invert the 1–5 scale (Never=5 … Always=1). */
function normalize(rawScore: number, reverseCoded: boolean | undefined): number {
  return reverseCoded ? 6 - rawScore : rawScore;
}

/** Strip IEEE-754 float artifacts without changing the value — domain/CA
 * scores are exact multiples of 0.025 for integer inputs. */
function clean(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Section score = mean within each CBT layer, then combine by layer weight,
 * renormalized over the layers actually present. */
function layerWeightedMean(items: { layer: Layer; normalizedScore: number }[]): number {
  const byLayer: Record<Layer, number[]> = { feeling: [], thought: [], behavior: [] };
  for (const it of items) byLayer[it.layer].push(it.normalizedScore);
  let weighted = 0;
  let wSum = 0;
  for (const layer of ['behavior', 'thought', 'feeling'] as const) {
    if (byLayer[layer].length === 0) continue;
    weighted += LAYER_WEIGHTS[layer] * mean(byLayer[layer]);
    wSum += LAYER_WEIGHTS[layer];
  }
  return weighted / wSum;
}

/** (5 − score) + anchorBoost(core_drivers) + focusAreaOverride(if Focus
 * area) — round-half-up to 2dp, the one place rounding is applied. */
function priorityScore(domain: DomainId, domainScore: number): number {
  let s = 5 - domainScore;
  if (domain === ANCHOR_BOOST.section) s += ANCHOR_BOOST.value;
  const [lo, hi] = FOCUS_AREA_OVERRIDE.range;
  if (domainScore >= lo && domainScore <= hi) s += FOCUS_AREA_OVERRIDE.value;
  return Math.round((s + Number.EPSILON) * 100) / 100;
}

/** Adaptive P1…P4 (Resource Awareness always last) from a set of domain
 * scores — pure function of the scores themselves, so it works both right
 * after reflections (scoreOnboarding below) and later, recomputed from
 * whatever GET /progress currently reports, to find "where you're at now"
 * on the Profile screen. Mirrors engine/src/scoring.ts's computePriorityOrder. */
export function computePriorityOrder(domainScores: { domain: DomainId; score: number }[]): DomainId[] {
  const scoreOf = new Map(domainScores.map(d => [d.domain, d.score]));
  const sequenced = DOMAIN_ORDER.filter(d => d !== 'resource_awareness');
  const ordered = [...sequenced].sort((a, b) => {
    const pa = priorityScore(a, scoreOf.get(a)!);
    const pb = priorityScore(b, scoreOf.get(b)!);
    if (pb !== pa) return pb - pa; // higher priority first
    return DOMAIN_ORDER.indexOf(a) - DOMAIN_ORDER.indexOf(b); // canonical tie-break
  });
  return [...ordered, 'resource_awareness'];
}

export type DomainScoreResult = { domain: DomainId; score: number; band: ScoreBand };

export type OnDeviceScoringResult = {
  /** In canonical DOMAIN_ORDER, not priority order. */
  domainScores: DomainScoreResult[];
  /** Adaptive P1…P4 — Resource Awareness always last. */
  priorityOrder: DomainId[];
  /** "How retirement feels" — layer-weighted like a domain, but not sequenced. */
  cognitiveAlignmentScore: number;
  /** "Your retirement reflection" — unweighted mean of all 5 section scores. */
  overallWellbeingScore: number;
};

/** DOMAINS' keys are already the real DomainId/section-id strings
 * (cognitive_alignment/core_drivers/social_architecture/physical_vitality/
 * resource_awareness) — see components/reflections/types.ts. */
function sectionItems(sectionKey: string, answers: ReflectionAnswers) {
  const section = DOMAINS.find(d => d.key === sectionKey)!;
  return section.questions.map(q => ({
    layer: q.layer,
    normalizedScore: normalize(answers[q.id], q.reverseCoded),
  }));
}

export function scoreOnboarding(answers: ReflectionAnswers): OnDeviceScoringResult {
  const domainScores: DomainScoreResult[] = DOMAIN_ORDER.map(domain => {
    const score = clean(layerWeightedMean(sectionItems(domain, answers)));
    return { domain, score, band: scoreBand(score) };
  });

  const cognitiveAlignmentScore = clean(layerWeightedMean(sectionItems('cognitive_alignment', answers)));

  const overallWellbeingScore = clean(mean([...domainScores.map(d => d.score), cognitiveAlignmentScore]));

  return {
    domainScores,
    priorityOrder: computePriorityOrder(domainScores),
    cognitiveAlignmentScore,
    overallWellbeingScore,
  };
}
