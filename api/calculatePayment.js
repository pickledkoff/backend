import calculatePaymentPlan from "../main/utils/calculations";

export default async function handler(req, res) {
  // Set the CORS header for every response right away.
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { apartmentPrice, percentFinancing, currency, conversionRate } = data;
    console.log("Received apartmentPrice:", apartmentPrice);
    console.log("Received percentFinancing:", percentFinancing);
    console.log("Received currency:", currency);
    console.log("Received conversionRate:", conversionRate);

    const planData = calculatePaymentPlan(Number(apartmentPrice), Number(conversionRate), currency);

    const responseData = {
      message: "super test",
      apartmentPrice,
      percentFinancing,
      currency,
      ...planData,
    };
    
    console.log("Sending response:", responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error caught in function:", error);
    return res.status(400).json({ error: error.message });
  }
}
