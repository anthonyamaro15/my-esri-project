import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MapController from '../../controllers/mapController';
import { mapLoaded as mapLoaderSelector } from '../../store/slices/mapSlice';

const ControlPanel = () => {
    const [updateBrigntness, setUpdateBrightness] = useState<number>(0);
    const mapLoaded = useSelector(mapLoaderSelector);

    useEffect(() => {
        if(mapLoaded) {
            MapController.updateBrightness(updateBrigntness);
        // console.log("inside ", updateBrigntness);

        }
        // console.log("outside ", updateBrigntness);
    },[updateBrigntness, mapLoaded]);

    

    return (
        <div>
            <div className="esri-widget" id="brightness-filter">
                <div className="brightness" onClick={() => setUpdateBrightness(300)} data-bright='300'>{'> 300'}</div>
                <div className="brightness" data-bright='280' onClick={() => setUpdateBrightness(280)}>{'> 280'}</div>
                <div className="brightness" data-bright='200' onClick={() => setUpdateBrightness(200)}>{'< 200'}</div>
                <div className="control-brightness">
                    <input type="range" min="0" max="400" value={updateBrigntness} onChange={(e) => setUpdateBrightness(Number(e.target.value))}/>
            </div>
            </div> 

            <div id="editorDiv"></div>
        </div>

    )
}

export default ControlPanel;
