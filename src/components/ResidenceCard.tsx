'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import VirtualTourModal from './VirtualTourModal';

interface Residence {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  status: string;
  units: number;
  apartment_types: string;
  image: string;
  virtual_tour_url?: string | null;
}

export default function ResidenceCard({ residence }: { residence: Residence }) {
  const { lang } = useLanguage();
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const slug = residence?.name?.toLowerCase().replace(/\s+/g, '-') || 'residence';

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; color: string }> = {
      ongoing: { label: 'En cours', color: 'bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
      completed: { label: 'Livré', color: 'bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
      sold: { label: 'Vendu', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700' },
    };

    const status = statusMap[residence.status] || statusMap.ongoing;
    return { label: status.label, color: status.color };
  };

  const status = getStatusBadge();

  return (
    <>
      {residence.virtual_tour_url && (
        <VirtualTourModal
          isOpen={isTourModalOpen}
          onClose={() => setIsTourModalOpen(false)}
          tourUrl={residence.virtual_tour_url}
          residenceName={lang === 'ar' ? residence.nameAr : residence.name}
        />
      )}
      <Link href={`/projets/${slug}`}>
        <div className="group cursor-pointer h-full">
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(110, 98, 80, 0.35) 0%, rgba(168, 152, 120, 0.2) 100%), url(${residence.image})`,
              }}
            />

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Virtual Tour Badge */}
            {residence.virtual_tour_url && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsTourModalOpen(true);
                }}
                className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                {lang === 'ar' ? 'جولة' : 'Visite'}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-7 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {lang === 'ar' ? residence.nameAr : residence.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{residence.location}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 mb-6 flex-1 border-t border-gray-200 dark:border-gray-800 pt-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Unités</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">{residence.units}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Types</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{residence.apartment_types}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full btn btn-primary text-center text-sm">
              {lang === 'ar' ? 'المزيد' : 'Découvrir'}
            </button>
          </div>
        </div>
      </div>
    </Link>
    </>
  );
}
