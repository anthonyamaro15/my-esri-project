const colorVisVar = {
  type: 'color',
  field: 'BRIGHT_T31',
  valueExpression: null,
  legendOptions: {
    title: 'colors',
  },
  stops: [
    {
      value: 280,
      color: 'red',
      label: '> 280',
    },
    {
      value: 290,
      color: 'blue',
      label: '> 290',
    },
    {
      value: 300,
      color: 'brown',
      label: '> 300',
    },
    {
      value: 320,
      color: 'lightblue',
      label: '> 320',
    },
  ],
};

const sizeVisVar = {
  type: 'size',
  field: 'BRIGHT_T31',
  legendOptions: {
    title: 'sizes by brightness',
  },
  stops: [
    {
      value: 280,
      size: 6,
      label: '> 280',
    },
    {
      value: 290,
      size: 3,
      label: '> 290',
    },
    {
      value: 300,
      size: 10,
      label: '> 300',
    },
    {
      value: 320,
      size: 15,
      label: '> 320',
    },
  ],
};

const renderer = {
  type: 'simple',
  symbol: {
    type: 'simple-marker',
    size: 7,
    color: [255, 128, 9, 0.6],
    outline: {
      width: 0.2,
      color: 'blue',
    },
  },
};

const popUpTemplate = {
  title: 'popup title: {SCAN}',
  content: `<ul>
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
          </ul>`,
};

const popUpTemplateTwo = {
  title: 'popup for testLayer',
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'BRIGHTNESS',
          visible: true,
          label: 'Brightness: ',
        },
        {
          fieldName: 'SCAN',
          visible: true,
          label: 'Scan: ',
        },
        {
          fieldName: 'TRACK',
          visible: true,
          label: 'Track: ',
        },
        {
          fieldName: 'SATELLITE',
          visible: true,
          label: 'Satellite: ',
        },
        {
          fieldName: 'CONFIDENCE',
          visible: true,
          label: 'Confidence: ',
        },
        {
          fieldName: 'VERSION',
          visible: true,
          label: 'Version: ',
        },
        {
          fieldName: 'BRIGHT_T31',
          visible: true,
          label: 'Bright: ',
        },
        {
          fieldName: 'FRP',
          visible: true,
          label: 'FRP: ',
        },
        {
          fieldName: 'ACQ_DATE',
          visible: true,
          label: 'Acq date: ',
        },
        {
          fieldName: 'DAYNIGHT',
          visible: true,
          label: 'Daynight: ',
        },
      ],
    },
  ],
};

const rendererTwo = {
  type: 'simple',
  symbol: {
    type: 'simple-marker',
    size: 7,
    outline: {
      width: 1,
      color: 'pink',
    },
  },
  visualVariables: [colorVisVar, sizeVisVar],
};

export { popUpTemplate, popUpTemplateTwo, renderer, rendererTwo };
