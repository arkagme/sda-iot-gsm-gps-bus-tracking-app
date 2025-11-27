import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="40" height="40">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Custom stop icon
const stopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="30" height="30">
      <circle cx="12" cy="12" r="10" fill="#10b981"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Component to update map view
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const BusMap = ({
  route,
  busLocation,
  userStop,
  gpsHistory = [],
  height = '500px',
  showControls = true,
}) => {
  const mapRef = useRef();
  
  // Determine map center
  const mapCenter = busLocation
    ? [busLocation.latitude, busLocation.longitude]
    : route?.stops?.[0]?.location?.coordinates
    ? [route.stops[0].location.coordinates[1], route.stops[0].location.coordinates[0]]
    : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng];

  // Prepare route path from stops
  const routePath = route?.stops
    ?.sort((a, b) => a.order - b.order)
    .map(stop => [
      stop.location.coordinates[1],
      stop.location.coordinates[0]
    ]);

  // Prepare traveled path from GPS history
  const traveledPath = gpsHistory
    ?.map(point => [
      point.location.coordinates[1],
      point.location.coordinates[0]
    ]);

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_MAP_ZOOM}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />

        {/* Planned Route Path */}
        {routePath && routePath.length > 1 && (
          <Polyline
            positions={routePath}
            color="#93c5fd"
            weight={4}
            opacity={0.6}
            dashArray="10, 10"
          />
        )}

        {/* Traveled Path */}
        {traveledPath && traveledPath.length > 1 && (
          <Polyline
            positions={traveledPath}
            color="#2563eb"
            weight={6}
            opacity={0.8}
          />
        )}

        {/* Bus Current Location */}
        {busLocation && (
          <Marker
            position={[busLocation.latitude, busLocation.longitude]}
            icon={busIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">Current Bus Location</p>
                <p className="text-sm text-gray-600">
                  Speed: {busLocation.speed?.toFixed(0) || 0} km/h
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Bus Stops */}
        {route?.stops?.map((stop, index) => {
          const isUserStop = stop.name === userStop;
          const customIcon = isUserStop ? new L.Icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="35" height="35">
                <circle cx="12" cy="12" r="10" fill="#ef4444"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
              </svg>
            `),
            iconSize: [35, 35],
            iconAnchor: [17.5, 17.5],
            popupAnchor: [0, -17.5],
          }) : stopIcon;

          return (
            <Marker
              key={index}
              position={[
                stop.location.coordinates[1],
                stop.location.coordinates[0]
              ]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold">{stop.name}</p>
                  <p className="text-sm text-gray-600">
                    Stop #{stop.order}
                  </p>
                  {stop.estimatedArrivalTime && (
                    <p className="text-sm text-gray-600">
                      ETA: {stop.estimatedArrivalTime}
                    </p>
                  )}
                  {isUserStop && (
                    <p className="text-xs font-medium text-red-600 mt-1">
                      Your Stop
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default BusMap;
