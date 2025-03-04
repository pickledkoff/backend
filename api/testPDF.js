import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  // Handle preflight requests (CORS setup)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).json({});
  }

  // Attach CORS header
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
      res.end(pdfData);
    });

    doc.text('Hello from PDFKit!');
    doc.end(); // Finalize PDF
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: error.message });
  }
}
