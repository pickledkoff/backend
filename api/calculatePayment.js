export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.log("Received request body:", req.body);
  
  // Use the exact same keys from the request
  const { apartmentPrice, percentFinancing } = req.body;
  
  // Build the response object using the data received
  const response = {
    message: "super test",
    apartmentPrice,
    percentFinancing,
    // Optionally, you can also include a default currency if needed
    currency: req.body.currency || "USD"
  };
  
  console.log("Sending response:", response);
  
  return res.status(200).json(response);
}
