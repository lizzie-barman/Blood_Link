import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically animate the map when the center changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom DivIcons for healthcare markers
const createCustomIcon = (type, label = '') => {
  let bgColor = '#DC2626';
  let symbol = '🩸';

  if (type === 'hospital') {
    bgColor = '#E11D48';
    symbol = '🏥';
  } else if (type === 'bloodbank') {
    bgColor = '#0284C7';
    symbol = '🏢';
  } else if (type === 'donor') {
    bgColor = '#16A34A';
    symbol = '👤';
  }

  const html = `
    <div style="
      background-color: ${bgColor};
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      border: 2px solid white;
      font-size: 14px;
      position: relative;
    ">
      <span>${symbol}</span>
      ${label ? `<div style="
        position: absolute;
        top: -18px;
        background: rgba(15, 23, 42, 0.85);
        color: white;
        padding: 1px 4px;
        border-radius: 4px;
        font-size: 9px;
        font-weight: 700;
        white-space: nowrap;
      ">${label}</div>` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bloodlink-map-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export const MapView = ({
  center,
  zoom = 12,
  bloodBanks = [],
  markers = [],
  hospitalLocation = null,
  donors = [],
  onSelectMarker,
  onMarkerSelect,
  height = '420px',
  className = ''
}) => {
  const activeBloodBanks = bloodBanks.length > 0 ? bloodBanks : markers;
  const handleMarkerSelect = onSelectMarker || onMarkerSelect;

  // Determine dynamic map center
  const mapCenter = useMemo(() => {
    if (center && center.lat && center.lng) {
      return [center.lat, center.lng];
    }
    if (hospitalLocation && hospitalLocation.lat && hospitalLocation.lng) {
      return [hospitalLocation.lat, hospitalLocation.lng];
    }
    if (activeBloodBanks.length > 0 && activeBloodBanks[0].coordinates) {
      return [activeBloodBanks[0].coordinates.lat, activeBloodBanks[0].coordinates.lng];
    }
    // Default fallback (Kolkata)
    return [22.5726, 88.3639];
  }, [center, hospitalLocation, activeBloodBanks]);

  const hospitalIcon = useMemo(() => createCustomIcon('hospital', 'HOSPITAL'), []);
  const bloodBankIcon = useMemo(() => createCustomIcon('bloodbank', 'DEPOT'), []);
  const donorIcon = useMemo(() => createCustomIcon('donor', 'DONOR'), []);

  return (
    <div
      className={`card ${className}`.trim()}
      style={{
        position: 'relative',
        height,
        width: '100%',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        padding: 0,
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'var(--spacing-3)',
          right: 'var(--spacing-3)',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 'var(--spacing-2) var(--spacing-3)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          fontSize: 'var(--font-size-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
          Map Radar Legend
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🏢</span> <span>Blood Bank / Inventory</span>
        </div>
        {hospitalLocation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏥</span> <span>Emergency Hospital Site</span>
          </div>
        )}
        {donors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👤</span> <span>Approx. Donor Radius</span>
          </div>
        )}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Inject the auto-updater to smoothly animate when clicking "View Details" */}
        <MapUpdater center={mapCenter} zoom={zoom > 14 ? zoom : 15} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hospitalLocation && hospitalLocation.lat && hospitalLocation.lng && (
          <Marker position={[hospitalLocation.lat, hospitalLocation.lng]} icon={hospitalIcon}>
            <Popup>
              <div style={{ fontWeight: 'bold', color: 'var(--color-danger)' }}>
                🏥 {hospitalLocation.name || 'Emergency Hospital Requisition Point'}
              </div>
              <div style={{ marginTop: '4px' }}>{hospitalLocation.address || 'Active Emergency Zone'}</div>
            </Popup>
          </Marker>
        )}

        {activeBloodBanks.map((bank) => {
          if (!bank.coordinates?.lat || !bank.coordinates?.lng) return null;
          return (
            <Marker
              key={bank.id}
              position={[bank.coordinates.lat, bank.coordinates.lng]}
              icon={bloodBankIcon}
              eventHandlers={{
                click: () => handleMarkerSelect && handleMarkerSelect(bank)
              }}
            >
              <Popup>
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--color-primary-dark)' }}>
                    🏢 {bank.name}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                    📍 {bank.location || bank.address}
                  </div>
                  <div style={{ fontSize: '11px', marginTop: '4px', fontWeight: 'bold' }}>
                    Available Units: {bank.availableUnits}
                  </div>
                  {bank.components && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      Whole: {bank.components['Whole Blood']} | Platelets: {bank.components['Platelets']} | Plasma: {bank.components['Plasma']}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', color: '#16a34a', marginTop: '2px' }}>
                    📞 {bank.phone}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {donors.map((donor) => {
          const coords = donor.approxCoordinates || donor.coordinates;
          if (!coords?.lat || !coords?.lng) return null;
          return (
            <React.Fragment key={donor.id}>
              <Circle
                center={[coords.lat, coords.lng]}
                radius={600}
                pathOptions={{ fillColor: '#16A34A', fillOpacity: 0.15, color: '#16A34A', weight: 1, dashArray: '4, 4' }}
              />
              <Marker position={[coords.lat, coords.lng]} icon={donorIcon}>
                <Popup>
                  <div>
                    <strong style={{ color: '#166534' }}>👤 Voluntary Donor ({donor.bloodGroup})</strong>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      Status: <strong>{donor.eligibility || 'Eligible'}</strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;