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
  // Calculate the raw amounts in USD
  const equityPaidUSD = stage.percentEquity * totalPriceUSD;
  const bankFundedUSD = stage.percentBank * totalPriceUSD;

  // Round and format, checking if the amount actually rounds to zero
  const equityPaidRounded = Math.round(equityPaidUSD);
  const bankFundedRounded = Math.round(bankFundedUSD);

  return {
    paymentStage: stage.stage,
    percentEquity: stage.percentEquity === 0 ? '' : (stage.percentEquity * 100).toFixed(0) + '%',
    percentBank: stage.percentBank === 0 ? '' : (stage.percentBank * 100).toFixed(0) + '%',
    equityPaid: equityPaidRounded === 0 ? '' : '$' + formatNumber(equityPaidRounded),
    bankFunded: bankFundedRounded === 0 ? '' : '$' + formatNumber(bankFundedRounded),
  };
});

// Calculate totals (using raw numeric values)
const totalPercentEquity = paymentStages.reduce((sum, stage) => sum + stage.percentEquity, 0);
const totalPercentBank = paymentStages.reduce((sum, stage) => sum + stage.percentBank, 0);
const totalEquityPaid = paymentStages.reduce((sum, stage) => sum + (stage.percentEquity * totalPriceUSD), 0);
const totalBankFunded = paymentStages.reduce((sum, stage) => sum + (stage.percentBank * totalPriceUSD), 0);

// Create a blank row with empty strings
const blankRow = {
  paymentStage: '',
  percentEquity: '',
  percentBank: '',
  equityPaid: '',
  bankFunded: ''
};

// Create totals row with the same logic
const totalsRow = {
  paymentStage: 'Total',
  percentEquity: totalPercentEquity === 0 ? '' : (totalPercentEquity * 100).toFixed(0) + '%',
  percentBank: totalPercentBank === 0 ? '' : (totalPercentBank * 100).toFixed(0) + '%',
  equityPaid: Math.round(totalEquityPaid) === 0 ? '' : '$' + formatNumber(Math.round(totalEquityPaid)),
  bankFunded: Math.round(totalBankFunded) === 0 ? '' : '$' + formatNumber(Math.round(totalBankFunded)),
};

// Append blank row and totals row
rows.push(blankRow);
rows.push(totalsRow);

return {
  header: headers,
  keys: keys,
  rows,
  totalPriceUSD: '$' + formatNumber(Math.round(totalPriceUSD)),
  totalPriceILS: '$' + formatNumber(Math.round(totalPriceILS)),
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

  // Define columns with updated width for "$ Equity Paid"
  const startX = doc.page.margins.left;
  const tableTop = doc.y;
  const colWidths = [150, 90, 130, 70, 90]; // Adjusted widths
  
  // Calculate x positions
  const colX = [];
  colX[0] = startX;
  for (let i = 1; i < colWidths.length; i++) {
    colX[i] = colX[i - 1] + colWidths[i - 1];
  }

  // Use dynamic headers
  const headers = planData.header;
  const keys = planData.keys;

  // Draw table headers with wrapping
  doc.fontSize(10).font('Helvetica-Bold');
  headers.forEach((headerText, index) => {
    const alignment = (index === 0) ? 'center' : 'right';
    doc.text(headerText, colX[index] + 5, tableTop + 5, {
      width: colWidths[index] - 10,
      align: alignment,
      characterSpacing: 0.75, // Slightly adjust to aid wrapping
      lineGap: 3 // Add space between lines if wrapped
    });
  });

  // Draw header border
  const headerHeight = 40; // Increased for better text wrapping
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], tableTop, colWidths[i], headerHeight).stroke();
  }

  // Start rows after header
  let currentY = tableTop + headerHeight;
  doc.font('Helvetica').fontSize(10);

  // Draw data rows
  planData.rows.forEach((row) => {
    const rowHeight = 20;
    for (let i = 0; i < colWidths.length; i++) {
      doc.rect(colX[i], currentY, colWidths[i], rowHeight).stroke();
    }

    // Insert row data
    keys.forEach((key, idx) => {
      let cellValue = row[key];
      const num = Number(cellValue);
      if ((idx === 3 || idx === 4) && num === 0) {
        cellValue = "";
      } else if (!isNaN(num)) {
        cellValue = '$' + formatNumber(num);
      }

      if (cellValue == null) {
        cellValue = "";
      } else {
        cellValue = cellValue.toString();
      }

      const align = idx === 0 ? 'center' : 'right';
      doc.text(cellValue, colX[idx] + 5, currentY + 5, {
        width: colWidths[idx] - 10,
        align: align
      });
    });

    currentY += rowHeight;
  });

  doc.moveDown(2).fontSize(11).text('Delivery time: 36 months', { align: 'left' });

  doc.end();
}

// Helper to format numeric values with commas
function formatNumber(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
