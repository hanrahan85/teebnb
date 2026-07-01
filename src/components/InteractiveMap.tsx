import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default marker icon paths (broken in Vite builds)
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapListing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  lat: number;
  lng: number;
  cover_image?: string | null;
}

interface Props {
  listings: MapListing[];
  highlightedId?: string | null;
  onMarkerClick?: (id: string) => void;
}

const InteractiveMap: React.FC<Props> = ({ listings, highlightedId, onMarkerClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Default centre: Ireland
    const defaultCenter: [number, number] = [53.3498, -6.2603];
    const defaultZoom = listings.length > 0 ? 5 : 6;

    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add/update markers when listings change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (listings.length === 0) return;

    const bounds: [number, number][] = [];

    listings.forEach(listing => {
      const isHighlighted = listing.id === highlightedId;

      const priceIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: ${isHighlighted ? '#C7F04A' : '#0B1F17'};
            color: ${isHighlighted ? '#0B1F17' : '#FFFFFF'};
            padding: 5px 10px;
            border-radius: 20px;
            font-family: 'Archivo', sans-serif;
            font-weight: 700;
            font-size: 13px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            border: 2px solid ${isHighlighted ? '#0B1F17' : 'transparent'};
            transition: all 0.2s;
            cursor: pointer;
          ">€${listing.nightly_price}</div>
        `,
        iconAnchor: [28, 16],
      });

      const marker = L.marker([listing.lat, listing.lng], { icon: priceIcon })
        .addTo(map);

      const popupContent = `
        <div style="font-family: 'Archivo', sans-serif; min-width: 200px; max-width: 240px;">
          ${listing.cover_image
            ? `<img src="${listing.cover_image}" style="width:100%;height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />`
            : ''}
          <div style="font-weight: 700; font-size: 14px; color: #0B1F17; margin-bottom: 4px; line-height: 1.3;">
            ${listing.property_title}
          </div>
          <div style="font-size: 12px; color: #5C6B62; margin-bottom: 8px;">
            ${listing.full_address}
          </div>
          <div style="font-weight: 700; font-size: 16px; color: #15794C;">
            €${listing.nightly_price}<span style="font-weight: 400; font-size: 12px; color: #5C6B62;">/night</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260, className: 'teebnb-popup' });

      marker.on('click', () => {
        onMarkerClick?.(listing.id);
      });

      markersRef.current[listing.id] = marker;
      bounds.push([listing.lat, listing.lng]);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [listings, highlightedId, onMarkerClick]);

  // Update marker icons when highlighted changes without re-rendering
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    listings.forEach(listing => {
      const marker = markersRef.current[listing.id];
      if (!marker) return;
      const isHighlighted = listing.id === highlightedId;
      marker.setIcon(L.divIcon({
        className: '',
        html: `
          <div style="
            background: ${isHighlighted ? '#C7F04A' : '#0B1F17'};
            color: ${isHighlighted ? '#0B1F17' : '#FFFFFF'};
            padding: 5px 10px;
            border-radius: 20px;
            font-family: 'Archivo', sans-serif;
            font-weight: 700;
            font-size: 13px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            border: 2px solid ${isHighlighted ? '#0B1F17' : 'transparent'};
            cursor: pointer;
          ">€${listing.nightly_price}</div>
        `,
        iconAnchor: [28, 16],
      }));
    });
  }, [highlightedId, listings]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <style>{`
        .teebnb-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          padding: 0;
          overflow: hidden;
        }
        .teebnb-popup .leaflet-popup-content {
          margin: 12px;
        }
        .leaflet-popup-tip-container { display: none; }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
