import React from 'react';
import { ComingSoon } from '@/components/ui/coming-soon';
import { BookOpen } from 'lucide-react';

interface HairEducationScreenProps {
  onBack: () => void;
}

const hairTypeCategories = [
  {
    type: '1',
    name: 'Cheveux Lisses',
    description: 'Cheveux naturellement raides, sans vagues ni boucles',
    subtypes: [
      { code: '1A', desc: 'Très fins et lisses, difficiles à boucler' },
      { code: '1B', desc: 'Lisses avec un peu de volume et de corps' },
      { code: '1C', desc: 'Lisses avec quelques vagues légères' }
    ],
    emoji: '💇🏻‍♀️'
  },
  {
    type: '2',
    name: 'Cheveux Ondulés',
    description: 'Cheveux avec des vagues naturelles en forme de S',
    subtypes: [
      { code: '2A', desc: 'Vagues légères, fins et faciles à coiffer' },
      { code: '2B', desc: 'Vagues plus marquées, tendance aux frisottis' },
      { code: '2C', desc: 'Vagues prononcées, plus épais et résistants' }
    ],
    emoji: '🌊'
  },
  {
    type: '3',
    name: 'Cheveux Bouclés',
    description: 'Boucles en spirale bien définies',
    subtypes: [
      { code: '3A', desc: 'Grandes boucles lâches et brillantes' },
      { code: '3B', desc: 'Boucles moyennes, plus de volume' },
      { code: '3C', desc: 'Boucles serrées, texture plus épaisse' }
    ],
    emoji: '🌀'
  },
  {
    type: '4',
    name: 'Cheveux Crépus',
    description: 'Texture naturellement bouclée à crépue, forte densité',
    subtypes: [
      { code: '4A', desc: 'Boucles crépues souples et élastiques' },
      { code: '4B', desc: 'Pattern en Z, texture cotonneuse' },
      { code: '4C', desc: 'Pattern très serré, maximum de rétrécissement' }
    ],
    emoji: '✨'
  }
];

const porosityTypes = [
  {
    level: 'Faible',
    description: 'Les cuticules sont très serrées',
    characteristics: [
      'Les produits ont du mal à pénétrer',
      'Les cheveux repoussent l\'eau',
      'Sèchent lentement',
      'Accumulent les produits facilement'
    ],
    tips: [
      'Utiliser de la chaleur douce pour ouvrir les cuticules',
      'Privilégier les textures légères et fluides',
      'Faire des clarifications régulières'
    ],
    color: 'bg-blue-100 border-blue-300',
    icon: '🔒'
  },
  {
    level: 'Moyenne',
    description: 'Les cuticules sont normalement espacées',
    characteristics: [
      'Équilibre parfait absorption/rétention',
      'Faciles à hydrater et à coiffer',
      'Temps de séchage normal',
      'Réagissent bien aux soins'
    ],
    tips: [
      'Routine équilibrée protéines/hydratation',
      'Alternez les textures selon les besoins',
      'Entretien modéré requis'
    ],
    color: 'bg-green-100 border-green-300',
    icon: '⚖️'
  },
  {
    level: 'Haute',
    description: 'Les cuticules sont très ouvertes',
    characteristics: [
      'Absorbent rapidement les produits',
      'Se déshydratent vite',
      'Sèchent rapidement',
      'Besoin de beaucoup d\'hydratation'
    ],
    tips: [
      'Sceller l\'hydratation avec des huiles',
      'Utiliser des produits riches et épais',
      'Éviter les protéines en excès'
    ],
    color: 'bg-red-100 border-red-300',
    icon: '🕳️'
  }
];

const porosityTests = [
  {
    name: 'Test du verre d\'eau',
    steps: [
      'Prendre un cheveu propre (sans produit)',
      'Le déposer dans un verre d\'eau',
      'Attendre 5-10 minutes et observer'
    ],
    results: [
      'Flotte : Porosité faible',
      'Reste au milieu : Porosité moyenne', 
      'Coule rapidement : Porosité haute'
    ]
  },
  {
    name: 'Test tactile',
    steps: [
      'Faire glisser ses doigts le long d\'une mèche',
      'Du bas vers les racines',
      'Observer les sensations'
    ],
    results: [
      'Lisse : Porosité faible',
      'Léger relief : Porosité moyenne',
      'Très rugueux : Porosité haute'
    ]
  }
];

export function HairEducationScreen({ onBack }: HairEducationScreenProps) {
  return (
    <ComingSoon
      title="Éducation Capillaire Avancée"
      description="Un centre complet d'apprentissage sur les soins capillaires arrive bientôt ! En attendant, utilisez le guide de profil intégré lors de la création de votre routine."
      features={[
        "Encyclopédie complète des types de cheveux",
        "Guides vidéo détaillés par texture",
        "Fiches techniques des ingrédients actifs",
        "Tutoriels de coiffures protectrices",
        "Diagnostic capillaire avancé",
        "Articles d'experts et dernières recherches"
      ]}
      onBack={onBack}
      icon={<BookOpen className="mx-auto text-coton-rose" size={64} />}
    />
  );
}