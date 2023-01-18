import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import { SensorMappingComponent } from './SensorMappingComponent';


export class SensorMappingWidget extends ReactWidget {
    _id: string;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(id: string) {
        super();
        this._id = id;
    }

    render(): JSX.Element {
        return (
            <div id={this._id + "_component"}>
                <SensorMappingComponent />
            </div>
        );
    }
}
