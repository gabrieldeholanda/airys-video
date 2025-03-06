import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/utils/rtlUtil';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Layout({ children, className, ...props }: LayoutProps) {
  const { i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col',
        rtl ? 'direction-rtl' : 'direction-ltr',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LayoutContent({ children, className, ...props }: LayoutProps) {
  const { i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <div
      className={cn(
        'flex flex-1 flex-col',
        rtl ? 'mr-auto' : 'ml-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LayoutHeader({ children, className, ...props }: LayoutProps) {
  return (
    <header
      className={cn('flex h-14 items-center border-b px-4', className)}
      {...props}
    >
      {children}
    </header>
  );
}

export function LayoutSidebar({ children, className, ...props }: LayoutProps) {
  const { i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <aside
      className={cn(
        'w-64 border-r',
        rtl ? 'border-l' : 'border-r',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
} 