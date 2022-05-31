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
    _settingRegistry: ISettingRegistry | null = null;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(service: WebDSService, settingRegistry?: ISettingRegistry) {
        super();
        this.addClass('jp-webds-widget');
        this._service = service;
        this._settingRegistry = settingRegistry || null;
        console.log("TabPanelUiWidget is created!!!");
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
    }

    render(): JSX.Element {
        return <MainWidget service={this._service} settingRegistry={this._settingRegistry}/>;
    }
}
