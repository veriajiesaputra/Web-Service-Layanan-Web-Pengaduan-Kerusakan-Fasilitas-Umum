import { ReportItem, CitizenUser } from '../types';

/**
 * Checks whether the current citizen user is the author/owner of the report.
 * Non-anonymous reports match by normalized phone or case-insensitive name.
 * Anonymous reports return false (can only be managed by admin).
 */
export function isReportOwner(
  report: ReportItem | null | undefined,
  user: CitizenUser | null | undefined
): boolean {
  if (!report || !user) return false;
  if (report.isAnonymous) return false;

  const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');
  const cleanReportPhone = (report.reporterPhone || '').replace(/[^0-9]/g, '');

  if (cleanUserPhone && cleanReportPhone && cleanUserPhone === cleanReportPhone) {
    return true;
  }

  const cleanUserName = (user.name || '').trim().toLowerCase();
  const cleanReportName = (report.reporterName || '').trim().toLowerCase();

  if (cleanUserName && cleanReportName && cleanUserName === cleanReportName) {
    return true;
  }

  return false;
}
