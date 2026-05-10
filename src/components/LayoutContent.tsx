'use client';
import PageTransition from '@/components/anim/PageTransition';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
