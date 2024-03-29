import React, { useEffect, useState, useRef } from "react";

import { Stack, Button } from "@mui/material";

import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { extensionConst } from "./constant";

export default function WidgetControl(props: any) {
    const [activeStep, setActiveStep] = useState(0);
    const stepStatus = useRef<number[]>(Array(extensionConst.steps).fill(0));

    useEffect(() => {
        setActiveStep(props.step);
    }, [props.step]);

    const updateStep = (step: number) => {
        if (step === extensionConst.steps + 1) {
            setActiveStep(0);
            stepStatus.current = Array(extensionConst.steps).fill(0);
            props.updateStep(0);
        } else {
            props.updateStep(step);
            setActiveStep(step);
        }
    };

    const handleNext = () => {
        updateStep(activeStep + 1);
    };

    const handleBack = () => {
        updateStep(activeStep - 1);
    };

    function showStep() {
        return (
            <>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                    >
                        <KeyboardArrowLeft />
            Prev
          </Button>

                    <Button
                        variant="text"
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep >= extensionConst.steps}
                    >
                        Next
            <KeyboardArrowRight />
                    </Button>
                </Stack>
            </>
        );
    }

    return <>{showStep()}</>;
}
