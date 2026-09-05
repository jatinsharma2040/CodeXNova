import { cn } from '@/utils/cn';

type BrandMarkProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'dark';
};

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
} as const;

export function BrandMark({ className, size = 'md', tone = 'light' }: BrandMarkProps) {
  return (
    <span className={cn('font-extrabold tracking-tight', sizes[size], className)}>
      <span className={tone === 'dark' ? 'text-white' : 'text-ink'}>Code</span>
      <span className={tone === 'dark' ? 'text-primary-400' : 'text-primary'}>XNova</span>
    </span>
  );
}
