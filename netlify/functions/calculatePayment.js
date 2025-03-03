export async function handler(event, context) {
  try {
    const data = JSON.parse(event.body);
    const { apartmentPrice, percentFinancing } = data;

    const response = {
      message: "Great success!",
      apartmentPrice,
      percentFinancing
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
}
