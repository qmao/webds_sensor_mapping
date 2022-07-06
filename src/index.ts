import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { ShellWidget } from './wrapper'

import { extensionSensorMappingIcon } from './icons';

import { WebDSService, WebDSWidget } from '@webds/service';


/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const sensor_mapping = 'webds:webds-sensor-mapping';
}

/**
 * Initialization data for the reprogram extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/sensor_mapping:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  activate: async (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService,
    settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension webds_sensor_mapping is activated!');

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = CommandIDs.sensor_mapping;
    const category = 'WebDS - Tuning'
    const extension_string = 'Sensor Mapping';


    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: extensionSensorMappingIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new ShellWidget(service, settingRegistry);

          widget = new WebDSWidget<ShellWidget>({ content });
          widget.id = 'webds_sensor_mapping_widget';
          widget.title.label = extension_string;
          widget.title.closable = true;
          widget.title.icon = extensionSensorMappingIcon;
        }

        if (!tracker.has(widget))
          tracker.add(widget);

        if (!widget.isAttached)
          shell.add(widget, 'main');

        shell.activateById(widget.id);
      }
    });

    // Add launcher
    launcher.add({
      command: command,
      category: category
    });

    let tracker = new WidgetTracker<WebDSWidget>({ namespace: 'webds_sensor_mapping' });
    restorer.restore(tracker, { command, name: () => 'webds_sensor_mapping' });
  }
};

export default plugin;
