import { toast } from '@/components/ui/use-toast';
import { STRIPE_PAYMENT_LINKS } from '@/config/stripePaymentLinks';

export const handleStripePayment = async (tierName: string, _price: number): Promise<void> => {
  try {
    toast({
      title: "Redirecting to Secure Checkout",
      description: `Taking you to Stripe to complete your ${tierName} membership...`,
      duration: 2000,
    });

    const paymentLink = STRIPE_PAYMENT_LINKS[tierName as keyof typeof STRIPE_PAYMENT_LINKS];

    if (!paymentLink || paymentLink.includes('placeholder')) {
      console.warn(`Payment link for ${tierName} is not configured yet.`);

      // Fallback for demo purposes since actual links aren't generated yet
      toast({
        title: "Demo Mode",
        description: "Payment links need to be generated in Stripe Dashboard. Simulating redirect...",
        duration: 3000,
      });

      setTimeout(() => {
        window.open('https://stripe.com/checkout', '_blank');
      }, 1500);
      return;
    }

    // Direct redirect to the hosted Stripe Payment Link
    window.location.href = paymentLink;

  } catch (error) {
    console.error("Payment Error:", error);
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};

export const saveEmail = (email: string): boolean => {
  try {
    const emails: string[] = JSON.parse(localStorage.getItem('maslowEmails') || '[]');
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem('maslowEmails', JSON.stringify(emails));
    }
    return true;
  } catch (error) {
    console.error('Error saving email:', error);
    return false;
  }
};
