
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

const BetaSignupModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('beta_signups')
        .insert([formData]);

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Welcome to the Beta!",
        description: "You've successfully reserved your spot for The Hull.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
      });
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '' });
      }, 2000);

    } catch (error) {
      console.error('Error signing up for beta:', error);
      toast({
        title: "Signup Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#F5F1E8] border-[#3B5998]">
        <DialogHeader>
          <DialogTitle className="text-[#3B5998] font-serif text-2xl">Join the Beta</DialogTitle>
          <DialogDescription className="text-[#3B5998]/70">
            Digital Access to The Hull is currently in Beta. Reserve your spot to get early access.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#C5A059] animate-bounce" />
            <h3 className="text-xl font-bold text-[#3B5998]">You're on the list!</h3>
            <p className="text-[#3B5998]/70">Watch your inbox for updates.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#3B5998]">Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="bg-white border-[#3B5998]/20 text-[#3B5998]"
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#3B5998]">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="bg-white border-[#3B5998]/20 text-[#3B5998]"
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#3B5998]">Phone (Optional)</Label>
              <Input 
                id="phone" 
                type="tel"
                value={formData.phone} 
                onChange={handleChange} 
                className="bg-white border-[#3B5998]/20 text-[#3B5998]"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#3B5998] font-bold">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  'Reserve My Spot'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BetaSignupModal;
