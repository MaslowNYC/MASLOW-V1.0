
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resetDatabase } from '@/utils/dbReset';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";

const DatabaseReset = () => {
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    if (confirmation !== 'DELETE') {
      toast({
        variant: "destructive",
        title: "Invalid confirmation",
        description: "Please type DELETE to confirm.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetDatabase();
      toast({
        title: "Success",
        description: "Database has been completely reset.",
      });
      setIsOpen(false);
      setConfirmation('');
      // Force reload to clear any local state/cache
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reset database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2 shadow-lg hover:bg-red-700">
          <Trash2 className="h-4 w-4" />
          Reset Database
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-red-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-gray-600">
            <p>
              This action cannot be undone. This will permanently delete <strong>ALL</strong> user accounts, bookings, and application data from the servers.
            </p>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              <p className="font-bold mb-2">The following will be deleted:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All User Accounts (Auth & Profiles)</li>
                <li>All Bookings & Reservations</li>
                <li>All Financial Projections</li>
                <li>All Memberships & Subscriptions</li>
                <li>All Contact Inquiries & Signups</li>
              </ul>
              <p className="mt-2 font-bold">Resets:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Funding Goal (to 0)</li>
                <li>Inventory Stock (to 100)</li>
              </ul>
            </div>
            <p>
              Type <strong>DELETE</strong> to confirm.
            </p>
            <Input 
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="mt-2 border-red-200 focus:ring-red-500"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleReset}
            disabled={confirmation !== 'DELETE' || isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Everything'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DatabaseReset;
