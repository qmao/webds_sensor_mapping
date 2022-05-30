import { ReactWidget } from '@jupyterlab/apputils';
import React  from 'react';


import { WebDSService } from '@webds/service';
import  MainWidget  from './widget';


/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ShellWidget extends ReactWidget {
    service: WebDSService;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(service: WebDSService) {
        super();
        this.addClass('jp-webds-widget');
        this.service = service
        console.log("TabPanelUiWidget is created!!!");
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
    }

    render(): JSX.Element {
        return <MainWidget/>;
    }
}
