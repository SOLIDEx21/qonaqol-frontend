'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet when used with Next.js/Webpack
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon} />
  );
}

export default function MapPicker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    // Default position (Baku, Azerbaijan)
    setPosition(new L.LatLng(40.4093, 49.8671));
  }, []);

  if (!position) return <div className="h-full w-full bg-gray-100 flex items-center justify-center">Xəritə yüklənir...</div>;

  return (
    <div className="h-full w-full z-0 relative rounded-xl overflow-hidden">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}
