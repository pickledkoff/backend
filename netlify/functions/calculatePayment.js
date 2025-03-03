export async function handler(event, context) {
  console.log("Received event:", event);
  console.log("Received context:", context);
  
  try {
    if (!event.body) {
      console.log("No body provided in request");
      throw new Error("Request body is missing");
    }
    
    console.log("Raw event.body:", event.body);
    const data = JSON.parse(event.body);
    console.log("Parsed data:", data);
    
    const { apartmentPrice, percentFinancing } = data;
    console.log("Apartment Price:", apartmentPrice);
    console.log("Percent Financing:", percentFinancing);
    
    const response = {
      message: "Great success!",
      apartmentPrice,
      percentFinancing
    };
    
    console.log("Response object:", response);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error("Error caught in handler:", error);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
}
