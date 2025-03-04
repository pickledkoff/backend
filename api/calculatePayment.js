export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).json({});
  }
  
  // For non-OPTIONS requests, also include the header in the response
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Proceed with POST handling
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    const data = JSON.parse(req.body);
    const { purchasePrice, financePercent, currency } = data;
    
    const response = {
      message: "super test",
      purchasePrice,
      financePercent,
      currency
    };
    
    return res.status(200).json(response);
  
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ error: error.message });
  }
}
