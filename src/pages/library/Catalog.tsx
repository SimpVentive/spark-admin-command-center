import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Plus, Settings } from "lucide-react";
import { useLibrary } from "@/hooks/useLibrary";
import AddBookDialog from "@/components/library/AddBookDialog";

const Catalog = () => {
  const { books, loading, createReservation } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = Array.from(new Set(books.map(book => book.category).filter(Boolean)));

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'Available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'Checked Out':
        return <Badge className="bg-red-100 text-red-800">Checked Out</Badge>;
      case 'Reserved':
        return <Badge className="bg-yellow-100 text-yellow-800">Reserved</Badge>;
      case 'Maintenance':
        return <Badge className="bg-gray-100 text-gray-800">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{availability}</Badge>;
    }
  };

  const handleReserve = async (bookId: string) => {
    try {
      await createReservation(bookId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading library catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library Catalog</h1>
          <p className="text-muted-foreground">Browse and search available books</p>
        </div>
        <AddBookDialog />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or author..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {(searchTerm || categoryFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No books found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter 
                ? "Try adjusting your search criteria"
                : "Start building your library by adding some books"
              }
            </p>
            <AddBookDialog 
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Book
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
                  </div>
                  {getAvailabilityBadge(book.availability)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {book.category && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category:</span> {book.category}
                    </div>
                  )}
                  {book.isbn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">ISBN:</span> {book.isbn}
                    </div>
                  )}
                  {book.location && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Location:</span> {book.location}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    {book.availability === 'Available' ? (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleReserve(book.id)}
                      >
                        Reserve Book
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        {book.availability === 'Checked Out' ? 'Currently Checked Out' :
                         book.availability === 'Reserved' ? 'Currently Reserved' :
                         'Not Available'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Library Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{books.length}</div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {books.filter(b => b.availability === 'Available').length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {books.filter(b => b.availability === 'Checked Out').length}
              </div>
              <div className="text-sm text-muted-foreground">Checked Out</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {books.filter(b => b.availability === 'Reserved').length}
              </div>
              <div className="text-sm text-muted-foreground">Reserved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Catalog;