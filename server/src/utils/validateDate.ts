import dayjs from "dayjs";
import AppError from "./appError.js";

function isValidFutureOrTodayDate(dateInput: unknown): string {
  if (typeof dateInput !== "string" || !dateInput.trim()) {
    throw new AppError("Date of surgery is required", 400);
  }

  const parsedDate = dayjs(dateInput, "YYYY-MM-DD", true);

  if (!parsedDate.isValid()) {
    throw new AppError("Invalid date format", 400);
  }

  const today = dayjs().startOf("day");

  if (parsedDate.isBefore(today)) {
    throw new AppError("Date of surgery must be today or a future date", 400);
  }
  
  return parsedDate.format("YYYY-MM-DD");
}
export default isValidFutureOrTodayDate;