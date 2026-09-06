// utils/calculateAge.ts
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * Calculates age in years, months, and weeks.
 * Uses sequential diff logic for accuracy: years → months → weeks.
 */
function calculateAge(dob) {
    const birthDate = dayjs(dob);
    const now = dayjs();
    if (!birthDate.isValid()) {
        throw new Error("Invalid date of birth provided.");
    }
    // 1. Years
    const years = now.diff(birthDate, "year");
    let remainder = birthDate.add(years, "year");
    // 2. Months
    const months = now.diff(remainder, "month");
    remainder = remainder.add(months, "month");
    // 3. Weeks
    const weeks = now.diff(remainder, "week");
    return {
        years,
        months,
        weeks,
    };
}
export default calculateAge;
//# sourceMappingURL=calculateAge.js.map