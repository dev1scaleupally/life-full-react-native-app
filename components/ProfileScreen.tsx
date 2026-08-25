import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, type BadgeProps } from './Badge';
import { Card } from './Card';
import { CommunityIcon } from './icons/CommunityIcon';
import { ChevronLeft } from './icons/ChevronLeft';
import { ClockIcon } from './icons/ClockIcon';
import { CompassIcon } from './icons/CompassIcon';
import { HomeIcon, type IconProps } from './icons/HomeIcon';
import { MapIcon } from './icons/MapIcon';
import { PencilIcon } from './icons/PencilIcon';
import { PulseIcon } from './icons/PulseIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { TargetIcon } from './icons/TargetIcon';
import { WalletIcon } from './icons/WalletIcon';
import { BodyText, Eyebrow, Heading, Stat } from './Typography';
import type { ComponentType } from 'react';
import type { DomainId } from '../services/api/types';

export type ProfileDomainResult = {
  domain: DomainId;
  score: number;
  band: string;
  /** null = no re-administration yet (baseline only) — no delta shown. */
  baselineScore: number | null;
};

export type ProfileScreenProps = {
  firstName: string;
  /** e.g. "Engineering & Technology, 60–64" — null renders no subtitle line. */
  subtitle: string | null;
  /** Which domain "Where You Are Now" narrates — the current top priority. */
  currentDomain: DomainId;
  overallScore: number;
  overallBand: string;
  overallBaselineScore: number | null;
  cognitiveAlignmentScore: number;
  cognitiveAlignmentBaselineScore: number | null;
  /** Canonical domain order (not priority order — spec's Profile view doesn't
   * re-sequence, it's a status report, not a "start here" cue). */
  domainResults: ProfileDomainResult[];
  /** Omitted entirely (no "About You" section at all) when there's no Basic
   * Profile to show. */
  aboutYou: {
    retirement: string;
    formerRole: string | null;
    livingSituation: string;
    location: string;
  } | null;
  onBack?: () => void;
  onEdit?: () => void;
  onBackToHome?: () => void;
};

type DomainMeta = { name: string; icon: ComponentType<IconProps> };

const DOMAIN_META: Record<DomainId, DomainMeta> = {
  core_drivers: { name: 'Core Drivers', icon: CompassIcon },
  social_architecture: { name: 'Social Architecture', icon: CommunityIcon },
  physical_vitality: { name: 'Physical Vitality', icon: PulseIcon },
  resource_awareness: { name: 'Resource Awareness', icon: WalletIcon },
};

/** Only Core Drivers' copy below is confirmed real. The other three reuse a
 * generic template — swap in real per-domain narrative copy when it exists;
 * nothing else about this screen needs to change when that happens. */
const WHERE_YOU_ARE_NOW_COPY: Record<DomainId, { heading: string; body: string }> = {
  core_drivers: {
    heading: 'Rebuilding what matters',
    body: "Identity felt tied to your work, and rebuilding it on your terms is what's in front of you now.",
  },
  social_architecture: {
    heading: 'Rebuilding your circle',
    body: "Who is in your life, and how close, is what's in front of you now.",
  },
  physical_vitality: {
    heading: 'Rebuilding your rhythm',
    body: "What your energy allows you to do is what's in front of you now.",
  },
  resource_awareness: {
    heading: 'Rebuilding your footing',
    body: "What you have to build with is what's in front of you now.",
  },
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

/** null baseline (no re-administration yet) renders nothing — matches the
 * spec's "Baseline only: shows the baseline; the delta appears after the
 * first re-administration." */
function DeltaLine({ current, baseline, suffix }: { current: number; baseline: number | null; suffix: string }) {
  if (baseline === null) return null;
  const diff = Math.round((current - baseline) * 100) / 100;
  if (diff === 0) {
    return (
      <BodyText size="sm" className="text-text-muted">
        <BodyText size="sm" className="font-sans-bold text-text-body">
          No change
        </BodyText>
        {`  ${suffix} ${baseline.toFixed(1)}`}
      </BodyText>
    );
  }
  const up = diff > 0;
  return (
    <BodyText size="sm" className={up ? 'text-success' : 'text-danger'}>
      {up ? '▲ ' : '▼ '}
      {`${up ? '+' : ''}${diff.toFixed(1)}`}
      <BodyText size="sm" className="text-text-muted">{`  ${suffix} ${baseline.toFixed(1)}`}</BodyText>
    </BodyText>
  );
}

function DomainRow({ result }: { result: ProfileDomainResult }) {
  const meta = DOMAIN_META[result.domain];
  const Icon = meta.icon;
  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-olive-50">
          <Icon size={20} color="#71754C" />
        </View>
        <BodyText className="flex-1 font-sans-bold text-lg text-text-heading">{meta.name}</BodyText>
        <Stat className="text-2xl">{result.score.toFixed(1)}</Stat>
      </View>
      <View className="flex-row items-center gap-3">
        <ScoreBar score={result.score} />
        <Badge tone={BAND_TONE[result.band] ?? 'brand'}>{result.band}</Badge>
      </View>
      <DeltaLine current={result.score} baseline={result.baselineScore} suffix="was" />
    </Card>
  );
}

function AboutYouRow({
  icon: Icon,
  label,
  value,
  isLast,
}: {
  icon: ComponentType<IconProps>;
  label: string;
  value: string;
  isLast: boolean;
}) {
  return (
    <View className={`flex-row items-center gap-3 py-3 ${isLast ? '' : 'border-b border-border-subtle'}`}>
      <Icon size={18} color="#5F574A" />
      <BodyText className="flex-1 text-text-muted">{label}</BodyText>
      <BodyText className="font-sans-bold text-text-heading">{value}</BodyText>
    </View>
  );
}

function initialsOf(firstName: string): string {
  const trimmed = firstName.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : '?';
}

/** Section 4.10 "Profile & Settings" (the reflection-data half of it — legal/
 * notifications/subscription live in Settings, 4.11, not built here). Reached
 * today right after a fresh signup's silent commit, or a returning sign-in. */
export function ProfileScreen({
  firstName,
  subtitle,
  currentDomain,
  overallScore,
  overallBand,
  overallBaselineScore,
  cognitiveAlignmentScore,
  cognitiveAlignmentBaselineScore,
  domainResults,
  aboutYou,
  onBack,
  onEdit,
  onBackToHome,
}: ProfileScreenProps) {
  const nowCopy = WHERE_YOU_ARE_NOW_COPY[currentDomain];

  return (
    <View className="flex-1 bg-surface-screen">
      <SafeAreaView edges={['top']} className="bg-surface-card">
        <View className="flex-row items-center gap-3 border-b border-border-subtle px-4 py-3">
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} hitSlop={12}>
            <ChevronLeft />
          </Pressable>
          <Heading level="h3">Your profile</Heading>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" contentContainerClassName="gap-5 px-6 pb-8 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand">
            <BodyText className="font-sans-bold text-2xl text-text-on-brand">{initialsOf(firstName)}</BodyText>
          </View>
          <View className="flex-1">
            <Heading level="h2">{firstName || 'there'}</Heading>
            {subtitle ? (
              <BodyText size="sm" className="text-text-muted">
                {subtitle}
              </BodyText>
            ) : null}
          </View>
        </View>

        <View className="gap-3 rounded-xl bg-navy-700 p-5">
          <View className="flex-row items-center gap-2">
            <SparkleIcon size={16} color="#E3853B" />
            <BodyText className="font-sans-bold uppercase tracking-wide text-orange-400">
              Where you are now
            </BodyText>
          </View>
          <Heading level="h3" className="text-text-inverse">
            {nowCopy.heading}
          </Heading>
          <BodyText className="text-text-inverse">{nowCopy.body}</BodyText>
        </View>

        <Card className="gap-4">
          <View className="flex-row gap-4">
            <View className="items-start">
              <Stat>{overallScore.toFixed(1)}</Stat>
              <Eyebrow>Of 5.0</Eyebrow>
            </View>
            <View className="flex-1 gap-1">
              <BodyText className="font-sans-bold text-lg text-text-heading">Your retirement reflection</BodyText>
              <BodyText size="sm" className="text-text-muted">
                Where things stand across your retirement life. You can see any shift since your last check-in
                below.
              </BodyText>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <ScoreBar score={overallScore} />
            <Badge tone={BAND_TONE[overallBand] ?? 'brand'}>{overallBand}</Badge>
          </View>
          <DeltaLine current={overallScore} baseline={overallBaselineScore} suffix="since onboarding — was" />
          <View className="flex-row items-center justify-between border-t border-border-subtle pt-3">
            <BodyText className="text-text-body">How retirement feels</BodyText>
            <View className="flex-row items-center gap-2">
              <BodyText className="font-sans-bold text-lg text-text-heading">
                {cognitiveAlignmentScore.toFixed(1)}
              </BodyText>
              <DeltaLine current={cognitiveAlignmentScore} baseline={cognitiveAlignmentBaselineScore} suffix="was" />
            </View>
          </View>
        </Card>

        <View className="gap-3">
          <BodyText className="font-sans-bold uppercase tracking-wide text-brand">
            Domain reflection results
          </BodyText>
          {domainResults.map(result => (
            <DomainRow key={result.domain} result={result} />
          ))}
        </View>

        {aboutYou ? (
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <BodyText className="font-sans-bold uppercase tracking-wide text-brand">About you</BodyText>
              <Pressable
                accessibilityRole="button"
                onPress={onEdit}
                hitSlop={8}
                className="flex-row items-center gap-1"
              >
                <PencilIcon size={16} />
                <BodyText size="sm" className="font-sans-bold text-brand">
                  Edit
                </BodyText>
              </Pressable>
            </View>
            <Card className="gap-0 p-0 px-5">
              <AboutYouRow icon={ClockIcon} label="Retirement" value={aboutYou.retirement} isLast={false} />
              {aboutYou.formerRole ? (
                <AboutYouRow icon={TargetIcon} label="Former role" value={aboutYou.formerRole} isLast={false} />
              ) : null}
              <AboutYouRow icon={HomeIcon} label="Living situation" value={aboutYou.livingSituation} isLast={false} />
              <AboutYouRow icon={MapIcon} label="Location" value={aboutYou.location} isLast />
            </Card>
          </View>
        ) : null}

        {/* Not Button's `secondary` variant — that's a neutral outline/navy
            text, and this needs the brand-orange outline+text the mockup
            shows, which isn't one of Button's existing variants. */}
        <Pressable
          accessibilityRole="button"
          onPress={onBackToHome}
          className="flex-row items-center justify-center gap-2 rounded-pill border-[1.5px] border-brand px-6 py-4"
        >
          <HomeIcon size={18} color="#A2571F" />
          <BodyText className="font-sans-bold text-lg text-brand">Back to home</BodyText>
        </Pressable>
      </ScrollView>
    </View>
  );
}
