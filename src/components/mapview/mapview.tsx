import { useEffect, useRef } from "react"
import MapController from '../../controllers/mapController';
import ControlPanel from "./control-panel";

const MapView = () => {
    const mapVieeEl = useRef(null);

    useEffect(() => {
        MapController.initialMap(mapVieeEl);
    },[]);

    return (
        <div className="mapview-container">
            <div className="mapview" ref={mapVieeEl} />
            <ControlPanel />
        </div>
    )
}

export default MapView;
