const SidebarData = [
  {
    label: 'Menu',
    isMainMenu: true,
  },
  {
    label: 'Dashboard',
    icon: 'mdi mdi-home-variant-outline',
    isHasArrow: true,
    url: '/dashboard',
  },

  {
    label: 'Rendez-vous',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/appointments',
  },

  // --------------------------------------

  // ----------------------------------------------------------------------
  // Patients, Traitements & Ordonnances
  {
    label: 'Traitements & Ordonnances',
    isMainMenu: true,
  },
  {
    label: 'Patients',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/patients',
  },
  {
    label: 'Traitements',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/traitements',
  },
  {
    label: 'Ordonnances',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/ordonnances',
  },

  // ----------------------------------------------------------------------
  // Médecins
  {
    label: 'Médecins & Fournisseurs',
    isMainMenu: true,
  },
  {
    label: 'Médecins',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/doctors',
  },
  {
    label: 'Fournisseurs',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/fournisseurs',
  },

  // ----------------------------------------------------------------------
  // Transactions
  {
    label: 'Paiements',
    isMainMenu: true,
  },
  {
    label: 'Transactions',
    icon: 'mdi mdi-email-outline',
    subItem: [
      { sublabel: 'Faire un Paiement', link: '/paiements' },
      { sublabel: 'Factures', link: '/factures' },
      { sublabel: 'Dépense', link: '/depenses' },
    ],
  },

  // ----------------------------------------------------------------------
  // Outils Médical
  {
    label: 'Matériels',
    isMainMenu: true,
  },
  {
    label: 'Outis Médicals',
    icon: 'mdi mdi-email-outline',
    subItem: [
      { sublabel: 'Chambre', link: '/chambres' },
      { sublabel: 'Matériels', link: '/materiels' },
    ],
  },

  // Pharmacie
  {
    label: 'Suivie Pharmaceutique',
    isMainMenu: true,
  },
  {
    label: 'Pharmacie',
    icon: 'mdi mdi-email-outline',
    subItem: [
      { sublabel: 'Médicament', link: '/medicaments' },
      { sublabel: 'Approvisionnements', link: '/approvisonnements' },
    ],
  },

  // Pharmacie
  {
    label: 'Statistiques & Rapports',
    isMainMenu: true,
  },
  {
    label: 'Rapports et Suivie',
    icon: 'mdi mdi-email-outline',
    subItem: [{ sublabel: 'Raports', link: '/rapports' }],
  },
  // --------------------------------------
];
export default SidebarData;
