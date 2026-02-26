import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

type EventCategory = 'cultural' | 'childrens' | 'dancing' | 'learning' | 'wellness' | 'social' | 'nightlife';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  category: EventCategory;
  tags: string[] | null;
  max_attendees: number | null;
  current_attendees: number;
  price_credits: number;
  host_name: string | null;
  status: string;
  image_url: string | null;
}

interface EventEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null; // null = creating new event
  onSave: () => void;
}

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'childrens', label: "Children's" },
  { value: 'dancing', label: 'Dancing' },
  { value: 'learning', label: 'Learning' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'social', label: 'Social' },
  { value: 'nightlife', label: 'Nightlife' },
];

const EventEditorModal: React.FC<EventEditorModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('social');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [priceCredits, setPriceCredits] = useState('0');
  const [hostName, setHostName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('upcoming');

  // Populate form when editing
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');

      // Parse date and time
      const date = new Date(event.event_date);
      setEventDate(date.toISOString().split('T')[0]);
      setEventTime(date.toTimeString().slice(0, 5));

      setLocation(event.location || '');
      setCategory(event.category);
      setMaxAttendees(event.max_attendees?.toString() || '');
      setPriceCredits(event.price_credits.toString());
      setHostName(event.host_name || '');
      setImageUrl(event.image_url || '');
      setTags(event.tags?.join(', ') || '');
      setStatus(event.status);
    } else {
      // Reset form for new event
      setTitle('');
      setDescription('');
      setEventDate('');
      setEventTime('19:00');
      setLocation('');
      setCategory('social');
      setMaxAttendees('');
      setPriceCredits('0');
      setHostName('');
      setImageUrl('');
      setTags('');
      setStatus('upcoming');
    }
  }, [event, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!eventDate || !eventTime) {
      toast({ title: 'Error', description: 'Date and time are required', variant: 'destructive' });
      return;
    }

    setSaving(true);

    try {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`).toISOString();
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      const eventData = {
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDateTime,
        location: location.trim() || null,
        category,
        max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
        price_credits: parseInt(priceCredits) || 0,
        host_name: hostName.trim() || null,
        image_url: imageUrl.trim() || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        status,
      };

      if (event) {
        // Update existing event
        const { error } = await (supabase
          .from('events') as any)
          .update(eventData)
          .eq('id', event.id);

        if (error) throw error;

        toast({ title: 'Event updated', description: 'Your changes have been saved.' });
      } else {
        // Create new event
        const { error } = await (supabase
          .from('events') as any)
          .insert({ ...eventData, current_attendees: 0 });

        if (error) throw error;

        toast({ title: 'Event created', description: 'Your new event has been published.' });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({ title: 'Error', description: 'Failed to save event. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    setDeleting(true);

    try {
      // First delete all RSVPs for this event
      await (supabase
        .from('event_attendees') as any)
        .delete()
        .eq('event_id', event.id);

      // Then delete the event
      const { error } = await (supabase
        .from('events') as any)
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast({ title: 'Event deleted', description: 'The event has been removed.' });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ title: 'Error', description: 'Failed to delete event. Please try again.', variant: 'destructive' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F5F1E8]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#3B5998]">
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            {event ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="bg-white"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 rounded-md border border-input bg-white text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-white text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="happening_now">Happening Now</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Maslow Sanctuary - Suite 1"
              className="bg-white"
            />
          </div>

          {/* Host Name */}
          <div className="space-y-2">
            <Label htmlFor="hostName">Host Name</Label>
            <Input
              id="hostName"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Who is hosting this event?"
              className="bg-white"
            />
          </div>

          {/* Max Attendees and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="Leave blank for unlimited"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceCredits">Price (Credits)</Label>
              <Input
                id="priceCredits"
                type="number"
                value={priceCredits}
                onChange={(e) => setPriceCredits(e.target.value)}
                placeholder="0 = free"
                className="bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event..."
              rows={4}
              className="bg-white"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="bg-white"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., meditation, beginner-friendly, family"
              className="bg-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#3B5998]/10">
            {event && !showDeleteConfirm && (
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}

            {showDeleteConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">Delete this event?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}

            {!event && <div />}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#3B5998] hover:bg-[#3B5998]/90 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {event ? 'Save Changes' : 'Create Event'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditorModal;
