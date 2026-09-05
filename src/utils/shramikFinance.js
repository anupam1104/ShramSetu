export const WORKER_SHARE_PERCENT = 85;
export const PLATFORM_CUT_PERCENT = 100 - WORKER_SHARE_PERCENT;

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const grossOf = (b) => b.totalAmount ?? b.amount ?? b.serviceFee ?? 0;
export const cutOf = (b) => Math.round((grossOf(b) * PLATFORM_CUT_PERCENT) / 100);
export const netOf = (b) => grossOf(b) - cutOf(b);
export const dateLabel = (b) => b.date || b.scheduleDate || b.bookingDate || '';
export const jobLabel = (b, t) => b.serviceName || b.jobTitle || b.skill || t('generalService', 'General Service');
export const badgeClassFor = (status) =>
  status === 'Paid' ? 'badge-paid' :
  status === 'Completed' ? 'badge-completed' :
  status === 'In Progress' ? 'badge-in-progress' : 'badge-confirmed';

export const computeShramikFinance = (bookings, shramikId) => {
  const shramikBookings = bookings.filter(b => b.shramikId === shramikId);
  const receivedBookings = shramikBookings.filter(b => b.status === 'Paid');
  const upcomingBookings = shramikBookings.filter(b => ['Confirmed', 'In Progress', 'Completed'].includes(b.status));
  const earningBookings = [...receivedBookings, ...upcomingBookings];

  const receivedNet = receivedBookings.reduce((sum, b) => sum + netOf(b), 0);
  const upcomingNet = upcomingBookings.reduce((sum, b) => sum + netOf(b), 0);
  const totalNet = receivedNet + upcomingNet;
  const totalGross = earningBookings.reduce((sum, b) => sum + grossOf(b), 0);
  const govtCut = totalGross - totalNet;
  const workerPct = totalGross > 0 ? Math.round((totalNet / totalGross) * 100) : WORKER_SHARE_PERCENT;
  const govtPct = 100 - workerPct;

  return {
    shramikBookings,
    receivedBookings,
    upcomingBookings,
    earningBookings,
    receivedNet,
    upcomingNet,
    totalNet,
    totalGross,
    govtCut,
    workerPct,
    govtPct
  };
};