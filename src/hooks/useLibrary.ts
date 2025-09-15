import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Book {
  id: string;
  title: string;
  author: string;
  availability: string;
  isbn?: string;
  category?: string;
  location?: string;
  condition?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  description?: string;
  resource_type: 'eBook' | 'Article' | 'Video' | 'Document' | 'Audio' | 'Software';
  url?: string;
  file_path?: string;
  tags?: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CheckoutRecord {
  id: string;
  book_id: string;
  user_id: string;
  checkout_date: string;
  due_date?: string;
  return_date?: string;
  status: string;
  renewal_count?: number;
  notes?: string;
  library_books?: {
    title: string;
    author: string;
  };
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export interface Reservation {
  id: string;
  book_id: string;
  user_id: string;
  reservation_date: string;
  expiry_date: string;
  status: string;
  notification_sent?: boolean;
  library_books?: {
    title: string;
    author: string;
  };
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export const useLibrary = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [checkoutRecords, setCheckoutRecords] = useState<CheckoutRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load all library data
  const loadBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('library_books')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error loading books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    }
  };

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('library_resources')
        .select('*')
        .eq('is_active', true)
        .order('title');
      
      if (error) throw error;
      setResources((data || []) as LibraryResource[]);
    } catch (error: any) {
      console.error('Error loading resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    }
  };

  const loadCheckoutRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('library_checkout_records')
        .select(`
          *,
          library_books(title, author),
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCheckoutRecords(data || []);
    } catch (error: any) {
      console.error('Error loading checkout records:', error);
    }
  };

  const loadReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('library_reservations')
        .select(`
          *,
          library_books(title, author),
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReservations(data || []);
    } catch (error: any) {
      console.error('Error loading reservations:', error);
    }
  };

  // Book operations
  const addBook = async (bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('library_books')
        .insert([bookData])
        .select()
        .single();
      
      if (error) throw error;
      
      await loadBooks();
      toast({
        title: "Success",
        description: "Book added successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (bookId: string, updates: Partial<Book>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('library_books')
        .update(updates)
        .eq('id', bookId);
      
      if (error) throw error;
      
      await loadBooks();
      toast({
        title: "Success",
        description: "Book updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating book:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update book",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Resource operations
  const addResource = async (resourceData: Omit<LibraryResource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('library_resources')
        .insert([resourceData])
        .select()
        .single();
      
      if (error) throw error;
      
      await loadResources();
      toast({
        title: "Success",
        description: "Resource added successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reservation operations
  const createReservation = async (bookId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if book is available
      const book = books.find(b => b.id === bookId);
      if (!book || book.availability !== 'Available') {
        throw new Error('Book is not available for reservation');
      }

      // Check if user already has a reservation for this book
      const existingReservation = reservations.find(
        r => r.book_id === bookId && r.user_id === user.id && r.status === 'active'
      );
      
      if (existingReservation) {
        throw new Error('You already have a reservation for this book');
      }

      const { error } = await supabase
        .from('library_reservations')
        .insert([{
          book_id: bookId,
          user_id: user.id,
          status: 'active'
        }]);
      
      if (error) throw error;
      
      // Update book status to reserved
      await updateBook(bookId, { availability: 'Reserved' });
      await loadReservations();
      
      toast({
        title: "Success",
        description: "Book reserved successfully",
      });
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create reservation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      setLoading(true);
      
      // Get reservation details
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) throw new Error('Reservation not found');

      // Update reservation status
      const { error } = await supabase
        .from('library_reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);
      
      if (error) throw error;
      
      // Update book availability back to Available
      await updateBook(reservation.book_id, { availability: 'Available' });
      await loadReservations();
      
      toast({
        title: "Success",
        description: "Reservation cancelled successfully",
      });
    } catch (error: any) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel reservation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadBooks();
    loadResources();
    loadCheckoutRecords();
    loadReservations();
  }, []);

  return {
    // Data
    books,
    resources,
    checkoutRecords,
    reservations,
    loading,
    
    // Actions
    loadBooks,
    loadResources,
    loadCheckoutRecords,
    loadReservations,
    addBook,
    updateBook,
    addResource,
    createReservation,
    cancelReservation,
  };
};