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
  doc.moveDown(2);

  const colX = [doc.page.margins.left, 150, 280, 360, 450];
  const colWidth = [120, 130, 80, 80, 90];

  // Table headers
  doc.fontSize(11).font('Helvetica-Bold')
    .text('Payment Stage', colX[0], doc.y, { width: colWidth[0] })
    .text('Amount to Pay (ILS)', colX[1], doc.y, { width: colWidth[1], align: 'right' })
    .text('Amount to Pay (USD)', colX[2], doc.y, { width: colWidth[2], align: 'right' })
    .text('Percent', colX[3], doc.y, { width: colWidth[3], align: 'right' })
    .text('Cumulative (USD)', colX[4], doc.y, { width: colWidth[4], align: 'right' });

  doc.moveTo(colX[0], doc.y + 5).lineTo(doc.page.width - doc.page.margins.right, doc.y + 5).stroke();
  doc.moveDown();

  doc.font('Helvetica').fontSize(10);
  planData.rows.forEach((row) => {
    const y = doc.y;
    doc.text(row.paymentStage, colX[0], y, { width: colWidth[0] })
      .text(`₪${formatNumber(row.amountToPayILS)}`, colX[1], y, { width: colWidth[1], align: 'right' })
      .text(`$${formatNumber(row.amountToPayUSD)}`, colX[2], y, { width: colWidth[2], align: 'right' })
      .text(row.percent, colX[3], y, { width: colWidth[3], align: 'right' })
      .text(`$${formatNumber(row.cumulative)}`, colX[4], y, { width: colWidth[4], align: 'right' });
    doc.moveDown(0.75);
  });

  doc.moveDown(1)
    .font('Helvetica-Bold')
    .text('Total', colX[0], doc.y, { width: colWidth[0] })
    .text(`₪${formatNumber(planData.totalILS)}`, colX[1], doc.y, { width: colWidth[1], align: 'right' })
    .text(`$${formatNumber(planData.totalUSD)}`, colX[2], doc.y, { width: colWidth[2], align: 'right' })
    .text('100.00%', colX[3], doc.y, { align: 'right' });

  doc.moveDown(2)
    .fontSize(11)
    .text('Delivery time', colX[0], doc.y)
    .text('36 months', colX[1], doc.y);

  doc.end();
}

function formatNumber(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}
