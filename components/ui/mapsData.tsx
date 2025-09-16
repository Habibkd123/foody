import React from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  marginTop: '50px',
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

function MyMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: "AIzaSyAGC7JgkXXAMa8Omh2xrzNZh-ziOjYg4Hk"
  });

  const [currentLocation, setCurrentLocation] = React.useState<{ lat: number, lng: number } | null>(null);

  React.useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Geolocation is not supported');
        }
      );
    }
  }, [isLoaded]);

  return (
    <>
    {/* <LoadScript googleMapsApiKey="AIzaSyAGC7JgkXXAMa8Omh2xrzNZh-ziOjYg4Hk">
      <GoogleMap mapContainerStyle={containerStyle} center={currentLocation || center} zoom={10}>
        {currentLocation && <Marker position={currentLocation} />}
      </GoogleMap>
    </LoadScript> */}
    </>
  );
}

export default MyMap;

