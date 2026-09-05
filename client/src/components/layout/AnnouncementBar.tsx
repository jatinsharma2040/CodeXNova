import { siteConfig } from '@/config/site';

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <p>
        <span className="inline-flex items-baseline">
          <span className="text-white">Code</span>
          <span className="text-primary-400">XNova</span>
        </span>
        {' · '}
        {siteConfig.announcement}
      </p>
    </div>
  );
}
