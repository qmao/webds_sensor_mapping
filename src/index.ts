import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { ShellWidget } from './wrapper'

import { extensionSensorMappingIcon } from './icons';

import { WebDSService } from '@webds/service';


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

	let settings: ISettingRegistry.ISettings | undefined = undefined;

    if (settingRegistry) {
      try {
        settings = await settingRegistry.load(plugin.id);
      } catch (reason) {
        console.log(`Failed to load settings for ${plugin.id}\n${reason}`);
      }
    }

    let widget: MainAreaWidget;
    const { commands, shell } = app;
    const command = CommandIDs.sensor_mapping;
    const category = 'WebDS';
    const extension_string = 'TX/RX Mapping';


    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: extensionSensorMappingIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new ShellWidget(service, settings, settingRegistry);

          widget = new MainAreaWidget<ShellWidget>({ content });
          widget.id = 'sensor_mapping';
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

    let tracker = new WidgetTracker<MainAreaWidget>({ namespace: 'webds_sensor_mapping' });
    restorer.restore(tracker, { command, name: () => 'webds_sensor_mapping' });
  }
};

export default plugin;
