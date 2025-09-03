import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface LanguageSelectionScreenProps {
  onBack: () => void;
}

export function LanguageSelectionScreen({ onBack }: LanguageSelectionScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast({
      title: t('toast.languageChanged'),
      description: t('toast.languageChangedDesc'),
    });
    onBack();
  };

  const languages = [
    { code: 'fr' as Language, name: t('language.french'), flag: '🇫🇷' },
    { code: 'en' as Language, name: t('language.english'), flag: '🇺🇸' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-coton-black px-4 py-3 shadow-soft">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>{t('common.back')}</span>
          </Button>
          <h1 className="font-poppins font-semibold text-lg text-white">
            {t('language.title')}
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Language Selection */}
        <Card>
          <CardHeader className="text-center">
            <Globe size={48} className="mx-auto text-coton-rose mb-4" />
            <CardTitle className="font-poppins">{t('language.select')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                className="w-full h-16 flex items-center justify-between text-left"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-lg">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <Check size={20} className="text-white" />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}