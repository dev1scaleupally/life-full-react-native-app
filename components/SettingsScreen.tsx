import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import packageJson from '../package.json';
import { Badge } from './Badge';
import { Card } from './Card';
import { BellIcon } from './icons/BellIcon';
import { ChevronLeft } from './icons/ChevronLeft';
import { ChevronRight } from './icons/ChevronRight';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { HomeIcon } from './icons/HomeIcon';
import { Icon } from './icons/Icons';
import { InfoIcon } from './icons/InfoIcon';
import { SignOutIcon } from './icons/SignOutIcon';
import { StarIcon } from './icons/StarIcon';
import { Switch } from './Switch';
import { BodyText, Heading } from './Typography';

export type SettingsScreenProps = {
  firstName: string;
  lastName: string;
  /** null = no known subscription state yet (no Paywall/purchase flow built). */
  subscriptionPlan: string | null;
  onBack?: () => void;
  onOpenProfile?: () => void;
  onOpenSubscription?: () => void;
  onOpenDataPrivacy?: () => void;
  onOpenHelp?: () => void;
  onOpenAbout?: () => void;
  onOpenHowItWorks?: () => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
  onBackToHome?: () => void;
};

function initialsOf(firstName: string, lastName: string): string {
  const f = firstName.trim()[0] ?? '';
  const l = lastName.trim()[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

function SectionLabel({ children }: { children: string }) {
  return <BodyText className="font-sans-bold uppercase tracking-wide text-brand">{children}</BodyText>;
}

function Row({
  icon,
  iconBg = 'bg-surface-sunken',
  title,
  description,
  trailing,
  onPress,
  isLast,
  danger,
}: {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  isLast: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      className={`flex-row items-center gap-3 py-3.5 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <View className={`h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>{icon}</View>
      <View className="flex-1">
        <BodyText className={`font-sans-bold text-lg ${danger ? 'text-danger' : 'text-text-heading'}`}>
          {title}
        </BodyText>
        {description ? (
          <BodyText size="sm" className="text-text-muted">
            {description}
          </BodyText>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

/**
 * Section 4.11 — Settings. Notification toggles are local-only right now
 * (no backend preference endpoint exists to persist them — see the note
 * where they're wired). Subscription management, data export, help/about
 * content, and account deletion are all stubs: none of those destinations
 * are built yet, and account deletion in particular needs a real backend
 * endpoint that doesn't exist (see Section 9's "removes both the ledger and
 * transcript stores").
 */
export function SettingsScreen({
  firstName,
  lastName,
  subscriptionPlan,
  onBack,
  onOpenProfile,
  onOpenSubscription,
  onOpenDataPrivacy,
  onOpenHelp,
  onOpenAbout,
  onOpenHowItWorks,
  onSignOut,
  onDeleteAccount,
  onBackToHome,
}: SettingsScreenProps) {
  // Local-only — see the class doc comment above.
  const [commitmentReminders, setCommitmentReminders] = useState(true);
  const [reviewPrompts, setReviewPrompts] = useState(true);

  return (
    <View className="flex-1 bg-surface-screen">
      <SafeAreaView edges={['top']} className="bg-surface-card">
        <View className="flex-row items-center gap-3 border-b border-border-subtle px-4 py-3">
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} hitSlop={12}>
            <ChevronLeft />
          </Pressable>
          <Heading level="h3">Settings</Heading>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" contentContainerClassName="gap-5 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <SectionLabel>Account</SectionLabel>
          <Card className="gap-0 p-0 px-5">
            <Row
              icon={
                <View className="h-10 w-10 items-center justify-center rounded-full bg-brand">
                  <BodyText className="font-sans-bold text-text-on-brand">
                    {initialsOf(firstName, lastName)}
                  </BodyText>
                </View>
              }
              iconBg="bg-transparent"
              title={`${firstName} ${lastName}`.trim() || 'Your account'}
              description="View your profile"
              trailing={<ChevronRight size={18} color="#ABA08C" />}
              onPress={onOpenProfile}
              isLast={false}
            />
            <Row
              icon={<StarIcon size={18} />}
              iconBg="bg-brand-soft"
              title="Subscription"
              trailing={
                <View className="flex-row items-center gap-2">
                  {subscriptionPlan ? <Badge tone="brand">{subscriptionPlan}</Badge> : null}
                  <ChevronRight size={18} color="#ABA08C" />
                </View>
              }
              onPress={onOpenSubscription}
              isLast
            />
          </Card>
        </View>

        <View className="gap-3">
          <SectionLabel>Notifications</SectionLabel>
          <Card className="gap-0 p-0 px-5">
            <Row
              icon={<BellIcon size={18} />}
              title="Commitment reminders"
              description="A nudge before each commitment is due"
              trailing={<Switch value={commitmentReminders} onValueChange={setCommitmentReminders} />}
              isLast={false}
            />
            <Row
              icon={<Icon name="check" size={18} color="#54583A" />}
              title="Review prompts"
              description="Sage checks in on how your last action went"
              trailing={<Switch value={reviewPrompts} onValueChange={setReviewPrompts} />}
              isLast
            />
          </Card>
        </View>

        <View className="gap-3">
          <SectionLabel>Privacy & data</SectionLabel>
          <Card className="gap-0 p-0 px-5">
            <Row
              icon={<Icon name="shield" size={18} color="#54583A" />}
              title="Data & privacy"
              description="What we store, and a copy of it whenever you want"
              trailing={<ChevronRight size={18} color="#ABA08C" />}
              onPress={onOpenDataPrivacy}
              isLast
            />
          </Card>
        </View>

        <View className="gap-3">
          <SectionLabel>Support</SectionLabel>
          <Card className="gap-0 p-0 px-5">
            <Row
              icon={<HelpCircleIcon size={18} />}
              title="Help & contact"
              trailing={<ChevronRight size={18} color="#ABA08C" />}
              onPress={onOpenHelp}
              isLast={false}
            />
            <Row
              icon={<InfoIcon size={18} />}
              title="About Lifefull"
              trailing={<ChevronRight size={18} color="#ABA08C" />}
              onPress={onOpenAbout}
              isLast={false}
            />
            <Row
              icon={<Icon name="shield" size={18} color="#54583A" />}
              title="How Lifefull works"
              trailing={<ChevronRight size={18} color="#ABA08C" />}
              onPress={onOpenHowItWorks}
              isLast
            />
          </Card>
        </View>

        <Card className="gap-0 p-0 px-5">
          <Row icon={<SignOutIcon size={18} />} iconBg="bg-danger-soft" title="Sign out" onPress={onSignOut} isLast />
        </Card>

        <Pressable accessibilityRole="button" onPress={onDeleteAccount} className="items-center py-1">
          <BodyText className="text-danger underline">Delete my account</BodyText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onBackToHome}
          className="flex-row items-center justify-center gap-2 rounded-pill border-[1.5px] border-brand px-6 py-4"
        >
          <HomeIcon size={18} color="#A2571F" />
          <BodyText className="font-sans-bold text-lg text-brand">Back to home</BodyText>
        </Pressable>

        <View className="gap-3">
          <BodyText size="caption">
            <BodyText size="caption" className="font-sans-bold text-text-heading">
              What Lifefull does:{' '}
            </BodyText>
            help you reflect on what matters next and turn it into small real-world steps.
          </BodyText>
          <BodyText size="caption">
            <BodyText size="caption" className="font-sans-bold text-text-heading">
              What it doesn't:{' '}
            </BodyText>
            give medical, psychological, or financial advice. When a topic needs a professional, we'll
            say so.
          </BodyText>
        </View>

        <BodyText size="caption" className="text-center">
          {`Lifefull · Version ${packageJson.version}`}
        </BodyText>
      </ScrollView>
    </View>
  );
}
