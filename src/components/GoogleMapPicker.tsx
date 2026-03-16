import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// @ts-ignore - Google Maps types
declare const google: any;

interface GoogleMapPickerProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  defaultValue?: string;
}

const GoogleMapPicker = ({ onLocationSelect, defaultValue = "" }: GoogleMapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [address, setAddress] = useState(defaultValue);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const initializeMap = async (apiKey: string) => {
    if (!mapRef.current) return;

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // India center
        zoom: 5,
      });

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        draggable: true,
      });

      const geocoder = new google.maps.Geocoder();

      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        if (position) {
          geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              const newAddress = results[0].formatted_address;
              setAddress(newAddress);
              onLocationSelect(newAddress, position.lat(), position.lng());
            }
          });
        }
      });

      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          markerInstance.setPosition(e.latLng);
          geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              const newAddress = results[0].formatted_address;
              setAddress(newAddress);
              onLocationSelect(newAddress, e.latLng!.lat(), e.latLng!.lng());
            }
          });
        }
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  };

  const searchLocation = async () => {
    if (!map || !address.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0] && marker) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);
        marker.setPosition(location);
        onLocationSelect(address, location.lat(), location.lng());
      }
    });
  };

  if (!useGoogleMaps) {
    return (
      <div className="space-y-4">
        <Input
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onLocationSelect(e.target.value, 0, 0);
          }}
          placeholder="Enter location address"
        />
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Want to use Google Maps for location selection? Enter your Google Maps API key:
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Google Maps API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button 
              onClick={() => {
                if (apiKey.trim()) {
                  setUseGoogleMaps(true);
                  initializeMap(apiKey);
                }
              }}
              disabled={!apiKey.trim()}
            >
              Enable Maps
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Get your API key from <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Search for a location"
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
        />
        <Button onClick={searchLocation}>Search</Button>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border"
        style={{ minHeight: '250px' }}
      />
      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to select a location
      </p>
    </div>
  );
};

export default GoogleMapPicker;