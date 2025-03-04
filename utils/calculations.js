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
  const doc = new PDFDocument();
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

  // Table headers
  doc.fontSize(10)
    .text('Payment stage', 50, doc.y, { continued: true })
    .text('Amount to pay', 150, doc.y, { continued: true, align: 'right' })
    .text('In dollars', 250, doc.y, { continued: true, align: 'right' })
    .text('Percent', 350, doc.y, { continued: true, align: 'right' })
    .text('Cumulative', 450, doc.y, { align: 'right' });

  // Table rows
  planData.rows.forEach((row) => {
    doc.text(row.paymentStage, 50, doc.y, { continued: true })
      .text(row.amountToPayILS, 150, doc.y, { continued: true, align: 'right' })
      .text(row.amountToPayUSD, 250, doc.y, { continued: true, align: 'right' })
      .text(row.percent, 350, doc.y, { continued: true, align: 'right' })
      .text(row.cumulative, 450, doc.y, { align: 'right' });
  });

  // Totals
  doc.moveDown()
      .text('Total', 50, doc.y, { continued: true })
      .text(planData.totalILS, 150, doc.y, { continued: true, align: 'right' })
      .text(planData.totalUSD, 250, doc.y, { continued: true, align: 'right' })
      .text('100.00%', 350, doc.y, { align: 'right' });

  // Delivery time
  doc.moveDown(2)
      .text('Delivery time', 50, doc.y, { continued: true })
      .text('36 months', 150, doc.y);

  doc.end();
}
