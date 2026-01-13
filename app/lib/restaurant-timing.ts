export type TimingAutomationMode = 'auto' | 'force_open' | 'force_closed';

function getKolkataYmdHm(date: Date) {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = dtf.formatToParts(date);
  const map: any = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }

  return {
    ymd: `${map.year}-${map.month}-${map.day}`,
    hm: `${map.hour}:${map.minute}`,
  };
}

function toMinutes(hm: string) {
  const m = String(hm || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(mm) || h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

function inWindow(hm: string, start: string, end: string) {
  const x = toMinutes(hm);
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (x === null || s === null || e === null) return null;
  if (s === e) return false;
  if (s < e) return x >= s && x < e;
  return x >= s || x < e;
}

export function getEffectiveRestaurantOpen(restaurant: any, now = new Date()) {
  const manualIsOpen = restaurant?.isOpen !== false;
  const ta = restaurant?.timingAutomation;

  if (!ta?.enabled) {
    return { isOpen: manualIsOpen, reason: 'manual' as const };
  }

  const mode: TimingAutomationMode = ta?.mode || 'auto';
  if (mode === 'force_open') return { isOpen: true, reason: 'force_open' as const };
  if (mode === 'force_closed') return { isOpen: false, reason: 'force_closed' as const };

  const { ymd, hm } = getKolkataYmdHm(now);

  const holidays: string[] = Array.isArray(ta?.holidays) ? ta.holidays.map((d: any) => String(d?.date || d || '').trim()).filter(Boolean) : [];
  if (holidays.includes(ymd)) {
    return { isOpen: false, reason: 'holiday' as const };
  }

  const overrides = Array.isArray(ta?.specialDays) ? ta.specialDays : [];
  const override = overrides.find((o: any) => String(o?.date || '').trim() === ymd);
  if (override) {
    const forced = typeof override?.isOpen === 'boolean' ? override.isOpen : null;
    if (forced === false) return { isOpen: false, reason: 'special_closed' as const };

    const oStart = String(override?.openingTime || restaurant?.openingTime || '').trim();
    const oEnd = String(override?.closingTime || restaurant?.closingTime || '').trim();
    const within = inWindow(hm, oStart, oEnd);
    if (within === null) return { isOpen: manualIsOpen, reason: 'invalid_time' as const };
    return { isOpen: within, reason: 'special_hours' as const };
  }

  const start = String(restaurant?.openingTime || '').trim();
  const end = String(restaurant?.closingTime || '').trim();
  const within = inWindow(hm, start, end);
  if (within === null) {
    return { isOpen: manualIsOpen, reason: 'invalid_time' as const };
  }

  return { isOpen: within, reason: 'hours' as const };
}
