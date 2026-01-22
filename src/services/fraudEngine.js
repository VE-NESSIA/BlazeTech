export function detectFraud({ loanAmount, transactions, country, ip }) {
  const flags = [];

  const avg =
    transactions.length === 0
      ? 0
      : transactions.reduce((s, t) => s + t.amount, 0) / transactions.length;

  if (loanAmount > avg * 5) {
    flags.push({ code: 'AMOUNT_SPIKE', severity: 'HIGH' });
  }

  if (country !== 'Nigeria') {
    flags.push({ code: 'GEO_MISMATCH', severity: 'MEDIUM' });
  }

  if (ip?.isProxy) {
    flags.push({ code: 'IP_RISK', severity: 'MEDIUM' });
  }

  return flags;
}
