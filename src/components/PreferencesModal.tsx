import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Globe,
  MessageCircle,
  Sparkles,
  Contrast,
  Type,
  X,
  Check,
} from 'lucide-react';
import { WELCOME_TRANSLATIONS } from '@/components/LanguageBubble';

interface AccessibilitySettings {
  reduce_animations: boolean;
  high_contrast: boolean;
  larger_text: boolean;
  show_concierge: boolean;
  skip_preferences_modal: boolean;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reduce_animations: false,
  high_contrast: false,
  larger_text: false,
  show_concierge: true,
  skip_preferences_modal: false,
};

// Simple Switch component
const Switch: React.FC<{
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onCheckedChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3B5998] focus:ring-offset-2
      ${checked ? 'bg-[#3B5998]' : 'bg-gray-200'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <span
      className={`
        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
        transition duration-200 ease-in-out
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language, setLanguage, isLoading: languageLoading } = useLanguage(user?.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Load settings
  useEffect(() => {
    if (!isOpen || !user) {
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        const { data, error } = await (supabase
          .from('profiles') as any)
          .select('accessibility_settings')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading settings:', error);
        }

        if (data?.accessibility_settings) {
          setSettings({
            ...DEFAULT_ACCESSIBILITY,
            ...data.accessibility_settings,
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isOpen, user]);

  // Update setting
  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save and close
  const handleConfirm = async () => {
    if (!user) {
      onConfirm?.();
      onClose();
      return;
    }

    setSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        skip_preferences_modal: dontShowAgain,
      };
      await (supabase
        .from('profiles') as any)
        .update({ accessibility_settings: updatedSettings })
        .eq('id', user.id);

      // Dispatch event to update concierge visibility immediately
      window.dispatchEvent(new CustomEvent('concierge-preference-change', {
        detail: { show_concierge: updatedSettings.show_concierge }
      }));

      onConfirm?.();
      onClose();
    } catch (err) {
      console.error('Failed to save settings:', err);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Handle language change
  const handleLanguageChange = async (code: string) => {
    await setLanguage(code);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#3B5998] to-[#4A6FB3] px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold">
                      {t('preferences.welcome', 'Welcome to Maslow')}
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                      {t('preferences.subtitle', 'Confirm your preferences')}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-[#3B5998]" />
                </div>
              ) : (
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                  {/* Language */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3B5998]/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-[#3B5998]" />
                      </div>
                      <div>
                        <Label className="text-[#3B5998] font-medium">
                          {t('settings.language', 'Language')}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {t('settings.languageDesc', 'Choose your language')}
                        </p>
                      </div>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      disabled={languageLoading}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[#3B5998] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B5998] cursor-pointer"
                    >
                      {WELCOME_TRANSLATIONS.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.language}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Show Concierge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3B5998]/10 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-[#3B5998]" />
                      </div>
                      <div>
                        <Label className="text-[#3B5998] font-medium">
                          {t('settings.showConcierge', 'AI Concierge')}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {t('settings.showConciergeDesc', 'Show AI assistant')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.show_concierge}
                      onCheckedChange={(v) => updateSetting('show_concierge', v)}
                      disabled={saving}
                    />
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Reduce Animations */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3B5998]/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#3B5998]" />
                      </div>
                      <div>
                        <Label className="text-[#3B5998] font-medium">
                          {t('settings.reduceAnimations', 'Reduce Animations')}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {t('settings.reduceAnimationsDesc', 'Minimize motion')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.reduce_animations}
                      onCheckedChange={(v) => updateSetting('reduce_animations', v)}
                      disabled={saving}
                    />
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3B5998]/10 flex items-center justify-center">
                        <Contrast className="w-5 h-5 text-[#3B5998]" />
                      </div>
                      <div>
                        <Label className="text-[#3B5998] font-medium">
                          {t('settings.highContrast', 'High Contrast')}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {t('settings.highContrastDesc', 'Increase visibility')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.high_contrast}
                      onCheckedChange={(v) => updateSetting('high_contrast', v)}
                      disabled={saving}
                    />
                  </div>

                  {/* Larger Text */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3B5998]/10 flex items-center justify-center">
                        <Type className="w-5 h-5 text-[#3B5998]" />
                      </div>
                      <div>
                        <Label className="text-[#3B5998] font-medium">
                          {t('settings.largerText', 'Larger Text')}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {t('settings.largerTextDesc', 'Increase font size')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.larger_text}
                      onCheckedChange={(v) => updateSetting('larger_text', v)}
                      disabled={saving}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-4">
                {/* Don't show again checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-[#3B5998] peer-checked:bg-[#3B5998] transition-colors flex items-center justify-center">
                      {dontShowAgain && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    {t('preferences.dontShowAgain', "Don't show this again on login")}
                  </span>
                </label>

                <Button
                  onClick={handleConfirm}
                  disabled={saving || loading}
                  className="w-full bg-[#3B5998] hover:bg-[#2d4a7c] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {t('preferences.confirm', 'Confirm Preferences')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PreferencesModal;
