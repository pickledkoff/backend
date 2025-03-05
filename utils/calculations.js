import PDFDocument from 'pdfkit';
export function calculatePaymentPlan(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;

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

  return { totalPriceUSD, totalPriceILS, rows, totalILS, totalUSD };
}

export function generatePDF(res, planData) {
  // Create a new PDF document: using A4 size with 50pt margins
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

  // Define table parameters
  // For A4 with 50pt margins, usable width is about 595 - (50 * 2) = 495 points.
  // We'll define columns with fixed widths that sum to less than 495.
  const startX = doc.page.margins.left; // 50
  const tableTop = doc.y;
  // Define columns: Payment Stage | Amount (ILS) | Amount (USD) | Percent | Cumulative (USD)
  const colWidths = [150, 90, 90, 70, 90];
  // Calculate x positions for each column using the starting x and cumulative widths:
  const colX = [];
  colX[0] = startX;
  for (let i = 1; i < colWidths.length; i++) {
    colX[i] = colX[i - 1] + colWidths[i - 1];
  }

  // Draw table header with a bold font
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Payment Stage', colX[0] + 5, tableTop + 5, { width: colWidths[0] - 10, align: 'center' });
  doc.text('Amount (ILS)', colX[1] + 5, tableTop + 5, { width: colWidths[1] - 10, align: 'right' });
  doc.text('Amount (USD)', colX[2] + 5, tableTop + 5, { width: colWidths[2] - 10, align: 'right' });
  doc.text('Percent', colX[3] + 5, tableTop + 5, { width: colWidths[3] - 10, align: 'right' });
  doc.text('Cumulative (USD)', colX[4] + 5, tableTop + 5, { width: colWidths[4] - 10, align: 'right' });
  
  // Draw header row border
  const headerHeight = 20;
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], tableTop, colWidths[i], headerHeight).stroke();
  }
  
  // Start drawing rows after header:
  let currentY = tableTop + headerHeight;
  doc.font('Helvetica').fontSize(10);
  
  planData.rows.forEach((row) => {
    const rowHeight = 20;
    // Draw borders for the row cells:
    for (let i = 0; i < colWidths.length; i++) {
      doc.rect(colX[i], currentY, colWidths[i], rowHeight).stroke();
    }
    // Add row text. Use a 5pt padding on each cell.
    doc.text(row.paymentStage, colX[0] + 5, currentY + 5, { width: colWidths[0] - 10 });
    doc.text(`₪${formatNumber(row.amountToPayILS)}`, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10, align: 'right' });
    doc.text(`$${formatNumber(row.amountToPayUSD)}`, colX[2] + 5, currentY + 5, { width: colWidths[2] - 10, align: 'right' });
    doc.text(row.percent, colX[3] + 5, currentY + 5, { width: colWidths[3] - 10, align: 'right' });
    doc.text(`$${formatNumber(row.cumulative)}`, colX[4] + 5, currentY + 5, { width: colWidths[4] - 10, align: 'right' });
    
    currentY += rowHeight;
  });
  
  // Draw totals row:
  const totalsRowHeight = 20;
  for (let i = 0; i < colWidths.length; i++) {
    doc.rect(colX[i], currentY, colWidths[i], totalsRowHeight).stroke();
  }
  doc.font('Helvetica-Bold');
  doc.text('Total', colX[0] + 5, currentY + 5, { width: colWidths[0] - 10 });
  doc.text(`₪${formatNumber(planData.totalILS)}`, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10, align: 'right' });
  doc.text(`$${formatNumber(planData.totalUSD)}`, colX[2] + 5, currentY + 5, { width: colWidths[2] - 10, align: 'right' });
  // Leave Percent blank or you can add a note:
  doc.text('', colX[3] + 5, currentY + 5, { width: colWidths[3] - 10, align: 'right' });
  // You may want to leave cumulative blank or repeat last row:
  doc.text(`$${formatNumber(planData.totalUSD)}`, colX[4] + 5, currentY + 5, { width: colWidths[4] - 10, align: 'right' });

  currentY += totalsRowHeight;
  
  // Delivery time (as separate text)
  doc.moveDown(2).font('Helvetica').fontSize(11)
    .text('Delivery time: 36 months', { align: 'left' });
  
  doc.end();
}

function formatNumber(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}
