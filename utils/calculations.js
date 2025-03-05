import PDFDocument from 'pdfkit';
export function calculatePaymentPlan(apartmentPrice, conversionRate, userCurrency) {
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

  // Optional totals row
  const totalsRowHeight = 20;
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], currentY, colWidths[i], totalsRowHeight).stroke();
  }
  doc.font('Helvetica-Bold');
  doc.text('Total', colX[0] + 5, currentY + 5, { width: colWidths[0] - 10 });
  // Right-align numeric totals (without currency symbols)
  doc.text(formatNumber(planData.totalILS), colX[1] + 5, currentY + 5, { width: colWidths[1] - 10, align: 'right' });
  doc.text(formatNumber(planData.totalUSD), colX[2] + 5, currentY + 5, { width: colWidths[2] - 10, align: 'right' });
  doc.text('', colX[3] + 5, currentY + 5, { width: colWidths[3] - 10, align: 'right' });
  doc.text(formatNumber(planData.totalUSD), colX[4] + 5, currentY + 5, { width: colWidths[4] - 10, align: 'right' });

  currentY += totalsRowHeight;

  // Optional extra info
  doc.moveDown(2).fontSize(11)
    .text('Delivery time: 36 months', { align: 'left' });
  
  doc.end();
}

// Helper to format numeric values with commas
function formatNumber(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}
