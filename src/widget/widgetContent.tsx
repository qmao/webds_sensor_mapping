import React, { useState, useEffect } from "react";

import { Stack, Divider } from "@mui/material";

import { VerticalStepper } from "./steps";
import WidgetSensor from "./widgetSensor";

export const WidgetContent = (props: any): JSX.Element => {
    const [showAxis, setShowAxis] = useState(false);
    const [xdir, setXdir] = useState<number[]>([]);
    const [ydir, setYdir] = useState<number[]>([]);
    const [initState, setInitState] = useState(false);

    useEffect(() => {
        setShowAxis(props.step > 2 ? true : false);
    }, [props.step]);

    function updateX(x: any) {
        setXdir(x);
    }

    function updateY(y: any) {
        setYdir(y);
    }

    function updateStep(step: any) {
        props.updateStep(step);
    }

    function updateStatus(status: any) {
        props.updateStatus(status);
    }

    function updateInitState(status: any) {
        setInitState(status);
        props.updateInitState(status);
    }

    return (
        <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            sx={{ minHeight: 480 }}
        >
            <Stack sx={{ width: "50%" }}>
                <Stack direction="row" justifyContent="flex-start" alignItems="stretch">
                    <VerticalStepper
                        service={props.service}
                        step={props.step}
                        updateStep={updateStep}
                        updateX={updateX}
                        updateY={updateY}
                        updateStatus={updateStatus}
                        updateInitState={updateInitState}
                    />
                </Stack>
            </Stack>
            {initState && (xdir.length !== 0 || ydir.length !== 0) && (
                <>
                    <Divider orientation="vertical" flexItem />
                    <Stack sx={{ width: "50%", height: "100%", pt: 2 }}>
                        <WidgetSensor xdir={xdir} ydir={ydir} axis={showAxis} />
                    </Stack>
                </>
            )}
        </Stack>
    );
};
