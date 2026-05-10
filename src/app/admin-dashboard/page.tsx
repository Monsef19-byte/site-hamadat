'use client';

import { useState, useEffect } from 'react';

interface Residence {
  id: string;
  name_fr: string;
  name_ar: string;
  location: string;
  status: 'Projet en cours' | 'Livré' | 'Vendu';
  total_units: number;
  typology: string;
  description_fr: string;
  description_ar: string;
  images?: string[];
  thumbnail?: string;
}

const mockResidences: Residence[] = [
  {
    id: '1',
    name_fr: 'Elysia',
    name_ar: 'إليسيا',
    location: 'Jijel',
    status: 'Projet en cours',
    total_units: 56,
    typology: 'F3 (96-110 m²)',
    description_fr: 'Résidence de prestige à Jijel',
    description_ar: 'مجمع سكني فاخر في جيجل',
  },
  {
    id: '2',
    name_fr: 'Les 3 Princes',
    name_ar: 'الثلاث أمراء',
    location: 'Alger',
    status: 'Projet en cours',
    total_units: 120,
    typology: 'F2, F3, F4',
    description_fr: "Projet ambitieux au cœur d'Alger",
    description_ar: 'مشروع طموح في قلب الجزائر',
  },
  {
    id: '3',
    name_fr: 'Orea',
    name_ar: 'أوريا',
    location: 'Oran',
    status: 'Livré',
    total_units: 80,
    typology: 'F3 (100-120 m²)',
    description_fr: 'Projet achevé avec succès',
    description_ar: 'مشروع مكتمل بنجاح',
  },
  {
    id: '4',
    name_fr: 'Lumalac',
    name_ar: 'لوملاك',
    location: 'Béjaïa',
    status: 'Projet en cours',
    total_units: 45,
    typology: 'F3, F4',
    description_fr: 'Résidence moderne à Béjaïa',
    description_ar: 'مجمع حديث في بجاية',
  },
  {
    id: '5',
    name_fr: 'Marmo',
    name_ar: 'مارمو',
    location: 'Sétif',
    status: 'Projet en cours',
    total_units: 60,
    typology: 'F3 (98-115 m²)',
    description_fr: 'Projet de qualité à Sétif',
    description_ar: 'مشروع جودة في سطيف',
  },
  {
    id: '6',
    name_fr: 'Vert Dalya',
    name_ar: 'فيرت داليا',
    location: 'Alger',
    status: 'Livré',
    total_units: 90,
    typology: 'F2, F3, F4',
    description_fr: 'Projet vert et durable',
    description_ar: 'مشروع أخضر ومستدام',
  },
];

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [residences, setResidences] = useState<Residence[]>(mockResidences);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Residence | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email === 'admin@hamadat.dz' && password === 'admin123') {
        localStorage.setItem('admin-token', 'mock-token-' + Date.now());
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
      } else {
        setError('Identifiants invalides');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const openNewModal = () => {
    setFormData({
      id: Date.now().toString(),
      name_fr: '',
      name_ar: '',
      location: '',
      status: 'Projet en cours',
      total_units: 0,
      typology: '',
      description_fr: '',
      description_ar: '',
      images: [],
      thumbnail: undefined,
    });
    setEditingId(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (residence: Residence) => {
    setFormData({
      ...residence,
      images: residence.images || [],
      thumbnail: residence.thumbnail,
    });
    setEditingId(residence.id);
    setImagePreview(residence.thumbnail || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(null);
    setEditingId(null);
    setImagePreview(null);
  };

  const handleSave = () => {
    if (!formData) return;

    if (editingId) {
      setResidences(
        residences.map((r) =>
          r.id === editingId ? formData : r
        )
      );
    } else {
      setResidences([...residences, formData]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette résidence?')) {
      setResidences(residences.filter((r) => r.id !== id));
    }
  };

  const handleInputChange = (field: keyof Residence, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        if (formData) {
          const images = formData.images || [];
          const newImages = [...images, imageData];
          setFormData({
            ...formData,
            images: newImages,
            thumbnail: formData.thumbnail || imageData,
          });
          if (!formData.thumbnail) {
            setImagePreview(imageData);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    if (!formData) return;
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    let newThumbnail = formData.thumbnail;

    if (formData.thumbnail === formData.images?.[index]) {
      newThumbnail = newImages[0];
      setImagePreview(newImages[0] || null);
    }

    setFormData({
      ...formData,
      images: newImages,
      thumbnail: newThumbnail,
    });
  };

  const handleSetThumbnail = (image: string) => {
    if (formData) {
      setFormData({
        ...formData,
        thumbnail: image,
      });
      setImagePreview(image);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Projet en cours':
        return { bg: '#fef3c7', text: '#92400e' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const stats = [
    { label: 'Total Résidences', value: residences.length, icon: '🏢' },
    {
      label: 'En Cours',
      value: residences.filter((r) => r.status === 'Projet en cours').length,
      icon: '🚧',
    },
    {
      label: 'Livrées',
      value: residences.filter((r) => r.status === 'Livré').length,
      icon: '✅',
    },
    {
      label: 'Total Unités',
      value: residences.reduce((sum, r) => sum + r.total_units, 0),
      icon: '🏠',
    },
  ];

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b7a62 0%, #6e6250 100%)',
          padding: '16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #8b7a62 0%, #6e6250 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '32px' }}>
                H
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              Hamadat
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              Tableau de Bord Admin
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                placeholder="admin@hamadat.dz"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid #fecaca',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: loading ? '#9ca3af' : '#8b7a62',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                !loading && (e.currentTarget.style.background = '#6e6250')
              }
              onMouseLeave={(e) =>
                !loading && (e.currentTarget.style.background = '#8b7a62')
              }
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '20px', margin: '0' }}>
            Test: admin@hamadat.dz / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
              Tableau de Bord
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
              Gérez vos résidences et projets
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={openNewModal}
              style={{
                padding: '10px 20px',
                background: '#8b7a62',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#6e6250')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#8b7a62')}
            >
              + Ajouter Résidence
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: '8px 0 0 0',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <span style={{ fontSize: '32px' }}>{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Residences Table */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
              Résidences
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Vignette
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Nom
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Localisation
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Unités
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Statut
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Typologie
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {residences.map((residence, idx) => {
                  const statusColor = getStatusColor(residence.status);
                  return (
                    <tr
                      key={residence.id}
                      style={{
                        borderBottom:
                          idx < residences.length - 1
                            ? '1px solid #e5e7eb'
                            : 'none',
                        background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        {residence.thumbnail ? (
                          <img
                            src={residence.thumbnail}
                            alt={residence.name_fr}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              background: '#f3f4f6',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#9ca3af',
                              fontSize: '12px',
                            }}
                          >
                            No image
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1f2937',
                        }}
                      >
                        {residence.name_fr}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {residence.location}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {residence.total_units}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: statusColor.bg,
                            color: statusColor.text,
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {residence.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {residence.typology}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <button
                          onClick={() => openEditModal(residence)}
                          style={{
                            padding: '6px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = '#2563eb')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = '#3b82f6')
                          }
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(residence.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = '#dc2626')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = '#ef4444')
                          }
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && formData && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px',
            }}
            onClick={closeModal}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 24px 0',
                }}
              >
                {editingId ? 'Modifier Résidence' : 'Ajouter Résidence'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name FR */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Nom (Français)
                  </label>
                  <input
                    type="text"
                    value={formData.name_fr}
                    onChange={(e) => handleInputChange('name_fr', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Name AR */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Nom (Arabe)
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => handleInputChange('name_ar', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Photos Section */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Photos
                  </label>
                  <div
                    style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = '#8b7a62')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = '#d1d5db')
                    }
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        display: 'none',
                      }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{
                        cursor: 'pointer',
                        display: 'block',
                      }}
                    >
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                        Cliquez pour ajouter des images
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
                        ou glissez et déposez
                      </p>
                    </label>
                  </div>

                  {/* Thumbnail Preview */}
                  {imagePreview && (
                    <div style={{ marginTop: '16px' }}>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '8px',
                        }}
                      >
                        Vignette (aperçu)
                      </p>
                      <img
                        src={imagePreview}
                        alt="Thumbnail"
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #8b7a62',
                        }}
                      />
                    </div>
                  )}

                  {/* Gallery */}
                  {formData.images && formData.images.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '12px',
                        }}
                      >
                        Galerie ({formData.images.length} photos)
                      </p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {formData.images.map((image, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border:
                                formData.thumbnail === image
                                  ? '3px solid #8b7a62'
                                  : '1px solid #e5e7eb',
                              aspectRatio: '1',
                            }}
                          >
                            <img
                              src={image}
                              alt={`Gallery ${idx}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '8px',
                                gap: '4px',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.style.opacity = '1';
                                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.style.opacity = '0';
                                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0)';
                                }
                              }}
                            >
                              {formData.thumbnail !== image && (
                                <button
                                  onClick={() => handleSetThumbnail(image)}
                                  style={{
                                    padding: '4px 8px',
                                    background: '#8b7a62',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = '#6e6250')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = '#8b7a62')
                                  }
                                >
                                  Vignette
                                </button>
                              )}
                              {formData.thumbnail === image && (
                                <div
                                  style={{
                                    padding: '4px 8px',
                                    background: '#8b7a62',
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                  }}
                                >
                                  ✓ Vignette
                                </div>
                              )}
                              <button
                                onClick={() => handleRemoveImage(idx)}
                                style={{
                                  padding: '4px 8px',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = '#dc2626')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = '#ef4444')
                                }
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange(
                        'status',
                        e.target.value as 'Projet en cours' | 'Livré' | 'Vendu'
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="Projet en cours">Projet en cours</option>
                    <option value="Livré">Livré</option>
                    <option value="Vendu">Vendu</option>
                  </select>
                </div>

                {/* Total Units */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Nombre d&apos;Unités
                  </label>
                  <input
                    type="number"
                    value={formData.total_units}
                    onChange={(e) =>
                      handleInputChange('total_units', parseInt(e.target.value))
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Typology */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Typologie
                  </label>
                  <input
                    type="text"
                    value={formData.typology}
                    onChange={(e) => handleInputChange('typology', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Description FR */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Description (Français)
                  </label>
                  <textarea
                    value={formData.description_fr}
                    onChange={(e) => handleInputChange('description_fr', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      minHeight: '80px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Description AR */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}
                  >
                    Description (Arabe)
                  </label>
                  <textarea
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange('description_ar', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      minHeight: '80px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={handleSave}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: '#8b7a62',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#6e6250')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '#8b7a62')
                    }
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: '#e5e7eb',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#d1d5db')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '#e5e7eb')
                    }
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
