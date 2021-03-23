import { loadModules, setDefaultOptions } from "esri-loader";
import { RefObject } from "react";

setDefaultOptions({ css: true, version: '4.18' });

class MapController {
    #map?: __esri.Map;
    #mapview?: __esri.MapView;

    initialMap = async (domRef: RefObject<HTMLDivElement>) => {
        if(!domRef.current) return;

        const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView']);

        this.#map = new Map({
            basemap: 'gray-vector'
        });

        this.#mapview = new MapView({
            container: domRef.current,
            map: this.#map,
            center: [-87.66453728281347, 41.840392306471315],
            zoom: 10
        });
    }
}

const mapController = new MapController();

export default mapController;
