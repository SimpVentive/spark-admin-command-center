import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, Trash2 } from "lucide-react";
import { useLibrary } from "@/hooks/useLibrary";

const Reservations = () => {
  const { reservations, loading, cancelReservation } = useLibrary();

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await cancelReservation(reservationId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'fulfilled':
        return <Badge className="bg-blue-100 text-blue-800">Fulfilled</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeReservations = reservations.filter(r => r.status === 'active');
  const historyReservations = reservations.filter(r => r.status !== 'active');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Book Reservations</h1>
        <p className="text-muted-foreground">Manage your book reservations</p>
      </div>

      {/* Active Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Active Reservations ({activeReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeReservations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Reservations</h3>
              <p className="text-muted-foreground">
                You don't have any active book reservations at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">
                          {reservation.library_books?.title || 'Unknown Book'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          by {reservation.library_books?.author || 'Unknown Author'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{reservation.profiles?.full_name || reservation.profiles?.email || 'Unknown User'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Reserved: {new Date(reservation.reservation_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {new Date(reservation.expiry_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(reservation.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reservation History */}
      {historyReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reservation History ({historyReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historyReservations.slice(0, 10).map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h5 className="font-medium text-sm">
                          {reservation.library_books?.title || 'Unknown Book'}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          by {reservation.library_books?.author || 'Unknown Author'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Reserved: {new Date(reservation.reservation_date).toLocaleDateString()}</span>
                      <span>User: {reservation.profiles?.full_name || reservation.profiles?.email || 'Unknown User'}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{reservations.length}</div>
              <div className="text-sm text-muted-foreground">Total Reservations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reservations.filter(r => r.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reservations.filter(r => r.status === 'fulfilled').length}
              </div>
              <div className="text-sm text-muted-foreground">Fulfilled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reservations.filter(r => r.status === 'expired').length}
              </div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Reservations are automatically created when you try to reserve available books
          </p>
          <p className="text-sm text-muted-foreground">
            • You will be notified when your reserved book becomes available for checkout
          </p>
          <p className="text-sm text-muted-foreground">
            • Reservations expire after 7 days if not claimed
          </p>
          <p className="text-sm text-muted-foreground">
            • You can have up to 3 active reservations at a time
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reservations;