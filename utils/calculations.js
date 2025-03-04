export function calculatePaymentPlan(apartmentPrice, conversionRate, userCurrency) {
  let totalPriceUSD, totalPriceILS;
  if (userCurrency === 'USD') {
    totalPriceUSD = apartmentPrice;
    totalPriceILS = apartmentPrice * conversionRate;
  } else {
    totalPriceILS = apartmentPrice;
    totalPriceUSD = apartmentPrice / conversionRate;
  }
  
  // Build the table header and rows.
  const header = ["Payment Stage", "Amount to Pay ILS", "Amount to Pay USD", "Percent", "Cumulative"];
  const rows = [];
  
  // Example: First Row - Signing of Contract with 15%
  const percent = 0.15;
  const amountToPayUSD = totalPriceUSD * percent;
  const amountToPayILS = totalPriceILS * percent;
  const cumulativeUSD = amountToPayUSD; // For first row, cumulative equals the payment made.
  
  rows.push({
    paymentStage: "Signing of Contract",
    amountToPayILS,
    amountToPayUSD,
    percent: (percent * 100).toFixed(2) + '%',
    cumulative: cumulativeUSD
  });
  
  // TODO: Add additional rows (total 12 rows) following your desired logic.
  
  return { totalPriceUSD, totalPriceILS, header, rows };
}

export default calculatePaymentPlan;
