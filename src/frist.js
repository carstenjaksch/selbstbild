/* Löschfrist: Stände, die so viele Tage nicht geändert wurden, löscht der tägliche Cron. */
export const FRIST_TAGE = 730;
export const tag = (ms = Date.now()) => Math.floor(ms / 86400000);
