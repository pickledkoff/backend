export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).json({});
  }
  
  // Always attach CORS header for non-OPTIONS requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    // Check if req.body is a string or already an object
    let data;
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }
    
    console.log("Parsed data:", data);

    const { purchasePrice, financePercent, currency } = data;
    
    const response = {
      message: "super test",
      purchasePrice,
      financePercent,
      currency,
    };

    console.log("Sending response:", response);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error caught in function:", error);
    return res.status(400).json({ error: error.message });
  }
}
