import { GamePoint } from "../pages/types"
import { Circle, Polyline, Popup, Marker } from "react-leaflet"
import { getPosition } from "../utils/mapUtils"
import { Icon } from "leaflet"
export const GamePointsComponent = ({quizPoints,currPoint,startPoint, inScope, radius}: {quizPoints: GamePoint[], currPoint: GamePoint, startPoint: GamePoint, inScope: boolean, radius: number} ) => {
    
    const circleStyleOptions = (point: GamePoint) => {

        
        const iconNext = new Icon({iconUrl: "/assets/active_flag.png", iconSize: [38,38]})
        const iconActiveIn = new Icon({iconUrl: "/assets/complete_flag.png", iconSize: [38,38], className: "in-scope-marker"})
        const iconActive = new Icon({iconUrl: "/assets/complete_flag.png", iconSize: [38,38]})
        const iconPassed = new Icon({iconUrl: "/assets/complete_flag.png", iconSize: [38,38], className: "passed-marker"})

        const getStyleForNextPoints = () => ({
            icon: iconNext,
            circle: {     
                color: 'green',
                fillcolor: "#009150",
                weight: 1,
                fillOpacity: 0.2,
            }
        });
        
        const getStyleForPreviousPoints = () => ({
            icon: iconPassed,
            circle: {     
                color: '#009150',
                fillcolor: "#009150",
                weight: 1,
                fillOpacity: 0.1,
                opacity: 0.5
            }
        });
        
        const getStyleForCurrentPointInScope = () => ({
            icon: iconActiveIn,
            circle: {     
                color: 'green',
                fillcolor: "#15803d",
                weight: 2,
                fillOpacity: 0.2,
            }
        });
        
        const getStyleForCurrentPointOutOfScope = () => ({
            icon: iconActive,
            circle: {     
                color: 'green',
                fillcolor: "#15803d",
                weight: 1,
                fillOpacity: 0.2,
            }
        });

        if(currPoint.order < point.order)
        {
            return getStyleForNextPoints()
        }
        if(currPoint.order > point.order)
        {
            return getStyleForPreviousPoints()
        }
        if( currPoint.order == point.order)
        {
            if(inScope)
            {
                return getStyleForCurrentPointInScope()
            }
            else{

                return getStyleForCurrentPointOutOfScope()
            }
        }

        return {circle: {}, icon: iconNext as Icon}
        
    }

    return <>
            {quizPoints.map((point,index) => (
                <div key={index}>
                { point.order > currPoint.order &&
                    <Polyline
                    positions={index == 0 ? [getPosition(startPoint), getPosition(point)] : [getPosition(quizPoints[index -1]), getPosition(point) ]} // Tablica współrzędnych punktów
                    pathOptions={{
                    color: 'blue',      // Kolor linii
                    weight: 3,          // Grubość linii
                    dashArray: '10 10', // Definicja przerywania (10 pikseli linii, 10 pikseli przerwy)
                    }}
                /> 
                }
                <Circle
                    center={[point.lat, point.lng]}
                    pathOptions={circleStyleOptions(point).circle}
                    radius={radius} // Promień w metrach (dla Circle jest w metrach, a nie pikselach)
                    >
                     <Marker position={[point.lat, point.lng]} icon={circleStyleOptions(point).icon}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </Circle>
                </div>
            ))}
        </>
}
 
  