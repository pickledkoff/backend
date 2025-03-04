import PDFDocument from 'pdfkit';

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

  // Table headers
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
      .text(`₪${formatNumber(row.amountToPayILS)}`, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
      .text(`$${formatNumber(row.amountToPayUSD)}`, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
      .text(row.percent, colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
      .text(`$${formatNumber(row.cumulative)}`, colX[4], doc.y, { align: 'right' });
    doc.moveDown(0.5);
  });

  doc.moveDown(1)
    .font('Helvetica-Bold')
    .text('Total', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text(`₪${formatNumber(planData.totalILS)}`, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text(`$${formatNumber(planData.totalUSD)}`, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('100.00%', colX[3], doc.y, { align: 'right' });

  doc.moveDown(2)
    .fontSize(11)
    .text('Delivery time', colX[0], doc.y, { continued: true })
    .text('36 months', colX[1], doc.y);

  doc.end();
}

function formatNumber(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}
