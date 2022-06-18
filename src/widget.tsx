import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material/styles";
import BankingScheme from "./bankingScheme";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
//import ListAltIcon from "@mui/icons-material/ListAlt";
//import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
//import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import {
    Tooltip,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Input,
    Typography,
    IconButton,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    Backdrop
} from "@mui/material";

//import { ISettingRegistry } from "@jupyterlab/settingregistry";
import { requestAPI } from './handler';

interface IMappingInfo {
    status: boolean;
    info: string;
    content: number[];
}

const MAIN_WIDTH = 1000;
//const ITEM_LENGTH_MAX = 20;
const ITEM_LENGTH_MIN = 8;
const ITEM_FONTSIZE = 15;
const ITEM_RADIUS = "5px";
const TX_DEFAULT = [];
const RX_DEFAULT = [];
const zoomIn = true;
const itemLength = ITEM_LENGTH_MIN;
const PANEL_SENSOR_MAX = 350;
const PANEL_HEIGHT_MIN = PANEL_SENSOR_MAX + 20;


export default function MainWidget(props: any) {

    interface IAlertInfo {
        state: boolean;
        message: string;
        severity: 'error' | 'info' | 'success' | 'warning'
    }

    const [xdir, setXdir] = useState<number[]>(TX_DEFAULT);
    const [ydir, setYdir] = useState<number[]>(RX_DEFAULT);

    const [xTrx, setXTrx] = useState("");

    const [txMappingBase, setTxMappingBase] = useState("");
    const [rxMappingBase, setRxMappingBase] = useState("");

    const [txError, setTxError] = useState(false);
    const [rxError, setRxError] = useState(false);
    const [txCountError, setTxCountError] = useState(false);
    const [rxCountError, setRxCountError] = useState(false);
    const [configFileError, setConfigFileError] = useState(false);

    const [txErrorInfo, setTxErrorInfo] = useState("");
    const [rxErrorInfo, setRxErrorInfo] = useState("");

    const [expanded, setExpanded] = useState(true);
    const [isReady, setReady] = useState(false);
    const [isProcessing, setProcessing] = useState(true);
    const [openAlert, setOpenAlert] = useState<IAlertInfo>({ state: false, message: "", severity: 'info' });

    const [txCount, setTxCount] = useState("0");
    const [rxCount, setRxCount] = useState("0");

    const txCountRef = useRef(0);
    const rxCountRef = useRef(0);

    const txDefaultList = useRef([...Array(100).keys()]);
    const rxDefaultList = useRef([...Array(100).keys()]);
    const txDim = useRef(0);
    const rxDim = useRef(0);
    const txDir = useRef<number[]>([]);
    const rxDir = useRef<number[]>([]);
    const xTrxRef = useRef("");

    const Get = async (): Promise<string | undefined> => {
        try {
            let url = "config?type=static";

            const reply = await requestAPI<any>(url, {
                method: "GET"
            });

            //console.log(reply);
            return Promise.resolve(JSON.stringify(reply));
        } catch (e) {
            console.error(`Error on POST.\n${e}`);
            return Promise.reject((e as Error).message);
        }
    };

    const WriteToRAM = async (): Promise<string | undefined> => {
        var dataToSend = {
            txCount: txCount,
            rxCount: rxCount,
            imageRxes: xdir,
            imageTxes: ydir,
            numColumns: txCount,
            numRows: rxCount
        };

        try {
            const reply = await requestAPI<any>("config", {
                body: JSON.stringify(dataToSend),
                method: "POST"
            });
            console.log(reply);
            return Promise.resolve(JSON.stringify(reply));
        } catch (e) {
            console.error(`Error on POST ${dataToSend}.\n${e}`);
            return Promise.reject((e as Error).message);
        }
    };

    const WriteToFlash = async (): Promise<string | undefined> => {
        try {
            var dataToSend = {
                command: "commitConfig"
            };
            const reply = await requestAPI<any>("command", {
                body: JSON.stringify(dataToSend),
                method: "POST"
            });

            return Promise.resolve(JSON.stringify(reply));
        } catch (e) {
            console.error(`Error on POST ${dataToSend}.\n${e}`);
            return Promise.reject((e as Error).message);
        }
    };

    const CheckMappingCount = (user: number[], userCount: number) => {
        var ret = {} as IMappingInfo;
        var count = userCount;
        if (user.length !== count) {
            ret.info = "count " + user.length + " not match " + count;
            ret.status = true;
        }
        return ret;
    };

    const CheckMappingRule = (
        user: number[],
        defaultMapping: number[],
        userCount: number
    ) => {
        var ret = {} as IMappingInfo;
        var singleCheck = [];
        ret.status = false;
        ret.info = "";
        ret.content = user;
        var BreakException = {};

        try {
            user.forEach((value) => {
                if (!defaultMapping.includes(value)) {
                    ret.info = "Invalid " + value.toString();
                    ret.status = true;
                    throw BreakException;
                }

                if (singleCheck.includes(value)) {
                    ret.info = "mutilple " + value.toString();
                    ret.status = true;
                    throw BreakException;
                }
                singleCheck.push(value);
            });
        } catch (e) {
            return ret;
        }

        if (user.length > defaultMapping.length) {
            ret.info = user.length + " over dim" + defaultMapping.length;
            ret.status = true;
            return ret;
        }

        ret = CheckMappingCount(user, userCount);

        return ret;
    };

    const checkInputMappingIsValid = (mapping: string) => {
        var ret = {} as IMappingInfo;
        ret.status = false;
        ret.info = "";

        var user = [];
        if (mapping.length !== 0) {
            try {
                user = mapping.split(",").map(function (item) {
                    return parseInt(item, 10);
                });
            } catch (error) {
                ret.status = true;
                ret.info = mapping + " parse failed";
            }
        }

        //const found = user.includes(NaN);
        let index = user.findIndex(Number.isNaN);

        if (index !== -1) {
            ret.status = true;
            ret.info = "Invalid value at index " + index;
        }
        ret.content = user;
        return ret;
    };

    const CheckMapping = (
        mapping: string,
        defaultList: number[],
        userCount: number
    ) => {
        var ret = {} as IMappingInfo;
        ret.status = false;
        ret.info = "";

        var user = [];

        ret = checkInputMappingIsValid(mapping);
        if (ret.status === true) {
            return ret;
        }
        user = ret.content;

        ret = CheckMappingRule(user, defaultList, userCount);
        return ret;
    };

    const updateTxDir = (data: number[]) => {
        txDir.current = data;
        if (xTrxRef.current === "TX") {
            setXdir(data);
        } else if (xTrxRef.current === "RX") {
            setYdir(data);
        }
    }

    const updateRxDir = (data: number[]) => {
        rxDir.current = data;
        if (xTrxRef.current === "TX") {
            setYdir(data);
        } else if (xTrxRef.current === "RX") {
            setXdir(data);
        }
    }

    const updatexTrxRef = (data: string) => {
        xTrxRef.current = data;
        setXTrx(data);
        if (data === "TX") {
            setYdir(rxDir.current);
            setXdir(txDir.current);
        } else if (data === "RX") {
            setXdir(rxDir.current);
            setYdir(txDir.current);
        }
    }

    const initialize = async () => {
        props.service.packrat.cache.addPrivateConfig()
            .then((ret) => {
                console.log(ret);
                setConfigFileError(false);
            })
            .then(() => Get())
            .then((ret) => {
                let config = JSON.parse(ret);
                var txlen = config["txCount"];
                var rxlen = config["rxCount"];
                var tx = config["imageTxes"];
                var rx = config["imageRxes"];

                updatexTrxRef(config["txAxis"] ? "TX" : "RX");

                updateTxCount(txlen.toString());
                updateRxCount(rxlen.toString());

                txDim.current = tx.length;
                rxDim.current = rx.length;

                updateTxMapping(tx.slice(0, txlen).toString());
                updateRxMapping(rx.slice(0, rxlen).toString());

                setReady(true);
                console.log(txDim.current, rxDim.current);
            })
            .catch(err => {
                console.log(err);
                setOpenAlert({ state: true, severity: 'error', message: err.toString() });
                setConfigFileError(true);
                return;
            })
            .finally(() =>
                setProcessing(false)
            )
    }

    useEffect(() => {
        initialize();
    }, []);

    const handleApplyBankingScheme = (commit: boolean) => {
        /*
        var settingRegistry: ISettingRegistry = props.settingRegistry;
        async function set() {
            if (settingRegistry) {
                try {
                    var id = "@webds/sensor_mapping:plugin";
                    await settingRegistry.set(id, "bankingScheme", bankingScheme);
                } catch (reason) {
                    console.log(`Failed to set settings for ${id}\n${reason}`);
                }
            }
        }
        set();
        */

        WriteToRAM()
            .then((ret) => {
                if (commit)
                    return WriteToFlash();
                else
                    return ret;
            }).then((ret) => {
                console.log(ret);
                setOpenAlert({ state: true, severity: 'success', message: "Success" });
            })
            .catch((e) => setOpenAlert({ state: true, severity: 'error', message: e.toString() }));
    };

    const updateTxCount = (data: string) => {
        setTxCount(data);
        let num = parseInt(data, 10);
        if (isNaN(num) || isNaN(Number(data)) || num < 0) {
            setTxCountError(true);
            txCountRef.current = -1;
        } else {
            setTxCountError(false);
            txCountRef.current = num;
        }
    }

    const updateRxCount = (data: string) => {
        setRxCount(data);
        let num = parseInt(data, 10);
        if (isNaN(num) || isNaN(Number(data)) || num < 0) {
            setRxCountError(true);
            rxCountRef.current = -1;
        } else {
            setRxCountError(false);
            rxCountRef.current = num;
        }
    }

    const updateTxDefaultList = (data: number[]) => {
        txDefaultList.current = data;
        updateTxCount(data.length.toString());
        updateTxMapping(data.toString());
    }

    const updateRxDefaultList = (data: number[]) => {
        rxDefaultList.current = data;
        updateRxCount(data.length.toString());
        updateRxMapping(data.toString());
    }

    const updateTxMapping = (mapping: string) => {
        setTxMappingBase(mapping);

        var ret = checkInputMappingIsValid(mapping);
        updateTxDir(ret.content);

        ret = CheckMapping(mapping, txDefaultList.current, txCountRef.current);
        setTxError(ret.status);
        setTxErrorInfo(ret.info);
    }

    const updateRxMapping = (mapping: string) => {
        setRxMappingBase(mapping);

        var ret = checkInputMappingIsValid(mapping);
        updateRxDir(ret.content);

        ret = CheckMapping(mapping, rxDefaultList.current, rxCountRef.current);
        setRxError(ret.status);
        setRxErrorInfo(ret.info);
    }

    const handleTxCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTxCount(event.target.value);
    };

    const handleTxCountBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        updateTxCount(event.target.value);

        var ret = CheckMappingCount(txDir.current, txCountRef.current);
        setTxError(ret.status);
        setTxErrorInfo(ret.info);
    };

    const handleRxCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRxCount(event.target.value);
    };

    const handleRxCountBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        updateRxCount(event.target.value);
        var ret = CheckMappingCount(rxDir.current, rxCountRef.current);
        setRxError(ret.status);
        setRxErrorInfo(ret.info);
    };

    const handleTxMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTxMappingBase(event.target.value);
    };

    const handleTxMappingBlur = () => {
        updateTxMapping(txMappingBase);
    };

    const handleRxMappingBlur = () => {
        updateRxMapping(rxMappingBase);
    };

    const handleRxMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRxMappingBase(event.target.value);
    };

    const handleAxesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updatexTrxRef(event.target.value);
    };

    const handlePanelTrxChangeBlur = (direction: string) => {
        var user = [];
        if (direction === "y") {
            user = ydir;
        } else {
            user = xdir;
        }

        if (
            (xTrxRef.current === "TX" && direction === "x") ||
            (xTrxRef.current !== "TX" && direction === "y")
        ) {
            updateTxMapping(user.toString());
        } else {
            updateRxMapping(user.toString());
        }
    };

    const handlePanelTrxChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
        direction: string
    ) => {
        var newValue = event.target.value;

        var user = [];
        if (direction === "y") {
            user = [...ydir];
            user[index] = newValue;
            setYdir(user);
        } else {
            user = [...xdir];
            user[index] = newValue;
            setXdir(user);
        }
    };

    /*
    const handleZoomState = () => {
      if (zoomIn) {
        setItemLength(ITEM_LENGTH_MAX);
      } else {
        setItemLength(ITEM_LENGTH_MIN);
      }
      setZoomIn(!zoomIn);
    };
    */

    const handleSelectBankingScheme = (select: any, config: any) => {
        var tx_table: number[] = [];
        var rx_table: number[] = [];
        if (select === 0) {
            updateTxDefaultList([...Array(100).keys()]);
            updateRxDefaultList([...Array(100).keys()]);
            return;
        }
        var trx_list = config[select]["list"];

        trx_list.forEach((value, index) => {
            var ret = value.split(/\[|\]|:/);
            var name = ret[0];
            var range1 = parseInt(ret[1], 10);
            var range2 = parseInt(ret[2], 10);
            var len = range1 - range2 + 1;
            var nlist: number[] = Array.from({ length: len }, (_, i) => i + range2);

            if (name === "Tx") {
                tx_table = tx_table.concat(nlist);
            } else if (name === "Rx") {
                rx_table = rx_table.concat(nlist);
            }
        });

        updateTxDefaultList(tx_table);
        updateRxDefaultList(rx_table);
    };

    const handleAccordionExpend = () => {
        setExpanded(!expanded);
    };

    function displayTxRxMapping() {
        return (
            <Stack spacing={3}>
                <TextField
                    id="standard-textarea"
                    label="Tx Mapping"
                    multiline
                    variant="standard"
                    value={txMappingBase}
                    onChange={handleTxMapping}
                    onBlur={handleTxMappingBlur}
                    error={txError}
                    helperText={txErrorInfo}
                />

                <TextField
                    id="standard-textarea"
                    label="Rx Mapping"
                    multiline
                    variant="standard"
                    value={rxMappingBase}
                    onChange={handleRxMapping}
                    onBlur={handleRxMappingBlur}
                    error={rxError}
                    helperText={rxErrorInfo}
                />
            </Stack>
        );
    }

    function displayAxisSelect() {
        return (
            <FormControl>
                <FormLabel id="radio-buttons-group-label">
                    Physical to Logical Axes
        </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={xTrx}
                    onChange={handleAxesChange}
                >
                    <FormControlLabel
                        value={"TX"}
                        control={<Radio />}
                        label="Tx on X-axis"
                    />
                    <FormControlLabel
                        value={"RX"}
                        control={<Radio />}
                        label="Rx on X-axis"
                    />
                </RadioGroup>
            </FormControl>
        );
    }

    function showAxisIcon(direction: string) {
        return (
            <IconButton disabled={true}>
                <Stack justifyContent="center" sx={{ width: 18, height: 18 }}>
                    <Typography variant="overline" color="primary" sx={{ fontSize: 18 }}>
                        {direction}
                    </Typography>
                </Stack>
            </IconButton>
        );
    }
    function displayPanel() {
        return (
            <Paper elevation={8}>
            <Stack
                justifyContent="space-between"
                sx={{
                    bgcolor: "black",
                    border: "2px solid grey",
                    width:
                        xdir.length > ydir.length
                            ? PANEL_SENSOR_MAX
                            : (PANEL_SENSOR_MAX * xdir.length) / ydir.length, //itemLength * xdir.length - 4,
                    height:
                        xdir.length <= ydir.length
                            ? PANEL_SENSOR_MAX
                            : (PANEL_SENSOR_MAX * ydir.length) / xdir.length //itemLength * ydir.length - 4
                }}
            >
                <Stack direction="row" justifyContent="space-between">
                    {ydir.length > 0 && (
                        <Stack alignItems="center">
                            {showAxisIcon("Y")}
                            <ArrowForwardIosIcon
                                color="primary"
                                sx={{
                                    transform: "rotate(270deg)"
                                }}
                            />
                        </Stack>
                    )}
                </Stack>

                {xdir.length > 0 && (
                    <Stack alignItems="flex-end">
                        <Stack direction="row" alignItems="center">
                            <ArrowForwardIosIcon color="primary" />
                            {showAxisIcon("X")}
                        </Stack>
                    </Stack>
                )}
                </Stack>
                </Paper>
        );
    }

    function displayTxRxSettings() {
        return <Stack>{displayAxisSelect()}</Stack>;
    }

    function displayApplyCommitButtons() {
        return (
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={6}
            >
                <Button
                    onClick={() => handleApplyBankingScheme(true)}
                    disabled={configFileError}
                    sx={{ width: 150 }}
                >
                    Write To Flash
        </Button>
                <Button
                    onClick={() => handleApplyBankingScheme(false)}
                    disabled={configFileError}
                    sx={{ width: 150 }}
                >
                    Write To RAM
        </Button>
            </Stack>
        );
    }

    function displaySensorSettings() {
        return (
            <Stack direction="row" spacing={2} sx={{ pb: 1 }}>
                {displayTxRxSettings()}
            </Stack>
        );
    }

    function getItemString(value: string) {
        let num = parseInt(value, 10);
        if (isNaN(num) || isNaN(Number(value))) {
            return "";
        }
        return num;
    }

    function displayPanelWithXY() {
        return (
            <Stack spacing={3} sx={{ minWidth: PANEL_SENSOR_MAX }}>
                {displaySensorSettings()}
                <Stack sx={{ minHeight: PANEL_HEIGHT_MIN }}>
                    <Stack direction="row">
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: "column-reverse"
                            }}
                        >
                            {!zoomIn &&
                                ydir.map((elevation, index) => (
                                    <Tooltip title={`Y${index}`} placement="right">
                                        <Input
                                            inputProps={{ style: { textAlign: "center" } }}
                                            key={`panel-input-y-${index}`}
                                            value={getItemString(elevation.toString())}
                                            onChange={(e) => handlePanelTrxChange(e, index, "y")}
                                            onBlur={() => handlePanelTrxChangeBlur("y")}
                                            sx={{
                                                fontSize: ITEM_FONTSIZE,
                                                height: itemLength,
                                                width: itemLength,
                                                border: "1px solid grey",
                                                borderRadius: ITEM_RADIUS
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                        </Box>

                        {displayPanel()}
                    </Stack>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap"
                        }}
                    >
                        {!zoomIn &&
                            xdir.map((elevation, index) => (
                                <Tooltip title={`X${index}`} placement="top">
                                    <Input
                                        inputProps={{ style: { textAlign: "center" } }}
                                        key={`panel-input-x-${index}`}
                                        value={getItemString(elevation.toString())}
                                        onChange={(e) => handlePanelTrxChange(e, index, "x")}
                                        onBlur={() => handlePanelTrxChangeBlur("x")}
                                        sx={{
                                            fontSize: ITEM_FONTSIZE,
                                            height: itemLength,
                                            width: itemLength,
                                            border: "1px solid grey",
                                            borderRadius: ITEM_RADIUS
                                        }}
                                    />
                                </Tooltip>
                            ))}
                    </Box>
                </Stack>
                <Divider />
                {displayApplyCommitButtons()}
            </Stack>
        );
    }

    function displayTxRxCount() {
        return (
            <Stack spacing={5} justifyContent="flex-start" direction="row">
                <TextField
                    label="Number Tx"
                    id="standard-size-txcount"
                    variant="standard"
                    value={txCount}
                    error={txCountError}
                    onChange={handleTxCount}
                    onBlur={handleTxCountBlur}
                    sx={{ width: "15ch" }}
                    InputProps={{
                        readOnly: false
                    }}
                />
                <TextField
                    label="Number Rx"
                    id="standard-size-rxcount"
                    variant="standard"
                    error={rxCountError}
                    value={rxCount}
                    onChange={handleRxCount}
                    onBlur={handleRxCountBlur}
                    sx={{ width: "15ch" }}
                    InputProps={{
                        readOnly: false
                    }}
                />
            </Stack>
        );
    }

    function disaplyBankingScheme() {
        return (
            <div>
                <Paper variant="outlined" square>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ ml: 2, mr: 2, mt: 1 }}
                    >
                        <Typography sx={{ width: "33%", flexShrink: 0 }}>
                            Banking Scheme
            </Typography>
                        <IconButton color="primary" onClick={() => handleAccordionExpend()}>
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Stack>
                    <BankingScheme
                        expanded={expanded}
                        onSelect={handleSelectBankingScheme}
                    />
                </Paper>
            </div>
        );
    }

    const handleCloseAlert = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert({...openAlert, state: false});
    };

    function displayAlert() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right' }}
                open={openAlert.state} autoHideDuration={3000} onClose={handleCloseAlert}>
                <Alert
                    onClose={handleCloseAlert}
                    severity={openAlert.severity}
                    sx={{ width: "100%" }}
                >
                    {openAlert.message}
          </Alert>
            </Snackbar>
        );
    }
    /*
    function displayConfigMinimize() {
      return (
        <Box>
          <IconButton color="primary" onClick={handleConfigExpand} sx={{ mt: 1 }}>
            {configExpand ? (
              <ExpandLessIcon
                color="primary"
                sx={{
                  transform: "rotate(270deg)"
                }}
              />
            ) : (
              <ExpandMoreIcon
                color="primary"
                sx={{
                  transform: "rotate(270deg)"
                }}
              />
            )}
          </IconButton>
        </Box>
      );
    }
    */
    const webdsTheme = props.service.ui.getWebDSTheme();

    return (
        <ThemeProvider theme={webdsTheme}>
            <div className="jp-webds-widget-body">
                <Box sx={{ width: MAIN_WIDTH }}>
                    <Typography variant="h5" sx={{ height: "50px", textAlign: "center" }}>
                        Sensor Mapping
          </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    <Stack direction="column" spacing={6} sx={{ ml: 3, pr: 6 }}>
                        {disaplyBankingScheme()}
                        {isReady && displayTxRxCount()}
                        {isReady && displayTxRxMapping()}
                    </Stack>
                    {isReady && displayPanelWithXY()}
                </Stack>
                {displayAlert()}

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isProcessing}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </ThemeProvider>
    );
}
