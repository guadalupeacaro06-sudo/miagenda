const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return toLocalDateString(new Date());
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(dateStr: string, offset: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + offset);
  return toLocalDateString(d);
}

export function getWeekStartMonday(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toLocalDateString(d);
}

export function getWeekDays(weekStartStr: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartStr, i));
}

export function formatShortDate(dateStr: string): string {
  const today = getTodayString();
  const tomorrow = addDays(today, 1);
  if (dateStr === today) return 'Hoy';
  if (dateStr === tomorrow) return 'Mañana';
  const d = parseLocalDate(dateStr);
  return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function formatLongDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} de ${MONTHS_LONG[d.getMonth()]}`;
}

export function getWeekdayShort(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return WEEKDAYS_SHORT[d.getDay()];
}

export function getDayNumber(dateStr: string): number {
  return parseLocalDate(dateStr).getDate();
}

export function formatMonthRange(weekStartStr: string): string {
  const start = parseLocalDate(weekStartStr);
  const end = parseLocalDate(addDays(weekStartStr, 6));
  const startMonth = MONTHS_LONG[start.getMonth()];
  const endMonth = MONTHS_LONG[end.getMonth()];
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} al ${end.getDate()} de ${startMonth}`;
  }
  return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} al ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;
}
