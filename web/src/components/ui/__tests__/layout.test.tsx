import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Layout, LayoutContent, LayoutHeader, LayoutSidebar } from '../layout';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

describe('Layout Components with RTL Support', () => {
  const renderWithI18n = (component: React.ReactNode) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    // Reset language to English (LTR) before each test
    i18n.changeLanguage('en');
  });

  describe('Layout', () => {
    it('should render with LTR direction by default', () => {
      renderWithI18n(<Layout>Content</Layout>);
      const layout = screen.getByText('Content').parentElement;
      expect(layout).toHaveClass('direction-ltr');
      expect(layout).not.toHaveClass('direction-rtl');
    });

    it('should apply custom className', () => {
      renderWithI18n(<Layout className="custom-class">Content</Layout>);
      const layout = screen.getByText('Content').parentElement;
      expect(layout).toHaveClass('custom-class');
    });

    it('should switch to RTL direction when language changes', async () => {
      renderWithI18n(<Layout>Content</Layout>);
      const layout = screen.getByText('Content').parentElement;
      
      // Change to an RTL language
      await i18n.changeLanguage('ar');
      
      expect(layout).toHaveClass('direction-rtl');
      expect(layout).not.toHaveClass('direction-ltr');
    });
  });

  describe('LayoutContent', () => {
    it('should render with LTR margin by default', () => {
      renderWithI18n(<LayoutContent>Content</LayoutContent>);
      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('ml-auto');
      expect(content).not.toHaveClass('mr-auto');
    });

    it('should apply custom className', () => {
      renderWithI18n(<LayoutContent className="custom-class">Content</LayoutContent>);
      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('custom-class');
    });

    it('should switch margins when language changes to RTL', async () => {
      renderWithI18n(<LayoutContent>Content</LayoutContent>);
      const content = screen.getByText('Content').parentElement;
      
      // Change to an RTL language
      await i18n.changeLanguage('ar');
      
      expect(content).toHaveClass('mr-auto');
      expect(content).not.toHaveClass('ml-auto');
    });
  });

  describe('LayoutHeader', () => {
    it('should render with default styles', () => {
      renderWithI18n(<LayoutHeader>Header</LayoutHeader>);
      const header = screen.getByText('Header').parentElement;
      expect(header).toHaveClass('flex', 'h-14', 'items-center', 'border-b');
    });

    it('should apply custom className', () => {
      renderWithI18n(<LayoutHeader className="custom-class">Header</LayoutHeader>);
      const header = screen.getByText('Header').parentElement;
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('LayoutSidebar', () => {
    it('should render with LTR border by default', () => {
      renderWithI18n(<LayoutSidebar>Sidebar</LayoutSidebar>);
      const sidebar = screen.getByText('Sidebar').parentElement;
      expect(sidebar).toHaveClass('border-r');
      expect(sidebar).not.toHaveClass('border-l');
    });

    it('should apply custom className', () => {
      renderWithI18n(<LayoutSidebar className="custom-class">Sidebar</LayoutSidebar>);
      const sidebar = screen.getByText('Sidebar').parentElement;
      expect(sidebar).toHaveClass('custom-class');
    });

    it('should switch borders when language changes to RTL', async () => {
      renderWithI18n(<LayoutSidebar>Sidebar</LayoutSidebar>);
      const sidebar = screen.getByText('Sidebar').parentElement;
      
      // Change to an RTL language
      await i18n.changeLanguage('ar');
      
      expect(sidebar).toHaveClass('border-l');
      expect(sidebar).not.toHaveClass('border-r');
    });
  });
});