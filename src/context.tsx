import { createContext } from "react";

export const UserContext = createContext({
    txCount: "0",
    rxCount: "0",
    txDefaultList: [...Array(100).keys()],
    rxDefaultList: [...Array(100).keys()]
});
