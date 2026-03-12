import { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { Button } from './ui/button';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Center of India as default fallback
const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629,
};

interface MapPickerProps {
    value: { lat: number; lng: number } | null;
    onChange: (location: { lat: number; lng: number }) => void;
    readonly?: boolean;
}

function LocationMarker({ position, onChange, readonly }: {
    position: L.LatLng | null,
    onChange?: (pos: L.LatLng) => void,
    readonly?: boolean
}) {
    const map = useMapEvents({
        click(e) {
            if (readonly) return;
            onChange?.(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    const markerEventHandlers = useMemo(
        () => ({
            dragend(e: L.LeafletEvent) {
                if (readonly) return;
                const marker = e.target;
                if (marker != null) {
                    onChange?.(marker.getLatLng());
                }
            },
        }),
        [onChange, readonly]
    );

    return position === null ? null : (
        <Marker
            draggable={!readonly}
            eventHandlers={markerEventHandlers}
            position={position}
        >
            <Popup>
                {readonly ? "Ad Location" : "Drag me or click map to move!"}
            </Popup>
        </Marker>
    );
}

export function MapPicker({ value, onChange, readonly = false }: MapPickerProps) {
    const [map, setMap] = useState<L.Map | null>(null);

    const position = value ? new L.LatLng(value.lat, value.lng) : null;

    const handleLocateMe = () => {
        if (!map) return;

        map.locate().on("locationfound", function (e) {
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
            map.flyTo(e.latlng, 15);
        }).on("locationerror", function (e) {
            alert("Could not access your location. Please ensure location permissions are granted.");
        });
    };

    return (
        <div className="relative flex flex-col gap-2 w-full h-[300px] mb-4">
            {!readonly && (
                <div className="absolute top-2 right-2 z-[400]">
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleLocateMe}
                        className="shadow-md bg-white text-black hover:bg-gray-100"
                    >
                        <LocateFixed className="w-4 h-4 mr-2" />
                        Locate Me
                    </Button>
                </div>
            )}

            <div className="rounded-lg overflow-hidden border border-border shadow-sm h-full w-full">
                <MapContainer
                    center={position || defaultCenter}
                    zoom={position ? 15 : 5}
                    ref={setMap}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={position}
                        onChange={(pos) => onChange({ lat: pos.lat, lng: pos.lng })}
                        readonly={readonly}
                    />
                </MapContainer>
            </div>

            {!readonly && (
                <p className="text-sm text-muted-foreground flex justify-between">
                    <span>Click the map or drag the pin to set precise location.</span>
                    {value && (
                        <span className="font-mono text-xs">
                            {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}
