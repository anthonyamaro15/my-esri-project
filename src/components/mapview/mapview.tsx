import { useEffect, useRef } from "react"
import MapController from '../../controllers/mapController';
import ControlPanel from "./control-panel";
import MapController3d from '../../controllers/mapController3d';

const MapView = () => {
    const mapVieeEl = useRef(null);

    useEffect(() => {
        MapController.initialMap(mapVieeEl);
        // MapController3d.initialMap(mapVieeEl);
    },[]);

    return (
        <div className="mapview-container">
            <div className="mapview" ref={mapVieeEl} />
            <ControlPanel />
        </div>
    )
}

export default MapView;
