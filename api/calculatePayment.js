export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
 // console.log("Received request body:", req.body); // Debug logging
  
  const { purchasePrice, financePercent, currency } = req.body;
  
  // Build the response object
  const response = {
    message: "super test",
    purchasePrice,
    financePercent,
    currency
  };
  
  console.log("Sending response:", response); // More logging
  
  return res.status(200).json(response);
}
