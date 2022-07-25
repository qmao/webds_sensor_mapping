import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
    Divider,
    ListItemText,
    Radio,
    Stack,
    Typography,
    Button,
    Tooltip,
    Paper
} from "@mui/material";
import { extensionConst } from "./constant";

const BANKING_ITEM_HEIGHT = 30;
const BANKING_ITEM_LIST_HEIGHT = BANKING_ITEM_HEIGHT + 2;

export default function BankingScheme(props: any) {
    const [checked, setChecked] = useState("");
    const [selectedBankingScheme, setSelectedBankingScheme] = useState<
        string | undefined
    >(undefined);

    useEffect(() => {
        //console.log("props.defaultSelect", props.defaultSelect);
        setChecked(props.defaultSelect);
        props.onSelect(props.defaultSelect, props.bankingSchemeConfig, false);
    }, [props.defaultSelect]);

    const handleToggle = (value: string) => () => {
        if (!props.expanded) return;
        if (checked === value) {
            setChecked("");
            setSelectedBankingScheme(undefined);
        } else {
            setChecked(value);
            const found = props.bankingListAll.find(
                (element) => element["id"] === value
            );
            setSelectedBankingScheme(found);
        }
        props.onSelect(value, props.bankingSchemeConfig, true);
    };

    function getTRxText(data: any) {
        var title: any = Object.values(
            extensionConst.bankingScheme[props.asic]["Banking"]
        );
        var row = [];
        data.map((value, index) => {
            var pin = title[index].slice(3);
            row.push([value, pin]);
        });
        return row;
    }

    function showItem(
        content: string,
        info: string,
        id0: string,
        id1: string,
        id2: string
    ) {
        return (
            <Stack>
                <Tooltip title={info} placement="top">
                    <Button
                        variant="text"
                        sx={{ height: BANKING_ITEM_HEIGHT, p: 0, b: 0, m: 0 }}
                    >
                        <Typography
                            variant="overline"
                            key={`list-trx-${id0}-${id1}-${id2}`}
                            sx={{ textAlign: "center" }}
                        >
                            {content}
                        </Typography>
                    </Button>
                </Tooltip>
            </Stack>
        );
    }

    function showItems(
        up: string,
        down: string,
        id0: string,
        id1: string,
        id2: string
    ) {
        return (
            <Stack direction="row">
                <Button
                    variant="text"
                    sx={{ height: BANKING_ITEM_HEIGHT, p: 0, b: 0, m: 0 }}
                >
                    <Typography
                        variant="overline"
                        key={`list-trx-${id0}-${id1}-${id2}`}
                        sx={{ textAlign: "center" }}
                    >
                        {up}
                    </Typography>
                </Button>
                <Button
                    variant="text"
                    sx={{ height: BANKING_ITEM_HEIGHT, p: 0, b: 0, m: 0 }}
                >
                    <Typography
                        variant="overline"
                        key={`list-pin-${id0}-${id1}-${id2}`}
                        sx={{ textAlign: "center" }}
                    >
                        {down}
                    </Typography>
                </Button>
            </Stack>
        );
    }

    function getTRxCountText(axis: any) {
        var count = props.bankingSchemeConfig[axis]["count"];

        return (
            <>
                {showItems(`T${count[0]}`, `R${count[1]}`, count[0], count[1], "axis")}
            </>
        );
    }

    function showBankingTRx(item: any) {
        var block = Object.values(item);
        var content = getTRxText(block.slice(1));
        return content;
    }

    function dispalyBankingScheme() {
        var showList = [];
        if (!props.expanded) {
            if (selectedBankingScheme !== undefined) {
                showList = [selectedBankingScheme];
            }
        } else {
            showList = props.bankingListAll;
        }
        return (
            <Paper square elevation={1}>
                {showList.map((value, index) => {
                    var axis_sense = value["id"];
                    const labelId = `checkbox-list-label-${axis_sense}-${index}`;
                    return (
                        <ListItem
                            key={`listitem-root-${axis_sense}-${index}`}
                            disablePadding
                            divider
                            sx={{ height: BANKING_ITEM_LIST_HEIGHT, p: 0, b: 0, m: 0 }}
                        /*sx={{ border: "1px solid grey", borderRadius: "4px" }}*/
                        >
                            <ListItemButton
                                key={`listitem-button-${axis_sense}-${index}`}
                                role={undefined}
                                onClick={handleToggle(axis_sense)}
                                dense
                                sx={{ m: 0 }}
                            >
                                <ListItemIcon
                                    key={`listitem-icon-${axis_sense}-${index}`}
                                    sx={{ minWidth: 20 }}
                                >
                                    <Radio
                                        id={labelId}
                                        key={`radio-${axis_sense}-${index}`}
                                        checked={axis_sense === checked}
                                        value={axis_sense}
                                        name="radio-buttons"
                                        inputProps={{ "aria-label": "B" }}
                                        sx={{ width: 0, p: 0, m: 0, b: 0 }}
                                    />
                                </ListItemIcon>

                                <ListItemText
                                    key={`list-trx-count-root-${axis_sense}-${index}`}
                                    sx={{
                                        width: 35,
                                        pr: 1,
                                        height: BANKING_ITEM_LIST_HEIGHT,
                                        p: 0,
                                        b: 0,
                                        m: 0
                                    }}
                                >
                                    <Typography
                                        variant="overline"
                                        key={`list-trx-count-${axis_sense}-${index}`}
                                        sx={{ textAlign: "center", fontSize: 12 }}
                                    >
                                        {getTRxCountText(axis_sense)}
                                    </Typography>
                                </ListItemText>

                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    key={`list-divider-${index}-${axis_sense}`}
                                />
                                {showBankingTRx(value).map((content, indexSub) => {
                                    return (
                                        <ListItemText
                                            key={`listitem-${axis_sense}-${indexSub}-${content[1]}`}
                                            sx={{
                                                height: BANKING_ITEM_LIST_HEIGHT,
                                                p: 0,
                                                b: 0,
                                                m: 0
                                            }}
                                        >
                                            {showItem(
                                                content[0],
                                                content[1],
                                                axis_sense,
                                                `${indexSub}`,
                                                content[1]
                                            )}
                                        </ListItemText>
                                    );
                                })}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </Paper>
        );
    }

    return (
        <Stack alignItems="center">
            <List sx={{ width: 350, bgcolor: "background.paper", p: 0 }}>
                {dispalyBankingScheme()}
            </List>
        </Stack>
    );
}
