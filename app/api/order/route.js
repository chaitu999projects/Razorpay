import axios from "axios";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ message: "Invalid amount" }), { status: 400 });
    }

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: "CUST_" + Date.now(),
          customer_email: "test@example.com",
          customer_phone: "9999999999",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    const { order_token, order_id } = response.data;

    return new Response(JSON.stringify({ orderToken: order_token, orderId: order_id }), {
      status: 200,
    });
  } catch (error) {
    console.error("Order Error:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({
        message: "Order creation failed",
        error: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}
