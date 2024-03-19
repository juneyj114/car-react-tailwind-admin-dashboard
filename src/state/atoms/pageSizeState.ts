import { atom } from "recoil";

export const pageSizeState = atom<number>({
    key: "pageSizeState",
    default: 1000
})