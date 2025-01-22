import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props : any) => {
  const { webpoints } = props 

  const instance = L.Routing.control({
    waypoints: webpoints,
    lineOptions: {
      styles: [{ color: 'blue', weight: 3 }], // Styl linii (opcjonalne)
      extendToWaypoints: true,               // Wymagane
      missingRouteTolerance: 10,  
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    // @ts-ignore
    createMarker: function() { return null; },
  });

  instance.on('routesfound', () => {
    const container = instance.getContainer();
    if (container) {
      container.style.display = 'none'; // Ukrycie kontenera legendy
    }
  });
  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
