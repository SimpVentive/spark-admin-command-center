import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, User, Calendar, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Book {
  id: string;
  title: string;
  author: string;
  availability: string;
  isbn?: string;
  category?: string;
}

interface CheckoutRecord {
  id: string;
  book_id: string;
  user_id: string;
  checkout_date: string;
  due_date?: string;
  return_date?: string;
  status: string;
  library_books?: {
    title: string;
    author: string;
  };
  profiles?: { 
    full_name?: string; 
    email?: string; 
  };
}

const CheckInOut = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [checkoutRecords, setCheckoutRecords] = useState<CheckoutRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    userEmail: '',
    action: '' as 'checkout' | 'return' | '',
  });

  // Load books and recent checkout records
  useEffect(() => {
    loadBooks();
    loadCheckoutRecords();
  }, []);

  const loadBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('library_books')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error loading books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
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
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setCheckoutRecords(data || []);
    } catch (error) {
      console.error('Error loading checkout records:', error);
    }
  };

  const findUserByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  };

  const handleCheckOut = async (bookId: string, userEmail: string) => {
    try {
      // Find user by email
      const user = await findUserByEmail(userEmail);
      
      // Check if book is available
      const book = books.find(b => b.id === bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (book.availability !== 'Available') {
        throw new Error('Book is not available for checkout');
      }

      // Check if user already has this book checked out
      const { data: existingCheckout } = await supabase
        .from('library_checkout_records')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', user.id)
        .eq('status', 'checked_out')
        .single();

      if (existingCheckout) {
        throw new Error('User already has this book checked out');
      }

      // Calculate due date (2 weeks from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // Create checkout record
      const { error: checkoutError } = await supabase
        .from('library_checkout_records')
        .insert({
          book_id: bookId,
          user_id: user.id,
          due_date: dueDate.toISOString(),
          status: 'checked_out'
        });

      if (checkoutError) throw checkoutError;

      // Update book availability
      const { error: updateError } = await supabase
        .from('library_books')
        .update({ availability: 'Checked Out' })
        .eq('id', bookId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Book checked out to ${user.full_name || user.email}. Due: ${dueDate.toLocaleDateString()}`,
      });

      // Reload data
      loadBooks();
      loadCheckoutRecords();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check out book",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async (bookId: string, userEmail: string) => {
    try {
      // Find user by email
      const user = await findUserByEmail(userEmail);
      
      // Find active checkout record
      const { data: checkoutRecord, error: findError } = await supabase
        .from('library_checkout_records')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', user.id)
        .eq('status', 'checked_out')
        .single();

      if (findError || !checkoutRecord) {
        throw new Error('No active checkout found for this book and user');
      }

      // Update checkout record
      const { error: updateCheckoutError } = await supabase
        .from('library_checkout_records')
        .update({ 
          status: 'returned',
          return_date: new Date().toISOString()
        })
        .eq('id', checkoutRecord.id);

      if (updateCheckoutError) throw updateCheckoutError;

      // Update book availability
      const { error: updateBookError } = await supabase
        .from('library_books')
        .update({ availability: 'Available' })
        .eq('id', bookId);

      if (updateBookError) throw updateBookError;

      toast({
        title: "Success",
        description: `Book returned successfully by ${user.full_name || user.email}`,
      });

      // Reload data
      loadBooks();
      loadCheckoutRecords();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to return book",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bookId || !formData.userEmail || !formData.action) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (formData.action === 'checkout') {
        await handleCheckOut(formData.bookId, formData.userEmail);
      } else if (formData.action === 'return') {
        await handleReturn(formData.bookId, formData.userEmail);
      }

      // Reset form
      setFormData({
        bookId: '',
        userEmail: '',
        action: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'Available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'Checked Out':
        return <Badge className="bg-red-100 text-red-800">Checked Out</Badge>;
      case 'Reserved':
        return <Badge className="bg-yellow-100 text-yellow-800">Reserved</Badge>;
      default:
        return <Badge variant="secondary">{availability}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Library Check In/Out</h1>
        <p className="text-muted-foreground">Manage book check-in and check-out operations</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Use the user's email address to identify them for checkout/return operations.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check In/Out Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookId">Select Book</Label>
                <Select
                  value={formData.bookId}
                  onValueChange={(value) => setFormData({ ...formData, bookId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} by {book.author} - {book.availability}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">User Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="Enter user's email address"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={formData.action}
                  onValueChange={(value) => setFormData({ ...formData, action: value as 'checkout' | 'return' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkout">Check Out</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Submit Transaction'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Available Books */}
        <Card>
          <CardHeader>
            <CardTitle>Library Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {books.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No books found</p>
              ) : (
                books.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground">by {book.author}</div>
                      {book.category && (
                        <div className="text-xs text-muted-foreground">{book.category}</div>
                      )}
                    </div>
                    <div className="ml-2">
                      {getAvailabilityBadge(book.availability)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {checkoutRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checkoutRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {record.library_books?.title || 'Unknown Book'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      by {record.library_books?.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      User: {record.profiles?.full_name || record.profiles?.email || 'Unknown User'}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <Badge 
                      className={
                        record.status === 'checked_out' 
                          ? 'bg-blue-100 text-blue-800' 
                          : record.status === 'returned'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {record.status === 'checked_out' ? 'Checked Out' : 
                       record.status === 'returned' ? 'Returned' : record.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(record.checkout_date).toLocaleDateString()}
                    </div>
                    {record.due_date && record.status === 'checked_out' && (
                      <div className="text-xs text-muted-foreground">
                        Due: {new Date(record.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckInOut;