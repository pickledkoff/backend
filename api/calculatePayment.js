export default function handler(req, res) {
       const { apartmentPrice, percentFinancing } = req.body;

       // Dummy calculation
       const financingAmount = (apartmentPrice * (percentFinancing / 100)).toFixed(2);

       // Return response
       res.status(200).json({ financingAmount });
     }
