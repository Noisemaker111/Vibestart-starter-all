import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey } from "@client/utils/googleMaps";

interface PlaceAutocompleteMapProps {
  /** Google Maps API key (falls back to global GOOGLE_MAPS_API_KEY if omitted) */
  apiKey?: string;
  /** Map style ID (optional) */
  mapId?: string;
  /** Extra Tailwind classes */
  className?: string;
}

const PlaceAutocompleteMap: React.FC<PlaceAutocompleteMapProps> = ({
  apiKey,
  mapId = "bf51a910020fa25a",
  className = "",
}) => {
  const key = apiKey || getGoogleMapsApiKey();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <APIProvider apiKey={key} solutionChannel="VibeStart_rgmautocomplete">
      <Map
        mapId={mapId}
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={"greedy"}
        disableDefaultUI
        className={className}
      >
        <AdvancedMarker ref={markerRef} position={null} />
        <MapControl position={ControlPosition.TOP_LEFT}>
          <div className="p-2 bg-white rounded shadow">
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
          </div>
        </MapControl>
        <MapHandler place={selectedPlace} marker={marker} />
      </Map>
    </APIProvider>
  );
};

/////////////////////////////////////////////
// Helper components – kept internal here
/////////////////////////////////////////////

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler: React.FC<MapHandlerProps> = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    const listener = placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
    // Cleanup listener on unmount
    return () => listener.remove();
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <input
      ref={inputRef}
      placeholder="Search place..."
      className="px-3 py-2 border border-gray-300 rounded w-64"
    />
  );
};

export default PlaceAutocompleteMap; 