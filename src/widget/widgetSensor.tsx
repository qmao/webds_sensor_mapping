import React, { useEffect, useState } from "react";

import { Stack, Typography, Box, Divider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const PANEL_SENSOR_MAX = 400;
const PANEL_HEIGHT_MIN = PANEL_SENSOR_MAX + 20;
const SENSOR_INFO_TEXT_PARAM = {
    fontWeight: "bold",
    fontSize: 13
};

/*
const MyPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": { background: "transparent" },
  "& .MuiPaper-rounded": { background: "transparent" },
  "& .MuiPaper-elevation": { background: "transparent" }
}));
*/

interface SensorParam {
    size: number[];
    xdir: number[];
    ydir: number[];
    axis: boolean;
    disabled?: boolean;
}

interface ISensorPoint {
    state: boolean;
    x: number;
    y: number;
    xNumber: number;
    yNumber: number;
}

export default function WidgetSensor(props: SensorParam) {
    const [ready, setReady] = useState(false);
    const [xLength, setXLength] = useState(0);
    const [yLength, setYLength] = useState(0);
    const [xGap, setXGap] = useState(0);
    const [yGap, setYGap] = useState(0);
    const [xdir, setXdir] = useState([]);
    const [ydir, setYdir] = useState([]);
    const [sensorPoint, setSensorPoint] = useState<ISensorPoint>({
        state: false,
        x: -1,
        y: -1,
        xNumber: -1,
        yNumber: -1
    });

    function updateSensorParam(x: any, y: any) {
        let xlen = 0;
        let ylen = 0;

        let xcount = x.length;
        let ycount = y.length;

        if (props.disabled) {
            xcount = props.size[0];
            ycount = props.size[1];
        }

        if (xcount > ycount) {
            xlen = PANEL_SENSOR_MAX;
            ylen = (PANEL_SENSOR_MAX * ycount) / xcount;
        } else {
            xlen = (PANEL_SENSOR_MAX * xcount) / ycount;
            ylen = PANEL_SENSOR_MAX;
        }
        setXLength(xlen);
        setYLength(ylen);

        let ny: any = [...y].reverse();
        setXdir(x);
        setYdir(ny);

        if (ycount !== 0) {
            let count = ycount === 1 ? 1 : ycount;
            setYGap(ylen / count);
        } else {
            setYdir([]);
        }
        if (xcount !== 0) {
            let count = xcount === 1 ? 1 : xcount;
            setXGap(xlen / count);
        } else {
            setXdir([]);
        }
    }

    useEffect(() => {
        updateSensorParam(props.xdir, props.ydir);
    }, [props.xdir, props.ydir, props.size]);

    useEffect(() => {
        updateSensorParam(props.xdir, props.ydir);
        setReady(true);
    }, []);

    function hover(
        event: any,
        x: number,
        y: number,
        xNumber: number,
        yNumber: number,
        state: boolean
    ) {
        if (state) {
            setSensorPoint({
                state: state,
                x: x,
                y: y,
                xNumber: xNumber,
                yNumber: yNumber
            });
        } else {
            setSensorPoint({
                state: state,
                x: -1,
                y: -1,
                xNumber: -1,
                yNumber: -1
            });
        }
    }

    function showPixelInfo() {
        let indexStyle = { transform: "scale(0.7)" };
        let numberParam = SENSOR_INFO_TEXT_PARAM;

        return (
            <Stack
                justifyContent="space-between"
                sx={{
                    width: 0,
                    height: 0,
                    position: "relative",
                    display: "inline-flex"
                }}
            >
                {sensorPoint.xNumber >= 0 && (
                    <>
                        <Stack
                            direction="column"
                            justifyContent="flex-start"
                            sx={{
                                width: xGap,
                                height: xGap,
                                top: 0,
                                left: sensorPoint.x * xGap,
                                display: "flex",
                                alignItems: "center",
                                position: "absolute"
                            }}
                        >
                            <Typography variant="overline" sx={numberParam}>
                                {sensorPoint.xNumber}
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                fontSize: 12,
                                width: xGap,
                                height: yGap,
                                top: -yGap,
                                left: sensorPoint.x * xGap,
                                display: "flex",
                                alignItems: "center",
                                position: "absolute",
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                align="center"
                                variant="overline"
                                color="black"
                                style={indexStyle}
                            >
                                {sensorPoint.x}
                            </Typography>
                        </Stack>
                    </>
                )}

                {sensorPoint.yNumber >= 0 && (
                    <>
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            sx={{
                                width: yGap,
                                height: yGap,
                                top: sensorPoint.y * yGap - yLength,
                                left: -20,
                                display: "flex",
                                alignItems: "center",
                                position: "absolute"
                            }}
                        >
                            <Typography variant="overline" sx={numberParam}>
                                {sensorPoint.yNumber}
                            </Typography>
                        </Stack>

                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                width: xGap,
                                height: yGap,
                                top: sensorPoint.y * yGap - yLength + 1,
                                left: 0,
                                display: "flex",
                                alignItems: "center",
                                position: "absolute",
                                fontSize: 12,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                align="center"
                                variant="overline"
                                color="black"
                                style={indexStyle}
                            >
                                {ydir.length - sensorPoint.y - 1}
                            </Typography>
                        </Stack>
                    </>
                )}
            </Stack>
        );
    }

    function showSensorLength() {
        return (
            <Stack
                justifyContent="space-between"
                sx={{
                    width: 0,
                    height: 0,
                    position: "relative",
                    display: "inline-flex"
                }}
            >
                <Stack
                    sx={{
                        top: -30,
                        left: 0,
                        position: "absolute"
                    }}
                >
                    <Divider sx={{ width: xLength }}>
                        <Typography sx={{ fontSize: 13 }}>
                            {props.disabled ? props.size[0] : xdir.length}
                        </Typography>
                    </Divider>
                </Stack>

                <Stack
                    sx={{
                        top: 0,
                        left: xLength + 6,
                        position: "absolute"
                    }}
                >
                    <Divider
                        orientation="vertical"
                        flexItem
                        style={{ height: yLength, fontSize: 12 }}
                    >
                        <Typography sx={{ fontSize: 13 }}>
                            {props.disabled ? props.size[1] : ydir.length}
                        </Typography>
                    </Divider>
                </Stack>
            </Stack>
        );
    }

    function displayPointLine() {
        return (
            <>
                {sensorPoint.state === true && (
                    <Stack
                        sx={{
                            top: sensorPoint.y * yGap,
                            left: 0,
                            position: "absolute",
                            width: xLength,
                            height: yGap,
                            backgroundColor: "white",
                            opacity: "0.6"
                        }}
                    />
                )}
                {sensorPoint.state === true && (
                    <Stack
                        sx={{
                            top: 0,
                            left: sensorPoint.x * xGap,
                            width: xGap,
                            height: yLength,
                            position: "absolute",
                            backgroundColor: "white",
                            opacity: "0.6"
                        }}
                    />
                )}
            </>
        );
    }

    function displayPoints() {
        return (
            <Stack
                justifyContent="space-between"
                sx={{
                    width: 0,
                    height: 0,
                    position: "relative",
                    display: "inline-flex"
                }}
            >
                {xdir.map((xElement, xindex) =>
                    ydir.map((yElement, yindex) => (
                        <Box
                            key={`sensor-box-${xindex}-${yindex}`}
                            sx={{
                                top: yindex * yGap - yLength,
                                left: xindex * xGap,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                width: xGap,
                                height: yGap
                            }}
                            onMouseEnter={(e) =>
                                hover(e, xindex, yindex, xElement, yElement, true)
                            }
                            onMouseLeave={(e) =>
                                hover(e, xindex, yindex, xElement, yElement, false)
                            }
                        ></Box>
                    ))
                )}
            </Stack>
        );
    }

    function displayAxis() {
        return (
            <Stack
                sx={{
                    width: 0,
                    height: 0,
                    position: "relative"
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        width: xLength,
                        mt: 4
                    }}
                >
                    <Stack justifyContent="center" alignItems="center" sx={{ m: 1 }}>
                        <Typography sx={{ color: "text.secondary" }}>x</Typography>
                    </Stack>
                    <Divider
                        sx={{
                            width: xLength - 24
                        }}
                        style={{ fontSize: 12 }}
                    ></Divider>
                    <PlayArrowIcon
                        style={{
                            width: "16px",
                            height: "16px",
                            marginRight: -4
                        }}
                        sx={{
                            position: "absolute",
                            right: 0,
                            color: "text.secondary"
                        }}
                    />
                </Stack>
            </Stack>
        );
    }

    function displayPanel() {
        let borderParam = props.disabled ? "2px solid red" : 0;
        return (
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={1}>
                    <Stack
                        justifyContent="space-between"
                        sx={{
                            bgcolor: "black",
                            border: borderParam,
                            width: xLength,
                            height: yLength,
                            position: "relative",
                            display: "inline-flex",
                            overflow: "hidden"
                        }}
                        style={{
                            borderRadius: 15
                        }}
                    >
                        {displayPointLine()}
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ height: PANEL_HEIGHT_MIN }}
        >
            {ready && (
                <Stack direction="column">
                    {showSensorLength()}
                    {displayPanel()}
                    {!props.disabled && showPixelInfo()}
                    {!props.disabled && displayPoints()}
                    {!props.disabled && props.axis && displayAxis()}
                </Stack>
            )}
        </Stack>
    );
}
