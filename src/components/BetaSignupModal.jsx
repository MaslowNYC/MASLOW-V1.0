
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const BetaSignupModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      // 1. Check if email already exists
      const { data: existing, error: checkError } = await supabase
        .from('beta_signups')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Stop right here. Do not insert.
        setSuccess(true); // Fake success to the user so they don't keep trying, or tell them.
        // Let's be honest but gentle:
        // Actually, for UX, let's just show success but NOT insert. 
        // This prevents error messages but stops the DB clutter.
      } else {
        // 2. Insert if new
        const { error: insertError } = await supabase
          .from('beta_signups')
          .insert([{ email }]);

        if (insertError) throw insertError;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 2000);

    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#F5F1E8] border-[#3B5998]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#3B5998] font-serif text-2xl text-center">
            {success ? 'Welcome to the Line' : 'Secure Your Spot'}
          </DialogTitle>
          <DialogDescription className="text-[#3B5998]/60 text-center">
            {success 
              ? "You're on the list. We'll notify you when your key is ready."
              : "Join the waitlist for Maslow's first allocation."
            }
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="w-16 h-16 text-[#C5A059] mb-4 animate-in zoom-in" />
            <p className="text-[#3B5998] font-medium">Position Locked</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-[#3B5998]/20 text-[#3B5998] placeholder:text-[#3B5998]/40 focus:border-[#C5A059] focus:ring-[#C5A059]"
                required
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#3B5998] hover:bg-[#2a4070] text-white font-bold tracking-wider"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'JOIN WAITLIST'}
            </Button>
            
            <p className="text-[10px] text-center text-[#3B5998]/40">
              *Limited to the first 1,000 founding members.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BetaSignupModal;