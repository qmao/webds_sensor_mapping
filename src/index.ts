import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { SensorMappingWidget } from './wrapper'

import { extensionSensorMappingIcon } from './icons';

import { WebDSService, WebDSWidget } from '@webds/service';

namespace Attributes {
  export const command = "webds_sensor_mapping:open";
  export const id = "webds_sensor_mapping_widget";
  export const label = "Sensor Mapping";
  export const caption = "Sensor Mapping";
  export const category = 'Touch - Config Library';
  export const rank = 30;
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
    const command =  Attributes.command;

    commands.addCommand(command, {
      label: Attributes.label,
      caption: Attributes.caption,
      icon: extensionSensorMappingIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new SensorMappingWidget(Attributes.id, service, settingRegistry);

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

        widget.setShadows();
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
