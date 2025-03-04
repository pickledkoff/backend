import PDFDocument from 'pdfkit';

export function generatePDF(res, planData) {
  // Initialize PDFDocument with A4 size and margin
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
  doc.fontSize(14).text('Payment Plan', { align: 'center' });
  doc.moveDown();

  // Define column positions and widths
  const colX = [doc.page.margins.left, 150, 250, 350, 450];
  const colWidth = [100, 100, 100, 100, 100];

  // Draw table headers
  doc.fontSize(11).font('Helvetica-Bold')
    .text('Payment Stage', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text('Amount to Pay (ILS)', colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text('Amount to Pay (USD)', colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('Percent', colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
    .text('Cumulative (USD)', colX[4], doc.y, { align: 'right' });

  // Draw header line
  doc.moveTo(colX[0], doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown();

  // Draw table rows
  doc.font('Helvetica').fontSize(10);
  planData.rows.forEach((row) => {
    doc.text(row.paymentStage, colX[0], doc.y, { width: colWidth[0], continued: true })
      .text(row.amountToPayILS, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
      .text(row.amountToPayUSD, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
      .text(row.percent, colX[3], doc.y, { width: colWidth[3], continued: true, align: 'right' })
      .text(row.cumulative, colX[4], doc.y, { align: 'right' });
    doc.moveDown(0.5); // Add spacing between rows
  });

  // Draw total row
  doc.moveDown(1)
    .font('Helvetica-Bold')
    .text('Total', colX[0], doc.y, { width: colWidth[0], continued: true })
    .text(planData.totalILS, colX[1], doc.y, { width: colWidth[1], continued: true, align: 'right' })
    .text(planData.totalUSD, colX[2], doc.y, { width: colWidth[2], continued: true, align: 'right' })
    .text('100.00%', colX[3], doc.y, { align: 'right' });

  // Draw delivery time
  doc.moveDown(2)
    .fontSize(11)
    .text('Delivery time', colX[0], doc.y, { continued: true })
    .text('36 months', colX[1], doc.y);

  doc.end();
}
