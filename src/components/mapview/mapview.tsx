import { useEffect, useRef } from "react"
import MapController from '../../controllers/mapController';

const MapView = () => {
    const mapVieeEl = useRef(null);

    useEffect(() => {
        MapController.initialMap(mapVieeEl);
    },[]);
    
    return (
        <div className="mapview-container">
            <div className="mapview" ref={mapVieeEl} />
        </div>
    )
}

export default MapView;
