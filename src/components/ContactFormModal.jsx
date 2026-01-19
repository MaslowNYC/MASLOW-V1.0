
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";

const ContactFormModal = ({ isOpen, onClose, defaultInquiryType = "General Inquiry" }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: '',
    inquiry_type: defaultInquiryType 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to database
      const { error: dbError } = await supabase
        .from('contact_inquiries')
        .insert([formData]);

      if (dbError) throw dbError;

      // 2. Send email via Edge Function
      const { error: fnError } = await supabase.functions.invoke('send-inquiry-email', {
        body: JSON.stringify(formData)
      });

      if (fnError) {
          console.warn("Email sending failed, but inquiry saved:", fnError);
      }

      toast({
        title: "Inquiry Sent",
        description: "We have received your message and will be in touch shortly.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
      });
      
      onClose();
      setFormData({ name: '', email: '', phone: '', message: '', inquiry_type: defaultInquiryType });

    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#F5F1E8] border-[#3B5998]">
        <DialogHeader>
          <DialogTitle className="text-[#3B5998] font-serif text-2xl">
            {defaultInquiryType === 'Sovereign Inquiry' ? 'Request Allocation' : 'Contact Us'}
          </DialogTitle>
          <DialogDescription className="text-[#3B5998]/70">
            {defaultInquiryType === 'Sovereign Inquiry' 
              ? 'Please provide your details to discuss a Sovereign tier allocation.'
              : 'Send us a message and we will get back to you.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#3B5998]">Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="bg-white border-[#3B5998]/20 text-[#3B5998]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#3B5998]">Phone</Label>
              <Input 
                id="phone" 
                type="tel"
                value={formData.phone} 
                onChange={handleChange} 
                required
                className="bg-white border-[#3B5998]/20 text-[#3B5998]"
              />
            </div>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#3B5998]">Message</Label>
            <Textarea 
              id="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              className="bg-white border-[#3B5998]/20 text-[#3B5998] min-h-[100px]"
              placeholder={defaultInquiryType === 'Sovereign Inquiry' ? "I am interested in the Sovereign tier because..." : "How can we help?"}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3B5998] hover:bg-[#2d4475] text-[#F5F1E8] font-bold">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;
