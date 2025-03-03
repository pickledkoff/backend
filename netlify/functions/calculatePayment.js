export async function handler(event, context) {
  // Handle preflight (OPTIONS) request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',          // Allow requests from all domains
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Proceed with main request handling
  try {
    // Add any key-value pairs you'd like to parse
    const data = JSON.parse(event.body);
    const { apartmentPrice, percentFinancing } = data || {};

    // Log or use these values as necessary
    console.log('apartmentPrice:', apartmentPrice);
    console.log('percentFinancing:', percentFinancing);

    const response = {
      message: "Great success!",
      apartmentPrice,
      percentFinancing
    };

    // Add the same CORS headers to the final response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
