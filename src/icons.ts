import { LabIcon } from '@jupyterlab/ui-components';

import extensionSensorMappingSvg from '../style/icons/extensionSensorMapping.svg';
import extensionAxisSvg from '../style/icons/extensionAxis.svg';

export const extensionSensorMappingIcon = new LabIcon({
  name: 'webDS:extension-icon-sensor-mapping',
  svgstr: extensionSensorMappingSvg
});

export const extensionAxisIcon = new LabIcon({
  name: 'webDS:extension-icon-axis',
  svgstr: extensionAxisSvg
});
