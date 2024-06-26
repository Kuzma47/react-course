import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import { City, Point } from '../../types/location';
import useMap from '../../hooks/use-map';
import 'leaflet/dist/leaflet.css';
import { OfferProps } from '../../types/offer';


const defaultCustomIcon = new Icon({
  iconUrl:  'img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

type MapProps = {
  city: City;
  mapOffers: OfferProps[];
  selectedOffer: OfferProps | undefined;
  page: 'cities' | 'offer';
}

function GetPointFromOffer(offer: OfferProps | undefined): Point | undefined {
  return offer && (
    {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
      title: offer.id
    }
  );
}

export default function Map({city, mapOffers, selectedOffer, page}: MapProps): JSX.Element {
  const points = mapOffers.map((offer) => GetPointFromOffer(offer)).filter((p) => !!p).map((p) => p as Point);
  const selectedPoint = GetPointFromOffer(selectedOffer);

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  useEffect(() => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer.options.pane === 'markerPane') {
          map.removeLayer(layer);
        }
      });
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.latitude,
          lng: point.longitude
        });

        marker
          .setIcon(
            point.title === selectedPoint?.title
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, selectedPoint]);

  useEffect(() => {
    if (map) {
      map.flyTo([city.latitude, city.longitude], city.zoom);
    }
  }, [map, city]);

  return <section className={`${page}__map map`} ref={mapRef}></section>;
}
