export type Language = 'fr' | 'ar';

export const translations = {
  fr: {
    // Header/Navigation
    nav: {
      home: 'Accueil',
      projects: 'Projets',
      about: 'À Propos',
      contact: 'Contact',
      admin: 'Admin',
    },

    // Home Page
    home: {
      heroTitle: 'Réaliser vos rêves immobiliers',
      heroSubtitle: 'Découvrez nos projets de résidences de prestige en Algérie',
      cta: 'Explorer les Projets',
      ctaContact: 'Nous Contacter',

      featuredProjects: 'Nos Projets Phares',
      aboutTitle: 'À Propos de Hamadat',
      aboutDesc: 'Hamadat Promotion Immobilière est spécialisée dans le développement de résidences de haut standing. Avec plus de 10 ans d\'expérience, nous transformons vos rêves en réalité grâce à une architecture moderne et une qualité supérieure.',

      viewMore: 'Voir Plus',
      schedule: 'Fixer un Rendez-vous',
      virtualTour: 'Visite Virtuelle',
    },

    // Projects Page
    projects: {
      title: 'Tous nos Projets',
      subtitle: 'Découvrez notre portefeuille complet de résidences',
      filter: 'Filtrer par',
      filterStatus: 'Statut',
      filterLocation: 'Localisation',

      status: {
        ongoing: 'Projet en cours',
        completed: 'Livré',
        sold: 'Vendu',
      },

      units: 'unités',
      typology: 'Type',
      location: 'Localisation',
      status_label: 'Statut',
    },

    // Project Detail
    projectDetail: {
      projectInfo: 'Informations du Projet',
      gallery: 'Galerie',
      description: 'Description',
      specifications: 'Caractéristiques',
      contact: 'Nous Contacter',

      totalUnits: 'Nombre Total d\'Unités',
      typology: 'Typologies',
      location: 'Localisation',
      status: 'Statut',

      virtualTourAvailable: 'Visite Virtuelle Disponible',
      startTour: 'Lancer la Visite',
    },

    // Contact Page
    contact: {
      title: 'Nous Contacter',
      subtitle: 'Une question ? Contactez-nous directement',

      form: {
        name: 'Nom Complet',
        email: 'Email',
        phone: 'Téléphone',
        subject: 'Sujet',
        message: 'Message',
        submit: 'Envoyer',
        success: 'Message envoyé avec succès!',
        error: 'Erreur lors de l\'envoi du message',
      },

      info: {
        phone: 'Téléphone',
        email: 'Email',
        address: 'Adresse',
        hours: 'Horaires',
        whatsapp: 'Nous contacter sur WhatsApp',
      },
    },

    // Footer
    footer: {
      company: 'Hamadat Promotion Immobilière',
      description: 'Créateur de résidences de prestige en Algérie.',
      links: 'Liens Rapides',
      contact: 'Contact',
      copyright: '© 2024 Hamadat Promotion Immobilière. Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
    },

    // Admin
    admin: {
      login: 'Connexion Admin',
      loginEmail: 'Email',
      loginPassword: 'Mot de passe',
      loginButton: 'Se Connecter',
      logout: 'Déconnexion',

      dashboard: 'Tableau de Bord',
      residences: 'Résidences',
      addNew: 'Ajouter Nouveau',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',

      form: {
        nameFr: 'Nom (Français)',
        nameAr: 'Nom (Arabe)',
        location: 'Localisation',
        status: 'Statut',
        totalUnits: 'Nombre Total d\'Unités',
        typology: 'Typologies (ex: F3, F4)',
        description: 'Description',
        images: 'Images',
        uploadImages: 'Télécharger des Images',
        virtualTour: 'URL de la Visite Virtuelle',
        featured: 'En Vedette sur la Page d\'Accueil',
        featuredTour: 'Afficher la Visite Virtuelle',
      },

      table: {
        name: 'Nom',
        location: 'Localisation',
        status: 'Statut',
        units: 'Unités',
        actions: 'Actions',
      },
    },
  },

  ar: {
    // Header/Navigation
    nav: {
      home: 'الرئيسية',
      projects: 'المشاريع',
      about: 'حول',
      contact: 'اتصل بنا',
      admin: 'إدارة',
    },

    // Home Page
    home: {
      heroTitle: 'حقق أحلامك العقارية',
      heroSubtitle: 'اكتشف مشاريع السكن الفاخر لدينا في الجزائر',
      cta: 'استكشف المشاريع',
      ctaContact: 'اتصل بنا',

      featuredProjects: 'مشاريعنا المميزة',
      aboutTitle: 'حول حمادة',
      aboutDesc: 'حمادة للترقية العقارية متخصصة في تطوير مباني سكنية فاخرة. مع أكثر من 10 سنوات من الخبرة، نحول أحلامك إلى واقع من خلال العمارة الحديثة والجودة العالية.',

      viewMore: 'عرض المزيد',
      schedule: 'حدد موعد',
      virtualTour: 'جولة افتراضية',
    },

    // Projects Page
    projects: {
      title: 'جميع مشاريعنا',
      subtitle: 'اكتشف محفظتنا الكاملة من المباني السكنية',
      filter: 'تصفية حسب',
      filterStatus: 'الحالة',
      filterLocation: 'الموقع',

      status: {
        ongoing: 'جارٍ حالياً',
        completed: 'مكتمل',
        sold: 'مباع',
      },

      units: 'وحدة',
      typology: 'نوع',
      location: 'الموقع',
      status_label: 'الحالة',
    },

    // Project Detail
    projectDetail: {
      projectInfo: 'معلومات المشروع',
      gallery: 'المعرض',
      description: 'الوصف',
      specifications: 'المواصفات',
      contact: 'اتصل بنا',

      totalUnits: 'إجمالي عدد الوحدات',
      typology: 'الأنواع',
      location: 'الموقع',
      status: 'الحالة',

      virtualTourAvailable: 'جولة افتراضية متاحة',
      startTour: 'ابدأ الجولة',
    },

    // Contact Page
    contact: {
      title: 'اتصل بنا',
      subtitle: 'هل لديك سؤال؟ اتصل بنا مباشرة',

      form: {
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        subject: 'الموضوع',
        message: 'الرسالة',
        submit: 'إرسال',
        success: 'تم إرسال الرسالة بنجاح!',
        error: 'حدث خطأ أثناء إرسال الرسالة',
      },

      info: {
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'العنوان',
        hours: 'ساعات العمل',
        whatsapp: 'اتصل بنا على واتس أب',
      },
    },

    // Footer
    footer: {
      company: 'حمادة للترقية العقارية',
      description: 'منشئ مباني سكنية فاخرة في الجزائر.',
      links: 'روابط سريعة',
      contact: 'اتصال',
      copyright: '© 2024 حمادة للترقية العقارية. جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
    },

    // Admin
    admin: {
      login: 'تسجيل دخول الإدارة',
      loginEmail: 'البريد الإلكتروني',
      loginPassword: 'كلمة المرور',
      loginButton: 'دخول',
      logout: 'تسجيل الخروج',

      dashboard: 'لوحة التحكم',
      residences: 'المباني السكنية',
      addNew: 'إضافة جديد',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',

      form: {
        nameFr: 'الاسم (الفرنسية)',
        nameAr: 'الاسم (العربية)',
        location: 'الموقع',
        status: 'الحالة',
        totalUnits: 'إجمالي عدد الوحدات',
        typology: 'الأنواع',
        description: 'الوصف',
        images: 'الصور',
        uploadImages: 'تحميل الصور',
        virtualTour: 'رابط الجولة الافتراضية',
        featured: 'مميز في الصفحة الرئيسية',
        featuredTour: 'عرض الجولة الافتراضية',
      },

      table: {
        name: 'الاسم',
        location: 'الموقع',
        status: 'الحالة',
        units: 'الوحدات',
        actions: 'الإجراءات',
      },
    },
  },
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value[k];
    if (!value) return key; // Fallback to key if not found
  }

  return value as string;
}
