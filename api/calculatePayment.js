   export default function handler(req, res) {
     // Log the body of the incoming request
     console.log('Request Body:', req.body);
 
     const { apartmentPrice, percentFinancing } = req.body;

     // Log extracted parameters
     console.log('Apartment Price:', apartmentPrice);
     console.log('Percent Financing:', percentFinancing);

     // Create the response object
     const response = {
       message: "Great success!",
       apartmentPrice,
       percentFinancing
     };

     // Log the response object
     console.log('Response:', response);

     // Send the response as JSON
     res.status(200).json(response);
   }
