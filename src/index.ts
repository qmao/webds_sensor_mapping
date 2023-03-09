import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { SensorMappingWidget } from './widget/SensorMappingWidget'

import { extensionSensorMappingIcon } from './icons';

import { WebDSService, WebDSWidget } from '@webds/service';

namespace Attributes {
  export const command = "webds_sensor_mapping:open";
  export const id = "webds_sensor_mapping_widget";
  export const label = "Sensor Mapping";
  export const caption = "Sensor Mapping";
  export const category = 'Device - Config Library';
  export const rank = 20;
}

export let webdsService: WebDSService;
export let settingRegistry: ISettingRegistry;

/**
 * Initialization data for the reprogram extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/sensor_mapping:plugin',
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer, WebDSService, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService,
    settings: ISettingRegistry) => {
    console.log('JupyterLab extension webds_sensor_mapping is activated!');

	webdsService = service;
	settingRegistry = settings;

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command =  Attributes.command;

    commands.addCommand(command, {
      label: Attributes.label,
      caption: Attributes.caption,
      icon: extensionSensorMappingIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new SensorMappingWidget(Attributes.id);

          widget = new WebDSWidget<SensorMappingWidget>({ content });
          widget.id = Attributes.id;
          widget.title.label = Attributes.label;
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
      category: Attributes.category,
      rank: Attributes.rank
    });

    let tracker = new WidgetTracker<WebDSWidget>({ namespace: Attributes.id });
    restorer.restore(tracker, { command, name: () => Attributes.id });
  }
};

export default plugin;
