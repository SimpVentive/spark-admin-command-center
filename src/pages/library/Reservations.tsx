import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, Trash2 } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useToast } from "@/hooks/use-toast";

const Reservations = () => {
  const { state, cancelReservation } = useLibrary();
  const { toast } = useToast();

  const handleCancelReservation = (id: string, bookTitle: string) => {
    cancelReservation(id);
    console.log('Reservation cancelled:', { id, bookTitle, timestamp: new Date().toISOString() });
    toast({
      title: "Reservation Cancelled",
      description: `Reservation for "${bookTitle}" has been cancelled successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reservations</h1>
        <p className="text-muted-foreground">Manage book reservations and waiting lists</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Active Reservations ({state.reservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.reservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active reservations.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Book reservations will appear here when users reserve unavailable books.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Book Title</th>
                    <th className="text-left py-3 px-4 font-medium">Reserved By</th>
                    <th className="text-left py-3 px-4 font-medium">Reservation Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{reservation.bookTitle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.reservedBy}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(reservation.reservationDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-orange-100 text-orange-800">
                          Pending
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelReservation(reservation.id, reservation.bookTitle)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reservation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{state.reservations.length}</div>
            <div className="text-sm text-muted-foreground">Active Reservations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {state.reservations.filter(r => {
                const reservationDate = new Date(r.reservationDate);
                const today = new Date();
                const diffTime = today.getTime() - reservationDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays > 7;
              }).length}
            </div>
            <div className="text-sm text-muted-foreground">Overdue ({'>'}7 days)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Set(state.reservations.map(r => r.reservedBy)).size}
            </div>
            <div className="text-sm text-muted-foreground">Unique Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Reservations are automatically created when users try to borrow unavailable books
          </p>
          <p className="text-sm text-muted-foreground">
            • Users are notified when their reserved book becomes available
          </p>
          <p className="text-sm text-muted-foreground">
            • Reservations expire after 7 days if not claimed
          </p>
          <p className="text-sm text-muted-foreground">
            • Users can have up to 3 active reservations at a time
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reservations;