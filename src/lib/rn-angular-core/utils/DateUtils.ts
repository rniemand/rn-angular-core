interface IDateUtils {
  toStartOfDay: (date: Date) => Date;
  addDays: (date: Date, days: number) => Date;
  addMonths: (date: Date, days: number) => Date;
}

const _toStartOfDay = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

const _addDays = (date: Date, days: number) => {
  return new Date(
    date.getTime() + (days * 86400) * 1000
  );
}

const _addMonths = (date: Date, months: number) => {
  let addYears = Math.floor(months / 12);
  let newMonth = date.getMonth() + (months - (addYears * 12));
  if(newMonth > 11) { addYears += 1; newMonth -= 12; }
  let newYear = date.getFullYear() + addYears;
  
  return new Date(newYear, newMonth, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
}

export const dateUtils: IDateUtils = {
  toStartOfDay: _toStartOfDay,
  addDays: _addDays,
  addMonths: _addMonths
};
