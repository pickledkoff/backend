import PDFDocument from 'pdfkit';

export function calculatePaymentPlan(apartmentPrice, conversionRate, userCurrency) {
  const totalPriceUSD = userCurrency === 'USD' ? apartmentPrice : apartmentPrice / conversionRate;
  const totalPriceILS = userCurrency === 'USD' ? apartmentPrice * conversionRate : apartmentPrice;

  // Example calculation stages
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
  // Create a new PDF document with A4 size and standard margins
  const doc = new PDFDocument({ size: 'A4', margin: 30 });
  let buffers = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payment-plan.pdf');
    res.end(pdfData);
  });

  doc.fontSize(12).text('Payment Plan', { align: 'center' });
  doc.moveDown();

  const colX = [30, 170, 310, 400, 470]; // Adjusted for margins
  const colWidth = [140, 140, 90, 70, 65]; // Widths based on available space

  // Table headers
  doc.fontSize(10)
    .text('Payment stage', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text('Amount to pay', colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text('In dollars', colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('Percent', colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
    .text('Cumulative', colX[4], doc.y, { width: colWidth[4], align: 'right' });

  // Draw a line below headers
  doc.moveTo(colX[0], doc.y).lineTo(555, doc.y).stroke();

  // Table rows
  planData.rows.forEach((row) => {
     doc.text(row.paymentStage, colX[0], doc.y, { width: colWidth[0], continued: true })
      .text(row.amountToPayILS, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
      .text(row.amountToPayUSD, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
      .text(row.percent, colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
      .text(row.cumulative, colX[4], doc.y, { width: colWidth[4], align: 'right' });
    doc.moveDown(0.5);
  });

  // Totals
  doc.moveDown(1)
    .text('Total', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text(planData.totalILS, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text(planData.totalUSD, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('100.00%', colX[3], doc.y, { width: colWidth[3], align: 'right' });

  // Delivery time
  doc.moveDown(2)
    .text('Delivery time', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text('36 months', colX[1], doc.y, { width: colWidth[1] });

  doc.end();
}
