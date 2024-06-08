import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map({ handleMapChange }) {
    const [pinLocation, setPinLocation] = useState([0, 0]); // Initial pin location

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setPinLocation([lat, lng]); // Update pin location on map click
        handleMapChange({ lat, lng }); // Pass updated pin location to parent component
    };

    return (
        <MapContainer center={pinLocation} zoom={13} style={{ height: '300px', width: '100%' }} onClick={handleMapClick}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marker for pin location */}
            <Marker position={pinLocation}>
                <Popup>{pinLocation}</Popup>
            </Marker>
        </MapContainer>
    );
}
