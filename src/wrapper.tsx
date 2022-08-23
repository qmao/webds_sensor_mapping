import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import { WebDSService } from '@webds/service';
import MainWidget from './widget';
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
        this.addClass('jp-webds-widget');
        this._service = service;
        this._settingRegistry = settingRegistry || null;
    }

    render(): JSX.Element {
        return (
            <div id={this._id + "_container"} className="jp-webds-widget-container">
                <div id={this._id + "_content"} className="jp-webds-widget">
                    <MainWidget service={this._service} settingRegistry={this._settingRegistry} />
                </div>
            </div>
        );
    }
}
