import React, { useState } from "react";

import {
  CircularProgress
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import { WidgetContent } from "./widgetContent";
import WidgetControl from "./widgetControl";

import { Canvas } from "./mui_extensions/Canvas";
import { Content } from "./mui_extensions/Content";
import { Controls } from "./mui_extensions/Controls";

export const SensorMappingComponent = (props: any): JSX.Element => {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState(false);
  const [initState, setInitState] = useState(false);

  function updateStep(step: number) {
    setStep(step);
  }

  function updateStatus(status: boolean) {
    setStatus(status);
  }

  function updateInitState(status: boolean) {
    setInitState(status);
  }

  function ShowContent() {
    return (
      <>
        <WidgetContent
          service={props.service}
          step={step}
          updateStep={updateStep}
          updateStatus={updateStatus}
		  updateInitState={updateInitState}
        />
      </>
    );
  }

  function ShowControl() {
    return (
      <>
        <WidgetControl step={step} updateStep={updateStep} status={status} />
      </>
    );
  }

  function showAll() {
    return (
        <Canvas title="Sensor Mapping">
            <Content>
              {ShowContent()}
		      { !initState &&
			    <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <CircularProgress color="primary" />
			    </div>
              }
            </Content>
            <Controls
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                { initState && ShowControl() }
            </Controls>
        </Canvas>
    );
  }

  const webdsTheme = props.service.ui.getWebDSTheme();

  return (
    <div className="jp-webds-widget-body">
      <ThemeProvider theme={webdsTheme}>
		{ showAll() }
      </ThemeProvider>
    </div>
  );
}

