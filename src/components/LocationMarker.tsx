import { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react"
import { Marker, Popup,  useMap } from "react-leaflet"

export function LocationMarker(props : {draggable: boolean, fixed: boolean, position?: LatLngTuple, setPositionCb: (args: LatLngTuple) => void}) {
     
    const [position,setPosition] = useState<LatLngTuple>([0,0])
    const markerRef = useRef<any>(null)
    const map = useMap();
    const {setPositionCb} = props
    useEffect(() => {
          if(!props.draggable && !props.fixed)
          {
            map.locate().on("locationfound", function (e) {
              setPosition([e.latlng.lat,e.latlng.lng]);
              setPositionCb([e.latlng.lat,e.latlng.lng])
              map.flyTo(e.latlng, map.getZoom());
            })
          }
          else if(props.draggable && !props.fixed)
          {
              map.locate().once("locationfound", function (e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                setPositionCb([e.latlng.lat, e.latlng.lng])
                map.flyTo(e.latlng, map.getZoom());
            })
          }
          else if(props.position?.length){
              setPosition(props.position)
          }
    }, []);

    const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current
            if (marker != null) {
              setPosition(marker?.getLatLng())
              const tuple = marker?.getLatLng()
              setPositionCb([tuple.lat,tuple.lng])
            }
          },
        }),[])

    return (
        <Marker
        draggable={props.draggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
        <Popup minWidth={90}>
              <span>Here you are</span>
        </Popup>
        </Marker>
    )
}
