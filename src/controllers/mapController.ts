import { loadModules, setDefaultOptions } from "esri-loader";
import { RefObject } from "react";
import { setMapLoaded } from "../store/slices/mapSlice";
import store from '../store/store';

setDefaultOptions({ css: true, version: '4.18' });

const colorVisVar = {
    "type": "color",
    "field": "BRIGHT_T31",
    "valueExpression": null,
    legendOptions: {
        title: "colors"
    },
    "stops": [
      {
        "value": 280,
        "color": 'red',
        "label": "> 280"
      },
      {
        "value": 290,
        "color": "blue",
        "label": "> 290"
      },
      {
        "value": 300,
        "color": 'brown',
        "label": "> 300"
      },
      {
        "value": 320,
        "color": 'lightblue',
        "label": "> 320"
      }
    ]
  };

const sizeVisVar = {
    type: 'size',
    field: "BRIGHT_T31",
    legendOptions: {
        title: "sizes by brightness",
    },
    stops: [
        {
            value: 280,
            size: 6,
            label: "> 280"
        },
        {
            value: 290,
            size: 3,
            label: '> 290'
        },
        {
            value: 300,
            size: 10,
            label: "> 300"
        },
        {
            value: 320,
            size: 15,
            label: "> 320"
        },
    ]
}

const renderer = {
    type: 'simple',
    symbol: {
        type: 'simple-marker',
        size: 7,
        color: [255, 128, 9, 0.6],
        outline: {
            width: 0.2,
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

const popUpTemplateTwo = {
    title: "popup for testLayer",
    content: [
        {
            type: 'fields',
            fieldInfos: [
                {
                    fieldName: 'BRIGHTNESS',
                    visible: true,
                    label: "Brightness: "
                },
                {
                    fieldName: 'SCAN',
                    visible: true,
                    label: "Scan: "
                },
                {
                    fieldName: 'TRACK',
                    visible: true,
                    label: "Track: "
                },
                {
                    fieldName: 'SATELLITE',
                    visible: true,
                    label: "Satellite: "
                },
                {
                    fieldName: 'CONFIDENCE',
                    visible: true,
                    label: "Confidence: "
                },
                {
                    fieldName: 'VERSION',
                    visible: true,
                    label: "Version: "
                },
                {
                    fieldName: 'BRIGHT_T31',
                    visible: true,
                    label: "Bright: "
                },
                {
                    fieldName: 'FRP',
                    visible: true,
                    label: "FRP: "
                },
                {
                    fieldName: 'ACQ_DATE',
                    visible: true,
                    label: "Acq date: "
                },
                {
                    fieldName: 'DAYNIGHT',
                    visible: true,
                    label: "Daynight: "
                },
            ],
        },
    ],

}


const rendererTwo = {
    type: 'simple',
    symbol: {
        type: 'simple-marker',
        size: 7,
        outline: {
            width: 1,
            color: 'pink'
        }
    },
    visualVariables: [colorVisVar, sizeVisVar]
}

class MapController {
    #map?: __esri.Map;
    #mapview?: __esri.MapView;
    #thermalLayer?: __esri.FeatureLayer;
    #testLayer?: __esri.FeatureLayer;
    #swipe?: __esri.Swipe;
    #popupTemplate?: __esri.PopupTemplate;
    #popupTemplateTwo?: __esri.PopupTemplate;
    #legend?: __esri.Legend;
    #sketch?: __esri.Sketch;
    #graphicsLayer?: __esri.GraphicsLayer;
    #brightnessLayer?: any;

    initialMap = async (domRef: RefObject<HTMLDivElement>) => {
        if(!domRef.current) return;

        const [
            Map, 
            MapView, 
            FeatureLayer, 
            PopupTemplate, 
            Expand,
            Swipe,
            Legend,
            Sketch,
            GraphicsLayer
        ] = await loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/PopupTemplate', 'esri/widgets/Expand', 'esri/widgets/Swipe', 'esri/widgets/Legend', 'esri/widgets/Sketch', 'esri/layers/GraphicsLayer']);


        this.#graphicsLayer = new GraphicsLayer();

        this.#map = new Map({
            basemap: 'gray-vector',
            // layers: [this.#graphicsLayer]
        });

        this.#popupTemplate = new PopupTemplate(popUpTemplate);
        this.#popupTemplateTwo = new PopupTemplate(popUpTemplateTwo);

        this.#thermalLayer = new FeatureLayer({
            url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/MODIS_Thermal_v1/FeatureServer/0',
            outFields: ['*'],
            renderer,
            popupTemplate: this.#popupTemplate
        });

        this.#testLayer = new FeatureLayer({
            // url: "https://services.arcgis.com/EDxZDh4HqQ1a9KvA/arcgis/rest/services/Fires_Mock_Layer/FeatureServer/0",
            url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/MODIS_Thermal_v1/FeatureServer/0',
            outFields: ['*'],
            renderer: rendererTwo,
            popupTemplate: this.#popupTemplateTwo
        });

        this.#mapview = new MapView({
            container: domRef.current,
            map: this.#map,
            center: [-87.66453728281347, 41.840392306471315],
            zoom: 4,
            // displays popup template on the botom right of the screen
            popup: {
                dockEnabled: true,
                dockOptions: {
                    position: "bottom-right",
                    breakpoint: false
                }
            }
        });

        this.#swipe = new Swipe({
            leadingLayers: [this.#testLayer],
            trailingLayers: [this.#thermalLayer],
            position:  35,
            view: this.#mapview
        });

        this.#legend = new Legend({
            view: this.#mapview,
            // information to render about the layers
            layerInfos: [
                {
                    layer: this.#thermalLayer,
                    title: "thermal Layer"
                },
                {
                    layer: this.#testLayer,
                    title: 'test layer'
                }
            ]
        });

        this.#sketch = new Sketch({
            layer: this.#graphicsLayer,
            view: this.#mapview,
            creationMode: 'update',
            deafultCreateOptions: {
                mode: 'hybrid'
            }
        });

        this.#sketch?.on('create', (event) => {
            // const evInfo = event.toolEventInfo;
            // if(evInfo && evInfo.type === 'cursor-update') {
            //     console.log(evInfo.type, evInfo.coordinates[0], evInfo.coordinates[1], ' checking');
            // }
        })

        this.#mapview?.when(() => {
            if(!this.#thermalLayer) return;
            if(!this.#testLayer) return;
            if(!this.#legend) return;
            this.#map?.add(this.#thermalLayer);
            this.#map?.add(this.#testLayer);


            const brightness = document.getElementById('brightness-filter');
            if(!brightness) return;

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
            store.dispatch(setMapLoaded(true));


            // Add layerInfo on the legend
            this.#mapview?.ui.add(this.#legend, 'top-right');
        });

        if(!this.#swipe) return;
        if(!this.#sketch) return;
        this.#mapview?.ui.add(this.#swipe);
        this.#mapview?.ui.add(this.#sketch, 'bottom-left');
    }


    // check back on this! its not working as expected
    updateBrightness = async (brightness: number) => {
        if(this.#brightnessLayer) {
            this.#brightnessLayer.filter = {
                where: "BRIGHT_T31 < " + brightness
            };
        }
    }
}

const mapController = new MapController();

export default mapController;
