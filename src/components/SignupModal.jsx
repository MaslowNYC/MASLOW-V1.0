
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const SignupModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);

      if (!error) {
        toast({
          title: "Account created!",
          description: "Welcome to Maslow. You can now access free services.",
        });
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
      }
      // Note: Error toast is already handled inside signUp function in AuthContext
    } catch (err) {
      console.error("Signup error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#F5F1E8] border-[#3B5998]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#3B5998]">Create your free account</DialogTitle>
          <DialogDescription className="text-[#3B5998]/70">
            Join the Maslow community to access The Hull's free amenities.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-[#3B5998]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-[#3B5998]/20 text-[#3B5998] placeholder:text-[#3B5998]/40 focus:border-[#C5A059]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-[#3B5998]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-[#3B5998]/20 text-[#3B5998] placeholder:text-[#3B5998]/40 focus:border-[#C5A059]"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3B5998] hover:bg-[#2d4475] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Get Free Access"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
