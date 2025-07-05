import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey } from "@pages/utils/googleMaps";

interface BasicGoogleMapProps {
  /** Google Maps API key (falls back to global GOOGLE_MAPS_API_KEY if omitted) */
  apiKey?: string;
  /** Initial zoom level */
  defaultZoom?: number;
  /** Initial map center */
  defaultCenter?: google.maps.LatLngLiteral;
  /** Optional mapId for Google Maps styles */
  mapId?: string;
  /** Extra Tailwind classes */
  className?: string;
}

/**
 * Thin wrapper around a bare-bones Google Map. It keeps all Google specific
 * logic out of the rest of the codebase and provides sensible defaults.
 */
const BasicGoogleMap: React.FC<BasicGoogleMapProps> = ({
  apiKey,
  defaultZoom = 8,
  defaultCenter = { lat: -34.397, lng: 150.644 },
  mapId,
  className = "",
}) => {
  const key = apiKey || getGoogleMapsApiKey();

  return (
    <APIProvider
      apiKey={key}
      solutionChannel="VibeStart_basic_map"
    >
      <Map
        mapId={mapId}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        gestureHandling={"greedy"}
        disableDefaultUI
        className={className}
      />
    </APIProvider>
  );
};

export default BasicGoogleMap; 