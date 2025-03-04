import calculatePaymentPlan from '../utils/calculations';
export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).json({});
  }
  
  // Always attach CORS header
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Process req.body. Check for string and parse accordingly.
    let data;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const { apartmentPrice, percentFinancing, currency } = data;
    console.log("Received apartmentPrice:", apartmentPrice);
    console.log("Received percentFinancing:", percentFinancing);
    console.log("Received currency:", currency);

    // Build the response object including conversion data if desired
    const responseData = {
      message: "super test",
      apartmentPrice,
      percentFinancing,
      currency,
    };
    
    console.log("Sending response:", responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error caught in function:", error);
    return res.status(400).json({ error: error.message });
  }
}
