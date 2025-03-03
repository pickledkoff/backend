export default function handler(req, res) {
  // Parse the input data from the request
  const { apartmentPrice, percentFinancing } = req.body;

  // Create a response object with the message and input data
  const response = {
    message: "Great success!",
    apartmentPrice,
    percentFinancing
  };

  // Send the response as JSON
  res.status(200).json(response);
}
