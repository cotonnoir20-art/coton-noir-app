export interface PartnerLink {
  store: string;
  storeLogo?: string;
  url: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  shippingInfo?: string;
  affiliateCode?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'shampoing' | 'conditioner' | 'masque' | 'leave-in' | 'huile' | 'beurre' | 'gel' | 'mousse' | 'serum' | 'traitement';
  price: number;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string[];
  
  // Critères de matching
  hairTypes: ('3C' | '4A' | '4B' | '4C' | 'LOCKS')[];
  porosity: ('faible' | 'moyenne' | 'elevee')[];
  objectives: string[];
  problems: string[];
  needs: string[];
  
  image?: string;
  benefits: string[];
  howToUse?: string;
  isNatural: boolean;
  isSulfateFree: boolean;
  isParabenFree: boolean;
  
  // Liens partenaires
  partnerLinks: PartnerLink[];
}

export const PRODUCTS_DATABASE: Product[] = [
  // Shampoings
  {
    id: 'sh001',
    name: 'Shampoing Hydratant Coco & Karité',
    brand: 'CurlsNaturally',
    category: 'shampoing',
    price: 12.99,
    rating: 4.5,
    reviews: 1203,
    description: 'Shampoing sans sulfates enrichi en huile de coco et beurre de karité pour nettoyer en douceur les cheveux texturés.',
    ingredients: ['Eau', 'Sodium Cocoyl Isethionate', 'Huile de Coco Bio', 'Beurre de Karité', 'Provitamine B5'],
    hairTypes: ['3C', '4A', '4B', '4C'],
    porosity: ['moyenne', 'elevee'],
    objectives: ['Hydratation', 'Douceur'],
    problems: ['secheresse', 'demelage'],
    needs: ['hydratation', 'brillance'],
    benefits: ['Nettoie sans décaper', 'Hydrate intensément', 'Facilite le démêlage'],
    howToUse: 'Appliquer sur cheveux mouillés, masser délicatement, rincer abondamment.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Sephora',
        url: 'https://www.sephora.fr/p/shampoing-hydratant-coco-karite-P12345',
        price: 12.99,
        originalPrice: 15.99,
        discount: 19,
        availability: 'in_stock',
        shippingInfo: 'Livraison gratuite dès 25€',
        affiliateCode: 'COTON2025'
      },
      {
        store: 'Notino',
        url: 'https://www.notino.fr/curls-naturally/shampoing-hydratant/',
        price: 11.90,
        availability: 'in_stock',
        shippingInfo: 'Livraison 2-3 jours'
      },
      {
        store: 'Nappy Queen',
        url: 'https://nappy-queen.com/products/shampoing-coco-karite',
        price: 13.50,
        availability: 'low_stock',
        shippingInfo: 'Livraison 24h en région parisienne'
      }
    ]
  },
  
  {
    id: 'sh002', 
    name: 'Shampoing Clarifiant Doux',
    brand: 'AfroGlow',
    category: 'shampoing',
    price: 15.50,
    rating: 4.3,
    reviews: 890,
    description: 'Shampoing clarifiant doux pour éliminer les résidus de produits sans assécher les cheveux crépus.',
    ingredients: ['Eau', 'Sodium Lauryl Sulfoacetate', 'Extrait de Thé Vert', 'Argile Blanche', 'Huile de Jojoba'],
    hairTypes: ['4A', '4B', '4C'],
    porosity: ['faible', 'moyenne'],
    objectives: ['Purification', 'Équilibrage'],
    problems: ['accumulation_produits', 'cuir_chevelu'],
    needs: ['nettoyage_profond'],
    benefits: ['Élimine les résidus', 'Purifie le cuir chevelu', 'Prépare aux soins'],
    howToUse: 'Utiliser 1-2 fois par mois. Masser sur cuir chevelu, laisser agir 2 minutes.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Afrikrea',
        url: 'https://www.afrikrea.com/fr/produit/shampoing-clarifiant-doux',
        price: 15.50,
        availability: 'in_stock',
        shippingInfo: 'Livraison internationale'
      },
      {
        store: 'Amazon',
        url: 'https://www.amazon.fr/dp/B08XYZ123',
        price: 14.99,
        availability: 'in_stock',
        shippingInfo: 'Prime - Livraison gratuite'
      }
    ]
  },

  // Conditionneurs
  {
    id: 'cd001',
    name: 'Conditioner Démêlant Hibiscus',
    brand: 'NaturalCurls',
    category: 'conditioner',
    price: 14.90,
    rating: 4.7,
    reviews: 2156,
    description: 'Conditioner riche en hibiscus et protéines végétales pour démêler et fortifier les boucles.',
    ingredients: ['Eau', 'Cetyl Alcohol', 'Extrait d\'Hibiscus', 'Protéines de Riz', 'Huile d\'Argan'],
    hairTypes: ['3C', '4A', '4B'],
    porosity: ['moyenne', 'elevee'],
    objectives: ['Fortification', 'Démêlage'],
    problems: ['demelage', 'casse', 'frisottis'],
    needs: ['definition', 'casse'],
    benefits: ['Démêle instantanément', 'Renforce la fibre', 'Définit les boucles'],
    howToUse: 'Appliquer sur longueurs humides, laisser poser 3-5 minutes, rincer.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Marionnaud',
        url: 'https://www.marionnaud.fr/conditioner-demelant-hibiscus',
        price: 14.90,
        availability: 'in_stock',
        shippingInfo: 'Click & Collect disponible'
      },
      {
        store: 'Blackstore',
        url: 'https://blackstore.fr/products/conditioner-hibiscus',
        price: 13.90,
        originalPrice: 16.90,
        discount: 18,
        availability: 'in_stock',
        shippingInfo: 'Livraison offerte dès 30€'
      }
    ]
  },

  // Masques
  {
    id: 'mq001',
    name: 'Masque Réparateur Intense',
    brand: 'AfroRestore',
    category: 'masque',
    price: 22.00,
    rating: 4.8,
    reviews: 1567,
    description: 'Masque ultra-nourrissant aux protéines et huiles précieuses pour cheveux abîmés et cassants.',
    ingredients: ['Beurre de Murumuru', 'Huile de Baobab', 'Protéines de Soie', 'Céramides', 'Vitamine E'],
    hairTypes: ['4A', '4B', '4C'],
    porosity: ['elevee'],
    objectives: ['Réparation', 'Nutrition intense'],
    problems: ['casse', 'secheresse', 'cheveux_abimes'],
    needs: ['reparation', 'hydratation'],
    benefits: ['Répare la fibre capillaire', 'Nutrition intense', 'Réduit la casse'],
    howToUse: 'Appliquer sur cheveux lavés, laisser poser 15-20 minutes, rincer soigneusement.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Sephora',
        url: 'https://www.sephora.fr/p/masque-reparateur-intense',
        price: 22.00,
        availability: 'in_stock',
        shippingInfo: 'Livraison gratuite dès 25€'
      },
      {
        store: 'Nocibé',
        url: 'https://www.nocibe.fr/masque-reparateur-afro-restore',
        price: 21.50,
        availability: 'in_stock'
      }
    ]
  },

  {
    id: 'mq002',
    name: 'Masque Hydratant Aloe & Miel',
    brand: 'CurlsNaturally',
    category: 'masque',
    price: 18.99,
    rating: 4.6,
    reviews: 1834,
    description: 'Masque hydratant à l\'aloe vera et miel pour cheveux assoiffés et ternes.',
    ingredients: ['Gel d\'Aloe Vera', 'Miel de Manuka', 'Huile de Coco', 'Glycérine Végétale', 'Extrait de Bambou'],
    hairTypes: ['3C', '4A', '4B', '4C'],
    porosity: ['faible', 'moyenne'],
    objectives: ['Hydratation', 'Souplesse'],
    problems: ['secheresse', 'ternissement'],
    needs: ['hydratation', 'brillance', 'volume'],
    benefits: ['Hydratation longue durée', 'Apporte brillance', 'Assouplit la texture'],
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Amazon',
        url: 'https://www.amazon.fr/dp/B08ABC789',
        price: 18.99,
        availability: 'in_stock',
        shippingInfo: 'Prime - Livraison gratuite'
      },
      {
        store: 'Nappy Queen',
        url: 'https://nappy-queen.com/products/masque-aloe-miel',
        price: 19.90,
        availability: 'low_stock'
      }
    ]
  },

  // Leave-in
  {
    id: 'lv001',
    name: 'Crème Leave-in Définition Parfaite',
    brand: 'CurlDefine',
    category: 'leave-in',
    price: 16.50,
    rating: 4.9,
    reviews: 3247,
    description: 'Crème sans rinçage pour définir et hydrater les boucles toute la journée.',
    ingredients: ['Eau', 'Beurre de Karité', 'Huile de Jojoba', 'Protéines de Quinoa', 'Extrait de Lin'],
    hairTypes: ['3C', '4A'],
    porosity: ['faible', 'moyenne'],
    objectives: ['Définition', 'Hydratation quotidienne'],
    problems: ['frisottis', 'perte_definition'],
    needs: ['definition', 'hydratation'],
    benefits: ['Définit les boucles', 'Contrôle les frisottis', 'Hydratation 24h'],
    howToUse: 'Appliquer sur cheveux humides, répartir uniformément, coiffer selon technique préférée.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Blackstore',
        url: 'https://blackstore.fr/products/leave-in-definition-parfaite',
        price: 16.50,
        originalPrice: 19.90,
        discount: 17,
        availability: 'in_stock',
        shippingInfo: 'Livraison offerte dès 30€'
      },
      {
        store: 'Afrikrea',
        url: 'https://www.afrikrea.com/fr/produit/creme-leave-in-definition',
        price: 15.90,
        availability: 'in_stock'
      }
    ]
  },

  // Huiles
  {
    id: 'hl001',
    name: 'Huile Précieuse Multi-Usages',
    brand: 'AfroGlow',
    category: 'huile',
    price: 24.90,
    rating: 4.7,
    reviews: 1923,
    description: 'Mélange d\'huiles précieuses pour sceller l\'hydratation et apporter brillance.',
    ingredients: ['Huile de Baobab', 'Huile de Moringa', 'Huile de Pracaxi', 'Vitamine E', 'Parfum Naturel'],
    hairTypes: ['4A', '4B', '4C'],
    porosity: ['moyenne', 'elevee'],
    objectives: ['Scellage', 'Brillance', 'Protection'],
    problems: ['secheresse', 'ternissement', 'casse'],
    needs: ['brillance', 'protection', 'hydratation'],
    benefits: ['Scelle l\'hydratation', 'Brillance intense', 'Protection thermique légère'],
    howToUse: 'Quelques gouttes sur cheveux humides ou secs. Utilisation cuir chevelu possible.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Marionnaud',
        url: 'https://www.marionnaud.fr/huile-precieuse-multi-usages',
        price: 24.90,
        availability: 'in_stock',
        shippingInfo: 'Click & Collect disponible'
      },
      {
        store: 'Sephora',
        url: 'https://www.sephora.fr/p/huile-precieuse-afroglow',
        price: 26.00,
        availability: 'in_stock'
      }
    ]
  },

  // Beurres
  {
    id: 'br001',
    name: 'Beurre Coiffant Karité Pur',
    brand: 'NaturalCurls',
    category: 'beurre',
    price: 19.99,
    rating: 4.5,
    reviews: 1456,
    description: 'Beurre de karité pur du Burkina Faso pour nourrir et coiffer les cheveux les plus secs.',
    ingredients: ['Beurre de Karité Brut', 'Huile de Coco', 'Cire de Candelilla', 'Huile Essentielle d\'Ylang-Ylang'],
    hairTypes: ['4B', '4C'],
    porosity: ['elevee'],
    objectives: ['Nutrition intense', 'Coiffage naturel'],
    problems: ['secheresse_extreme', 'cheveux_rebelles'],
    needs: ['nutrition', 'maitrise'],
    benefits: ['Nutrition profonde', 'Facilite le coiffage', 'Texture fondante'],
    howToUse: 'Réchauffer entre les paumes, appliquer sur cheveux humides ou secs.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Nappy Queen',
        url: 'https://nappy-queen.com/products/beurre-karite-pur',
        price: 19.99,
        availability: 'in_stock',
        shippingInfo: 'Livraison 24h en région parisienne'
      },
      {
        store: 'Amazon',
        url: 'https://www.amazon.fr/dp/B08DEF456',
        price: 18.90,
        availability: 'in_stock',
        shippingInfo: 'Prime - Livraison gratuite'
      }
    ]
  },

  // Gels
  {
    id: 'gl001',
    name: 'Gel Définition Strong Hold',
    brand: 'CurlDefine',
    category: 'gel',
    price: 13.90,
    rating: 4.4,
    reviews: 2890,
    description: 'Gel fixation forte à base de lin pour définir et maintenir les boucles sans résidus.',
    ingredients: ['Eau', 'Gel de Lin', 'Glycérine Végétale', 'Xanthane', 'Huile de Ricin', 'Conservateur Naturel'],
    hairTypes: ['3C', '4A', '4B'],
    porosity: ['faible', 'moyenne'],
    objectives: ['Définition', 'Tenue longue durée'],
    problems: ['frisottis', 'perte_definition', 'tenue_insuffisante'],
    needs: ['definition', 'tenue'],
    benefits: ['Fixation forte', 'Définition nette', 'Pas de résidus blancs'],
    howToUse: 'Appliquer sur cheveux très humides, techniques finger coils ou scrunching.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Blackstore',
        url: 'https://blackstore.fr/products/gel-definition-strong-hold',
        price: 13.90,
        availability: 'in_stock',
        shippingInfo: 'Livraison offerte dès 30€'
      },
      {
        store: 'Notino',
        url: 'https://www.notino.fr/curl-define/gel-definition-strong-hold/',
        price: 12.90,
        originalPrice: 15.90,
        discount: 19,
        availability: 'in_stock'
      }
    ]
  },

  // Sérums
  {
    id: 'sr001',
    name: 'Sérum Anti-Frisottis Argan',
    brand: 'AfroSmooth',
    category: 'serum',
    price: 21.50,
    rating: 4.6,
    reviews: 1672,
    description: 'Sérum léger à l\'huile d\'argan pour contrôler les frisottis et apporter brillance.',
    ingredients: ['Huile d\'Argan Bio', 'Squalane', 'Vitamine E', 'Silice Naturelle'],
    hairTypes: ['3C', '4A', '4B', '4C'],
    porosity: ['faible', 'moyenne'],
    objectives: ['Contrôle frisottis', 'Brillance', 'Finition'],
    problems: ['frisottis', 'ternissement', 'cheveux_rebelles'],
    needs: ['brillance', 'maitrise'],
    benefits: ['Contrôle immédiat des frisottis', 'Brillance miroir', 'Texture soyeuse'],
    howToUse: '2-3 gouttes sur cheveux secs en finition ou sur humides avant coiffage.',
    isNatural: true,
    isSulfateFree: true,
    isParabenFree: true,
    partnerLinks: [
      {
        store: 'Sephora',
        url: 'https://www.sephora.fr/p/serum-anti-frisottis-argan',
        price: 21.50,
        availability: 'in_stock',
        shippingInfo: 'Livraison gratuite dès 25€'
      },
      {
        store: 'Marionnaud',
        url: 'https://www.marionnaud.fr/serum-anti-frisottis-afrosmooth',
        price: 20.90,
        availability: 'low_stock',
        shippingInfo: 'Click & Collect disponible'
      },
      {
        store: 'Amazon',
        url: 'https://www.amazon.fr/dp/B08GHI789',
        price: 19.99,
        availability: 'in_stock',
        shippingInfo: 'Prime - Livraison gratuite',
        affiliateCode: 'COTON2025'
      }
    ]
  }
];

// Fonction utilitaire pour filtrer les produits
export const getProductsByCategory = (category: Product['category']) => {
  return PRODUCTS_DATABASE.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return PRODUCTS_DATABASE.find(product => product.id === id);
};