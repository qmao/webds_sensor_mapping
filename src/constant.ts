export const extensionConst = {
	partNumber: {
		keys: ["s3908", "s3909"],
		rio: ["s3808"]
	},
	bankingScheme: {
        keys: {
            Banking: {
                BK4: "TRX[29:22]",
                BK3: "TRX[21:20]",
                BK2: "TRX[19:10]",
                BK1: "TRX[9:8]",
                BK0: "TRX[7:0]",
                BK7: "TRX[59:50]",
                BK6: "TRX[49:40]",
                BK5: "TRX[39:30]"
            },
            "axis-sense": [
                {
                    id: "0",
                    mapping: ["Tx", "Tx", "Tx", "Tx", "Tx", "Tx", "Tx", "Tx"]
                },
                {
                    id: "1",
                    mapping: ["Rx", "Rx", "Rx", "Tx", "Tx", "Tx", "Rx", "Rx"]
                },
                {
                    id: "2",
                    mapping: ["Tx", "Tx", "Tx", "Rx", "Rx", "Rx", "Tx", "Tx"]
                },
                {
                    id: "3",
                    mapping: ["Tx", "Tx", "Rx", "Rx", "Rx", "Rx", "Rx", "Tx"]
                },
                {
                    id: "4",
                    mapping: ["Rx", "Rx", "Tx", "Tx", "Tx", "Tx", "Tx", "Rx"]
                },
                {
                    id: "5",
                    mapping: ["Rx", "Rx", "Rx", "Rx", "Tx", "Tx", "Rx", "Rx"]
                },
                {
                    id: "6",
                    mapping: ["Tx", "Tx", "Tx", "Tx", "Rx", "Rx", "Tx", "Tx"]
                },
                {
                    id: "7",
                    mapping: ["Tx", "Rx", "Rx", "Rx", "Rx", "Rx", "Rx", "Tx"]
                },
                {
                    id: "0xa",
                    mapping: ["Rx", "Tx", "Tx", "Tx", "Tx", "Tx", "Tx", "Rx"]
                }
            ],
            exclusive: [
                ["BK0", "BK4"],
                ["BK5", "BK7"]
            ]
        },
        rio: {
            Banking: [{ BK0: "TRX[7:0]" }, { BK1: "TRX[8:9]" }, { BK2: "TRX[19:10]" }]
        }
    }
};