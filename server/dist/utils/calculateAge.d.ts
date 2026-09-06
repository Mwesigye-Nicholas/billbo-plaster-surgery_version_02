export interface AgeBreakdown {
    years: number;
    months: number;
    weeks: number;
}
/**
 * Calculates age in years, months, and weeks.
 * Uses sequential diff logic for accuracy: years → months → weeks.
 */
declare function calculateAge(dob: string | Date): AgeBreakdown;
export default calculateAge;
//# sourceMappingURL=calculateAge.d.ts.map