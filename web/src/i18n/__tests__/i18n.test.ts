import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '../index';
import { getLanguageDirection, isRTL } from '../../utils/rtlUtil';
import { Language } from '../types';

describe('i18n configuration', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('should initialize with English as default language', () => {
    expect(i18n.language).toBe('en');
  });

  it('should change language successfully', () => {
    i18n.changeLanguage('pt-BR');
    expect(i18n.language).toBe('pt-BR');
  });

  it('should fallback to English when language is not supported', () => {
    i18n.changeLanguage('unsupported');
    expect(i18n.language).toBe('en');
  });

  it('should load translations for all namespaces', () => {
    const namespaces = ['common', 'settings', 'live', 'events', 'logs', 'status'];
    namespaces.forEach(ns => {
      expect(i18n.hasResourceBundle('en', ns)).toBe(true);
      expect(i18n.hasResourceBundle('pt-BR', ns)).toBe(true);
    });
  });

  it('should handle interpolation correctly', () => {
    expect(i18n.t('status.cpu', { percent: 50 })).toBe('CPU 50%');
    i18n.changeLanguage('pt-BR');
    expect(i18n.t('status.cpu', { percent: 50 })).toBe('CPU 50%');
  });

  it('should load English translations', () => {
    expect(i18n.t('common:actions.save')).toBe('Save');
    expect(i18n.t('common:status.loading')).toBe('Loading...');
    expect(i18n.t('common:time.units.second')).toBe('second');
    expect(i18n.t('common:errors.required_field')).toBe('This field is required');
  });

  it('should load Brazilian Portuguese translations', () => {
    i18n.changeLanguage('pt-BR');
    expect(i18n.t('common:actions.save')).toBe('Salvar');
    expect(i18n.t('common:status.loading')).toBe('Carregando...');
    expect(i18n.t('common:time.units.second')).toBe('segundo');
    expect(i18n.t('common:errors.required_field')).toBe('Este campo é obrigatório');
  });

  it('should handle interpolation correctly', () => {
    expect(i18n.t('common:status.cpu', { percent: 75 })).toBe('CPU 75%');
    expect(i18n.t('ui:layout.footer.version', { version: '1.0.0' })).toBe('Version 1.0.0');
  });

  it('should handle pluralization correctly', () => {
    expect(i18n.t('common:time.relative.seconds_ago', { count: 1 })).toBe('1 second ago');
    expect(i18n.t('common:time.relative.seconds_ago', { count: 5 })).toBe('5 seconds ago');
  });

  it('should use fallback language when translation is missing', () => {
    i18n.changeLanguage('pt-BR');
    const nonExistentKey = 'common:nonexistent.key';
    expect(i18n.t(nonExistentKey)).toBe(nonExistentKey);
  });

  it('should handle UI component translations', () => {
    expect(i18n.t('ui:layout.sidebar.toggle')).toBe('Toggle sidebar');
    expect(i18n.t('ui:dialog.confirm.title')).toBe('Confirm Action');
    expect(i18n.t('ui:button.states.loading')).toBe('Loading...');
  });

  it('should handle language direction changes', () => {
    i18n.changeLanguage('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');

    i18n.changeLanguage('pt-BR');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('pt-BR');
  });

  it('should provide correct language names', () => {
    const languages: Language[] = ['en', 'pt-BR'];
    expect(i18n.options.resources).toHaveProperty('en');
    expect(i18n.options.resources).toHaveProperty('pt-BR');
    expect(languages).toEqual(expect.arrayContaining(['en', 'pt-BR']));
  });
});

describe('RTL support', () => {
  it('should return correct text direction for languages', () => {
    expect(getLanguageDirection('en')).toBe('ltr');
    expect(getLanguageDirection('pt-BR')).toBe('ltr');
  });

  it('should correctly identify RTL languages', () => {
    expect(isRTL('en')).toBe(false);
    expect(isRTL('pt-BR')).toBe(false);
  });

  it('should default to LTR for unknown languages', () => {
    expect(getLanguageDirection('unknown')).toBe('ltr');
    expect(isRTL('unknown')).toBe(false);
  });
}); 