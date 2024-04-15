import { atom } from "recoil";
import { formatYMD } from "../../js/dateFormat";

const startDate: Date = new Date();
startDate.setDate(new Date().getDate() - 3);

const endDate: Date = new Date();

export const startDateState = atom<string>({
    key: "startDateState",
    default: formatYMD(startDate)
})

export const endDateState = atom<string>({
    key: "endDateState",
    default: formatYMD(endDate)
})
