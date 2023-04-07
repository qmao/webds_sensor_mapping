export const extensionConst: any = {
  partNumber: {
    keys: ["s3913"],
    rio: ["s3908", "s3909"],
    juneau: ["s3910"]
  },
  bankingScheme: {
    jira: "https://jira.synaptics.com/browse/SWDS6-3451",
    keys: {
      Banking: {
        BK0: "TRX[7:0]",
        BK1: "TRX[9:8]",
        BK2: "TRX[19:10]",
        BK3: "TRX[21:20]",
        BK4: "TRX[29:22]",
        BK5: "TRX[39:30]",
        BK6: "TRX[49:40]",
        BK7: "TRX[59:50]"
      },
      "axis-sense": [
        {
          id: "1",
          mapping: ["Tx", "Rx", "Rx", "Rx", "Rx", "Rx", "Rx", "Tx"]
        },
        {
          id: "2",
          mapping: ["Tx", "Tx", "Rx", "Rx", "Rx", "Rx", "Rx", "Tx"]
        },
        {
          id: "3",
          mapping: ["Rx", "Rx", "Rx", "Rx", "Tx", "Tx", "Rx", "Rx"]
        },
        {
          id: "4",
          mapping: ["Rx", "Rx", "Rx", "Tx", "Tx", "Tx", "Rx", "Rx"]
        },
        {
          id: "5",
          mapping: ["Tx", "1T1R", "Rx", "Rx", "Rx", "Rx", "Rx", "Tx"]
        },
        {
          id: "6",
          mapping: ["Rx", "Rx", "Rx", "1T1R", "Tx", "Tx", "Rx", "Rx"]
        }
      ],
      exclusive: [
        ["BK0", "BK4"],
        ["BK5", "BK7"]
      ],
      settings: [
        {
          condition: ["1", "2", "3", "5", "6:20"],
          configs: {
            "tchCbcGlobalConfigCtl1[0].cbcGlobalConn": 1,
            "tchCbcGlobalConfigCtl1[1].cbcGlobalConn": 0,
            "tchCbcGlobalConfigCtl1[2].cbcGlobalConn": 0,
            "tchCbcGlobalConfigCtl1[3].cbcGlobalConn": 1,
            cbcGlobalConn121: [0, 0, 0, 0, 0, 0]
          }
        },
        {
          condition: ["4", "6:21"],
          configs: {
            "tchCbcGlobalConfigCtl1[0].cbcGlobalConn": 1,
            "tchCbcGlobalConfigCtl1[1].cbcGlobalConn": 0,
            "tchCbcGlobalConfigCtl1[2].cbcGlobalConn": 0,
            "tchCbcGlobalConfigCtl1[3].cbcGlobalConn": 1,
            cbcGlobalConn121: [0, 0, 0, 0, 1, 0]
          }
        }
      ]
    },
    rio: {
      Banking: {
        BK2: "TRX[29:20]",
        BK1: "TRX[19:10]",
        BK0: "TRX[9:0]",
        BK5: "TRX[59:50]",
        BK4: "TRX[49:40]",
        BK3: "TRX[39:30]"
      },
      "axis-sense": [
        {
          id: "0x00",
          mapping: ["Tx", "Tx", "Tx", "Tx", "Tx", "Tx"]
        },
        {
          id: "0x1E",
          mapping: ["Rx", "Rx", "Tx", "Tx", "Rx", "Rx"]
        },
        {
          id: "0x21",
          mapping: ["Tx", "Tx", "Rx", "Rx", "Tx", "Tx"]
        },
        {
          id: "0x33",
          mapping: ["Tx", "Rx", "Rx", "Rx", "Rx", "Tx"]
        },
        {
          id: "0x0C",
          mapping: ["Rx", "Tx", "Tx", "Tx", "Tx", "Rx"]
        },
        {
          id: "0x36",
          mapping: ["Tx", "Rx", "Rx", "Tx", "Rx", "Rx"]
        },
        {
          id: "0x1B",
          mapping: ["Rx", "Rx", "Tx", "Rx", "Rx", "Tx"]
        }
      ]
    },
    juneau: {
      jira: "https://jira.synaptics.com/browse/SWDS6-3159",
      Banking: {
        BK2: "TRX[29:20]",
        BK1: "TRX[19:10]",
        BK0: "TRX[9:0]",
        BK5: "TRX[59:50]",
        BK4: "TRX[49:40]",
        BK3: "TRX[39:30]"
      },
      "axis-sense": [
        {
          id: "0",
          mapping: ["Tx", "Tx", "Tx", "Tx", "Tx", "Tx"]
        },
        {
          id: "1",
          mapping: ["Rx", "Rx", "Tx", "Tx", "Rx", "Rx"]
        },
        {
          id: "2",
          mapping: ["Tx", "Tx", "Rx", "Rx", "Tx", "Tx"]
        },
        {
          id: "3",
          mapping: ["Tx", "Rx", "Rx", "Rx", "Rx", "Tx"]
        },
        {
          id: "4",
          mapping: ["Rx", "Tx", "Tx", "Tx", "Tx", "Rx"]
        }
      ]
    },
    temp: {
      Banking: {
        BK2: "TRX[29:20]",
        BK1: "TRX[19:10]"
      },
      "axis-sense": [
        {
          id: "0x00",
          mapping: ["Tx", "Tx", "Tx", "Tx", "Tx", "Tx"]
        },
        {
          id: "0x1E",
          mapping: ["Rx", "Rx", "Tx", "Tx", "Rx", "Rx"]
        }
      ]
    }
  },
  steps: 4,
  buttonApplyId: "button-stepper-apply"
};
