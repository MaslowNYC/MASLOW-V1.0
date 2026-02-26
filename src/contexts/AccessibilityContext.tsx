import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

interface AccessibilitySettings {
  reduce_animations: boolean;
  high_contrast: boolean;
  larger_text: boolean;
  show_concierge: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  reduce_animations: false,
  high_contrast: false,
  larger_text: false,
  show_concierge: true,
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => Promise<void>;
  isLoading: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase
          .from('profiles') as any)
          .select('accessibility_settings')
          .eq('id', user.id)
          .single();

        if (!error && data?.accessibility_settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data.accessibility_settings,
          });
        }
      } catch (err) {
        console.error('Failed to load accessibility settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Reduce animations
    if (settings.reduce_animations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // High contrast
    if (settings.high_contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Larger text
    if (settings.larger_text) {
      root.classList.add('larger-text');
    } else {
      root.classList.remove('larger-text');
    }
  }, [settings]);

  const updateSetting = async (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (user) {
      try {
        await (supabase
          .from('profiles') as any)
          .update({ accessibility_settings: newSettings })
          .eq('id', user.id);

        // Dispatch event for concierge visibility
        if (key === 'show_concierge') {
          window.dispatchEvent(new CustomEvent('concierge-preference-change', {
            detail: { show_concierge: value }
          }));
        }
      } catch (err) {
        console.error('Failed to save setting:', err);
        // Revert on error
        setSettings(settings);
      }
    }
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, isLoading }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
