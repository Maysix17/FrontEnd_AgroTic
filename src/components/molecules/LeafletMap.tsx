import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Zona {
  id: string;
  nombre: string;
  coorX: number;
  coorY: number;
  coordenadas?: any;
}

// Validation function for coordinates
const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Validation function for polygon coordinates
const validatePolygonCoordinates = (coordinates: any[]): boolean => {
  if (!Array.isArray(coordinates) || coordinates.length < 3) {
    console.warn('Polygon must have at least 3 coordinates');
    return false;
  }

  for (const coord of coordinates) {
    if (typeof coord.lat !== 'number' || typeof coord.lng !== 'number') {
      console.warn('Invalid coordinate format:', coord);
      return false;
    }
    if (!validateCoordinates(coord.lat, coord.lng)) {
      console.warn('Coordinate out of bounds:', coord);
      return false;
    }
  }

  return true;
};

interface LeafletMapProps {
  zonas: Zona[];
  selectedZona?: Zona;
  onZonaSelect?: (zona: Zona) => void;
  height?: string;
  showSatellite?: boolean;
  modalOpen?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  zonas,
  selectedZona,
  onZonaSelect,
  showSatellite = true,
  modalOpen = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      maxZoom: 18,
      minZoom: 12,
    }).setView([1.8921903999999965, -76.0903752], 17);

    // Remove attribution
    map.attributionControl.remove();

    // Add tile layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: ''
    });

    // Default to satellite
    if (showSatellite) {
      satelliteLayer.addTo(map);
    } else {
      osmLayer.addTo(map);
    }

    // Add layer control
    L.control.layers({
      'Mapa': osmLayer,
      'Satelital': satelliteLayer
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showSatellite]);

  // Update markers and polygons
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers and polygons
    markersRef.current.forEach(marker => map.removeLayer(marker));
    polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
    markersRef.current.clear();
    polygonsRef.current.clear();

    // Add markers and polygons for zones
    zonas.forEach(zona => {
      // Validate center coordinates before adding marker
      if (!validateCoordinates(zona.coorY, zona.coorX)) {
        console.error(`Invalid center coordinates for zona ${zona.nombre}: lat=${zona.coorY}, lng=${zona.coorX}`);
        return;
      }

      // Add marker at center coordinates
      const isSelected = selectedZona?.id === zona.id;
      const marker = L.marker([zona.coorY, zona.coorX])
        .addTo(map)
        .bindPopup(`<strong>${zona.nombre}</strong>`);

      if (onZonaSelect) {
        marker.on('click', () => {
          console.log('Zona seleccionada desde mapa:', zona);
          onZonaSelect(zona);
        });
      }

      // Set initial marker icon based on selection
      if (isSelected) {
        const customIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        marker.setIcon(customIcon);
      }

      markersRef.current.set(zona.id, marker);

      // Add polygon if coordinates exist
      if (zona.coordenadas) {
        let latlngs: [number, number][] = [];

        try {
          if (Array.isArray(zona.coordenadas)) {
            // Legacy format: array of {lat, lng}
            if (validatePolygonCoordinates(zona.coordenadas)) {
              latlngs = zona.coordenadas.map((coord: any) => [coord.lat, coord.lng]);
            }
          } else if (zona.coordenadas.type === 'Polygon' && zona.coordenadas.coordinates) {
            // GeoJSON Polygon format
            const coords = zona.coordenadas.coordinates[0];
            if (Array.isArray(coords) && coords.length >= 3) {
              latlngs = coords.map((coord: [number, number]) => [coord[1], coord[0]]);
              // Validate GeoJSON coordinates
              if (!latlngs.every(([lat, lng]) => validateCoordinates(lat, lng))) {
                console.warn(`Invalid GeoJSON coordinates for zona ${zona.nombre}`);
                latlngs = [];
              }
            }
          } else if (zona.coordenadas.type === 'Point') {
            // Point format - skip polygon rendering
            latlngs = [];
          }

          if (latlngs.length > 0) {
            const polygon = L.polygon(latlngs, {
              color: isSelected ? 'red' : 'blue',
              weight: isSelected ? 3 : 2,
              opacity: isSelected ? 1 : 0.8,
              fillOpacity: isSelected ? 0.3 : 0.1,
            }).addTo(map);

            if (isSelected) {
              polygon.bringToFront();
            }

            polygonsRef.current.set(zona.id, polygon);
          }
        } catch (error) {
          console.error(`Error processing coordinates for zona ${zona.nombre}:`, error);
        }
      }
    });
  }, [zonas, selectedZona, onZonaSelect]);

  // Center on selected zone and highlight it
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedZona) return;

    const map = mapInstanceRef.current;

    // Center the map on the selected zone
    map.flyTo([selectedZona.coorY, selectedZona.coorX], 16, { duration: 0.8 });

    // Highlight the selected zone's marker and polygon
    const marker = markersRef.current.get(selectedZona.id);
    const polygon = polygonsRef.current.get(selectedZona.id);

    // Reset all other markers and polygons to default style
    markersRef.current.forEach((m, id) => {
      if (id !== selectedZona.id) {
        m.setIcon(new L.Icon.Default());
      }
    });

    polygonsRef.current.forEach((p, id) => {
      if (id !== selectedZona.id) {
        p.setStyle({
          color: 'blue',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.1,
        });
      }
    });

    // Highlight selected marker
    if (marker) {
      const customIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      marker.setIcon(customIcon);
    }

    // Highlight selected polygon
    if (polygon) {
      polygon.setStyle({
        color: 'red',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.3,
      });
      polygon.bringToFront();
    }
  }, [selectedZona]);

  return <div ref={mapRef} style={{ height: '100%', width: '90%', borderRadius: '8px', zIndex: modalOpen ? 0 : 1 }} />;
};

export default LeafletMap;