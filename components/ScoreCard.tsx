import { View } from 'react-native';
import { Card } from './Card';
import { cn } from './cn';
import { BodyText, Eyebrow, Stat } from './Typography';

export type ScoreCardProps = {
  label: string;
  /** 0–100 */
  score: number;
  description?: string;
  className?: string;
};

/** The recurring "domain score" pattern — eyebrow label, big stat number, progress bar. */
export function ScoreCard({ label, score, description, className = '' }: ScoreCardProps) {
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <Card className={cn('gap-3', className)}>
      <Eyebrow>{label}</Eyebrow>
      <Stat>{clamped}</Stat>
      <View className="h-2 overflow-hidden rounded-pill bg-surface-sunken">
        <View className="h-full rounded-pill bg-brand" style={{ width: `${clamped}%` }} />
      </View>
      {description ? <BodyText size="sm">{description}</BodyText> : null}
    </Card>
  );
}
