import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';

/**
 * Simple rule-based fraud detector for demonstration.
 * Evaluates a transaction and returns an object { score, flags, severity }
 */
export async function evaluateTransaction(tx) {
const flags = [];
let score = 0;

  // Rule: large amount
  const largeAmountThreshold = 10000; // simple heuristic
if (parseFloat(tx.amount) > largeAmountThreshold) {
    flags.push('large_amount');
    score += 60;
}

  // Rule: unusual currency (small penalty)
if (tx.currency && tx.currency !== 'NGN' && parseFloat(tx.amount) > 1000) {
    flags.push('unusual_currency');
    score += 10;
}

  // Rule: rapid transactions (last 1 minute >= 3)
const recentWindowSeconds = 60;
const [recent] = await Transaction.sequelize.query(
    `SELECT COUNT(*)::int AS cnt FROM "Transactions" WHERE customer_id = $1 AND created_at >= now() - interval '${recentWindowSeconds} seconds'`,
    { bind: [tx.customerId] }
);
const cnt = recent && recent[0] && recent[0].cnt ? recent[0].cnt : 0;
if (cnt >= 3) {
    flags.push('rapid_transactions');
    score += 30;
}

  // Rule: geolocation mismatch (compare tx.location.country to customer.address.country)
try {
    const cust = await tx.getCustomer();
    if (cust && cust.address) {
    const custCountry = (cust.address && cust.address.country) ? cust.address.country : null;
    const txCountry = (tx.location && tx.location.country) ? tx.location.country : null;
    if (custCountry && txCountry && custCountry.toLowerCase() !== txCountry.toLowerCase()) {
        flags.push('geo_mismatch');
        score += 30;
    }

      // Rule: IP address not in customer's known ips
    const txIp = tx.ip_address || tx.ip || null;
    const knownIps = (cust.address && Array.isArray(cust.address.known_ips)) ? cust.address.known_ips : [];
    if (txIp && knownIps.length > 0 && !knownIps.includes(txIp)) {
        flags.push('new_ip');
        score += 20;
    }
    }
} catch (err) {
    // don't fail detection on lookup errors
    console.warn('fraudDetector: customer lookup failed', err.message);
}

  // Cap score
if (score > 100) score = 100;

  // Determine severity
let severity = 'low';
if (score >= 70) severity = 'high';
else if (score >= 40 && score < 70) severity = 'medium';

  // Determine color mapping: red (high >=70), yellow (medium 40-69), green (<40)
let color = 'green';
if (score >= 70) color = 'red';
else if (score >= 40 && score < 70) color = 'yellow';

return { score, flags, severity };
}

export async function processTransaction(tx) {
const { score, flags, severity } = await evaluateTransaction(tx);

  // Update transaction with score and flags
await Transaction.update({ fraud_score: score, fraud_flags: flags }, { where: { id: tx.id } });

  // Determine color
const color = score >= 70 ? 'red' : (score >= 40 ? 'yellow' : 'green');

  // Create an alert if above threshold
if (score >= 40) {
    const existing = await Alert.findOne({ where: { transactionId: tx.id, alert_type: 'Fraud' } });
    if (existing) {
    await existing.update({ severity, color, description: `Auto-detected fraud (score=${score}) flags=${flags.join(',')}` });
    } else {
    await Alert.create({
        customerId: tx.customerId,
        transactionId: tx.id,
        alert_type: 'Fraud',
        severity,
        color,
        description: `Auto-detected fraud (score=${score}) flags=${flags.join(',')}`
    });
    }
}

return { score, flags, severity };
}

export default { evaluateTransaction, processTransaction };
