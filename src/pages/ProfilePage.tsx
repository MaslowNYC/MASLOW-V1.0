
import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Save, Upload, Sparkles, Wind, Coffee, X, ZoomIn, RotateCw, Image as ImageIcon } from 'lucide-react';
import { Profile } from '@/types/database.types';

interface UsageOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface AmenityOption {
  id: string;
  label: string;
}

interface ProductOption {
  id: string;
  label: string;
}

interface ProfileFormState {
  first_name: string;
  last_name: string;
  bio: string;
  dob: string;
  phone: string;
  photo_url?: string | null;
  member_number?: number | null;
  preferences_amenities: string[];
  preferences_usage: string[];
  preferences_products: string[];
}

type PreferenceCategory = 'preferences_amenities' | 'preferences_usage' | 'preferences_products';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [expandedKit, setExpandedKit] = useState<string | null>(null);

  // --- FORM STATE ---
  const [profile, setProfile] = useState<ProfileFormState>({
    first_name: '',
    last_name: '',
    bio: '',
    dob: '',
    phone: '',
    preferences_amenities: [],
    preferences_usage: [],
    preferences_products: []
  });

  // --- DATA OPTIONS ---
  const usageOptions: UsageOption[] = [
    {
      id: 'prayer',
      label: 'Prayer / Meditation',
      icon: '🙏',
      description: 'Prayer rug, qibla compass, ablution station, meditation cushion',
    },
    {
      id: 'pumping',
      label: 'Nursing / Pumping',
      icon: '🍼',
      description: 'Breast pump accessories, nursing pillow, privacy screen, cleaning supplies',
    },
    {
      id: 'interview',
      label: 'Interview Prep',
      icon: '👔',
      description: 'Full-length mirror, iron & steamer, lint roller, emergency sewing kit',
    },
    {
      id: 'decompress',
      label: 'Sensory Decompression',
      icon: '🧠',
      description: 'Noise-canceling headphones, weighted blanket, dim lighting, white noise options',
    },
    {
      id: 'change',
      label: 'Outfit Change',
      icon: '👕',
      description: 'Garment steamer, full-length mirror, privacy curtain, clothing hooks',
    },
  ];

  const amenityOptions: AmenityOption[] = [
    { id: 'heated_seat', label: 'Heated Seat' },
    { id: 'dim_lights', label: 'Dimmed Lighting' },
    { id: 'white_noise', label: 'White Noise / Music' },
    { id: 'hair_dryer', label: 'Hair Dryer Access' },
    { id: 'steamer', label: 'Garment Steamer' },
  ];

  const productOptions: ProductOption[] = [
    { id: 'ursa_major', label: 'Ursa Major Face Wash' },
    { id: 'spf', label: 'SPF Lotion' },
    { id: 'mouthwash', label: 'Mouthwash' },
    { id: 'feminine_care', label: 'Organic Feminine Care' },
  ];

  // --- FETCH DATA ---
  useEffect(() => {
    const getProfile = async (): Promise<void> => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // If no row exists, we just stick with default state
        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const profileData = data as Profile;
          setProfile({
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            bio: profileData.bio || '',
            dob: profileData.dob || '',
            phone: profileData.phone || '',
            photo_url: profileData.photo_url || null,
            member_number: profileData.member_number || null,
            preferences_amenities: (profileData.preferences_amenities as string[]) || [],
            preferences_usage: (profileData.preferences_usage as string[]) || [],
            preferences_products: (profileData.preferences_products as string[]) || [],
          });
          if (profileData.photo_url) downloadImage(profileData.photo_url);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user]);

  // --- AVATAR HANDLING ---
  const downloadImage = async (path: string): Promise<void> => {
    try {
      // Get the public URL directly (no download needed)
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      // Add cache buster to force reload
      const urlWithCache = `${data.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(urlWithCache);
    } catch (error) {
      console.error('Error downloading image:', error);
      setAvatarUrl(null);
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      setSaving(true);
      if (!event.target.files || event.target.files.length === 0) {
        setSaving(false);
        return;
      }

      if (!user) {
        setSaving(false);
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${user.id}-${timestamp}.${fileExt}`;
      const filePath = fileName;

      // Delete old avatar if it exists
      if (profile.photo_url) {
        try {
          await supabase.storage.from('avatars').remove([profile.photo_url]);
        } catch (deleteError) {
          console.warn('Could not delete old avatar:', deleteError);
        }
      }

      // Upload new avatar (upsert: false to ensure new file)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Ensure profile row exists first
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const now = new Date().toISOString();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            photo_url: filePath,
            created_at: now,
            updated_at: now
          });
        if (insertError) throw insertError;
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            photo_url: filePath,
            updated_at: now
          })
          .eq('id', user.id);
        if (updateError) throw updateError;
      }

    // Update local state
    setProfile(prev => ({ ...prev, photo_url: filePath }));

      // Force immediate display with cache buster
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
    setAvatarUrl(freshUrl);

      toast({
        title: "Photo Updated",
        description: "Your profile picture has been saved.",
        className: "bg-[#3B5998] text-white"
      });

    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: (error as Error).message || "Could not upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

 // --- SAVE PROFILE (Fixed for Date Error) ---
  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);

      if (!user) return;

      // 1. Sanitize the data before sending
      // PostgreSQL hates empty strings "" for Dates. It wants NULL.
      const updates = {
        ...profile,
        dob: profile.dob === '' ? null : profile.dob, // <--- THE FIX
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...updates
        });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your digital concierge is updated.",
        className: "bg-[#3B5998] text-white border-[#C5A059]"
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error Saving", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (category: PreferenceCategory, itemId: string): void => {
    setProfile(prev => {
      const currentList = prev[category] || [];
      const newList = currentList.includes(itemId)
        ? currentList.filter(id => id !== itemId)
        : [...currentList, itemId];
      return { ...prev, [category]: newList };
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]"><Loader2 className="animate-spin w-8 h-8 text-[#3B5998]" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-24 pt-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#C5A059] shadow-lg bg-white cursor-pointer hover:border-[#b08d4b] transition-all"
              onClick={() => avatarUrl && setIsZoomed(true)}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#3B5998] text-white">
                  <User className="w-16 h-16" />
                </div>
              )}
            </div>
            {avatarUrl && (
              <div className="absolute top-0 left-0 bg-[#3B5998]/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsZoomed(true)}>
                <ZoomIn className="w-4 h-4" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-[#C5A059] text-white p-2 rounded-full cursor-pointer hover:bg-[#b08d4b] transition-colors shadow-md" htmlFor="avatar-upload">
              <Upload className="w-4 h-4" />
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={uploadAvatar}
              className="hidden"
              disabled={saving}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-[#3B5998]">Welcome Home, {profile.first_name || 'Member'}.</h1>
            <p className="text-[#3B5998]/60 mt-2 font-light text-lg">Manage your digital concierge preferences.</p>

            {/* Member Badge */}
            <div className="mt-4 inline-flex items-center gap-3 bg-gradient-to-r from-[#3B5998] to-[#2a4070] text-white px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] font-bold text-sm uppercase tracking-wider">Member</span>
                <span className="text-white font-mono text-lg font-bold">
                #{String(profile?.member_number || 0).padStart(4, '0')}
                </span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="text-sm font-light">
                Since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Zoomed Avatar Modal */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Profile Picture Preview</h3>
                  <p className="text-sm text-white/70">Make sure your face is centered and visible</p>
                </div>
                <button
                  className="text-white bg-[#3B5998] rounded-full p-2 hover:bg-[#2A406E] transition-colors"
                  onClick={() => setIsZoomed(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Image */}
            <img
              src={avatarUrl || ''}
              alt="Avatar Zoomed"
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                <label
                  htmlFor="avatar-upload-modal"
                  className="cursor-pointer bg-[#C5A059] hover:bg-[#b08d4b] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RotateCw className="w-5 h-5" />
                  Upload New Photo
                </label>
                <input
                  type="file"
                  id="avatar-upload-modal"
                  accept="image/*"
                  onChange={(e) => {
                    uploadAvatar(e);
                    setIsZoomed(false);
                  }}
                  className="hidden"
                  disabled={saving}
                />
                <div className="text-white/70 text-sm text-center">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Tip: Use a well-lit photo with your face clearly visible
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 1. IDENTITY CARD */}
          <Card className="border-[#3B5998]/10 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3B5998] flex items-center gap-2">
                <User className="w-5 h-5" /> Identity
              </CardTitle>
              <CardDescription>Tell us a bit about yourself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={profile.dob} onChange={e => setProfile({...profile, dob: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Bio / Notes for Staff</Label>
                <Textarea
                  placeholder="e.g. 'I prefer a quiet greeting' or 'I love matcha'"
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. THE USUAL (Amenities) */}
          <Card className="border-[#3B5998]/10 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3B5998] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" /> The Usual
              </CardTitle>
              <CardDescription>How should we prep the room for you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {amenityOptions.map(item => (
                <div key={item.id} className="flex items-center space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <Checkbox
                    id={item.id}
                    checked={(profile.preferences_amenities || []).includes(item.id)}
                    onCheckedChange={() => togglePreference('preferences_amenities', item.id)}
                    className="border-[#3B5998] data-[state=checked]:bg-[#3B5998]"
                  />
                  <Label htmlFor={item.id} className="cursor-pointer flex-grow text-[#3B5998] font-medium">{item.label}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 3. KITS & USAGE */}
          <Card className="border-[#3B5998]/10 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3B5998] flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#C5A059]" /> Usage Kits
              </CardTitle>
              <CardDescription>Select kits to have ready on arrival.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {usageOptions.map(item => (
                <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={item.id}
                      checked={(profile.preferences_usage || []).includes(item.id)}
                      onCheckedChange={() => togglePreference('preferences_usage', item.id)}
                      className="border-[#C5A059] data-[state=checked]:bg-[#C5A059]"
                    />
                    <Label
                      htmlFor={item.id}
                      className="cursor-pointer flex-grow text-[#3B5998] font-medium flex items-center gap-2"
                    >
                      <span className="text-xl">{item.icon}</span> {item.label}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedKit(expandedKit === item.id ? null : item.id)}
                      className="text-[#3B5998]/60 hover:text-[#3B5998]"
                    >
                      {expandedKit === item.id ? '−' : '+'}
                    </Button>
                  </div>
                  {expandedKit === item.id && item.description && (
                    <div className="mt-2 ml-9 text-sm text-[#3B5998]/70 bg-[#F5F1E8] p-3 rounded">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 4. PRODUCTS */}
          <Card className="border-[#3B5998]/10 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3B5998] flex items-center gap-2">
                <Wind className="w-5 h-5 text-[#C5A059]" /> Ethical Toiletries
              </CardTitle>
              <CardDescription>Select products to stock in your suite.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {productOptions.map(item => (
                <div key={item.id} className="flex items-center space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <Checkbox
                    id={item.id}
                    checked={(profile.preferences_products || []).includes(item.id)}
                    onCheckedChange={() => togglePreference('preferences_products', item.id)}
                    className="border-[#3B5998] data-[state=checked]:bg-[#3B5998]"
                  />
                  <Label htmlFor={item.id} className="cursor-pointer flex-grow text-[#3B5998] font-medium">{item.label}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-50 flex justify-center">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold py-6 px-12 rounded-full shadow-2xl text-lg transition-all transform hover:scale-105"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            Save Concierge Profile
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
