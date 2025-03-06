import { LanguageConfig, TextDirection } from '../i18n/types';

const languageConfigs: Record<string, LanguageConfig> = {
  'en': {
    code: 'en',
    name: 'English',
    direction: 'ltr'
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Português (Brasil)',
    direction: 'ltr'
  }
};

export const getLanguageDirection = (languageCode: string): TextDirection => {
  return languageConfigs[languageCode]?.direction || 'ltr';
};

export const isRTL = (languageCode: string): boolean => {
  return getLanguageDirection(languageCode) === 'rtl';
};

export const getLanguageConfig = (languageCode: string): LanguageConfig | undefined => {
  return languageConfigs[languageCode];
};

export const getAllLanguageConfigs = (): LanguageConfig[] => {
  return Object.values(languageConfigs);
}; 