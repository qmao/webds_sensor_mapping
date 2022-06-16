import React, { useEffect, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Divider, ListItemText, Radio, Stack, Typography } from "@mui/material";
import { UserContext } from "./context";

export default function CheckboxList(props: any) {
    const [checked, setChecked] = React.useState("");
    const [bankingListAll, setBankingListAll] = React.useState([]);

    const context = useContext(UserContext);

    useEffect(() => {
        var banking_field = Object.keys(context.bankingScheme["keys"]["Banking"]);

        var title = Object.values(context.bankingScheme["keys"]["Banking"]);
        var pin = [];
        title.map((value) => {
            pin.push(value.slice(3));
        });

        var axis_sense = context.bankingScheme["keys"]["axis-sense"];
        var row = [];
        var trx_select = {};
        axis_sense.forEach(function (item) {
            var r = {};
            r["id"] = item["id"];

            //console.log(item["mapping"]);
            item["mapping"].forEach(function (bk, index) {
                r[banking_field[index]] = bk;
            });

            //append pin range to TxRx text
            var trx = Object.values(r).slice(1);
            var tx_count = 0;
            var rx_count = 0;
            trx.forEach((element, index) => {
                trx[index] = element + pin[index];

                var ret = pin[index].split(/\[|\]|:/);
                var range1 = parseInt(ret[1], 10);
                var range2 = parseInt(ret[2], 10);
                var len = range1 - range2 + 1;
                if (element === "Tx") {
                    tx_count = tx_count + len;
                } else {
                    rx_count = rx_count + len;
                }
            });
            trx_select[r["id"]] = {};
            trx_select[r["id"]]["list"] = trx;
            trx_select[r["id"]]["count"] = [tx_count, rx_count];

            row.push(r);
        });
        console.log(row);
        context.bankingSchemeConfig = JSON.parse(JSON.stringify(trx_select));

        setBankingListAll(row);
    }, []);

    const handleToggle = (value: string) => () => {
        if (!props.expanded) return;
        if (checked === value) {
            setChecked("");
            context.selectedBankingScheme = undefined;
        } else {
            setChecked(value);
            const found = bankingListAll.find((element) => element["id"] === value);
            context.selectedBankingScheme = found;
        }
        props.onSelect(value);
    };

    function getTRxText(data: any) {
        var title = Object.values(context.bankingScheme["keys"]["Banking"]);
        var row = [];
        data.map((value, index) => {
            var pin = title[index].slice(3);
            row.push([value, pin]);
        });
        return row;
    }

    function getTRxCountText(axis: any) {
        var count = context.bankingSchemeConfig[axis]["count"];

        return `T${count[0]},R${count[1]}`;
    }

    /*
    function showAxisSense(item: any) {
      return (
        <ListItemText
          sx={{ pr: 0, textAlign: "center" }}
          key={`listitem-axis-sense-${item["id"]}`}
        >
          <Typography
            variant="overline"
            key={`axis-sense-label-${item["id"]}`}
            sx={{ textAlign: "center" }}
          >
            {item["id"]}
          </Typography>
        </ListItemText>
      );
    }
    */

    function showBankingTRx(item: any) {
        var block = Object.values(item);
        var content = getTRxText(block.slice(1));
        return content;
    }

    function dispalyBankingScheme() {
        var showList = [];
        if (!props.expanded) {
            if (context.selectedBankingScheme !== undefined) {
                showList = [context.selectedBankingScheme];
            }
        } else {
            showList = bankingListAll;
        }

        return (
            <div>
                {showList.map((value, index) => {
                    var axis_sense = value["id"];
                    const labelId = `checkbox-list-label-${axis_sense}-${index}`;
                    return (
                        <ListItem
                            key={`listitem-root-${axis_sense}-${index}`}
                            disablePadding
                            divider
                        /*sx={{ border: "1px solid grey", borderRadius: "5px" }}*/
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
                                        sx={{ width: 20, p: 0, m: 0, b: 0 }}
                                    />
                                </ListItemIcon>

                                <ListItemText
                                    key={`list-trx-count-root-${axis_sense}-${index}`}
                                    sx={{ minWidth: "8ch" }}
                                >
                                    <Typography
                                        variant="overline"
                                        key={`list-trx-count-${axis_sense}-${index}`}
                                        sx={{ textAlign: "center", fontSize: 13 }}
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
                                        >
                                            <Stack
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                                key={`list-stack-${axis_sense}-${indexSub}-${content[1]}`}
                                                sx={{ height: 30 }}
                                            >
                                                <Typography
                                                    variant="overline"
                                                    key={`list-trx-${axis_sense}-${indexSub}-${content[1]}`}
                                                    sx={{ minWidth: 35, height: 15, textAlign: "center" }}
                                                >
                                                    {content[0]}
                                                </Typography>
                                                <Typography
                                                    variant="overline"
                                                    key={`list-pin-${axis_sense}-${indexSub}-${content[1]}`}
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {content[1]}
                                                </Typography>
                                            </Stack>
                                        </ListItemText>
                                    );
                                })}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </div>
        );
    }

    return (
        <Stack alignItems="center">
            <List sx={{ width: 500, bgcolor: "background.paper" }}>
                {dispalyBankingScheme()}
            </List>
        </Stack>
    );
}
