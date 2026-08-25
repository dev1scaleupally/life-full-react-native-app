import type { ComponentType } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, type BadgeProps } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { CommunityIcon } from './icons/CommunityIcon';
import { CompassIcon } from './icons/CompassIcon';
import type { IconProps } from './icons/HomeIcon';
import { PulseIcon } from './icons/PulseIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { WalletIcon } from './icons/WalletIcon';
import { Mark } from './Mark';
import { BodyText, Eyebrow, Heading, Stat } from './Typography';
import type { DomainId } from '../services/api/types';

export type DomainResult = { domain: DomainId; score: number; band: string };

export type OnboardingResultsScreenProps = {
  firstName: string;
  /** "Your Retirement Wellbeing" — unweighted mean of all 5 section scores (see
   * GET /v1/progress's overallWellbeing[0]; POST /onboarding/responses never
   * returns this). */
  overallScore: number;
  overallBand: string;
  /** Cognitive Alignment baseline ("How retirement feels") — same source,
   * GET /v1/progress's cognitiveAlignment[0].score; it's not one of the four
   * coaching domains, so it never appears in domainResults. */
  cognitiveAlignmentScore: number;
  /** Already in priority order (Resource Awareness always last) — the first
   * entry is the one coaching starts with. */
  domainResults: DomainResult[];
  onStartTrial?: () => void;
};

type DomainMeta = { name: string; icon: ComponentType<IconProps>; hook: string };

/**
 * Mirrors tokens/theme.ts's `domains` array — same display names and
 * taglines — but keyed by the real `DomainId` the API uses. theme.ts's own
 * keys (drivers/social/vitality/resource) are a separate, unrelated
 * short-key convention (used only for that file's icon-string/color lookup),
 * not `DomainId` values, so it can't be indexed by `DomainId` directly.
 */
const DOMAIN_META: Record<DomainId, DomainMeta> = {
  core_drivers: { name: 'Core Drivers', icon: CompassIcon, hook: 'What matters beyond your career' },
  social_architecture: {
    name: 'Social Architecture',
    icon: CommunityIcon,
    hook: 'Who is in your life, and how close',
  },
  physical_vitality: {
    name: 'Physical Vitality',
    icon: PulseIcon,
    hook: 'What your energy allows you to do',
  },
  resource_awareness: {
    name: 'Resource Awareness',
    icon: WalletIcon,
    hook: 'What you have to build with',
  },
};

/**
 * Only Core Drivers' opening line below is confirmed real copy. The other
 * three reuse theme.ts's existing one-line tagline as a placeholder hook
 * sentence — swap in real per-domain narrative copy when it exists; nothing
 * else about this screen needs to change when that happens.
 */
const FIRST_WEEK_COPY: Record<DomainId, string> = {
  core_drivers:
    "Like many retirees, you're facing the question underneath: what are your days for now? This week you'll explore your Core Drivers — what matters beyond work — and leave with a Monday-morning commitment: one small step you'll actually take.",
  social_architecture:
    "This week you'll start with your Social Architecture — who is in your life, and how close — and leave with a Monday-morning commitment: one small step you'll actually take.",
  physical_vitality:
    "This week you'll start with your Physical Vitality — what your energy allows you to do — and leave with a Monday-morning commitment: one small step you'll actually take.",
  resource_awareness:
    "This week you'll start with your Resource Awareness — what you have to build with — and leave with a Monday-morning commitment: one small step you'll actually take.",
};

const BAND_TONE: Record<string, BadgeProps['tone']> = {
  Thriving: 'success',
  Steady: 'info',
  Building: 'warning',
  'Focus area': 'danger',
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <View className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-sunken">
      <View className="h-full rounded-pill bg-brand" style={{ width: `${pct}%` }} />
    </View>
  );
}

function DomainRow({ result, isPriority }: { result: DomainResult; isPriority: boolean }) {
  const meta = DOMAIN_META[result.domain];
  const Icon = meta.icon;
  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-olive-50">
          <Icon size={20} color="#71754C" />
        </View>
        <View className="flex-1">
          <BodyText className="font-sans-bold text-lg text-text-heading">{meta.name}</BodyText>
          {isPriority ? (
            <BodyText size="sm" className="text-text-muted">
              We start here
            </BodyText>
          ) : null}
        </View>
        <Stat className="text-2xl">{result.score.toFixed(1)}</Stat>
      </View>
      <View className="flex-row items-center gap-3">
        <ScoreBar score={result.score} />
        <Badge tone={BAND_TONE[result.band] ?? 'brand'}>{result.band}</Badge>
      </View>
    </Card>
  );
}

/** Shown right after onboarding submit succeeds — the one place the app
 * actually surfaces the scored results (domain scores + Cognitive Alignment
 * + Overall Wellbeing) computed for GET /onboarding/responses/GET /progress. */
export function OnboardingResultsScreen({
  firstName,
  overallScore,
  overallBand,
  cognitiveAlignmentScore,
  domainResults,
  onStartTrial,
}: OnboardingResultsScreenProps) {
  const priorityDomain = domainResults[0]?.domain ?? 'core_drivers';

  return (
    <View className="flex-1 bg-surface-screen">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-6 pb-8 pt-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-3">
            <Mark variant="orange" height={44} />
            <Heading level="h1" className="text-center">
              {`You're all set, ${firstName}.`}
            </Heading>
            <BodyText className="text-center text-lg text-text-muted">
              This is your starting point. From here and onward with Lifefull, you'll be guided to a
              clearer picture of your life after work and find ways to get where you want to be.
            </BodyText>
          </View>

          <Card className="gap-4">
            <View className="flex-row gap-4">
              <View className="items-start">
                <Stat>{overallScore.toFixed(1)}</Stat>
                <Eyebrow>Of 5.0</Eyebrow>
              </View>
              <View className="flex-1 gap-1">
                <BodyText className="font-sans-bold text-lg text-text-heading">
                  Your retirement reflection
                </BodyText>
                <BodyText size="sm" className="text-text-muted">
                  Where things stand across your retirement life, based on your own answers.
                </BodyText>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <ScoreBar score={overallScore} />
              <Badge tone={BAND_TONE[overallBand] ?? 'brand'}>{overallBand}</Badge>
            </View>
            <View className="flex-row items-center justify-between border-t border-border-subtle pt-3">
              <BodyText className="text-text-body">How retirement feels</BodyText>
              <BodyText className="font-sans-bold text-lg text-text-heading">
                {cognitiveAlignmentScore.toFixed(1)}
              </BodyText>
            </View>
          </Card>

          <View className="gap-3">
            <BodyText className="font-sans-bold uppercase tracking-wide text-brand">
              Your four life domains
            </BodyText>
            {domainResults.map(result => (
              <DomainRow key={result.domain} result={result} isPriority={result.domain === priorityDomain} />
            ))}
          </View>

          <View className="gap-3 rounded-xl bg-navy-700 p-5">
            <View className="flex-row items-center gap-2">
              <SparkleIcon size={16} color="#E3853B" />
              <BodyText className="font-sans-bold uppercase tracking-wide text-orange-400">
                Your first week
              </BodyText>
            </View>
            <BodyText className="text-text-inverse">{FIRST_WEEK_COPY[priorityDomain]}</BodyText>
          </View>
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} className="border-t border-border-subtle bg-surface-card px-6 pt-4">
        <Button
          size="lg"
          className="bg-brand-hover"
          onPress={onStartTrial}
          rightIcon={<SparkleIcon size={16} color="#FFFFFF" />}
        >
          Start free trial
        </Button>
      </SafeAreaView>
    </View>
  );
}
