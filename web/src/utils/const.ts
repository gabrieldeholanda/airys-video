import { isSafari } from "react-device-detect";

export const PLAYBACK_RATE_DEFAULT = isSafari ? [0.5, 1, 2] : [0.5, 1, 2, 4, 8, 16];
export const WEEK_STARTS_ON = ["Sunday", "Monday"]; 