import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import { WebDSService } from '@webds/service';
import { SensorMappingComponent } from './SensorMappingComponent';
import { ISettingRegistry } from '@jupyterlab/settingregistry';


export class SensorMappingWidget extends ReactWidget {
    _id: string;
    _service: WebDSService;
    _settingRegistry: ISettingRegistry | null = null;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(id: string, service: WebDSService, settingRegistry?: ISettingRegistry) {
        super();
        this._id = id;
        this._service = service;
        this._settingRegistry = settingRegistry || null;
    }

    render(): JSX.Element {
        return (
            <div id={this._id + "_component"}>
                <SensorMappingComponent service={this._service} settingRegistry={this._settingRegistry} />
            </div>
        );
    }
}
