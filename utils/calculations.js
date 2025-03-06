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
    equityPaid: equityPaidRounded === 0 ? '' : equityPaidRounded,
    bankFunded: bankFundedRounded === 0 ? '' : bankFundedRounded,
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
  equityPaid: Math.round(totalEquityPaid) === 0 ? '' : Math.round(totalEquityPaid),
  bankFunded: Math.round(totalBankFunded) === 0 ? '' : Math.round(totalBankFunded),
};
  
// Create closing costs row 
const closingCosts = {
  paymentStage: 'Closing Costs Est',
  percentEquity: 10 + '%',
  percentBank: '',
  equityPaid: Math.round(totalPriceUSD * .1),
  bankFunded: '0',
};

// Append blank row and totals row
rows.push(blankRow);
rows.push(totalsRow);
rows.push(blankRow);
rows.push(closingCosts);

return {
  header: headers,
  keys: keys,
  rows,
  totalPriceUSD: Math.round(totalPriceUSD),
  totalPriceILS: Math.round(totalPriceILS),
  conversionRate: conversionRate,
  bannerText: '50% Financing'
};}


// ---------------------------------------------------------

export function calculatePaymentPlan0(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;
  // Define headers for the table (they may differ depending on financing option)
  const headers = ['Payment Stage', 'Amount (ILS)', 'Amount ($)', 'Percent', 'Cumulative ($)'];
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
      amountToPayILS: amountToPayILS.toFixed(0),
      amountToPayUSD: amountToPayUSD.toFixed(0),
      percent: (stage.percent * 100).toFixed(0) + '%',
      cumulative: cumulativeUSD.toFixed(2)
    };
  });

  const totalILS = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayILS), 0).toFixed(2);
  const totalUSD = rows.reduce((sum, row) => sum + parseFloat(row.amountToPayUSD), 0).toFixed(2);

 
// Create a blank row with empty strings
const blankRow = {
  amountToPayILS: '',
  amountToPayILS: '',
  amountToPayUSD: '',
  percent: '',
  cumulative: ''
};

// Create totals row with the same logic
const totalsRow = {
  paymentStage: 'Total',
  amountToPayILS: totalILS,
  amountToPayUSD: totalUSD,
  percent: '100%',
  cumulative: '',
};
// Create Message row 
const message = {
  paymentStage: 'DELIVERY TIME',
  amountToPayILS: '36 MONTHS',
  percentBank: '',
  equityPaid: '',
  bankFunded: '',
};
  rows.push(blankRow);
  rows.push(totalsRow);
  rows.push(blankRow);
  rows.push(message);
  
return {
    header: headers,
    keys: keys,
    rows,
    totalILS,
    totalUSD,
    totalPriceUSD: totalPriceUSD.toFixed(0),
    totalPriceILS: totalPriceILS.toFixed(0),
    conversionRate: conversionRate,
    bannerText: 'Paying in Full'

  };}
// ---------------------------
export function calculatePaymentPlan70(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;
  // Define headers for the table (they may differ depending on financing option)
  const headers = ['Payment Stage', 'Percent Equity Paid', 'Percent Bank', '$ Equity Paid', '$ Bank Funded'];
  const keys = ['paymentStage', 'percentEquity', 'percentBank', 'equityPaid', 'bankFunded'];

const paymentStages = [
  { stage: "At Signing of Contract", percentEquity: 0.15, percentBank: 0 },
  { stage: "6 months", percentEquity: 0.00, percentBank: 0.12 },
  { stage: "12 months", percentEquity: 0.00, percentBank: 0.12 },
  { stage: "18 months", percentEquity: 0.00, percentBank: 0.12 },
  { stage: "24 months", percentEquity: 0.00, percentBank: 0.12 },
  { stage: "30 months", percentEquity: 0.00, percentBank: 0.11 },
  { stage: "36 Months", percentEquity: 0.00, percentBank: 0.11 },
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
    equityPaid: equityPaidRounded === 0 ? '' : equityPaidRounded,
    bankFunded: bankFundedRounded === 0 ? '' : bankFundedRounded,
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
  equityPaid: Math.round(totalEquityPaid) === 0 ? '' : Math.round(totalEquityPaid),
  bankFunded: Math.round(totalBankFunded) === 0 ? '' : Math.round(totalBankFunded),
};
  
// Create closing costs row 
const closingCosts = {
  paymentStage: 'Closing Costs Est',
  percentEquity: 10 + '%',
  percentBank: '',
  equityPaid: '',
  bankFunded: Math.round(totalPriceUSD * .1),
};

// Append blank row and totals row
rows.push(blankRow);
rows.push(totalsRow);
rows.push(blankRow);
rows.push(closingCosts);

return {
  header: headers,
  keys: keys,
  rows,
  totalPriceUSD: Math.round(totalPriceUSD),
  totalPriceILS: Math.round(totalPriceILS),
  conversionRate: conversionRate,
  bannerText: '70% Financing'
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
  
  // Define startX early so it's available throughout.
  const startX = doc.page.margins.left; // e.g., 50

  // Title
  doc.fontSize(16).font('Helvetica-Bold').text('Payment Plan', { align: 'center' });
  doc.moveDown(2);
  
  // Draw financingPercent banner
  const bannerHeight = 30;
  doc.rect(startX, doc.y, doc.page.width - 2 * startX, bannerHeight)
    .fillAndStroke('#ADD8E6', '#000000');  // Light blue banner with black border
  
  doc.fillColor('#000000')
    .fontSize(12)
    .text(planData.bannerText, startX, doc.y + bannerHeight / 2 - 6, {
      width: doc.page.width - 2 * startX,
      align: 'center'
    });
  
  // Move down after the banner
  doc.moveDown(1);

  // Code for second banner
  const firstColWidth = 150;  // This is the same as baseColWidths[0]
  const bannerHeight2 = 40;    // Increase banner height if needed
  
  // Record the current Y coordinate for our banner's top
  const bannerY = doc.y;

  // Draw the banner as a rectangle, with the width equal to the first column only
  doc.rect(startX, bannerY, firstColWidth, bannerHeight2)
    .fillAndStroke('#ADD8E6', '#000000');  // Light blue background with black border

  // Set up font and fill style for the text
  doc.fillColor('#000000').fontSize(10);

  // Define a small padding from the top of the banner for the first line of text
  const textPadding = 4;
  const lineSpacing = 12; // spacing between lines (adjust as needed)

  // Write three lines of text inside the banner; center each within the banner's width
  doc.text('Current exchange rate: ' + planData.conversionRate, startX, bannerY + textPadding, {
    width: firstColWidth,
    align: 'center'
  });

  doc.text('Purchase Price (USD): $' + planData.totalPriceUSD, startX, bannerY + textPadding + lineSpacing, {
    width: firstColWidth,
    align: 'center'
  });

  doc.text('Purchase Price (ILS): ' + planData.totalPriceILS, startX, bannerY + textPadding + 2 * lineSpacing, {
    width: firstColWidth,
    align: 'center'
  });
  
  // Define columns
  const tableTop = doc.y;
  const baseColWidths = [150, 100, 100, 100, 100];
  // Adjust widths if header contains "percent"
  const headers = planData.header;
  const colWidths = headers.map((header, i) =>
    header.toLowerCase().includes("percent") ? baseColWidths[i] * 0.8 : baseColWidths[i]
  );
  
  const colX = [];
  colX[0] = startX;
  for (let i = 1; i < colWidths.length; i++) {
    colX[i] = colX[i - 1] + colWidths[i - 1];
  }
  
  const headerHeight = 30; // Header cell height for wrapping
  
  // Draw centered headers with vertical centering
  doc.fontSize(10).font('Helvetica-Bold');
  headers.forEach((headerText, index) => {
    const textHeight = doc.heightOfString(headerText, {
      width: colWidths[index] - 10
    });
    const textY = tableTop + (headerHeight - textHeight) / 2;
    doc.text(headerText, colX[index] + 5, textY, {
      width: colWidths[index] - 10,
      align: 'center'
    });
  });
  
  // Draw header border
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], tableTop, colWidths[i], headerHeight).stroke();
  }
  
  let currentY = tableTop + headerHeight;
  doc.font('Helvetica').fontSize(10);
  const keys = planData.keys; // Should match the headers order
  
  // Draw data rows
  planData.rows.forEach((row) => {
    const rowHeight = 20;
    for (let i = 0; i < colWidths.length; i++) {
      doc.rect(colX[i], currentY, colWidths[i], rowHeight).stroke();
    }
    
    keys.forEach((key, idx) => {
      let cellValue = row[planData.keys[idx]];
      const isMoneyColumn = headers[idx].includes('$');
      
      if (isMoneyColumn) {
        const num = Number(cellValue);
        if (isNaN(num) || num === 0) {
          cellValue = "";
        } else {
          cellValue = { money: num };
        }
      } else {
        if (cellValue == null) {
          cellValue = "";
        } else {
          cellValue = cellValue.toString();
        }
      }
      
      const align = idx === 0 ? 'center' : 'right';
      if (isMoneyColumn && typeof cellValue === 'object') {
        // Render '$' left-aligned in a fixed width area, number right-aligned in the remainder.
        doc.text('$', colX[idx] + 5, currentY + 5, { width: 10, align: 'left' });
        doc.text(formatNumber(cellValue.money), colX[idx] + 15, currentY + 5, {
          width: colWidths[idx] - 20,
          align: 'right'
        });
      } else {
        // Add slight padding for right-aligned text.
        const textAlignAdjust = align === 'right' ? 5 : 0;
        doc.text(cellValue, colX[idx] + 5, currentY + 5, {
          width: colWidths[idx] - 10 - textAlignAdjust,
          align: align
        });
      }
    });
    
    currentY += rowHeight;
  });
  
  doc.end();
}

// Helper to format numbers with commas and no decimals.
function formatNumber(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
