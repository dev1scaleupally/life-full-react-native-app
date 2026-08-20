import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Checkbox } from './Checkbox';
import { IconButton } from './IconButton';
import { Input } from './Input';
import { Logo } from './Logo';
import { Mark } from './Mark';
import { ScoreCard } from './ScoreCard';
import { Select, type SelectOption } from './Select';
import { Switch } from './Switch';
import { Tabs, type TabItem } from './Tabs';
import { BodyText, Heading } from './Typography';

const DOMAIN_OPTIONS: SelectOption[] = [
  { label: 'Core Drivers', value: 'core' },
  { label: 'Social Architecture', value: 'social' },
  { label: 'Physical Vitality', value: 'physical' },
  { label: 'Resource Awareness', value: 'resource' },
];

const TAB_ITEMS: TabItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'plan', label: 'Plan' },
  { key: 'profile', label: 'Profile' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Heading level="h4">{title}</Heading>
      {children}
    </View>
  );
}

/** Full run-through of every shared component, wired to real local state. */
export function DesignSystemDemo() {
  const [domain, setDomain] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [tab, setTab] = useState('overview');

  return (
    <ScrollView className="flex-1 bg-surface-app" contentContainerClassName="gap-8 p-5">
      <Heading level="h1">Design system</Heading>

      <Section title="Brand">
        <View className="gap-4">
          <Logo />
          <View className="flex-row flex-wrap items-center gap-4">
            <Mark variant="orange" height={40} />
            <Mark variant="navy" height={40} />
            <View className="rounded-md bg-navy-700 p-3">
              <Mark variant="white" height={40} />
            </View>
          </View>
          <View className="gap-3 rounded-md bg-navy-700 p-4">
            <Logo variant="white" />
            <Logo variant="white-mark" />
          </View>
          <Logo variant="navy" />
        </View>
      </Section>

      <Section title="Buttons">
        <View className="flex-row flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </View>
        <View className="flex-row flex-wrap items-center gap-3">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <IconButton
            variant="filled"
            icon={<BodyText className="text-text-on-brand">＋</BodyText>}
          />
          <IconButton icon={<BodyText className="text-text-heading">⋯</BodyText>} />
        </View>
      </Section>

      <Section title="Form controls">
        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          error="Must be at least 8 characters"
        />
        <Select
          label="Focus domain"
          value={domain}
          options={DOMAIN_OPTIONS}
          onChange={setDomain}
          placeholder="Choose a domain…"
        />
        <Checkbox checked={agreed} onChange={setAgreed} label="I agree to the terms" />
        <View className="flex-row items-center justify-between">
          <BodyText>Push notifications</BodyText>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </Section>

      <Section title="Data display">
        <View className="flex-row flex-wrap gap-2">
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="danger">Danger</Badge>
        </View>

        <View className="flex-row items-center gap-3">
          <Avatar initials="SG" size="lg" />
          <Avatar initials="AB" size="md" />
          <Avatar initials="XY" size="sm" />
        </View>

        <Card>
          <BodyText className="font-sans-bold text-text-heading">Plain card</BodyText>
          <BodyText size="sm">A bordered surface for grouping related content.</BodyText>
        </Card>

        <ScoreCard
          label="Social Architecture"
          score={72}
          description="Steady — one open action this week."
        />
      </Section>

      <Section title="Tabs">
        <Tabs items={TAB_ITEMS} value={tab} onChange={setTab} />
        <BodyText size="sm" className="text-text-muted">
          Active tab: {tab}
        </BodyText>
      </Section>
    </ScrollView>
  );
}
