import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2,
  Globe,
  MessageCircle,
  Sparkles,
  Smartphone,
  Contrast,
  Type,
  Ear,
  HelpCircle,
  Mail,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { WELCOME_TRANSLATIONS } from '@/components/LanguageBubble';

interface AccessibilitySettings {
  reduce_animations: boolean;
  no_haptics: boolean;
  high_contrast: boolean;
  larger_text: boolean;
  screen_reader: boolean;
  show_concierge: boolean;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reduce_animations: false,
  no_haptics: false,
  high_contrast: false,
  larger_text: false,
  screen_reader: false,
  show_concierge: true,
};

// Simple Switch component (shadcn-style)
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

const ProfileSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language, setLanguage, isLoading: languageLoading } = useLanguage(user?.id);
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  // Load settings from profile
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

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
          setAccessibilitySettings({
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
  }, [user]);

  // Update a single accessibility setting
  const updateAccessibilitySetting = async (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...accessibilitySettings, [key]: value };
    setAccessibilitySettings(newSettings);

    if (user) {
      setSaving(true);
      try {
        const { error } = await (supabase
          .from('profiles') as any)
          .update({ accessibility_settings: newSettings })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: t('settings.saved'),
          description: t('settings.savedDesc'),
          className: 'bg-[#3B5998] text-white',
        });
      } catch (err) {
        console.error('Failed to save setting:', err);
        toast({
          title: t('settings.error'),
          description: t('settings.errorDesc'),
          variant: 'destructive',
        });
        // Revert on error
        setAccessibilitySettings(accessibilitySettings);
      } finally {
        setSaving(false);
      }
    }
  };

  // Handle language change
  const handleLanguageChange = async (code: string) => {
    await setLanguage(code);
    toast({
      title: t('settings.languageChanged'),
      description: t('settings.languageChangedDesc'),
      className: 'bg-[#3B5998] text-white',
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    if (window.confirm(t('settings.signOutConfirm'))) {
      await signOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <Loader2 className="animate-spin w-8 h-8 text-[#3B5998]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-16 pt-4 px-3 md:pb-24 md:pt-8 md:px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#3B5998] flex items-center justify-center gap-2">
            <Settings className="w-6 h-6 md:w-8 md:h-8" />
            {t('settings.title')}
          </h1>
          <p className="text-[#3B5998]/60 mt-2">{t('settings.subtitle')}</p>
        </div>

        {/* Preferences Section */}
        <Card className="border-[#3B5998]/10 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3B5998] text-sm uppercase tracking-wider">
              {t('settings.preferences')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language Selector */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.language')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.languageDesc')}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={languageLoading}
                className="bg-[#F5F1E8] border border-[#3B5998]/20 rounded-lg px-3 py-2 text-[#3B5998] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B5998] cursor-pointer"
              >
                {WELCOME_TRANSLATIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.language}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Concierge Toggle */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1">
                <MessageCircle className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.showConcierge')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.showConciergeDesc')}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings.show_concierge}
                onCheckedChange={(v) => updateAccessibilitySetting('show_concierge', v)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Section */}
        <Card className="border-[#3B5998]/10 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3B5998] text-sm uppercase tracking-wider">
              {t('settings.accessibility')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {/* Reduce Animations */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.reduceAnimations')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.reduceAnimationsDesc')}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings.reduce_animations}
                onCheckedChange={(v) => updateAccessibilitySetting('reduce_animations', v)}
                disabled={saving}
              />
            </div>

            {/* No Haptics */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-1">
                <Smartphone className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.noHaptics')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.noHapticsDesc')}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings.no_haptics}
                onCheckedChange={(v) => updateAccessibilitySetting('no_haptics', v)}
                disabled={saving}
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-1">
                <Contrast className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.highContrast')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.highContrastDesc')}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings.high_contrast}
                onCheckedChange={(v) => updateAccessibilitySetting('high_contrast', v)}
                disabled={saving}
              />
            </div>

            {/* Larger Text */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-1">
                <Type className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.largerText')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.largerTextDesc')}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings.larger_text}
                onCheckedChange={(v) => updateAccessibilitySetting('larger_text', v)}
                disabled={saving}
              />
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1">
                <Ear className="w-5 h-5 text-[#3B5998]/60" />
                <div>
                  <Label className="text-[#3B5998] font-medium">{t('settings.screenReader')}</Label>
                  <p className="text-xs text-[#3B5998]/50">{t('settings.screenReaderDesc')}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings.screen_reader}
                onCheckedChange={(v) => updateAccessibilitySetting('screen_reader', v)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="border-[#3B5998]/10 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3B5998] text-sm uppercase tracking-wider">
              {t('settings.support')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {/* Help Center */}
            <button
              className="flex items-center justify-between py-3 border-b border-gray-100 w-full text-left hover:bg-gray-50 transition-colors rounded"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#3B5998]/60" />
                <span className="text-[#3B5998] font-medium">Help Center</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#3B5998]/40" />
            </button>

            {/* Contact Support */}
            <button
              className="flex items-center justify-between py-3 border-b border-gray-100 w-full text-left hover:bg-gray-50 transition-colors rounded"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#3B5998]/60" />
                <span className="text-[#3B5998] font-medium">Contact Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#3B5998]/40" />
            </button>

            {/* Terms & Conditions */}
            <button
              className="flex items-center justify-between py-3 border-b border-gray-100 w-full text-left hover:bg-gray-50 transition-colors rounded"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#3B5998]/60" />
                <span className="text-[#3B5998] font-medium">Terms & Conditions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#3B5998]/40" />
            </button>

            {/* Privacy Policy */}
            <button
              className="flex items-center justify-between py-3 w-full text-left hover:bg-gray-50 transition-colors rounded"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#3B5998]/60" />
                <span className="text-[#3B5998] font-medium">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#3B5998]/40" />
            </button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="border-[#3B5998]/10 bg-white shadow-sm">
          <CardContent className="pt-4">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              {t('settings.signOut')}
            </Button>
          </CardContent>
        </Card>

        {/* Version */}
        <p className="text-center text-[#3B5998]/40 text-xs">
          Maslow v2.1.0
        </p>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
