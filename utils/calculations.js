import PDFDocument from 'pdfkit';
export function calculatePaymentPlan50(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;
  // Define headers for the table (they may differ depending on financing option)
 const headers = ['Payment Stage', 'Percent Equity Paid', 'Percent Bank', '$ Equity Paid', '$ Bank Funded'];
const keys = ['paymentStage', 'percentEquity', 'percentBank', 'equityPaid', 'bankFunded'];

const paymentStages = [
  { stage: "At Signing of Contract", percentEquity: 0.15, percentBank: 0 },
  { stage: "6 months", percentEquity: 0.03, percentBank: 0.09 },
  { stage: "12 months", percentEquity: 0.03, percentBank: 0.09 },
  { stage: "18 months", percentEquity: 0.03, percentBank: 0.09 },
  { stage: "24 months", percentEquity: 0.03, percentBank: 0.08 },
  { stage: "30 months", percentEquity: 0.03, percentBank: 0.08 },
  { stage: "36 Months", percentEquity: 0.05, percentBank: 0.07 },
  { stage: "Delivery of the apartment", percentEquity: 0.15, percentBank: 0 },
];

// Build rows by calculating each required field
const rows = paymentStages.map(stage => {
  const equityPaidUSD = stage.percentEquity * totalPriceUSD;
  const bankFundedUSD = stage.percentBank * totalPriceUSD;

  return {
    paymentStage: stage.stage,
    percentEquity: (stage.percentEquity * 100).toFixed(2) + '%',
    percentBank: (stage.percentBank * 100).toFixed(2) + '%',
    equityPaid: '$' + equityPaidUSD.toFixed(2),
    bankFunded: '$' + bankFundedUSD.toFixed(2),
  };
});

  // Calculate totals (using raw numeric values)
const totalPercentEquity = paymentStages.reduce((sum, stage) => sum + stage.percentEquity, 0);
const totalPercentBank = paymentStages.reduce((sum, stage) => sum + stage.percentBank, 0);
const totalEquityPaid = paymentStages.reduce((sum, stage) => sum + (stage.percentEquity * totalPriceUSD), 0);
const totalBankFunded = paymentStages.reduce((sum, stage) => sum + (stage.percentBank * totalPriceUSD), 0);

// Create blank row
const blankRow = {
  paymentStage: '',
  percentEquity: '',
  percentBank: '',
  equityPaid: '',
  bankFunded: ''
};

// Create totals row
const totalsRow = {
  paymentStage: 'Total',
  percentEquity: (totalPercentEquity * 100).toFixed(2) + '%',
  percentBank: (totalPercentBank * 100).toFixed(2) + '%',
  equityPaid: totalEquityPaid.toFixed(2),
  bankFunded: totalBankFunded.toFixed(2)
};

// Append blank row and totals row
rows.push(blankRow);
rows.push(totalsRow);

return {
  header: headers,
  keys: keys,
  rows,
  totalPriceUSD: totalPriceUSD.toFixed(2),
  totalPriceILS: totalPriceILS.toFixed(2)
};}

// ---------------------------------------------------------

export function calculatePaymentPlan0(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;
  // Define headers for the table (they may differ depending on financing option)
  const headers = ['Payment Stage', 'Amount (ILS)', 'Amount (USD)', 'Percent', 'Cumulative (USD)'];
  const keys = ["paymentStage", "amountToPayILS", "amountToPayUSD", "percent", "cumulative"];

  const paymentStages = [
    { stage: "At Signing of Contract", percent: 0.15 },
    { stage: "6 months", percent: 0.12 },
    { stage: "12 months", percent: 0.12 },
    { stage: "18 months", percent: 0.12 },
    { stage: "24 months", percent: 0.11 },
    { stage: "30 months", percent: 0.11 },
    { stage: "36 Months", percent: 0.12 },
    { stage: "Delivery of the apartment", percent: 0.15 },
  ];

  let cumulativeUSD = 0;
  const rows = paymentStages.map((stage) => {
    const amountToPayUSD = totalPriceUSD * stage.percent;
    const amountToPayILS = totalPriceILS * stage.percent;
    cumulativeUSD += amountToPayUSD;

    return {
      paymentStage: stage.stage,
      amountToPayILS: amountToPayILS.toFixed(2),
      amountToPayUSD: amountToPayUSD.toFixed(2),
      percent: (stage.percent * 100).toFixed(2) + '%',
      cumulative: cumulativeUSD.toFixed(2)
    };
  });

  const totalILS = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayILS), 0).toFixed(2);
  const totalUSD = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayUSD), 0).toFixed(2);

return {
    header: headers,
    keys: keys,
    rows,
    totalILS,
    totalUSD,
    totalPriceUSD: totalPriceUSD.toFixed(2),
    totalPriceILS: totalPriceILS.toFixed(2)
  };}
// ---------------------------
export function calculatePaymentPlan70(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;
  // Define headers for the table (they may differ depending on financing option)
  const headers = ['Payment Stage', 'Amount (ILS)', 'Amount (USD)', 'Percent', 'Cumulative (USD)'];
  const keys = ["paymentStage", "amountToPayILS", "amountToPayUSD", "percent", "cumulative"];

  const paymentStages = [
    { stage: "At Signing of Contract", percent: 0.15 },
    { stage: "6 months", percent: 0.12 },
    { stage: "12 months", percent: 0.12 },
    { stage: "18 months", percent: 0.12 },
    { stage: "24 months", percent: 0.11 },
    { stage: "30 months", percent: 0.11 },
    { stage: "36 Months", percent: 0.12 },
    { stage: "Delivery of the apartment", percent: 0.15 },
  ];

  let cumulativeUSD = 0;
  const rows = paymentStages.map((stage) => {
    const amountToPayUSD = totalPriceUSD * stage.percent;
    const amountToPayILS = totalPriceILS * stage.percent;
    cumulativeUSD += amountToPayUSD;

    return {
      paymentStage: stage.stage,
      amountToPayILS: amountToPayILS.toFixed(2),
      amountToPayUSD: amountToPayUSD.toFixed(2),
      percent: (stage.percent * 100).toFixed(2) + '%',
      cumulative: cumulativeUSD.toFixed(2)
    };
  });

  const totalILS = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayILS), 0).toFixed(2);
  const totalUSD = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayUSD), 0).toFixed(2);

return {
    header: headers,
    keys: keys,
    rows,
    totalILS,
    totalUSD,
    totalPriceUSD: totalPriceUSD.toFixed(2),
    totalPriceILS: totalPriceILS.toFixed(2)
  };}
// ------------------------------------------

export function calculatePaymentPlan75(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;
  // Define headers for the table (they may differ depending on financing option)
  const headers = ['Payment Stage', 'Amount (ILS)', 'Amount (USD)', 'Percent', 'Cumulative (USD)'];
  const keys = ["paymentStage", "amountToPayILS", "amountToPayUSD", "percent", "cumulative"];

  const paymentStages = [
    { stage: "At Signing of Contract", percent: 0.15 },
    { stage: "6 months", percent: 0.12 },
    { stage: "12 months", percent: 0.12 },
    { stage: "18 months", percent: 0.12 },
    { stage: "24 months", percent: 0.11 },
    { stage: "30 months", percent: 0.11 },
    { stage: "36 Months", percent: 0.12 },
    { stage: "Delivery of the apartment", percent: 0.15 },
  ];

  let cumulativeUSD = 0;
  const rows = paymentStages.map((stage) => {
    const amountToPayUSD = totalPriceUSD * stage.percent;
    const amountToPayILS = totalPriceILS * stage.percent;
    cumulativeUSD += amountToPayUSD;

    return {
      paymentStage: stage.stage,
      amountToPayILS: amountToPayILS.toFixed(2),
      amountToPayUSD: amountToPayUSD.toFixed(2),
      percent: (stage.percent * 100).toFixed(2) + '%',
      cumulative: cumulativeUSD.toFixed(2)
    };
  });

  const totalILS = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayILS), 0).toFixed(2);
  const totalUSD = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayUSD), 0).toFixed(2);

return {
    header: headers,
    keys: keys,
    rows,
    totalILS,
    totalUSD,
    totalPriceUSD: totalPriceUSD.toFixed(2),
    totalPriceILS: totalPriceILS.toFixed(2)
  };}

// ------------------------------------------ 
export function generatePDF(res, planData) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payment-plan.pdf');
    res.end(pdfData);
  });
  
  // Title
  doc.fontSize(16).font('Helvetica-Bold').text('Payment Plan', { align: 'center' });
  doc.moveDown(2);

  // Define columns
  const startX = doc.page.margins.left; // typically 50
  const tableTop = doc.y;
  // Example widths that sum to less than 495 for A4 minus margins
  const colWidths = [150, 90, 90, 70, 90];
  
  // Calculate x positions
  const colX = [];
  colX[0] = startX;
  for (let i = 1; i < colWidths.length; i++) {
    colX[i] = colX[i - 1] + colWidths[i - 1];
  }

  // Use dynamic headers
  const headers = planData.header;
  const keys = planData.keys;

  // Draw table headers
  doc.fontSize(10).font('Helvetica-Bold');
  headers.forEach((headerText, index) => {
    const alignment = (index === 0) ? 'center' : 'right';
    doc.text(headerText, colX[index] + 5, tableTop + 5, {
      width: colWidths[index] - 10,
      align: alignment
    });
  });

  // Draw header border
  const headerHeight = 20;
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], tableTop, colWidths[i], headerHeight).stroke();
  }
  
  // Start rows after header
  let currentY = tableTop + headerHeight;
  doc.font('Helvetica').fontSize(10);

  // Draw data rows
  planData.rows.forEach((row) => {
    const rowHeight = 20;
    // Draw cell borders
    for (let i = 0; i < colWidths.length; i++) {
      doc.rect(colX[i], currentY, colWidths[i], rowHeight).stroke();
    }
    
    // Insert row data
    keys.forEach((key, idx) => {
      let cellValue = row[key];
      const numValue = Number(cellValue);
      if (!isNaN(numValue)) {
        cellValue = formatNumber(numValue);
      } else if (cellValue == null) {
        cellValue = "";
      } else {
        cellValue = cellValue.toString();
      }
      const align = idx === 0 ? 'center' : 'right';
      doc.text(cellValue, colX[idx] + 5, currentY + 5, {
        width: colWidths[idx] - 10,
        align
      });
    });
    currentY += rowHeight;
  });

  // Optional extra info
  doc.moveDown(2).fontSize(11)
    .text('Delivery time: 36 months', { align: 'left' });
  
  doc.end();
}

// Helper to format numeric values with commas
function formatNumber(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}
