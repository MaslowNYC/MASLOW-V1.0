
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Save, Upload, Sparkles, Wind, Coffee, X, ZoomIn } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // --- FORM STATE ---
  const [profile, setProfile] = useState({
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
  const usageOptions = [
    { id: 'prayer', label: 'Prayer / Meditation', icon: '🙏' },
    { id: 'pumping', label: 'Nursing / Pumping', icon: '🍼' },
    { id: 'interview', label: 'Interview Prep', icon: '👔' },
    { id: 'decompress', label: 'Sensory Decompression', icon: '🧠' },
    { id: 'change', label: 'Outfit Change', icon: '👕' },
  ];

  const amenityOptions = [
    { id: 'heated_seat', label: 'Heated Seat' },
    { id: 'dim_lights', label: 'Dimmed Lighting' },
    { id: 'white_noise', label: 'White Noise / Music' },
    { id: 'hair_dryer', label: 'Hair Dryer Access' },
    { id: 'steamer', label: 'Garment Steamer' },
  ];

  const productOptions = [
    { id: 'ursa_major', label: 'Ursa Major Face Wash' },
    { id: 'spf', label: 'SPF Lotion' },
    { id: 'mouthwash', label: 'Mouthwash' },
    { id: 'feminine_care', label: 'Organic Feminine Care' },
  ];

  // --- FETCH DATA ---
  useEffect(() => {
    const getProfile = async () => {
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
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            bio: data.bio || '',
            dob: data.dob || '',
            phone: data.phone || '',
            preferences_amenities: data.preferences_amenities || [],
            preferences_usage: data.preferences_usage || [],
            preferences_products: data.preferences_products || [],
          });
          if (data.photo_url) downloadImage(data.photo_url);
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
  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setSaving(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete old avatar if it exists
      if (profile.photo_url) {
        await supabase.storage.from('avatars').remove([profile.photo_url]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Ensure profile row exists first, then update photo_url
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            photo_url: filePath,
            created_at: new Date(),
            updated_at: new Date()
          });
        if (insertError) throw insertError;
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            photo_url: filePath,
            updated_at: new Date()
          })
          .eq('id', user.id);
        if (updateError) throw updateError;
      }

      // Update local state
      setProfile(prev => ({ ...prev, photo_url: filePath }));
      await downloadImage(filePath);
      toast({ title: "Photo Updated", className: "bg-[#3B5998] text-white" });

    } catch (error) {
      console.error(error);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

 // --- SAVE PROFILE (Fixed for Date Error) ---
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 1. Sanitize the data before sending
      // PostgreSQL hates empty strings "" for Dates. It wants NULL.
      const updates = {
        ...profile,
        dob: profile.dob === '' ? null : profile.dob, // <--- THE FIX
        updated_at: new Date(),
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
      toast({ title: "Error Saving", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (category, itemId) => {
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
          </div>
        </div>

        {/* Zoomed Avatar Modal */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-[#3B5998] rounded-full p-2 hover:bg-[#2A406E] transition-colors"
              onClick={() => setIsZoomed(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={avatarUrl}
              alt="Avatar Zoomed"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
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
                <div key={item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    id={item.id} 
                    checked={(profile.preferences_usage || []).includes(item.id)}
                    onCheckedChange={() => togglePreference('preferences_usage', item.id)}
                    className="border-[#C5A059] data-[state=checked]:bg-[#C5A059]"
                  />
                  <Label htmlFor={item.id} className="cursor-pointer flex-grow text-[#3B5998] font-medium flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span> {item.label}
                  </Label>
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