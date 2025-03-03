export default function handler(req, res) {
  // Get inputs from the request body
  const { apartmentPrice, percentFinancing } = req.body || {};
  console.log("Request Body:", req.body);

  // Build a simple response object
  const response = {
    message: "Great success!",
    apartmentPrice,
    percentFinancing,
  };
  
  console.log("Response:", response);

  // Return the response as JSON
  res.status(200).json(response);
}
