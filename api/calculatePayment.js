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
    let data;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }
    
    console.log("Parsed data:", data);
    
    // Use the correct keys coming from your front end
    const { apartmentPrice, percentFinancing, currency } = data;
    
    console.log("apartmentPrice:", apartmentPrice);
    console.log("percentFinancing:", percentFinancing);
    console.log("currency:", currency);

    const response = {
      message: "super test",
      apartmentPrice,
      percentFinancing,
      currency: currency || "USD"
    };

    console.log("Sending response:", response);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error caught in function:", error);
    return res.status(400).json({ error: error.message });
  }
}
