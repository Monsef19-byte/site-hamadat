'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email === 'admin@hamadat.dz' && password === 'admin123') {
        localStorage.setItem('admin-token', 'mock-token-' + Date.now());
        document.cookie = 'admin-auth-token=mock-token; path=/; max-age=86400';
        document.cookie = 'admin-verified=true; path=/; max-age=86400';
        setTimeout(() => {
          router.push('/admin');
        }, 100);
      } else {
        setError('Identifiants invalides');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1a19 0%, #06080a 50%, #0e2f2d 100%)',
      padding: '16px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/images/logo/logo-vertical-color.png"
            alt="Hamadat"
            style={{ height: '80px', width: 'auto', margin: '0 auto 20px', display: 'block', objectFit: 'contain' }}
          />
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Tableau de Bord Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0e7470'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              placeholder="admin@hamadat.dz"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0e7470'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(220,38,38,0.2)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#0e7470',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(14,116,112,0.3)',
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = '#0a5450'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(14,116,112,0.4)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#0e7470'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,116,112,0.3)'; }}
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>

        <p style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          Identifiants de test: admin@hamadat.dz / admin123
        </p>
      </div>
    </div>
  );
}
