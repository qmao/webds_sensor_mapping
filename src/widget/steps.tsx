import React, { useEffect, useState, useRef } from "react";

import {
    Stack,
    TextField,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    Avatar,
    Typography,
    Snackbar,
    Alert,
    Box,
    Stepper,
    Step,
    StepContent,
    Button
} from "@mui/material";

import { BankingScheme } from "./bankingScheme";
import { extensionConst } from "./constant";

import { requestAPI, webdsService } from "./local_exports";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

interface IAxis {
    dir: number[];
    count: number;
    dim: number;
    bk: number[];
}

interface IMappingInfo {
    status: boolean;
    info: string;
    content: number[];
}

interface ITrxOption {
    pin: number[];
    tx: number;
    rx: number;
}

interface IBankingSchemeUnit {
    id: string;
    tx: number[];
    rx: number[];
    trx: ITrxOption[];
}

interface ISteppr {
    updateSize: any;
    updateX: any;
    updateY: any;
    updateStep: any;
    step: any;
    updateStatus: any;
    updateInitState: any;
}

interface IAlertInfo {
    state: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
}

interface IApplyParam {
    txCount: string;
    rxCount: string;

    imageRxes: number[];
    imageTxes: number[];

    txAxis: string;
}

const TITLE_FONTSIZE = 15;
const CONTENT_FONTSIZE = 13;

export const VerticalStepper = (props: ISteppr): JSX.Element => {
    const [activeStep, setActiveStep] = React.useState(props.step);

    const [txCount, setTxCount] = useState("0");
    const [rxCount, setRxCount] = useState("0");
    const [countErrorInfo, setCountErrorInfo] = useState("");
    const [txCountError, setTxCountError] = useState(false);
    const [rxCountError, setRxCountError] = useState(false);
    const [txErrorInfo, setTxErrorInfo] = useState("");
    const [rxErrorInfo, setRxErrorInfo] = useState("");
    const [txError, setTxError] = useState(false);
    const [rxError, setRxError] = useState(false);
    const [txMappingBase, setTxMappingBase] = useState("");
    const [rxMappingBase, setRxMappingBase] = useState("");
    const [xdir, setXdir] = useState<number[]>([]);
    const [ydir, setYdir] = useState<number[]>([]);
    const [xTrx, setXTrx] = useState("");
    const [defaultSelect, setDefaultSelect] = useState("");
    const [initState, setInitState] = useState(false);

    const [bankingListAll, setBankingListAll] = useState([]);
    const [bankingSchemeConfig, setBankingSchemeConfig] = useState([]);

    const [toRamDone, setToRamDone] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [openAlert, setOpenAlert] = useState<IAlertInfo>({
        state: false,
        message: "",
        severity: "info"
    });

    const applyParam = useRef<IApplyParam>({
        txCount: "0",
        rxCount: "0",
        imageRxes: [],
        imageTxes: [],
        txAxis: ""
    });

    const asic = useRef("");
    const xTrxRef = useRef("");
    const bklist = useRef<IBankingSchemeUnit[]>([]);
    const txData = useRef<IAxis>({
        dir: [],
        count: 0,
        dim: 0,
        bk: [...Array(100).keys()]
    });

    const rxData = useRef<IAxis>({
        dir: [],
        count: 0,
        dim: 0,
        bk: [...Array(100).keys()]
    });

    const trxOption = useRef<ITrxOption[]>([]);

    useEffect(() => {
        setActiveStep(props.step);
    }, [props.step]);

    useEffect(() => {
        setToRamDone(false);
    }, [txCount, rxCount, xdir, ydir]);

    useEffect(() => {
        props.updateInitState(initState);
    }, [initState]);

    useEffect(() => {
        if (txCountError || rxCountError || txError || rxError || !dataReady) {
            props.updateStatus(true);
        } else {
            props.updateStatus(false);
        }
    }, [txCountError, rxCountError, txError, rxError, props, dataReady]);

    const Identify = async (): Promise<string> => {
        let partNumber: string = "none";
        let fw_mode: string = "none";

        try {
            const reply = await requestAPI<any>("command?query=identify", {
                method: "GET"
            });

            fw_mode = reply["mode"];
            if (fw_mode === "application") {
                console.log("appliction mode");
                partNumber = reply["partNumber"];
                return Promise.resolve(partNumber);
            } else {
                return Promise.reject(`invalid fw mode: ${fw_mode}`);
            }
        } catch (error) {
            console.log(error);
            return Promise.reject(`identify failed: ${error.toString()}`);
        }

        return Promise.resolve(partNumber);
    };

    const Get = async (): Promise<string> => {
        try {
            let url = "config/static";

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

    const WriteToRAM = async (dataToSend: any): Promise<string | undefined> => {
        try {
            const reply = await requestAPI<any>("config/static", {
                body: JSON.stringify(dataToSend),
                method: "POST"
            });
            console.log(reply);
            return Promise.resolve(JSON.stringify(reply));
        } catch (e) {
            console.error(`Error on POST ${dataToSend}.\n${e}`);
            ///qmao return Promise.reject((e as Error).message);
            return Promise.resolve(JSON.stringify(""));
        }
    };

    const WriteToFlash = async (): Promise<string | undefined> => {
        var dataToSend = {
            command: "commitConfig"
        };
        try {
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

    const updatexTrxRef = (data: string) => {
        xTrxRef.current = data;
        setXTrx(data);
        if (data === "TX") {
            setYdir(rxData.current.dir);
            setXdir(txData.current.dir);
        } else if (data === "RX") {
            setXdir(rxData.current.dir);
            setYdir(txData.current.dir);
        }
        updateSensorSize();
    };

    useEffect(() => {
        props.updateX(xdir);
    }, [xdir]);

    useEffect(() => {
        props.updateY(ydir);
    }, [ydir]);

    function handleStep(step: number) {
        setActiveStep(step);
        props.updateStep(step);
    }

    const updateTxDir = (data: number[]) => {
        txData.current.dir = data;
        if (xTrxRef.current === "TX") {
            setXdir(data);
        } else if (xTrxRef.current === "RX") {
            setYdir(data);
        }
    };

    const updateRxDir = (data: number[]) => {
        rxData.current.dir = data;
        if (xTrxRef.current === "TX") {
            setYdir(data);
        } else if (xTrxRef.current === "RX") {
            setXdir(data);
        }
    };

    const checkInputMappingIsValid = (mapping: string) => {
        var ret = {} as IMappingInfo;
        ret.status = false;
        ret.info = "";

        var user: any = [];
        if (mapping.length !== 0) {
            try {
                user = mapping.split(",").map(function (item: any) {
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

    function updateSensorSize() {
        if (xTrxRef.current === "TX") {
            props.updateSize([txData.current.count, rxData.current.count]);
        } else {
            props.updateSize([rxData.current.count, txData.current.count]);
        }
    }

    const CheckMappingCountDimension = (data: IAxis) => {
        var ret: IMappingInfo = { status: false, info: "", content: [] };

        // check tx/rx dimension compared with value read from fw
        /*
                if (data.count > data.dim) {
                  ret.info = "count " + data.dir.length + " over dimension " + data.dim;
                  ret.status = true;
                }
                */

        findSupportedBK();
        updateSensorSize();
        return ret;
    };

    const CheckMappingCount = (data: IAxis) => {
        var ret: IMappingInfo = { status: false, info: "", content: [] };

        if (data.dir.length !== data.count) {
            ret.info = "count " + data.dir.length + " not match " + data.count;
            ret.status = true;
        }

        if (data.dir.length > data.dim) {
            ret.info = "count " + data.dir.length + " over dimension " + data.dim;
            ret.status = true;
        }
        return ret;
    };

    const CheckPinOption = () => {
        var ret: IMappingInfo = { status: false, info: "", content: [] };
        console.log("QQQQQ OPTION 1", trxOption.current);
        if (trxOption.current.length) {
            trxOption.current.forEach((option: any) => {
                let tx = 0;
                let rx = 0;
                option.pin.forEach((num: any) => {
                    if (txData.current.dir.includes(num)) {
                        tx = tx + 1;
                    }
                    if (rxData.current.dir.includes(num)) {
                        rx = rx + 1;
                    }
                    console.log("QQQQQ OPTION 2", num);
                });
                if (tx > option.tx || rx > option.rx) {
                    ret.info = "Error pin:" + option.pin.toString();
                    ret.status = true;
                    console.log("QQQQQ OPTION 3", tx, rx);
                }
            });
        }

        console.log("QQQQQ OPTION", ret);
        return ret;
    };

    const CheckMappingRule = (data: IAxis) => {
        var ret = {} as IMappingInfo;
        var singleCheck: any = [];
        ret.status = false;
        ret.info = "";
        var BreakException = {};

        try {
            data.dir.forEach((value) => {
                if (value === 0) {
                } else {
                    if (!data.bk.includes(value)) {
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
                }
            });
        } catch (e) {
            return ret;
        }

        if (data.dir.length > data.bk.length) {
            ret.info = data.dir.length + " over dim" + data.bk.length;
            ret.status = true;
            return ret;
        }

        ret = CheckMappingCount(data);
        return ret;
    };

    const updateTxMapping = (mapping: string) => {
        setTxMappingBase(mapping);

        var ret = checkInputMappingIsValid(mapping);
        updateTxDir(ret.content);

        ret = CheckMappingRule(txData.current);
        if (ret.status === false) {
            ret = CheckPinOption();
        }
        setTxError(ret.status);
        setTxErrorInfo(ret.info);
    };

    const updateRxMapping = (mapping: string) => {
        setRxMappingBase(mapping);

        var ret = checkInputMappingIsValid(mapping);
        updateRxDir(ret.content);

        ret = CheckMappingRule(rxData.current);
        if (ret.status === false) {
            ret = CheckPinOption();
        }

        setRxError(ret.status);
        setRxErrorInfo(ret.info);
    };

    const updateTxCount = (data: string) => {
        setCountErrorInfo("");
        setTxCount(data);
        let num = parseInt(data, 10);
        if (isNaN(num) || isNaN(Number(data)) || num < 0) {
            setTxCountError(true);
            txData.current.count = -1;
        } else {
            setTxCountError(false);
            txData.current.count = num;
        }
        let ret = CheckMappingCountDimension(txData.current);
        if (ret.status) {
            setTxCountError(true);
            setCountErrorInfo(ret.info);
        }
    };

    const updateRxCount = (data: string) => {
        setCountErrorInfo("");
        setRxCount(data);
        let num = parseInt(data, 10);
        if (isNaN(num) || isNaN(Number(data)) || num < 0) {
            setRxCountError(true);
            rxData.current.count = -1;
        } else {
            setRxCountError(false);
            rxData.current.count = num;
        }

        let ret = CheckMappingCountDimension(rxData.current);
        if (ret.status) {
            setRxCountError(true);
            setCountErrorInfo(ret.info);
        }
    };

    const updateTxDefaultList = (data: number[]) => {
        txData.current.bk = data;
        //do not update mapping when select banking
        //updateTxCount(data.length.toString());
        //updateTxMapping(data.toString());
    };

    const updateRxDefaultList = (data: number[]) => {
        rxData.current.bk = data;
        //do not update mapping when select banking
        //updateRxCount(data.length.toString());
        //updateRxMapping(data.toString());
    };

    const handleTxCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTxCount(event.target.value);
        validateTxRx();
        findSupportedBK();
    };

    const validateTxRx = () => {
        var ret = CheckMappingRule(txData.current);
        setTxError(ret.status);
        setTxErrorInfo(ret.info);

        ret = CheckMappingRule(rxData.current);
        setRxError(ret.status);
        setRxErrorInfo(ret.info);
    };

    const handleRxCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRxCount(event.target.value);
        validateTxRx();
        findSupportedBK();
    };

    const handleSelectBankingScheme = (select: any) => {
        if (select === 0) {
            updateTxDefaultList([...Array(100).keys()]);
            updateRxDefaultList([...Array(100).keys()]);
            return;
        }

        var unit: any = bklist.current.find((item) => item.id === select);

        if (unit) {
            trxOption.current = unit.trx;
            updateTxDefaultList(unit!.tx);
            updateRxDefaultList(unit!.rx);
            setDefaultSelect(select);
            validateTxRx();
        }
    };

    const handleTxMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTxMapping(event.target.value);
    };

    const handleRxMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRxMapping(event.target.value);
    };

    const findDuplicatesCount = (array1: number[], array2: number[]) => {
        var duplicates = array1.filter(function (val) {
            return array2.indexOf(val) !== -1;
        });
        return duplicates.length;
    };

    const findMatchBankingScheme = (tx: number[], rx: number[]) => {
        const match = bklist.current.map((item: any) => {
            var txMatch = findDuplicatesCount(item.tx, tx);
            var rxMatch = findDuplicatesCount(item.rx, rx);
            return txMatch + rxMatch;
        });

        if (match.length === 0) {
            return;
        }

        const max = Math.max(...match);
        const index = match.indexOf(max);

        txData.current.bk = bklist.current[index].tx;
        rxData.current.bk = bklist.current[index].rx;

        setDefaultSelect(bklist.current[index].id);
    };

    interface configType {
        id: {
            list: string;
            count: string;
        };
    }
    const handleBankingSchemeInit = (config: configType) => {
        console.log("config", config);

        bklist.current = [];
        for (const [key, kvalue] of Object.entries(config)) {
            var trx_list: any = kvalue.list;

            var unit: IBankingSchemeUnit = { id: "", tx: [], rx: [], trx: [] };
            unit.id = key;

            trx_list.forEach((value: any, index: any) => {
                var ret = value.split(/\[|\]|:/);
                var name = ret[0];
                var range1 = parseInt(ret[1], 10);
                var range2 = parseInt(ret[2], 10);
                var len = range1 - range2 + 1;
                var nlist: number[] = Array.from({ length: len }, (_, i) => i + range2);

                if (name === "Tx") {
                    unit.tx = unit.tx.concat(nlist);
                } else if (name === "Rx") {
                    unit.rx = unit.rx.concat(nlist);
                } else {
                    unit.tx = unit.tx.concat(nlist);
                    unit.rx = unit.rx.concat(nlist);

                    const nums = name.match(/\d+/g)?.map(Number);
                    let option: ITrxOption = {
                        pin: nlist,
                        tx: nums[0],
                        rx: nums[1]
                    };
                    unit.trx.push(option);
                }
            });
            bklist.current.push(unit);
        }
    };

    function updateLatestStatus() {
        //update latest param for tracking
        applyParam.current.txCount = txData.current.dir.length.toString();
        applyParam.current.rxCount = rxData.current.dir.length.toString();
        applyParam.current.imageTxes = txData.current.dir;
        applyParam.current.imageRxes = rxData.current.dir;
        applyParam.current.txAxis = xTrxRef.current;
    }

    const initSensorMapping = async () => {
        try {
            let ret;
            if (webdsService.pinormos !== undefined) {
                const external = webdsService.pinormos.isExternal();
                if (external) {
                    ret = await webdsService.packrat.cache.addPublicConfig();
                } else {
                    ret = await webdsService.packrat.cache.addPrivateConfig();
                }
                setOpenAlert({
                    state: true,
                    severity: "success",
                    message: ret.toString()
                });
            }

            ret = await Get();

            let config: any = JSON.parse(ret);
            var txlen = config["txCount"];
            var rxlen = config["rxCount"];
            var tx = config["imageTxes"];
            var rx = config["imageRxes"];

            updatexTrxRef(config["txAxis"] ? "RX" : "TX");

            updateTxCount(txlen.toString());
            updateRxCount(rxlen.toString());

            txData.current.dim = tx.length;
            rxData.current.dim = rx.length;

            updateTxMapping(tx.slice(0, txlen).toString());
            updateRxMapping(rx.slice(0, rxlen).toString());
            setDataReady(true);
            updateLatestStatus();
        } catch (error) {
            console.error(error);
            setOpenAlert({
                state: true,
                severity: "error",
                message: error.toString()
            });
            updateLatestStatus();
        }
    };

    function findSupportedBK() {
        if (asic.current === "") return;
        var banking_field = Object.keys(
            extensionConst.bankingScheme[asic.current]["Banking"]
        );
        var title: any = Object.values(
            extensionConst.bankingScheme[asic.current]["Banking"]
        );
        var pin: any = [];

        title.forEach((value: any) => {
            pin.push(value.slice(3));
        });

        var axis_sense: any =
            extensionConst.bankingScheme[asic.current]["axis-sense"];
        var row: any = [];
        var trx_select: any = {};
        axis_sense.forEach(function (item: any) {
            var r: any = {};
            r["id"] = item["id"];

            item["mapping"].forEach(function (bk: any, index: any) {
                r[banking_field[index]] = bk;
            });

            //append pin range to TxRx text
            var trx: any = Object.values(r).slice(1);
            var tx_count = 0;
            var rx_count = 0;
            trx.forEach((element: any, index: any) => {
                trx[index] = element + pin[index];

                var ret = pin[index].split(/\[|\]|:/);
                var range1 = parseInt(ret[1], 10);
                var range2 = parseInt(ret[2], 10);
                var len = range1 - range2 + 1;
                if (element === "Tx") {
                    tx_count = tx_count + len;
                } else if (element === "Rx") {
                    rx_count = rx_count + len;
                } else {
                    let nums = element.match(/\d+/g)?.map(Number);
                    tx_count = tx_count + nums[0];
                    rx_count = rx_count + nums[1];
                }
            });
            if (
                txData.current.count <= tx_count &&
                rxData.current.count <= rx_count
            ) {
                trx_select[r["id"]] = {};
                trx_select[r["id"]]["list"] = trx;
                trx_select[r["id"]]["count"] = [tx_count, rx_count];
                row.push(r);
            }
        });
        setBankingSchemeConfig(JSON.parse(JSON.stringify(trx_select)));
        setBankingListAll(row);

        handleBankingSchemeInit(trx_select);
        findMatchBankingScheme(txData.current.dir, rxData.current.dir);
    }

    const initializeBK = async () => {
        await Identify()
            .then((partNumber) => {
                console.log(partNumber);
                for (const [key, value] of Object.entries(extensionConst.partNumber)) {
                    let v: any = value;
                    v.find((element: any) => {
                        if (partNumber.toLowerCase().includes(element)) {
                            asic.current = key;
                            return true;
                        }
                    });
                }

                if (asic.current === "") {
                    throw `unsupported partnumber ${partNumber}`;
                }

                findSupportedBK();
            })
            .catch((err) => {
                alert(err);
            });
    };

    async function init() {
        await initSensorMapping();
        await initializeBK();
        setInitState(true);
    }

    useEffect(() => {
        init();
    }, []);

    const handleAxesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updatexTrxRef(event.target.value);
    };

    function CountComponent(title: any, value: any, err: any, f: any) {
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ py: 0, fontSize: CONTENT_FONTSIZE }}>
                    {title}:
        </Typography>
                <TextField
                    variant="standard"
                    value={value}
                    error={err}
                    onChange={f}
                    size="small"
                    //onBlur={(e) => f(e.target.value)}
                    sx={{ width: "5ch", py: 1, fontSize: CONTENT_FONTSIZE }}
                    inputProps={{
                        readOnly: false,
                        style: { fontSize: CONTENT_FONTSIZE, textAlign: "center" }
                    }}
                />
            </Stack>
        );
    }
    function displayTxRxCount() {
        return (
            <Stack>
                <Typography sx={{ fontSize: CONTENT_FONTSIZE }}>
                    Enter the desired number of transmitters and receivers.
        </Typography>
                <Stack spacing={2} justifyContent="flex-start" direction="row">
                    {CountComponent("Tx", txCount, txCountError, handleTxCount)}
                    {CountComponent("Rx", rxCount, rxCountError, handleRxCount)}
                </Stack>
                {(txCountError || rxCountError) && (
                    <Typography sx={{ fontSize: CONTENT_FONTSIZE, color: "error.main" }}>
                        {countErrorInfo}
                    </Typography>
                )}
            </Stack>
        );
    }

    function displayTxRxMapping() {
        return (
            <Stack spacing={3}>
                <Typography sx={{ fontSize: CONTENT_FONTSIZE }}>
                    Enter the desired Tx / Rx order (valid range shown).
        </Typography>
                <Stack direction="column" spacing={0}>
                    <BankingScheme
                        expanded={false}
                        onSelect={handleSelectBankingScheme}
                        defaultSelect={defaultSelect}
                        asic={asic.current}
                        bankingListAll={bankingListAll}
                        bankingSchemeConfig={bankingSchemeConfig}
                        count={[parseInt(txCount, 10), parseInt(rxCount, 10)]}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Tx:</Typography>
                    <TextField
                        multiline
                        id="standard-textarea"
                        variant="standard"
                        value={txMappingBase}
                        onChange={handleTxMapping}
                        error={txError}
                        helperText={txErrorInfo}
                        sx={{ width: "100%" }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Rx:</Typography>
                    <TextField
                        multiline
                        id="standard-textarea"
                        variant="standard"
                        value={rxMappingBase}
                        onChange={handleRxMapping}
                        error={rxError}
                        helperText={rxErrorInfo}
                        sx={{ width: "100%" }}
                    />
                </Stack>
            </Stack>
        );
    }

    function applyExtraSettings() {
        var configs: any = {};
        var extra: any = extensionConst.bankingScheme[asic.current]["settings"];
        var select: any = Number(defaultSelect);

        extra.forEach((con: any) => {
            var found = false;
            con["condition"].forEach((index: any) => {
                var split = index.split(":");
                if (Number(split[0]) === select) {
                    if (
                        split.length === 1 ||
                        txData.current.dir.includes(Number(split[1])) ||
                        rxData.current.dir.includes(Number(split[1]))
                    ) {
                        found = true;
                    }
                }
            });
            if (found) {
                Object.assign(configs, con["configs"]);
            }
        });
        console.log(configs);
        return configs;
    }

    async function onApply(event: any, toFlash: any) {
        var dataToSend = {};
        let newStatus = Array(extensionConst.steps).fill(0);

        enum StepIndex {
            TxRxNumber = 0,
            Banking,
            TxRxOrder,
            Axes
        }

        if (
            applyParam.current.txCount !== txCount ||
            applyParam.current.rxCount !== rxCount
        ) {
            newStatus[StepIndex.TxRxNumber] = 1;
        }

        if (applyParam.current.txAxis !== xTrxRef.current) {
            newStatus[StepIndex.Axes] = 1;
        }

        if (
            JSON.stringify(applyParam.current.imageRxes) !==
            JSON.stringify(rxData.current.dir) ||
            JSON.stringify(applyParam.current.imageTxes) !==
            JSON.stringify(txData.current.dir)
        ) {
            newStatus[StepIndex.TxRxOrder] = 1;
        }

        let index = parseInt(event.currentTarget.value, 10);
        if (index === StepIndex.Banking) {
            newStatus[StepIndex.Banking] = 1;
        }

        let tx = new Array(txData.current.dim).fill(0);
        let rx = new Array(rxData.current.dim).fill(0);

        tx = tx.map((e, index) => {
            if (index < txData.current.count) return txData.current.dir[index];
            //equivalent to list[index]
            else return 0;
        });
        rx = rx.map((e, index) => {
            if (index < rxData.current.count) return rxData.current.dir[index];
            //equivalent to list[index]
            else return 0;
        });

        console.log(txData.current);
        console.log(rxData.current);
        console.log(tx);
        console.log(rx);

        dataToSend = {
            txCount: txCount,
            rxCount: rxCount,

            imageRxes: rx,
            imageTxes: tx,
            numColumns: xTrxRef.current === "TX" ? txCount : rxCount,
            numRows: xTrxRef.current === "TX" ? rxCount : txCount,

            txAxis: xTrxRef.current === "TX" ? 0 : 1
        };

        Object.assign(dataToSend, applyExtraSettings());

        await WriteToRAM(dataToSend)
            .then((ret) => {
                if (toFlash) {
                    return WriteToFlash();
                } else return ret;
            })
            .then((ret) => {
                //console.log(ret);
                if (toFlash) {
                    //to flash pass
                    setOpenAlert({
                        state: true,
                        severity: "success",
                        message: "Success"
                    });

                    handleStep(0);
                } else {
                    //to ram pass
                    setOpenAlert({
                        state: true,
                        severity: "success",
                        message: "Success"
                    });

                    setToRamDone(true);
                }

                updateLatestStatus();
            })
            .catch((e) => {
                setOpenAlert({ state: true, severity: "error", message: e.toString() });
            });
    }

    function displayStepText(label: any, index: number) {
        let labelColor = "text.disabled";
        if (index === props.step) {
            labelColor = "text.primary";
        }

        return (
            <Typography
                sx={{ fontWeight: "bold", fontSize: TITLE_FONTSIZE }}
                color={labelColor}
                variant="caption"
            >
                {label}
            </Typography>
        );
    }

    function displayStepIcon(index: number) {
        let error = false;
        const param = {
            bgcolor: "primary",
            width: 24,
            height: 24,
            mr: 2,
            color: "inherit"
        };

        /*
                if (props.step === extensionConst.steps) {
                  //check step finish when DONE
                  param.color = "#inherit";
                  if (stepStatus[index] === 1) {
                    param.bgcolor = "green";
                  } else {
                    param.bgcolor = "red";
                  }
                }
                */

        switch (index) {
            case 0:
                if (txCountError || rxCountError) {
                    error = true;
                }
                break;
            case 2:
                if (txError || rxError) {
                    error = true;
                }
                break;
            default:
                break;
        }

        if (index === props.step) {
            param.bgcolor = "#007dc3";
        }

        if (error) {
            param.bgcolor = "red";
            param.color = "white";
        }

        return (
            <Avatar sx={param}>
                {error ? (
                    <PriorityHighIcon sx={{ fontSize: 16 }} />
                ) : (
                        <Typography sx={{ fontSize: 14, color: "white" }}>
                            {index + 1}
                        </Typography>
                    )}
            </Avatar>
        );
    }

    function displayAxisSelect() {
        return (
            <Stack direction="column" spacing={1} alignItems="flex-start">
                <Typography sx={{ fontSize: CONTENT_FONTSIZE }}>
                    Select x / y asix orientation.
        </Typography>
                <FormControl>
                    <RadioGroup
                        name="row-radio-buttons-group"
                        value={xTrx}
                        onChange={handleAxesChange}
                    >
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <FormControlLabel value={"TX"} control={<Radio />} label="" />
                            <Typography color="textPrimary">Tx on x axis</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <FormControlLabel value={"RX"} control={<Radio />} label="" />
                            <Typography color="textPrimary">Rx on x axis</Typography>
                        </Stack>
                    </RadioGroup>
                </FormControl>
            </Stack>
        );
    }

    const handleCloseAlert = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert({ ...openAlert, state: false });
    };

    function displayAlert() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                open={openAlert.state}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
            >
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

    const steps = [
        {
            label: "TX / RX Count",
            description: displayTxRxCount()
        },
        {
            label: "Banking Scheme",
            description: (
                <Stack direction="column" spacing={1}>
                    <Typography sx={{ fontSize: CONTENT_FONTSIZE }}>
                        Select the desired banking scheme.
          </Typography>
                    <BankingScheme
                        expanded={true}
                        onSelect={handleSelectBankingScheme}
                        defaultSelect={defaultSelect}
                        asic={asic.current}
                        bankingListAll={bankingListAll}
                        bankingSchemeConfig={bankingSchemeConfig}
                        count={[parseInt(txCount, 10), parseInt(rxCount, 10)]}
                    />
                </Stack>
            )
        },
        {
            label: "TX / RX Order",
            description: displayTxRxMapping()
        },
        {
            label: "X / Y Axis",
            description: displayAxisSelect()
        },
        {
            label: "Apply Changes",
            description: (
                <Stack direction="column" spacing={3}>
                    <div>
                        <Typography
                            sx={{
                                display: "inline-block",
                                whiteSpace: "pre-line",
                                fontSize: CONTENT_FONTSIZE
                            }}
                        >
                            Review all changes in the validation panel on the right. Use mouse
                            hover to verify the sensor order. When you are happy with the
                            changes, write them to RAM for temporary usage or flash for
                            permanent usage.
            </Typography>
                    </div>
                    <Stack direction="row" spacing={6}>
                        <Button
                            variant="contained"
                            disabled={
                                toRamDone || txError || rxError || txCountError || rxCountError
                            }
                            onClick={(e) => onApply(e, false)}
                        >
                            Write to RAM
            </Button>
                        <Button
                            variant="contained"
                            disabled={txError || rxError || txCountError || rxCountError}
                            onClick={(e) => onApply(e, true)}
                        >
                            {" "}
              Write to Flash
            </Button>
                    </Stack>
                </Stack>
            )
        }
    ];

    return (
        <Stack
            direction="column"
            justifyContent="space-between"
            spacing={2}
            sx={{ width: "100%", pr: 2 }}
        >
            {initState && dataReady && (
                <Stepper
                    nonLinear
                    activeStep={activeStep}
                    orientation="vertical"
                    sx={{ pl: 2, pt: 2 }}
                >
                    {steps.map((step: any, index: any) => (
                        <Step key={step.label}>
                            <Button
                                variant="text"
                                onClick={() => handleStep(index)}
                                style={{ justifyContent: "flex-start" }}
                                sx={{ pl: 0, width: "100%" }}
                            >
                                {displayStepIcon(index)}
                                {displayStepText(step.label, index)}
                            </Button>
                            <StepContent>
                                <Box sx={{ m: 1 }}>
                                    <div>{step.description}</div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            )}

            {displayAlert()}
        </Stack>
    );
};
