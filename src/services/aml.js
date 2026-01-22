export function analyzeTransactions(transactions) {
    let risk = 0;

    if (transactions.length > 20) risk += 30;

    const total = transactions.reduce((s, t) => s + t.amount, 0);
    if (total > 1_000_000) risk += 40;

    return risk;
}
