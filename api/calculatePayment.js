import { calculatePaymentPlan0, calculatePaymentPlan50, calculatePaymentPlan70, calculatePaymentPlan75, generatePDF } from '../utils/calculations.js';
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
    // Process req.body
    let data;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const { apartmentPrice, percentFinancing, currency, conversionRate } = data;
    console.log("Received apartmentPrice:", apartmentPrice);
    console.log("Received percentFinancing:", percentFinancing);
    console.log("Received currency:", currency);

    // Convert conversionRate to a number with a new name
    const conversionRateNum = Number(conversionRate);
    const apartmentPriceNum = Number(apartmentPrice);
    
    let planData; 

    // Determine which payment plan calculation to use based on percentFinancing
    switch (percentFinancing) {
       console.log("in switch:", percentFinancing);

      case 50:
                       console.log("in 50:", percentFinancing);

        planData = calculatePaymentPlan50(apartmentPriceNum, conversionRateNum, currency);

        break;
      case 75:
                               console.log("in 75:", percentFinancing);

        planData = calculatePaymentPlan75(apartmentPriceNum, conversionRateNum, currency);

        break;
      case 70:
                                       console.log("in 70:", percentFinancing);

        planData = calculatePaymentPlan70(apartmentPriceNum, conversionRateNum, currency);

        break;
      case 0:
                       console.log("in 0:", percentFinancing);

        planData = calculatePaymentPlan0(apartmentPriceNum, conversionRateNum, currency);
        break;
      default:
                       console.log("nada error default:", percentFinancing);

        return res.status(400).json({ error: "Invalid percentFinancing value" });
    }
    
    // Generate PDF
   generatePDF(res, planData);
  } catch (error) {
    console.error("Error caught in function:", error);
    return res.status(400).json({ error: error.message });
  }
}
