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
