import { loadModules, setDefaultOptions } from 'esri-loader';
import { RefObject } from 'react';
import { setMapLoaded } from '../store/slices/mapSlice';
import store from '../store/store';
import { popUpTemplate, popUpTemplateTwo, rendererTwo, renderer } from '../variables';

setDefaultOptions({ css: true, version: '4.18' });

class MapController {
  #map?: __esri.Map;
  #mapview?: __esri.MapView;
  #thermalLayer?: __esri.FeatureLayer;
  #testLayer?: __esri.FeatureLayer | any;
  #swipe?: __esri.Swipe;
  #popupTemplate?: __esri.PopupTemplate;
  #popupTemplateTwo?: __esri.PopupTemplate;
  #legend?: __esri.Legend;
  #sketch?: __esri.Sketch;
  #sketchExpand?: __esri.Expand;
  #graphicsLayer?: __esri.GraphicsLayer;
  #brightnessLayer?: any;
  #updateGeometries?: any;

  initialMap = async (domRef: RefObject<HTMLDivElement>) => {
    if (!domRef.current) return;

    const [
      Map,
      MapView,
      FeatureLayer,
      PopupTemplate,
      Expand,
      Swipe,
      Legend,
      Sketch,
      GraphicsLayer,
      geometryEngine,
      FeatureFilter,
    ] = await loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/PopupTemplate',
      'esri/widgets/Expand',
      'esri/widgets/Swipe',
      'esri/widgets/Legend',
      'esri/widgets/Sketch',
      'esri/layers/GraphicsLayer',
      'esri/geometry/geometryEngine',
      'esri/views/layers/support/FeatureFilter',
    ]);

    this.#graphicsLayer = new GraphicsLayer();

    this.#map = new Map({
      basemap: 'gray-vector',
    });

    this.#popupTemplate = new PopupTemplate(popUpTemplate);
    this.#popupTemplateTwo = new PopupTemplate(popUpTemplateTwo);

    this.#thermalLayer = new FeatureLayer({
      url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/MODIS_Thermal_v1/FeatureServer/0',
      outFields: ['*'],
      renderer,
      popupTemplate: this.#popupTemplate,
    });

    this.#testLayer = new FeatureLayer({
      // url: "https://services.arcgis.com/EDxZDh4HqQ1a9KvA/arcgis/rest/services/Fires_Mock_Layer/FeatureServer/0",
      url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/MODIS_Thermal_v1/FeatureServer/0',
      outFields: ['*'],
      renderer: rendererTwo,
      popupTemplate: this.#popupTemplateTwo,
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
          position: 'bottom-right',
          breakpoint: false,
        },
      },
    });

    this.#swipe = new Swipe({
      leadingLayers: [this.#testLayer],
      trailingLayers: [this.#thermalLayer],
      position: 35,
      view: this.#mapview,
    });

    this.#legend = new Legend({
      view: this.#mapview,
      // information to render about the layers
      layerInfos: [
        {
          layer: this.#thermalLayer,
          title: 'thermal Layer',
        },
        {
          layer: this.#testLayer,
          title: 'test layer',
        },
      ],
    });

    this.#sketch = new Sketch({
      layer: this.#graphicsLayer,
      view: this.#mapview,
      creationMode: 'update',
      deafultCreateOptions: {
        mode: 'hybrid',
      },
    });

    this.#sketchExpand = new Expand({
      view: this.#mapview,
      content: this.#sketch,
      expandIconClass: 'esri-icon-edit',
    });

    this.#sketch?.on('create', (event) => {
      if (event.state === 'complete') {
        console.log('event now? ', event);
        this.#graphicsLayer?.remove(event.graphic);
        // check more on this
        this.#updateGeometries = this.getSketchUpdate(event.graphic.geometry, geometryEngine);
        this.updateLayer();
      }
    });

    this.#mapview?.when(() => {
      if (!this.#thermalLayer) return;
      if (!this.#testLayer) return;
      if (!this.#legend) return;

      this.#map?.add(this.#thermalLayer);
      this.#map?.add(this.#testLayer);

      const brightness = document.getElementById('brightness-filter');
      if (!brightness) return;

      this.#mapview?.whenLayerView(this.#thermalLayer).then((layerView) => {
        this.#brightnessLayer = layerView;

        brightness.style.visibility = 'visible';
        const expand = new Expand({
          view: this.#mapview,
          content: brightness,
          expandIconClass: 'esri-icon-filter',
          group: 'top-left',
        });

        expand.watch('expanded', () => {
          if (!expand.expanded) {
            this.#brightnessLayer.filter = null;
          }
        });

        this.#mapview?.ui.add(expand, 'top-left');
      });
      store.dispatch(setMapLoaded(true));

      // Add layerInfo on the legend
      this.#mapview?.ui.add(this.#legend, 'top-right');
    });

    if (!this.#swipe) return;
    if (!this.#sketchExpand) return;
    this.#mapview?.ui.add(this.#swipe);
    this.#mapview?.ui.add(this.#sketchExpand, 'bottom-left');
  };

  getSketchUpdate = (geometry: any, fn: any) => {
    return fn.union(geometry);
  };

  updateLayer = async () => {
    if (this.#brightnessLayer) {
      this.#brightnessLayer.filter = {
        geometry: this.#updateGeometries,
      };
    }
  };
  updateBrightness = async (brightness: number) => {
    if (this.#brightnessLayer) {
      this.#brightnessLayer.filter = {
        where: 'BRIGHT_T31 < ' + brightness,
      };
    }
  };
}

const mapController = new MapController();

export default mapController;
