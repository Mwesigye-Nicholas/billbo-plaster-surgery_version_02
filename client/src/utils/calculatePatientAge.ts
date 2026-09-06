import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const calculateAge = (dateOfBirth: string) => {
  const birth = dayjs(dateOfBirth);
  const now = dayjs();

  const years = now.diff(birth, "year");
  const months = now.diff(birth.add(years, "year"), "month");
  const weeks = now.diff(
    birth.add(years, "year").add(months, "month"),
    "weeks",
  );

  const days = now.diff(
      birth
          .add(years, "year")
          .add(months, "month")
          .add(weeks, "week"),
    "day",
    );
    
    return { years, months, weeks, days };
};

export default calculateAge;
