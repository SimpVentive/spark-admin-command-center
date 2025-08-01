import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, User, Calendar } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useToast } from "@/hooks/use-toast";

const CheckInOut = () => {
  const { state, addCheckoutRecord } = useLibrary();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    action: '' as 'Check In' | 'Check Out' | '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bookId || !formData.userId || !formData.action) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const book = state.books.find(b => b.id === formData.bookId);
    if (!book) {
      toast({
        title: "Error",
        description: "Book not found.",
        variant: "destructive",
      });
      return;
    }

    // Check availability logic
    if (formData.action === 'Check Out' && book.availability === 'Checked Out') {
      toast({
        title: "Error",
        description: "This book is already checked out.",
        variant: "destructive",
      });
      return;
    }

    if (formData.action === 'Check In' && book.availability === 'Available') {
      toast({
        title: "Error",
        description: "This book is not currently checked out.",
        variant: "destructive",
      });
      return;
    }

    addCheckoutRecord({
      bookId: formData.bookId,
      userId: formData.userId,
      action: formData.action,
    });

    console.log('Checkout action:', {
      action: formData.action,
      bookId: formData.bookId,
      bookTitle: book.title,
      userId: formData.userId,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Success",
      description: `Book ${formData.action.toLowerCase()}ed successfully!`,
    });

    // Reset form
    setFormData({
      bookId: '',
      userId: '',
      action: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Check In/Out</h1>
        <p className="text-muted-foreground">Manage book check-in and check-out operations</p>
      </div>

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
                <Label htmlFor="bookId">Book ID</Label>
                <Input
                  id="bookId"
                  placeholder="Enter book ID"
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user ID"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={formData.action}
                  onValueChange={(value) => setFormData({ ...formData, action: value as 'Check In' | 'Check Out' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check Out">Check Out</SelectItem>
                    <SelectItem value="Check In">Check In</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Submit Transaction
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Available Books Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Available Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.books.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-muted-foreground">ID: {book.id}</div>
                    <div className="text-sm text-muted-foreground">Author: {book.author}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    book.availability === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.availability}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {state.checkoutRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.checkoutRecords.slice(-5).reverse().map((record) => {
                const book = state.books.find(b => b.id === record.bookId);
                return (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{book?.title || 'Unknown Book'}</div>
                      <div className="text-sm text-muted-foreground">
                        User ID: {record.userId} • Book ID: {record.bookId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs font-medium mb-1 ${
                        record.action === 'Check Out' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {record.action}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(record.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckInOut;