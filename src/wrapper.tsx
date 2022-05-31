import { ReactWidget } from '@jupyterlab/apputils';
import React  from 'react';


import { WebDSService } from '@webds/service';
import MainWidget from './widget';
import { ISettingRegistry } from '@jupyterlab/settingregistry';


/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ShellWidget extends ReactWidget {
    _service: WebDSService;
    _settings: ISettingRegistry.ISettings | null = null;
    _settingsRegistry: ISettingRegistry | null = null;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(service: WebDSService, settings?: ISettingRegistry.ISettings, settingsRegistry?: ISettingRegistry) {
        super();
        this.addClass('jp-webds-widget');
        this._service = service;
        this._settings = settings || null;
        this._settingsRegistry = settingsRegistry || null;
        console.log("TabPanelUiWidget is created!!!");
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
    }

    render(): JSX.Element {
        return <MainWidget service={this._service} settings={this._settings} settingsRegistry={this._settingsRegistry}/>;
    }
}
