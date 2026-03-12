import { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocateFixed, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
    const [isLocating, setIsLocating] = useState(false);

    const position = value ? new L.LatLng(value.lat, value.lng) : null;

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported in your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                onChange({ lat: latitude, lng: longitude });
                if (map) map.flyTo([latitude, longitude], 16);
                setIsLocating(false);
            },
            (err) => {
                setIsLocating(false);
                if (err.code === err.PERMISSION_DENIED) {
                    toast.error("Location permission denied. Enable it in browser settings.");
                } else if (err.code === err.TIMEOUT) {
                    toast.error("Location request timed out. Please try again.");
                } else {
                    toast.error("Could not get your location. Please try again.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
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
                        disabled={isLocating}
                        className="shadow-md bg-white text-black hover:bg-gray-100"
                    >
                        {isLocating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Locating…
                            </>
                        ) : (
                            <>
                                <LocateFixed className="w-4 h-4 mr-2" />
                                Locate Me
                            </>
                        )}
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
