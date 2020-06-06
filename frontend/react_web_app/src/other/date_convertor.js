import { gregorian_to_jalali } from './convertor'


export function to_jalali(date_str) {
    // date must be in this format: 2020-06-04T16:42:42.974422Z
    // we only get 10 first characters

    const date = date_str.slice(0, 10);
    const elements = date.split("-");

    const year = parseInt(elements[0]);
    const month = parseInt(elements[1]);
    const day = parseInt(elements[2]);

    const converted_date = gregorian_to_jalali(year, month, day);
    return converted_date.join("/") + " - " + date_str.slice(11, 19);
}
