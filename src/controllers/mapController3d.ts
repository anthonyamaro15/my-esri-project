import { loadModules } from 'esri-loader';
import { RefObject } from 'react';


class MapController3d {
    #map?: __esri.Map;
    #mapview?: __esri.MapView;
    #sceneview?: __esri.SceneView;

    initialMap = async (domRef: RefObject<HTMLDivElement>) => {
        if(!domRef.current) return;

        const [Map, SceneView] = await loadModules(['esri/Map', 'esri/views/SceneView']);

        this.#map = new Map({
            basemap: "topo-vector",
            ground: "world-elevation"
        });

        // for 3d map use SceneView instead of MapView
        this.#sceneview = new SceneView({
            container: domRef.current,
            map: this.#map,
            scale: 50000000,
            center: [-101.17, 21.78]
        })
    }
}

const mapController3d = new MapController3d();
export default mapController3d;
