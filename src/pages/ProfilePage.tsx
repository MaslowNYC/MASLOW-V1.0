import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Upload, Settings, Check, X, ZoomIn, RotateCw, Image as ImageIcon } from 'lucide-react';
import { Profile } from '@/types/database.types';

interface UsageOption { id: string; label: string; icon: string; description: string; }
interface AmenityOption { id: string; label: string; }
interface ProductOption { id: string; label: string; }
interface ProfileFormState {
  first_name: string; last_name: string; bio: string; birthday_month: string; birthday_day: string; phone: string;
  photo_url?: string | null; member_number?: number | null; credits?: number | null;
  preferences_amenities: string[]; preferences_usage: string[]; preferences_products: string[];
}
type PreferenceCategory = 'preferences_amenities' | 'preferences_usage' | 'preferences_products';

const MONTHS = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
  { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const getDaysInMonth = (month: string): number => {
  if (!month) return 31;
  const m = parseInt(month, 10);
  if ([4, 6, 9, 11].includes(m)) return 30;
  if (m === 2) return 29; // Allow Feb 29 for leap year babies
  return 31;
};

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const formatBirthdayDisplay = (month: string, day: string): string => {
  if (!month || !day) return '';
  const monthObj = MONTHS.find(m => m.value === month);
  const dayNum = parseInt(day, 10);
  if (!monthObj || isNaN(dayNum)) return '';
  return `${monthObj.label} ${dayNum}${getOrdinalSuffix(dayNum)}`;
};

const parseDob = (dob: string | null): { month: string; day: string } => {
  if (!dob) return { month: '', day: '' };
  // Handle both YYYY-MM-DD (legacy) and MM-DD formats
  const parts = dob.split('-');
  if (parts.length === 3) {
    // YYYY-MM-DD format - strip year
    return { month: parts[1], day: parts[2] };
  } else if (parts.length === 2) {
    // MM-DD format
    return { month: parts[0], day: parts[1] };
  }
  return { month: '', day: '' };
};

const formatDobForStorage = (month: string, day: string): string => {
  if (!month || !day) return '';
  return `${month}-${day.padStart(2, '0')}`;
};

const usageOptions: UsageOption[] = [
  { id: 'prayer', label: 'Prayer & Meditation', icon: '🙏', description: 'Prayer rug, qibla compass, ablution station, meditation cushion' },
  { id: 'pumping', label: 'Nursing & Pumping', icon: '🍼', description: 'Breast pump accessories, nursing pillow, privacy screen, cleaning supplies' },
  { id: 'interview', label: 'Interview Prep', icon: '👔', description: 'Full-length mirror, iron & steamer, lint roller, emergency sewing kit' },
  { id: 'decompress', label: 'Sensory Decompression', icon: '🧠', description: 'Noise-canceling headphones, weighted blanket, dim lighting, white noise' },
  { id: 'change', label: 'Outfit Change', icon: '👕', description: 'Garment steamer, full-length mirror, privacy curtain, clothing hooks' },
];
const amenityOptions: AmenityOption[] = [
  { id: 'heated_seat', label: 'Heated Seat' },
  { id: 'dim_lights', label: 'Dimmed Lighting' },
  { id: 'white_noise', label: 'White Noise' },
  { id: 'hair_dryer', label: 'Hair Dryer' },
  { id: 'steamer', label: 'Garment Steamer' },
];
const productOptions: ProductOption[] = [
  { id: 'ursa_major', label: 'Ursa Major Face Wash' },
  { id: 'spf', label: 'SPF Lotion' },
  { id: 'mouthwash', label: 'Mouthwash' },
  { id: 'feminine_care', label: 'Organic Feminine Care' },
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileFormState>({
    first_name: '', last_name: '', bio: '', birthday_month: '', birthday_day: '', phone: '',
    preferences_amenities: [], preferences_usage: [], preferences_products: []
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user) return;
        const { data, error } = await (supabase.from('profiles') as any).select('*').eq('id', user.id).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          const p = data as Profile;
          const { month, day } = parseDob(p.dob);
          setProfile({
            first_name: p.first_name || '', last_name: p.last_name || '',
            bio: p.bio || '', birthday_month: month, birthday_day: day, phone: p.phone || '',
            photo_url: p.photo_url || null, member_number: p.member_number || null,
            credits: p.credits || 0,
            preferences_amenities: (p.preferences_amenities as unknown as string[]) || [],
            preferences_usage: (p.preferences_usage as unknown as string[]) || [],
            preferences_products: (p.preferences_products as unknown as string[]) || [],
          });
          if (p.photo_url) downloadImage(p.photo_url);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    getProfile();
  }, [user]);

  const downloadImage = async (path: string) => {
    try {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    } catch (e) { setAvatarUrl(null); }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setSaving(true);
      if (!event.target.files?.length || !user) return;
      const file = event.target.files[0];
      const filePath = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      if (profile.photo_url) {
        try { await supabase.storage.from('avatars').remove([profile.photo_url]); } catch {}
      }
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { data: existing } = await (supabase.from('profiles') as any).select('*').eq('id', user.id).maybeSingle();
      const now = new Date().toISOString();
      if (!existing) {
        await (supabase.from('profiles') as any).insert({ id: user.id, email: user.email, photo_url: filePath, created_at: now, updated_at: now });
      } else {
        await (supabase.from('profiles') as any).update({ photo_url: filePath, updated_at: now }).eq('id', user.id);
      }
      setProfile(prev => ({ ...prev, photo_url: filePath }));
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
      toast({ title: "Photo updated.", className: "bg-[#2A2724] text-[#FAF4ED] border-[#C49F58]/20" });
    } catch (e) {
      toast({ title: "Upload failed.", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleSave = async (section?: string) => {
    try {
      setSaving(true);
      if (!user) return;
      const dob = formatDobForStorage(profile.birthday_month, profile.birthday_day);
      const { birthday_month, birthday_day, ...rest } = profile;
      const updates = { ...rest, dob: dob || null, updated_at: new Date().toISOString() };
      const { error } = await (supabase.from('profiles') as any).upsert({ id: user.id, email: user.email, ...updates });
      if (error) throw error;
      setSavedSection(section || 'all');
      setTimeout(() => setSavedSection(null), 2000);
    } catch (e) {
      toast({ title: "Error saving.", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const togglePreference = (category: PreferenceCategory, itemId: string) => {
    setProfile(prev => {
      const list = prev[category] || [];
      return { ...prev, [category]: list.includes(itemId) ? list.filter(id => id !== itemId) : [...list, itemId] };
    });
  };

  const memberSince = new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF4ED]">
      <Loader2 className="animate-spin w-6 h-6 text-[#2A2724]/40" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F1E9]" style={{ fontFamily: "'Jost', sans-serif" }}>

      {/* ── HERO BAND ── */}
      <div className="bg-[#2A2724] px-6 py-10 md:px-12 md:py-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8">

          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[#C49F58]/50 cursor-pointer transition-all hover:border-[#C49F58]"
              onClick={() => avatarUrl && setIsZoomed(true)}
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-[#3C3430]"><User className="w-12 h-12 text-[#FAF4ED]/20" /></div>
              }
            </div>
            {avatarUrl && (
              <div className="absolute top-1 left-1 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsZoomed(true)}>
                <ZoomIn className="w-3 h-3" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-[#C49F58] text-[#2A2724] p-2 rounded-full cursor-pointer hover:bg-[#d4ad6a] transition-colors shadow-lg" htmlFor="avatar-upload">
              <Upload className="w-3.5 h-3.5" />
            </label>
            <input type="file" id="avatar-upload" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={saving} />
          </div>

          {/* Name + Member ID */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#C49F58]/70 uppercase tracking-[0.2em] text-xs mb-1" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Member Profile</p>
            <h1 className="text-3xl md:text-5xl text-[#FAF4ED] leading-none mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
              {profile.first_name || 'Welcome'}{profile.last_name ? `, ${profile.last_name}` : ''}.
            </h1>
            <p className="text-[#FAF4ED]/30 text-sm tracking-wide">Member since {memberSince}</p>
          </div>

          {/* Credits + Member # */}
          <div className="flex gap-4 md:gap-6 flex-shrink-0">
            <div className="text-center md:text-right">
              <p className="text-[#C49F58]/60 uppercase tracking-[0.15em] text-xs mb-1">Credits</p>
              <p className="text-[#FAF4ED] text-3xl md:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.credits || 0}</p>
              <p className="text-[#FAF4ED]/30 text-xs mt-0.5">{((profile.credits || 0) * 10)} min</p>
            </div>
            <div className="w-px bg-[#FAF4ED]/10 hidden md:block" />
            <div className="text-center md:text-right">
              <p className="text-[#C49F58]/60 uppercase tracking-[0.15em] text-xs mb-1">No.</p>
              <p className="text-[#FAF4ED] text-3xl md:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>#{(profile.member_number || 0).toLocaleString()}</p>
              <a href="/buy-credits" className="text-[#C49F58]/70 hover:text-[#C49F58] text-xs mt-0.5 block transition-colors">+ Add credits</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-12 md:py-12">

        {/* ── ROW 1: Identity + The Usual side by side ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Identity */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#2A2724]/5">
            <SectionHeader label="Identity" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FieldGroup label="First Name">
                <StyledInput value={profile.first_name} onChange={v => setProfile({ ...profile, first_name: v })} placeholder="First" />
              </FieldGroup>
              <FieldGroup label="Last Name">
                <StyledInput value={profile.last_name} onChange={v => setProfile({ ...profile, last_name: v })} placeholder="Last" />
              </FieldGroup>
            </div>
            <FieldGroup label="Birthday">
              <div className="flex gap-3">
                <select
                  value={profile.birthday_month}
                  onChange={e => {
                    const newMonth = e.target.value;
                    const maxDay = getDaysInMonth(newMonth);
                    const currentDay = parseInt(profile.birthday_day, 10);
                    setProfile({
                      ...profile,
                      birthday_month: newMonth,
                      birthday_day: currentDay > maxDay ? String(maxDay).padStart(2, '0') : profile.birthday_day
                    });
                  }}
                  className="flex-1 text-sm text-[#1C2B3A] bg-[#F0EFED] border-0 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#C49F58]/30 appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231C2B3A' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  <option value="">Month</option>
                  {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select
                  value={profile.birthday_day}
                  onChange={e => setProfile({ ...profile, birthday_day: e.target.value })}
                  className="w-24 text-sm text-[#1C2B3A] bg-[#F0EFED] border-0 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#C49F58]/30 appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231C2B3A' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                >
                  <option value="">Day</option>
                  {Array.from({ length: getDaysInMonth(profile.birthday_month) }, (_, i) => {
                    const day = String(i + 1).padStart(2, '0');
                    return <option key={day} value={day}>{i + 1}</option>;
                  })}
                </select>
              </div>
              {profile.birthday_month && profile.birthday_day && (
                <p className="text-xs text-[#C49F58] mt-2 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatBirthdayDisplay(profile.birthday_month, profile.birthday_day)}
                </p>
              )}
            </FieldGroup>
            <div className="mt-4">
              <FieldGroup label="Notes for Staff">
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="e.g. 'I prefer a quiet greeting'"
                  rows={3}
                  className="w-full text-sm text-[#2A2724] bg-[#F7F1E9] border-0 rounded-lg px-3 py-2.5 resize-none outline-none focus:ring-1 focus:ring-[#C49F58]/30 placeholder-[#2A2724]/25"
                />
              </FieldGroup>
            </div>
            <SaveRow sectionKey="identity" onSave={() => handleSave('identity')} saving={saving} saved={savedSection === 'identity'} />
          </section>

          {/* The Usual */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#2A2724]/5">
            <SectionHeader label="The Usual" sublabel="How should we prep the room?" />
            <div className="space-y-1 mt-1">
              {amenityOptions.map(item => (
                <ToggleRow
                  key={item.id}
                  label={item.label}
                  checked={(profile.preferences_amenities || []).includes(item.id)}
                  onChange={() => togglePreference('preferences_amenities', item.id)}
                />
              ))}
            </div>
            <SaveRow sectionKey="usual" onSave={() => handleSave('usual')} saving={saving} saved={savedSection === 'usual'} />
          </section>
        </div>

        {/* ── ROW 2: Usage Kits full width ── */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-[#2A2724]/5 mb-6">
          <SectionHeader label="Usage Kits" sublabel="Select kits to have ready on arrival" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-3">
            {usageOptions.map(item => {
              const checked = (profile.preferences_usage || []).includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => togglePreference('preferences_usage', item.id)}
                  className={`group relative text-left rounded-xl p-4 border transition-all ${
                    checked
                      ? 'bg-[#2A2724] border-[#2A2724] text-[#FAF4ED]'
                      : 'bg-[#F7F1E9] border-[#2A2724]/8 text-[#2A2724] hover:border-[#2A2724]/20'
                  }`}
                >
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <span className="text-xs font-medium tracking-wide leading-tight block">{item.label}</span>
                  {checked && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-[#C49F58] rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#2A2724]" strokeWidth={3} />
                    </span>
                  )}
                  <p className={`text-xs mt-1.5 leading-tight ${checked ? 'text-[#FAF4ED]/50' : 'text-[#2A2724]/35'}`}>{item.description}</p>
                </button>
              );
            })}
          </div>
          <SaveRow sectionKey="kits" onSave={() => handleSave('kits')} saving={saving} saved={savedSection === 'kits'} />
        </section>

        {/* ── ROW 3: Toiletries + nav ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#2A2724]/5">
            <SectionHeader label="Ethical Toiletries" sublabel="What should we stock for you?" />
            <div className="space-y-1 mt-1">
              {productOptions.map(item => (
                <ToggleRow
                  key={item.id}
                  label={item.label}
                  checked={(profile.preferences_products || []).includes(item.id)}
                  onChange={() => togglePreference('preferences_products', item.id)}
                />
              ))}
            </div>
            <SaveRow sectionKey="toiletries" onSave={() => handleSave('toiletries')} saving={saving} saved={savedSection === 'toiletries'} />
          </section>

          {/* Settings card */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/profile/settings')}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#2A2724]/5 hover:border-[#2A2724]/15 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F0EFED] rounded-full flex items-center justify-center group-hover:bg-[#1C2B3A]/8 transition-colors">
                  <Settings className="w-4.5 h-4.5 text-[#1C2B3A]/50" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C2B3A]">Account Settings</p>
                  <p className="text-xs text-[#1C2B3A]/40">Security, notifications & more</p>
                </div>
              </div>
            </button>
            <div className="bg-[#1C2B3A] rounded-xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[#C49F58]/70 uppercase tracking-[0.2em] text-xs mb-3">Your Sanctuary</p>
                <p className="text-[#F8F7F4] text-lg leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Every preference you set is a note passed to the room before you arrive.
                </p>
              </div>
              <p className="text-[#F8F7F4]/30 text-xs mt-4">Changes save instantly per section.</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── ZOOMED AVATAR ── */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setIsZoomed(false)}>
            <X className="w-6 h-6" />
          </button>
          <img src={avatarUrl || ''} alt="Avatar" className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
          <label htmlFor="avatar-upload-modal" className="mt-6 cursor-pointer bg-[#C49F58] hover:bg-[#d4ad6a] text-[#2A2724] px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors" onClick={e => e.stopPropagation()}>
            <RotateCw className="w-4 h-4" /> Replace Photo
          </label>
          <input type="file" id="avatar-upload-modal" accept="image/*" onChange={e => { uploadAvatar(e); setIsZoomed(false); }} className="hidden" disabled={saving} />
        </div>
      )}
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ label: string; sublabel?: string }> = ({ label, sublabel }) => (
  <div className="mb-4">
    <h2 className="text-base font-medium text-[#1C2B3A] tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>{label}</h2>
    {sublabel && <p className="text-xs text-[#1C2B3A]/40 mt-0.5">{sublabel}</p>}
  </div>
);

const FieldGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs text-[#1C2B3A]/40 uppercase tracking-[0.12em] mb-1.5">{label}</label>
    {children}
  </div>
);

const StyledInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full text-sm text-[#1C2B3A] bg-[#F0EFED] border-0 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#C49F58]/30 placeholder-[#1C2B3A]/20"
  />
);

const ToggleRow: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left ${
      checked ? 'bg-[#1C2B3A] text-[#F8F7F4]' : 'bg-[#F0EFED] text-[#1C2B3A] hover:bg-[#E5E4E1]'
    }`}
  >
    <span className="text-sm">{label}</span>
    {checked && <Check className="w-3.5 h-3.5 text-[#C49F58]" strokeWidth={2.5} />}
  </button>
);

const SaveRow: React.FC<{ sectionKey: string; onSave: () => void; saving: boolean; saved: boolean }> = ({ onSave, saving, saved }) => (
  <div className="mt-5 flex justify-end">
    <button
      onClick={onSave}
      disabled={saving}
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
        saved
          ? 'bg-[#4A5C3A]/10 text-[#4A5C3A]'
          : 'bg-[#1C2B3A] text-[#F8F7F4] hover:bg-[#243347]'
      }`}
    >
      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : null}
      {saved ? 'Saved' : 'Save'}
    </button>
  </div>
);

export default ProfilePage;
