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
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payment-plan.pdf');
    res.end(pdfData);
  });

  doc.fontSize(14).text('Payment Plan', { align: 'center' });
  doc.moveDown();

  const colX = [doc.page.margins.left, 150, 250, 350, 450];
  const colWidth = [100, 100, 100, 100, 100];

  doc.fontSize(11).font('Helvetica-Bold')
    .text('Payment Stage', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text('Amount to Pay (ILS)', colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text('Amount to Pay (USD)', colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('Percent', colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
    .text('Cumulative (USD)', colX[4], doc.y, { align: 'right' });

  doc.moveTo(colX[0], doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown();

  doc.font('Helvetica').fontSize(10);
  planData.rows.forEach((row) => {
    doc.text(row.paymentStage, colX[0], doc.y, { width: colWidth[0], continued: true })
      .text(row.amountToPayILS, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
      .text(row.amountToPayUSD, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
      .text(row.percent, colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
      .text(row.cumulative, colX[4], doc.y, { align: 'right' });
    doc.moveDown(0.5);
  });

  doc.moveDown(1)
    .font('Helvetica-Bold')
    .text('Total', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text(planData.totalILS, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text(planData.totalUSD, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('100.00%', colX[3], doc.y, { align: 'right' });

  doc.moveDown(2)
    .fontSize(11)
    .text('Delivery time', colX[0], doc.y, { continued: true })
    .text('36 months', colX[1], doc.y);

  doc.end();
}
