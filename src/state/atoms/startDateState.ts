import { atom } from "recoil";
import { formatYMD } from "../../js/dateFormat";

const startDate: Date = new Date();
startDate.setDate(new Date().getDate() - 7);

export const startDateState = atom<string>({
    key: "startDateState",
    default: formatYMD(startDate)
})