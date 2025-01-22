import { LatLngTuple } from "leaflet";
import { SquereCoordinate } from "./types";
import { GamePoint } from "../pages/types";

export function calculateSquare(lat: number, lng: number, radius: number): SquereCoordinate {
    const EARTH_RADIUS = 6378137; // Promień Ziemi w metrach

    // Przelicz promień na stopnie szerokości geograficznej
    const deltaLat = radius / 111320; // 1 stopień szerokości geograficznej to ~111.32 km

    // Przelicz promień na stopnie długości geograficznej
    const deltaLng = radius / (111320 * Math.cos((lat * Math.PI) / 180));

    // Wierzchołki kwadratu
    const topLeft = [lat + deltaLat, lng - deltaLng ];
    const topRight = [lat + deltaLat,lng + deltaLng ];
    const bottomLeft = [lat - deltaLat, lng - deltaLng ];
    const bottomRight = [lat - deltaLat,lng + deltaLng ];

    return { topLeft, topRight, bottomLeft, bottomRight };
}
export const scaleBounds = (originalBounds: LatLngTuple[], scaleFactor: number) : LatLngTuple[] => {
    const [[lat1, lng1], [lat2, lng2]] = originalBounds;
  
    // Oblicz środek
    const centerLat = (lat1 + lat2) / 2;
    const centerLng = (lng1 + lng2) / 2;
  
    // Oblicz szerokość i wysokość oryginalnego obszaru
    const halfLatSpan = (lat2 - lat1) / 2;
    const halfLngSpan = (lng2 - lng1) / 2;
  
    // Zmniejsz wymiary w oparciu o scaleFactor (np. 50% => scaleFactor = 0.5)
    const newHalfLatSpan = halfLatSpan * scaleFactor;
    const newHalfLngSpan = halfLngSpan * scaleFactor;
  
    // Zwróć nowe bounds
    return [
      [centerLat - newHalfLatSpan, centerLng - newHalfLngSpan], // Dolny lewy
      [centerLat + newHalfLatSpan, centerLng + newHalfLngSpan], // Górny prawy
    ];
  };

  export const getPosition = (point: GamePoint) : LatLngTuple => {
    return [point.lat,point.lng]
 } 

 export const isPointInCircle = (
  pointLat: number,
  pointLng: number,
  centerLat: number,
  centerLng: number,
  radius: number // w metrach
): boolean => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const R = 6371000; // Promień Ziemi w metrach
  const dLat = toRadians(pointLat - centerLat);
  const dLng = toRadians(pointLng - centerLng);

  const lat1 = toRadians(centerLat);
  const lat2 = toRadians(pointLat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Odległość w metrach

  return distance <= radius;
};