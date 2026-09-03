/**
 * Dev-visibility check, not a runtime dependency: components/onboarding/
 * types.ts's STEPS and components/reflections/types.ts's DOMAINS are
 * hand-copied from GET /onboarding/catalog rather than rendered from it
 * live (see those files' own doc comments) — deliberate, but it means nobody
 * finds out if the two drift apart until something looks wrong by hand.
 *
 * store/onboarding/onboardingSaga.ts dispatches this on every fetch and
 * console.warns whatever it finds — never throws, never blocks anything;
 * the hardcoded copies stay the source of truth for the actual UI/scoring
 * either way (utils/onboardingScoring.ts is the scoring counterpart of this
 * same "the backend is authoritative, this file just mirrors it" contract).
 */
import { STEPS, type OnboardingAnswers } from '../components/onboarding/types';
import { DOMAINS } from '../components/reflections/types';
import type { OnboardingCatalog } from '../services/api/types';
import { ANCHOR_BOOST, FOCUS_AREA_OVERRIDE, LAYER_WEIGHTS } from './onboardingScoring';

/** catalog basicProfileFields' snake_case id -> the OnboardingAnswers key
 * STEPS uses for it. Kept here rather than in types.ts since it's only
 * ever needed for this comparison. */
const FIELD_ID_MAP: Record<string, keyof OnboardingAnswers> = {
  first_name: 'firstName',
  age_range: 'ageRange',
  gender: 'gender',
  relationship_status: 'relationshipStatus',
  living_situation: 'livingSituation',
  location: 'location',
  primary_career: 'careerField',
  retirement_status: 'retirementStatus',
  how_long_retired: 'howLongRetired',
  primary_reason_retiring: 'primaryReasonForRetiring',
};

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const bSet = new Set(b);
  return a.every(x => bSet.has(x));
}

/** Returns one human-readable line per mismatch found; empty when the
 * hardcoded copies still agree with `catalog` byte-for-byte on everything
 * that actually feeds the form/scoring (option values, not label copy —
 * labels are allowed to drift, per STEPS' own doc comment). */
export function checkCatalogDrift(catalog: OnboardingCatalog): string[] {
  const issues: string[] = [];

  for (const field of catalog.basicProfileFields) {
    if (!field.options) continue;
    const key = FIELD_ID_MAP[field.id];
    if (!key) {
      issues.push(`basicProfileFields has "${field.id}" — no entry in FIELD_ID_MAP for it.`);
      continue;
    }
    const step = STEPS.find(s => s.key === key && s.type !== 'text');
    if (!step || step.type === 'text') {
      issues.push(`No STEPS entry with select options for "${key}" (catalog field "${field.id}").`);
      continue;
    }
    const catalogValues = field.options.map(o => o.value);
    const localValues = step.options.map(o => o.value);
    if (!sameSet(catalogValues, localValues)) {
      issues.push(
        `"${key}" options differ — catalog: [${catalogValues.join(', ')}] vs STEPS: [${localValues.join(', ')}]`,
      );
    }
  }

  for (const section of catalog.sections) {
    const domain = DOMAINS.find(d => d.key === section.id);
    if (!domain) {
      issues.push(`catalog has section "${section.id}" — no matching entry in DOMAINS.`);
      continue;
    }
    for (const q of section.questions) {
      const local = domain.questions.find(x => x.id === q.id);
      if (!local) {
        issues.push(`"${section.id}" has question "${q.id}" — missing from DOMAINS.`);
        continue;
      }
      if (local.layer !== q.layer) {
        issues.push(`"${q.id}" layer differs — catalog: ${q.layer} vs local: ${local.layer}`);
      }
      if (local.weight !== q.weight) {
        issues.push(`"${q.id}" weight differs — catalog: ${q.weight} vs local: ${local.weight}`);
      }
      const catalogReverse = q.coding === 'reverse';
      if (Boolean(local.reverseCoded) !== catalogReverse) {
        issues.push(`"${q.id}" coding differs — catalog: ${q.coding} vs local reverseCoded: ${Boolean(local.reverseCoded)}`);
      }
    }
  }

  const lw = catalog.layerWeights;
  if (lw.behavior !== LAYER_WEIGHTS.behavior || lw.thought !== LAYER_WEIGHTS.thought || lw.feeling !== LAYER_WEIGHTS.feeling) {
    issues.push(`layerWeights differ — catalog: ${JSON.stringify(lw)} vs local: ${JSON.stringify(LAYER_WEIGHTS)}`);
  }

  const ab = catalog.sequencing.anchorBoost;
  if (ab.section !== ANCHOR_BOOST.section || ab.value !== ANCHOR_BOOST.value) {
    issues.push(`sequencing.anchorBoost differs — catalog: ${JSON.stringify(ab)} vs local: ${JSON.stringify(ANCHOR_BOOST)}`);
  }

  const fao = catalog.sequencing.focusAreaOverride;
  if (fao.range[0] !== FOCUS_AREA_OVERRIDE.range[0] || fao.range[1] !== FOCUS_AREA_OVERRIDE.range[1] || fao.value !== FOCUS_AREA_OVERRIDE.value) {
    issues.push(
      `sequencing.focusAreaOverride differs — catalog: ${JSON.stringify(fao)} vs local: ${JSON.stringify(FOCUS_AREA_OVERRIDE)}`,
    );
  }

  return issues;
}
