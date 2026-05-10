'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourUrl: string;
  residenceName: string;
}

export default function VirtualTourModal({
  isOpen,
  onClose,
  tourUrl,
  residenceName,
}: VirtualTourModalProps) {
  const { lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'جولة افتراضية' : 'Visite Virtuelle'} - {residenceName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Fermer'}
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-700 border-t-silver-300 rounded-full animate-spin dark:border-t-silver-400"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'ar' ? 'جاري التحميل...' : 'Chargement...'}
              </p>
            </div>
          </div>
        )}

        {/* Tour Iframe */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 relative min-h-[500px]">
          <iframe
            src={tourUrl}
            className="w-full h-full border-none"
            title={`${lang === 'ar' ? 'جولة افتراضية' : 'Visite Virtuelle'} - ${residenceName}`}
            onLoad={() => setIsLoading(false)}
            allowFullScreen
          />
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
          {lang === 'ar'
            ? '💡 استخدم الماوس للتنقل والتكبير/التصغير باستخدام عجلة الماوس'
            : '💡 Utilisez la souris pour naviguer et la molette pour zoomer'}
        </div>
      </div>
    </div>
  );
}
