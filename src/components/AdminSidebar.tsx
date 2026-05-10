'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: 'Tableau de Bord',
      href: '/admin',
      icon: '📊',
    },
    {
      label: 'Résidences',
      href: '/admin/residences',
      icon: '🏢',
    },
    {
      label: 'Paramètres',
      href: '/admin/settings',
      icon: '⚙️',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-3 px-6 pb-8 border-b border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">H</span>
        </div>
        <span className="font-poppins font-bold text-lg hidden sm:inline">Hamadat</span>
      </Link>

      {/* Navigation */}
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item ${
              pathname === item.href ? 'active' : ''
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
