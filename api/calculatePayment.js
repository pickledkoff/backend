export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Log the request for debugging
  console.log("Received request method:", req.method);
  console.log("Received request body:", req.body);

  // Extract fields from the request body
  const { purchasePrice, financePercent, currency } = req.body;

  // Build the response object
  const response = {
    message: "super test",
    purchasePrice,
    financePercent,
    currency
  };

  // Return the response as JSON
  return res.status(200).json(response);
}
