import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Plus, Settings } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import AddBookDialog from "@/components/library/AddBookDialog";

const Catalog = () => {
  const { state } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = state.books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityBadge = (availability: string) => {
    return availability === 'Available' ? (
      <Badge className="bg-green-100 text-green-800">Available</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Checked Out</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catalog</h1>
          <p className="text-muted-foreground">Browse and search the library catalog</p>
        </div>
        <div className="flex gap-2">
          <AddBookDialog />
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search books by title or author..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Library Catalog ({filteredBooks.length} books)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No books found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Book Title</th>
                    <th className="text-left py-3 px-4 font-medium">Author</th>
                    <th className="text-left py-3 px-4 font-medium">Availability</th>
                    <th className="text-left py-3 px-4 font-medium">Book ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{book.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-3 px-4">
                        {getAvailabilityBadge(book.availability)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{book.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{state.books.length}</div>
            <div className="text-sm text-muted-foreground">Total Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {state.books.filter(b => b.availability === 'Available').length}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {state.books.filter(b => b.availability === 'Checked Out').length}
            </div>
            <div className="text-sm text-muted-foreground">Checked Out</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Catalog;