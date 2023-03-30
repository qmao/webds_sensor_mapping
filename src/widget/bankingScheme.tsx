import React, { useEffect, useState } from "react";
import {
  Divider,
  Radio,
  Stack,
  Typography,
  Button,
  Tooltip,
  Paper,
  List
} from "@mui/material";
import { extensionConst } from "./constant";

const BANKING_ITEM_HEIGHT = 30;
const BANKING_ITEM_LIST_HEIGHT = BANKING_ITEM_HEIGHT + 2;
const BANKING_LIST_WIDTH = 420;
const BANKING_ITEM_LIST_WIDTH = BANKING_LIST_WIDTH - 100;

interface IProps {
  asic: string;
  defaultSelect: any;
  bankingSchemeConfig: any;
  expanded: any;
  bankingListAll: any;
  count: any;
  onSelect: any;
}

export const BankingScheme = (props: IProps, ref: any): JSX.Element => {
  const [checked, setChecked] = useState("");
  const [title, setTitle] = useState([]);
  const [selectedBankingScheme, setSelectedBankingScheme] = useState<
    string | undefined
  >(undefined);

  function updateSelectBK(select: any) {
    setChecked(select);
    props.onSelect(select);
    const found = props.bankingListAll.find(
      (element: any) => element["id"] === select
    );
    setSelectedBankingScheme(found);
  }

  useEffect(() => {
    try {
      var title: any = Object.values(
        extensionConst.bankingScheme[props.asic]["Banking"]
      );
      var t = [];
      t = title.map((value: any) => {
        let data = value.slice(3);
        return data;
      });
      setTitle(t);
    } catch (e) {
      console.log(e);
    }
    updateSelectBK(props.defaultSelect);
  }, []);

  const handleToggle = (value: string) => () => {
    if (!props.expanded) return;
    if (checked === value) {
      return;
    } else {
      setChecked(value);
      updateSelectBK(value);
    }
  };

  function getTRxText(data: any) {
    var title: any = Object.values(
      extensionConst.bankingScheme[props.asic]["Banking"]
    );
    var row: any = [];
    data.map((value: any, index: any) => {
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
          <Typography
            color="textPrimary"
            variant="overline"
            key={`list-trx-${id0}-${id1}-${id2}`}
            sx={{ textAlign: "center", width: 25 }}
            style={{ transform: "scale(0.85)" }}
          >
            {content}
          </Typography>
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
      <Stack key={`list-trx-stack-${id0}-${id1}-${id2}`} direction="row">
        <Typography
          color="textPrimary"
          variant="overline"
          key={`list-trx-${id0}-${id1}-${id2}`}
          sx={{ textAlign: "center" }}
        >
          {up}
          {down}
        </Typography>
      </Stack>
    );
  }

  function getTRxCountText(axis: any) {
    var count = props.bankingSchemeConfig[axis]["count"];

    return (
      <Stack key={`get-tx-rx-count-${count[0]}-${count[1]}-${axis}`}>
        {showItems(`T${count[0]}`, `R${count[1]}`, count[0], count[1], "axis")}
      </Stack>
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
        <Stack direction="row">
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            sx={{ pl: 12, width: BANKING_ITEM_LIST_WIDTH }}
          >
            {title.map((value: any) => {
              return (
                <Typography
                  key={`list-title-${value}`}
                  sx={{
                    fontSize: 12,
                    width: BANKING_ITEM_LIST_WIDTH / title.length,
                    textAlign: "center"
                  }}
                  style={{ transform: "scale(0.8)" }}
                >
                  {value.replace(/\[(\d+):(\d+)\]/g, "$2-$1")}
                </Typography>
              );
            })}
          </Stack>
          <Paper elevation={0} sx={{ pl: 1 }} />
        </Stack>
        <Divider />
        {showList.map((value: any, index: any) => {
          var axis_sense = value["id"];
          const labelId = `checkbox-list-label-${axis_sense}-${index}`;
          return (
            <Stack
              key={`listitem-root-${axis_sense}-${index}`}
              sx={{ height: BANKING_ITEM_LIST_HEIGHT, p: 0, b: 0, m: 0 }}
              spacing={2}
            >
              <Button
                variant="text"
                key={`listitem-button-${axis_sense}-${index}`}
                onClick={handleToggle(axis_sense)}
                sx={{ m: 0, p: 0, width: BANKING_LIST_WIDTH }}
              >
                <Stack
                  key={`listitem-stack2-${axis_sense}-${index}`}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Radio
                    id={labelId}
                    key={`radio-${axis_sense}-${index}`}
                    checked={axis_sense === checked}
                    value={axis_sense}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "B" }}
                    disabled={!props.expanded}
                  />

                  <Stack
                    direction="row"
                    key={`list-trx-count-root-stack-${axis_sense}-${index}`}
                    sx={{
                      height: BANKING_ITEM_LIST_HEIGHT,
                      b: 0,
                      m: 0
                    }}
                  >
                    <Typography
                      color="textPrimary"
                      variant="overline"
                      key={`list-trx-count-${axis_sense}-${index}`}
                      sx={{ textAlign: "center", width: 50 }}
                    >
                      {getTRxCountText(axis_sense)}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      key={`list-divider-${index}-${axis_sense}`}
                    />
                  </Stack>

                  <Stack
                    key={`listitem-stack2-${axis_sense}-${index}`}
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    sx={{ width: BANKING_ITEM_LIST_WIDTH }}
                  >
                    {showBankingTRx(value).map(
                      (content: any, indexSub: any) => {
                        return (
                          <Stack
                            key={`listitem-stack3-${content}-${indexSub}-${axis_sense}-${index}`}
                          >
                            {showItem(
                              content[0],
                              content[1],
                              axis_sense,
                              `${indexSub}`,
                              content[1]
                            )}
                          </Stack>
                        );
                      }
                    )}
                  </Stack>
                </Stack>
              </Button>
            </Stack>
          );
        })}
      </Paper>
    );
  }

  return (
    <Stack alignItems="center">
      <List
        sx={{ width: BANKING_LIST_WIDTH, bgcolor: "background.paper", p: 0 }}
      >
        {dispalyBankingScheme()}
      </List>
    </Stack>
  );
};
