const ControlPanel = () => {
    return (
       <div className="esri-widget" id="brightness-filter">
           <div className="brightness" data-bright='300'>{'> 300'}</div>
           <div className="brightness" data-bright='280'>{'> 280'}</div>
           <div className="brightness" data-bright='200'>{'< 200'}</div>
       </div> 
    )
}

export default ControlPanel;
