import { loadModules, setDefaultOptions } from "esri-loader";
import { RefObject } from "react";

setDefaultOptions({ css: true, version: '4.18' });


const renderer = {
    type: 'simple',
    symbol: {
        type: 'simple-marker',
        size: 7,
        color: [255, 128, 9, 0.1],
        outline: {
            width: 1,
            color: 'blue'
        }
    },
}

const popUpTemplate = {
    title: 'popup title: {SCAN}',
    content: 
        `<ul>
            <li>Brightness: {BRIGHTNESS}</li>
            <li>Scan: {SCAN}</li>
            <li>Track: {TRACK}</li>
            <li>Satellite: {SATELLITE}</li>
            <li>Confidence: {CONFIDENCE}</li>
            <li>Version: {VERSION}</li>
            <li>Bright T31: {BRIGHT_T31}</li>
            <li>FRP: {FRP}</li>
            <li>Acq date: {ACQ_DATE}</li>
            <li>Daynight: {DAYNIGHT}</li>
        </ul>`
}

class MapController {
    #map?: __esri.Map;
    #mapview?: __esri.MapView;
    #thermalLayer?: __esri.FeatureLayer;
    #testLayer?: __esri.FeatureLayer;
    #swipe?: __esri.Swipe;
    #popupTemplate?: __esri.PopupTemplate;
    #brightnessLayer?: any;

    initialMap = async (domRef: RefObject<HTMLDivElement>) => {
        if(!domRef.current) return;

        const [
            Map, 
            MapView, 
            FeatureLayer, 
            PopupTemplate, 
            Expand,
            Swipe
        ] = await loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/PopupTemplate', 'esri/widgets/Expand', 'esri/widgets/Swipe']);

        this.#map = new Map({
            basemap: 'gray-vector'
        });

        this.#popupTemplate = new PopupTemplate(popUpTemplate);

        this.#thermalLayer = new FeatureLayer({
            url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/MODIS_Thermal_v1/FeatureServer/0',
            outFields: ['*'],
            renderer,
            popupTemplate: this.#popupTemplate
        });

        this.#testLayer = new FeatureLayer({
            url: "https://services.arcgis.com/EDxZDh4HqQ1a9KvA/arcgis/rest/services/Fires_Mock_Layer/FeatureServer/0"
        });
        // this.#testLayer?.visible = true;

        this.#mapview = new MapView({
            container: domRef.current,
            map: this.#map,
            center: [-87.66453728281347, 41.840392306471315],
            zoom: 4
        });

        this.#swipe = new Swipe({
            leadingLayers: [this.#thermalLayer],
            trailingLayers: [this.#testLayer],
            position:  35,
            view: this.#mapview
        });

        this.#mapview?.when(() => {
            if(!this.#thermalLayer) return;
            this.#map?.add(this.#thermalLayer);

            const brightness = document.getElementById('brightness-filter');
            if(!brightness) return;

            brightness.addEventListener('click', (e) => this.filterData(e, this.#brightnessLayer));

            this.#mapview?.whenLayerView(this.#thermalLayer).then(layerView => {
                this.#brightnessLayer = layerView;

                brightness.style.visibility = 'visible';
                const expand = new Expand({
                    view: this.#mapview,
                    content: brightness,
                    expandIconClass: "esri-icon-filter",
                    group: 'top-left'
                });

                expand.watch('expanded', () => {
                    if(!expand.expanded) {
                        this.#brightnessLayer.filter = null;
                    }
                });

                this.#mapview?.ui.add(expand, 'top-left');
            });
        });

        if(!this.#swipe) return;
        if(!this.#testLayer) return;
        this.#mapview?.ui.add(this.#swipe);
        this.#map?.add(this.#testLayer);
    }

    filterData(e: any, layerView: any) {
        const selectedBrightness = e.target.getAttribute('data-bright');

        layerView.filter = {
            where: "BRIGHT_T31 < " + selectedBrightness
        }
    }
}

const mapController = new MapController();

export default mapController;
