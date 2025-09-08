import React from 'react';
import { ArrowLeft, Book, Droplets, Eye, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';

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
    <div className="min-h-screen bg-background px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="black" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="font-poppins font-bold text-xl text-foreground">
            Guide des Types de Cheveux
          </h1>
          <p className="font-roboto text-sm text-muted-foreground">
            Comprendre ton type de cheveux et ta porosité
          </p>
        </div>
      </div>

      {/* Introduction */}
      <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/20 to-purple-100">
        <div className="text-center space-y-3">
          <div className="text-4xl">📚</div>
          <h2 className="font-poppins font-semibold text-lg text-foreground">
            Classification André Walker
          </h2>
          <p className="font-roboto text-sm text-muted-foreground">
            Système de classification créé pour Oprah Winfrey, aujourd'hui référence mondiale pour identifier les types de cheveux.
          </p>
        </div>
      </CotonCard>

      {/* Hair Types Section */}
      <div className="space-y-4">
        <h2 className="font-poppins font-bold text-xl text-foreground flex items-center gap-2">
          <Book size={20} />
          Types de Cheveux (1-4)
        </h2>
        
        {hairTypeCategories.map((category) => (
          <CotonCard key={category.type} className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="text-2xl">{category.emoji}</div>
              <div>
                <h3 className="font-poppins font-semibold text-lg text-foreground">
                  Type {category.type} - {category.name}
                </h3>
                <p className="font-roboto text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {category.subtypes.map((subtype) => (
                <div key={subtype.code} className="p-3 rounded-lg bg-white/60">
                  <div className="font-poppins font-medium text-sm text-coton-rose mb-1">
                    {subtype.code}
                  </div>
                  <p className="font-roboto text-xs text-muted-foreground">
                    {subtype.desc}
                  </p>
                </div>
              ))}
            </div>
          </CotonCard>
        ))}
      </div>

      {/* Visual Guide */}
      <CotonCard className="p-6 space-y-4">
        <h3 className="font-poppins font-semibold text-lg text-foreground flex items-center gap-2">
          <Eye size={20} />
          Guide Visuel
        </h3>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🔍</div>
            <div className="space-y-2">
              <p className="font-roboto text-sm text-gray-700">
                <strong>Astuce :</strong> Observez vos cheveux naturels, sans produit, à la lumière naturelle
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <span className="px-3 py-1 bg-white rounded-full">1️⃣ Totalement raides</span>
                <span className="px-3 py-1 bg-white rounded-full">2️⃣ Vagues en S</span>
                <span className="px-3 py-1 bg-white rounded-full">3️⃣ Boucles spiralées</span>
                <span className="px-3 py-1 bg-white rounded-full">4️⃣ Pattern en Z</span>
              </div>
            </div>
          </div>
        </div>
      </CotonCard>

      {/* Porosity Section */}
      <div className="space-y-4">
        <h2 className="font-poppins font-bold text-xl text-foreground flex items-center gap-2">
          <Droplets size={20} />
          Porosité des Cheveux
        </h2>
        
        <CotonCard className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="font-roboto text-sm text-muted-foreground">
              La porosité détermine la capacité de tes cheveux à absorber et retenir l'hydratation
            </p>
          </div>
          
          <div className="space-y-4">
            {porosityTypes.map((porosity) => (
              <div key={porosity.level} className={`p-4 rounded-lg border-2 ${porosity.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{porosity.icon}</div>
                  <div>
                    <h4 className="font-poppins font-semibold text-base text-gray-800">
                      Porosité {porosity.level}
                    </h4>
                    <p className="font-roboto text-sm text-gray-600">
                      {porosity.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-poppins font-medium text-sm text-gray-800 mb-2">
                      Caractéristiques :
                    </h5>
                    <ul className="space-y-1">
                      {porosity.characteristics.map((char, index) => (
                        <li key={index} className="font-roboto text-xs text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-poppins font-medium text-sm text-gray-800 mb-2">
                      Conseils :
                    </h5>
                    <ul className="space-y-1">
                      {porosity.tips.map((tip, index) => (
                        <li key={index} className="font-roboto text-xs text-gray-700 flex items-start gap-2">
                          <span className="text-coton-rose mt-0.5">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CotonCard>
      </div>

      {/* Porosity Tests */}
      <div className="space-y-4">
        <h3 className="font-poppins font-bold text-lg text-foreground flex items-center gap-2">
          <TestTube size={20} />
          Tests de Porosité
        </h3>
        
        {porosityTests.map((test, index) => (
          <CotonCard key={index} className="p-6 space-y-4">
            <h4 className="font-poppins font-semibold text-base text-foreground">
              {test.name}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-poppins font-medium text-sm text-gray-800 mb-3">
                  Étapes :
                </h5>
                <ol className="space-y-2">
                  {test.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="font-roboto text-sm text-gray-700 flex items-start gap-3">
                      <span className="bg-coton-rose text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h5 className="font-poppins font-medium text-sm text-gray-800 mb-3">
                  Résultats :
                </h5>
                <ul className="space-y-2">
                  {test.results.map((result, resultIndex) => (
                    <li key={resultIndex} className="font-roboto text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CotonCard>
        ))}
      </div>

      {/* Important Note */}
      <CotonCard className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
        <div className="text-center space-y-3">
          <div className="text-3xl">⚠️</div>
          <h3 className="font-poppins font-semibold text-base text-orange-800">
            Important à Retenir
          </h3>
          <div className="space-y-2 font-roboto text-sm text-orange-700">
            <p>• Tes cheveux peuvent avoir plusieurs caractéristiques (ex: 4A/4B)</p>
            <p>• La porosité peut varier sur différentes sections</p>
            <p>• Les traitements chimiques modifient la porosité</p>
            <p>• L'âge et les dommages influencent aussi ces caractéristiques</p>
          </div>
        </div>
      </CotonCard>

      {/* Call to Action */}
      <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/20 to-purple-100 text-center">
        <div className="space-y-4">
          <div className="text-4xl">🎯</div>
          <h3 className="font-poppins font-semibold text-lg text-foreground">
            Prêt(e) à définir ton profil ?
          </h3>
          <p className="font-roboto text-sm text-muted-foreground">
            Utilise ces informations pour créer ton profil capillaire personnalisé
          </p>
          <Button 
            variant="hero" 
            onClick={onBack}
            className="mt-4"
          >
            Retour au Profil
          </Button>
        </div>
      </CotonCard>

      <div className="pb-6"></div>
    </div>
  );
}