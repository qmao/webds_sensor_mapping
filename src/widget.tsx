import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import {
    Button,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Slider,
    SvgIcon,
    TextField,
    IconButton
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
///import { extensionAxisIcon } from './icons';
import { Axis } from "./axis";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from '@mui/icons-material/Add';
import { ISettingRegistry } from '@jupyterlab/settingregistry';


const LENGTH = 18;
const LENGTHPX = "18px";
const LENGTHPXMAX = "20px";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: LENGTH,
    lineHeight: LENGTHPX
}));

const DEFAULT_RANGE_MIN = 20;
const DEFAULT_RANGE_MAX = 40;


const XDEFAULT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const YDEFAULT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function MainWidget(props: any) {
    const [xdir, setXdir] = useState<number[]>(XDEFAULT);
    const [ydir, setYdir] = useState<number[]>(YDEFAULT);

    const [max, setMax] = useState(60);
    const [txCount, setTxCount] = useState("20");
    const [rxCount, setRxCount] = useState("40");
    const [rangeFull, setRangeFull] = useState(false);

    const [openNewBankingScheme, setOpenNewBankingScheme] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);

    const [name, setName] = React.useState("");
    const [isTxAxis, setTxAxis] = React.useState(true);

    const [range, setRange] = React.useState<number[]>([
        DEFAULT_RANGE_MIN,
        DEFAULT_RANGE_MAX
    ]);
    const [usedRange, setUsedRange] = useState([]);
    const [bankingScheme, setBankingScheme] = useState([]);
    const [singleScheme, setSingleScheme] = useState([]);
    const [schemeErr, setSchemeErr] = useState(true);

    useEffect(() => {
        var settingRegistry: ISettingRegistry = props.settingsRegistry;
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(settingRegistry);

        async function load() {
            if (settingRegistry) {
                try {
                    var id = '@webds/sensor_mapping:plugin';
                    var settings = await settingRegistry.load(id);

                    if (settings != null) {
                        var bsSettings = props.settings.composite['bankingScheme'];
                        setBankingScheme(bsSettings);
                    }

                } catch (reason) {
                    console.log(`Failed to load settings for ${id}\n${reason}`);
                }
            }
        }

        load();
    }, []);

    useEffect(() => {
        let num = parseInt(txCount, 10);
        if (isNaN(num) || isNaN(Number(txCount))) {
            //setAddrError(true);
        } else {
            if (num < 0) setTxCount("20");
            //setAddrError(false);
        }
    }, [txCount]);

    useEffect(() => {
        let num = parseInt(rxCount, 10);
        if (isNaN(num) || isNaN(Number(rxCount))) {
            //setAddrError(true);
        } else {
            if (num < 0) setRxCount("20");
            //setAddrError(false);
        }
    }, [rxCount]);

    useEffect(() => {
        if (usedRange.length === max) {
            setRangeFull(true);
        } else {
            setRangeFull(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usedRange]);

    const getArray = (input: number[]) => {
        var start = input[0];
        var end = input[1];
        var len = end - start + 1;
        var nlist = Array.from({ length: len }, (_, i) => i + start);
        return nlist;
    };

    useEffect(() => {
        if (singleScheme.length === 0) {
            setUsedRange([]);
        } else {
            var temp_range: number[] = [];
            var xset = false;
            var yset = false;
            singleScheme.forEach(function (value) {
                temp_range = temp_range.concat(getArray(value["range"]));

                if (value.isTxAxis) {
                    xset = true;
                } else {
                    yset = true;
                }
            });
            temp_range = temp_range.sort((a, b) => a - b);

            setUsedRange(temp_range);

            if (xset && yset) {
                setSchemeErr(false);
            } else {
                setSchemeErr(true);
            }
        }
    }, [singleScheme]);

    const handleOpenNewBankingScheme = () => {
        setOpenNewBankingScheme(true);
    };

    const handleApplyBankingScheme = () => {

        var settingRegistry: ISettingRegistry = props.settingsRegistry;
        async function set() {
            if (settingRegistry) {
                try {
                    var id = '@webds/sensor_mapping:plugin';
                    var ret = await settingRegistry.set(id, 'bankingScheme', bankingScheme);
                    console.log(ret);
                } catch (reason) {
                    console.log(`Failed to set settings for ${id}\n${reason}`);
                }
            }
        }
        set();


        console.log("APPLY");
    };

    const handleCloseNewBankingScheme = (add: boolean) => {
        setOpenNewBankingScheme(false);

        if (add) {
            var item = {};

            singleScheme.forEach(function (value) {
                var direction = value.isTxAxis ? "TX-AXIS" : "RX-AXIS";
                if (item[direction] === undefined) {
                    item[direction] = [];
                }
                item[direction].push({ name: value.name, range: value.range });
            });

            bankingScheme.push(item);
        }
        setSingleScheme([]);
    };

    const handleCloseAddXY = (add: boolean) => {
        setOpenAdd(false);
        if (add) {
            var item = {};
            item["isTxAxis"] = isTxAxis;
            item["name"] = name;
            item["range"] = range;
            var temp = [];
            Object.assign(temp, singleScheme);
            temp.push(item);
            setSingleScheme(temp);
        }
    };

    const handleDeleteBankingScheme = (index: number) => {
        var tempBanking = [];
        Object.assign(tempBanking, bankingScheme);
        tempBanking.splice(index, 1);
        setBankingScheme(tempBanking);
    };

    const handleOpenAdd = (
        event: React.MouseEvent<HTMLElement>,
        openTxAxis: boolean
    ) => {
        setOpenAdd(true);
        setTxAxis(openTxAxis);

        var tx_set = false;
        var rx_set = false;
        var temp_range = [];
        singleScheme.forEach(function (value) {
            //console.log(value["isTxAxis"]);
            //console.log(value["name"]);
            //console.log(value["range"]);
            if (value["name"] === "TX") {
                tx_set = true;
            } else if (value["name"] === "RX") {
                rx_set = true;
            }
            temp_range = temp_range.concat(getArray(value["range"]));
        });

        if (openTxAxis && !tx_set) {
            setName("TX");
        } else if (!openTxAxis && !rx_set) {
            setName("RX");
        } else {
            setName("U");
        }

        var rmin = 0;
        var rmax = 0;
        if (temp_range.length === 0) {
            var step = Math.round(max / 4);
            setRange([0 + step, max - step - 1]);
        } else {
            temp_range = temp_range.sort((a, b) => a - b);
            if (rmin === temp_range[0]) {
                rmin = temp_range[temp_range.length - 1] + 1;
                rmax = max - 1;
            } else {
                rmax = temp_range[0] - 1;
            }

            setRange([rmin, rmax]);
            setUsedRange(temp_range);
        }
    };

    const handleSetName = (event: SelectChangeEvent) => {
        setName(event.target.value as string);
    };

    const handleRangeChange = (event: Event, newValue: number | number[]) => {
        setRange(newValue as number[]);
    };

    const handleTxCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        var count = event.target.value;
        setTxCount(count);
        setMax(parseInt(count, 10) + parseInt(rxCount, 10));
    };

    const handleRxCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        var count = event.target.value;
        setRxCount(count);
        setMax(parseInt(count, 10) + parseInt(txCount, 10));
    };

    const handleSelectBankingScheme = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        var index = (event.target as HTMLInputElement).value;

        var xlist: number[] = [];
        var ylist: number[] = [];

        bankingScheme[index]["RX-AXIS"].forEach(function (item) {
            xlist = xlist.concat(getArray(item["range"]));
        });

        bankingScheme[index]["TX-AXIS"].forEach(function (item) {
            ylist = ylist.concat(getArray(item["range"]));
        });

        setXdir(xlist);
        setYdir(ylist);
    };

    function showBankingSchemeList() {
        var blist = [];
        bankingScheme.forEach(function (value) {
            var str = "";
            value["TX-AXIS"].forEach(function (v) {
                str = str + v.name + "[" + v.range[0] + ", " + v.range[1] + "]";
            });
            str = str + ",  ";
            value["RX-AXIS"].forEach(function (v) {
                str = str + v.name + "[" + v.range[0] + ", " + v.range[1] + "]";
            });

            blist.push(str);
        });

        return (
            <FormControl sx={{ mt: 5 }}>
                <FormLabel id="demo-radio-buttons-group-label">
                    Banking Scheme
        </FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={handleSelectBankingScheme}
                >
                    {blist.map((value, index) => (
                        <Stack direction="row" justifyContent="space-between">
                        <FormControlLabel
                            key={`radio-${index}`}
                            value={index}
                            control={<Radio />}
                            label={value}
                        />
                            <IconButton
                                aria-label="delete"
                                onClick={() => handleDeleteBankingScheme(index)}
                            >
                                <RemoveIcon />
                            </IconButton>
                            </Stack>
                    ))}
                </RadioGroup>

                <Stack direction="row" justifyContent="flex-end">
                    <IconButton aria-label="delete" onClick={handleOpenNewBankingScheme}>
                        <AddIcon />
                    </IconButton>
                </Stack>
            </FormControl>
        );
    }

    function disaplyPanel() {
        return (
            <div>
                <Stack direction="row" sx={{ minWidth: 350 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column-reverse",
                            "& > :not(style)": {
                                width: LENGTH,
                                height: LENGTH
                            }
                        }}
                    >
                        {xdir.map((elevation, index) => (
                            <Item key={`x-dir-${index}`} sx={{ border: "1px solid grey" }}>
                                {`${elevation}`}
                            </Item>
                        ))}
                    </Box>

                    <Box component="span" sx={{ border: "2px solid grey" }}>
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                width: (LENGTH + 2) * ydir.length - 4,
                                height: (LENGTH + 2) * xdir.length - 4
                            }}
                        >
                            <SvgIcon sx={{ width: 100, height: 100, m: 2 }}>{Axis}</SvgIcon>
                        </Stack>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        ml: LENGTHPXMAX,
                        "& > :not(style)": {
                            width: LENGTH,
                            height: LENGTH
                        }
                    }}
                >
                    {ydir.map((elevation, index) => (
                        <Item key={`y-dir-${index}`} sx={{ border: "1px solid grey" }}>
                            {`${elevation}`}
                        </Item>
                    ))}
                </Box>
            </div>
        );
    }

    function showUserScheme() {
        var xItems = "";
        var yItems = "";

        singleScheme.forEach(function (value) {
            var str = "";
            if (value.name === "U") {
                str = " U";
            }
            str = str + "[" + value.range[0] + ", " + value.range[1] + "]";
            if (value.isTxAxis) {
                if (xItems === "") {
                    xItems = "TX:";
                }
                xItems = xItems + str;
            } else {
                if (yItems === "") {
                    yItems = "RX:";
                }
                yItems = yItems + str;
            }
        });

        if (singleScheme.length) {
            return (
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <TextField
                        id={`textfiled-${xItems}`}
                        value={xItems}
                        variant="standard"
                        InputProps={{
                            readOnly: true
                        }}
                    />
                    <TextField
                        id={`textfiled-${yItems}`}
                        value={yItems}
                        variant="standard"
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Stack>
            );
        }
    }

    function displaySingleBankingScheme() {
        return (
            <Dialog open={openAdd}>
                <DialogTitle>{isTxAxis ? "Tx-Axis" : "RX-Axis"}</DialogTitle>
                <DialogContent sx={{ width: 400 }}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ height: 100 }}
                        spacing={2}
                    >
                        <FormControl sx={{ m: 1, minWidth: 80 }}>
                            <InputLabel id="demo-simple-select-label">Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={name}
                                label="Name"
                                autoWidth
                                onChange={handleSetName}
                            >
                                {isTxAxis && <MenuItem value={"TX"}>TX</MenuItem>}
                                {!isTxAxis && <MenuItem value={"RX"}>RX</MenuItem>}
                                <MenuItem value={"U"}>U</MenuItem>
                            </Select>
                        </FormControl>

                        <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={range}
                            onChange={handleRangeChange}
                            valueLabelDisplay="on"
                            max={max - 1}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => handleCloseAddXY(false)}>Cancel</Button>
                    <Button onClick={() => handleCloseAddXY(true)}>Add</Button>
                </DialogActions>
            </Dialog>
        );
    }

    function displayNewBankingScheme() {
        return (
            <Dialog open={openNewBankingScheme}>
                <DialogTitle>New Banking Scheme</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please add banking scheme.</DialogContentText>
                    <Stack
                        spacing={3}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ minWidth: 420, minHeight: 200 }}
                    >
                        <Button
                            disabled={rangeFull}
                            onClick={(e) => handleOpenAdd(e, true)}
                            sx={{ width: 200 }}
                        >
                            TX AXIS
            </Button>
                        <Button
                            disabled={rangeFull}
                            onClick={(e) => handleOpenAdd(e, false)}
                            sx={{ width: 200 }}
                        >
                            RX AXIS
            </Button>
                        {showUserScheme()}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseNewBankingScheme(false)}>
                        Cancel
          </Button>
                    <Button
                        disabled={schemeErr}
                        onClick={() => handleCloseNewBankingScheme(true)}
                    >
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        );
    }

    function displayTxRxCount() {
        return (
            <Stack spacing={2} direction="row">
                <TextField
                    label="Number Tx"
                    id="standard-size-txcount"
                    variant="standard"
                    defaultValue={txCount}
                    onChange={handleTxCount}
                    sx={{ width: "15ch" }}
                />
                <TextField
                    label="Number Rx"
                    id="standard-size-rxcount"
                    variant="standard"
                    defaultValue={rxCount}
                    onChange={handleRxCount}
                    sx={{ width: "15ch" }}
                />
            </Stack>
        );
    }

    const webdsTheme = props.service.ui.getWebDSTheme();

    return (
        <div className="jp-webds-widget-body">
            <ThemeProvider theme={webdsTheme}>
                <Stack direction="row" spacing={6}>
                    {disaplyPanel()}

                    <Stack direction="column" spacing={4} sx={{ ml: 3 }}>
                        {displayTxRxCount()}

                        {showBankingSchemeList()}

                        <Button onClick={handleApplyBankingScheme}>Apply</Button>

                        {displayNewBankingScheme()}

                        {displaySingleBankingScheme()}
                    </Stack>
                </Stack>
            </ThemeProvider>
        </div>
    );
}
