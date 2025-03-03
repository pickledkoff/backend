export default function handler(req, res) {
  // Return a simple JSON response
  res.status(200).json({ message: "Hello, world!" });
}
