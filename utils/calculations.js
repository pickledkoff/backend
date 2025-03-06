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

  // ---------------------------------------------------
  // Draw the left banner with apt details (yellow background)
  // ---------------------------------------------------
 const firstColWidth = 150;   // width of the left banner
const bannerHeight2 = 50;    // banner height for apt details
const currentY = doc.y;      // current y position for the left banner

// Draw the left banner with a yellow background and black border.
doc.rect(startX, currentY, firstColWidth, bannerHeight2)
  .fillAndStroke('#FFFF00', '#000000');

// Set the detail font size and define line spacing.
const detailFontSize = 8;
doc.fontSize(detailFontSize);
const lineSpacing = 4;  // spacing between lines

// Measure a typical line height (using a sample string)
const measuredLineHeight = doc.heightOfString('M', { width: firstColWidth });

// There are three lines; compute total text height.
const numberOfLines = 3;
const totalTextHeight = numberOfLines * measuredLineHeight + (numberOfLines - 1) * lineSpacing;

// Compute vertical padding so that the text block is vertically centered in the banner.
const verticalPadding = (bannerHeight2 - totalTextHeight) / 2;

// Function to draw one line with a bold label and regular value, both centered horizontally.
function drawInlineText(lineY, labelText, valueText) {
  // Ensure the value is a string.
  const valueStr = valueText.toString();
  
  // Use bold font to measure the label.
  doc.font('Helvetica-Bold');
  const labelWidth = doc.widthOfString(labelText, { fontSize: detailFontSize });
  
  // Switch to regular font to measure the value.
  doc.font('Helvetica');
  const valueWidth = doc.widthOfString(valueStr, { fontSize: detailFontSize });
  
  // Total combined width.
  const totalLineWidth = labelWidth + valueWidth;
  
  // Calculate starting X position so that the combined text is centered.
  const startLineX = startX + (firstColWidth - totalLineWidth) / 2;
  
  // Draw the bold label (no line break).
  doc.font('Helvetica-Bold').text(labelText, startLineX, lineY, {
    continued: false,
    lineBreak: false,
  });
  
  // Draw the value text immediately to the right.
  doc.font('Helvetica').text(valueStr, startLineX + labelWidth, lineY, {
    lineBreak: false,
  });
}

// Prepare the text strings.
const exchangeRateLabel = "Current exchange rate: ";
const exchangeRateValue = planData.conversionRate;

const usdLabel = "Purchase Price (USD): ";
const usdValue = "$" + formatNumber(planData.totalPriceUSD);

const ilsLabel = "Purchase Price (ILS): ";
const ilsValue = formatNumber(planData.totalPriceILS);

// Draw each line with appropriate vertical offset.
drawInlineText(currentY + verticalPadding, exchangeRateLabel, exchangeRateValue);
drawInlineText(currentY + verticalPadding + measuredLineHeight + lineSpacing, usdLabel, usdValue);
drawInlineText(currentY + verticalPadding + 2 * (measuredLineHeight + lineSpacing), ilsLabel, ilsValue);
  
  // ---------------------------------------------------
  // Draw "Payment Plan" title centered on the page.
  // We move a little bit below the left banner.
  // ---------------------------------------------------
  doc.moveDown(2);
  doc.font('Helvetica-Bold').fontSize(16);
  // Use the full available width (from margin to margin) and center the text.
  doc.text('Payment Plan', startX, doc.y, {
    width: doc.page.width - 2 * startX,
    align: 'center'
  });
  
  // Add some vertical spacing after the title.
  doc.moveDown(1);
  
  // ---------------------------------------------------
  // Define table column widths. (The table will be drawn below.)
  // This will also be used to set the exact width of the financing banner.
  // ---------------------------------------------------
  const baseColWidths = [150, 100, 100, 100, 100];
  const headers = planData.header;
  // Adjust column width if the header text includes "percent"
  const colWidths = headers.map((header, i) =>
    header.toLowerCase().includes("percent") ? baseColWidths[i] * 0.8 : baseColWidths[i]
  );
  
  // Compute the total width of the table (sum of columns widths)
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
  
  // ---------------------------------------------------
  // Draw financing banner above the table. Its width now matches the table.
  // ---------------------------------------------------
  const bannerHeight = 30;
  let bannerY = doc.y;  // current y position
  
  doc.rect(startX, bannerY, tableWidth, bannerHeight)
    .fillAndStroke('#ADD8E6', '#000000');  // Light blue background with black border
  
  doc.fillColor('#000000')
    .fontSize(12)
    .text(planData.bannerText, startX, bannerY + bannerHeight / 2 - 6, {
      width: tableWidth,
      align: 'center'
    });
  
  doc.moveDown(1);
  
  // ---------------------------------------------------
  // Build table header and rows
  // ---------------------------------------------------
  const tableTop = doc.y;
  const colX = [];
  colX[0] = startX;
  for (let i = 1; i < colWidths.length; i++) {
    colX[i] = colX[i - 1] + colWidths[i - 1];
  }
  
  const headerHeight = 30; // Header cell height
  doc.fontSize(10).font('Helvetica-Bold');
  headers.forEach((headerText, index) => {
    const textHeight = doc.heightOfString(headerText, { width: colWidths[index] - 10 });
    const textY = tableTop + (headerHeight - textHeight) / 2;
    doc.text(headerText, colX[index] + 5, textY, {
      width: colWidths[index] - 10,
      align: 'center'
    });
  });
  
  // Draw header borders
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], tableTop, colWidths[i], headerHeight).stroke();
  }
  
  let currentYTable = tableTop + headerHeight;
  doc.font('Helvetica').fontSize(10);
  const keys = planData.keys; // Should match the header order
  
  // Draw data rows
  planData.rows.forEach((row) => {
    const rowHeight = 20;
    for (let i = 0; i < colWidths.length; i++) {
      doc.rect(colX[i], currentYTable, colWidths[i], rowHeight).stroke();
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
        // Render '$' left-aligned in a fixed width area, then right-align the number.
        doc.text('$', colX[idx] + 5, currentYTable + 5, { width: 10, align: 'left' });
        doc.text(formatNumber(cellValue.money), colX[idx] + 15, currentYTable + 5, {
          width: colWidths[idx] - 20,
          align: 'right'
        });
      } else {
        const textAlignAdjust = align === 'right' ? 5 : 0;
        doc.text(cellValue, colX[idx] + 5, currentYTable + 5, {
          width: colWidths[idx] - 10 - textAlignAdjust,
          align: align
        });
      }
    });
    
    currentYTable += rowHeight;
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
