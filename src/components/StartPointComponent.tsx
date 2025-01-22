import { ImageOverlay, Rectangle } from "react-leaflet"
import { LatLngTuple } from "leaflet"
import { scaleBounds } from "../utils/mapUtils"

export const StartPointComponent = ({isStartPoint, inScope, startArea} :{isStartPoint: boolean, inScope: boolean, startArea: LatLngTuple[]}) => {

    //const isStartPoint = typePoint() === PointType.START
    //const inScope = inCurrPointScope()
    let currStyle = {}

    const startPointActive = {     
        fillColor: "#228B22",
        color: "darkgreen",
        fillOpacity: 0.3,
        weight: 1, // Zwiększ grubość obramowania
    };
    const startPointOPtionsActiveOnLocation = {     
      fillColor: "#228B22",
      color: "#006400",
      fillOpacity: 0.4,
      weight: 2,
    }
    const startPointInActive = {
      fillColor: "#A9A9A9", // Wyszarzały zielony (ciemny szary z odcieniem zieleni)
      color: "#6B8E23", // Oliwkowy zielony
      fillOpacity: 0.7, // Bardziej przezroczysty
      weight: 1, // Cieńsze linie
    }

    if(!isStartPoint)
    {
      currStyle = startPointInActive
    }
    else if (isStartPoint && !inScope ) {
      currStyle = startPointActive
    }
    else{
       currStyle = startPointOPtionsActiveOnLocation
    }

    return <>
      <Rectangle bounds={startArea} pathOptions={currStyle}>
      {(isStartPoint && !inScope) && <ImageOverlay
          bounds={scaleBounds(startArea, 0.5)}
          opacity={0.9}
          url="/assets/start_flag.png"
        />}
      </Rectangle> 
    </>
  }