
import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Search, Coffee, Wind, Sparkles } from 'lucide-react';
import { Profile } from '@/types/database.types';

interface ProfileWithPreferences extends Omit<Profile, 'preferences_amenities' | 'preferences_usage' | 'preferences_products'> {
  preferences_amenities: string[] | null;
  preferences_usage: string[] | null;
  preferences_products: string[] | null;
}

const ConciergeDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileWithPreferences[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all profiles (RLS MUST ALLOW THIS FOR ADMINS)
  useEffect(() => {
    const fetchProfiles = async (): Promise<void> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProfiles(data as ProfileWithPreferences[]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter(p =>
    (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.first_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  if (loading) return <div className="p-8 text-center">Loading Guest List...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#3B5998]">Concierge Command</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search guests..."
              className="pl-10 bg-white"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(profile => (
            <Card key={profile.id} className="overflow-hidden border-none shadow-md">
              <div className="bg-[#3B5998] p-4 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                   {profile.photo_url ? (
                     <img src={`https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/${profile.photo_url}`} className="w-full h-full object-cover" alt={`${profile.first_name || 'Guest'} avatar`} />
                   ) : (
                     <User className="text-white" />
                   )}
                 </div>
                 <div>
                   <h3 className="text-white font-bold text-lg">{profile.first_name} {profile.last_name}</h3>
                   <p className="text-white/60 text-xs">{profile.email}</p>
                 </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Notes */}
                {profile.bio && (
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm text-yellow-800 italic">
                    "{profile.bio}"
                  </div>
                )}

                {/* Preferences Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">

                  {/* Kits */}
                  {profile.preferences_usage && profile.preferences_usage.length > 0 && (
                     <div className="col-span-2">
                        <h4 className="font-bold text-[#3B5998] flex items-center gap-2 mb-2">
                           <Coffee className="w-4 h-4" /> Prep Kits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.preferences_usage.map((k: string) => (
                            <span key={k} className="bg-[#3B5998] text-white px-2 py-1 rounded text-xs uppercase tracking-wide">
                              {k}
                            </span>
                          ))}
                        </div>
                     </div>
                  )}

                  {/* Amenities */}
                  <div>
                    <h4 className="font-bold text-[#3B5998] flex items-center gap-2 mb-2">
                       <Sparkles className="w-4 h-4" /> Room
                    </h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {(profile.preferences_amenities || []).map((a: string) => <li key={a}>{a}</li>)}
                    </ul>
                  </div>

                  {/* Products */}
                  <div>
                    <h4 className="font-bold text-[#3B5998] flex items-center gap-2 mb-2">
                       <Wind className="w-4 h-4" /> Stock
                    </h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {(profile.preferences_products || []).map((p: string) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConciergeDashboard;
