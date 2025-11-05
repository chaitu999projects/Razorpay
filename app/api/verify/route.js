import axios from "axios";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(JSON.stringify({ message: "Missing orderId" }), { status: 400 });
    }

    const response = await axios.get(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    });

    const orderStatus = response.data?.order_status;

    if (orderStatus === "PAID") {
      return new Response(JSON.stringify({ verified: true, message: "✅ Payment Verified Successfully" }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ verified: false, message: `⚠️ Payment not completed (${orderStatus})` }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({
        message: "Verification failed",
        error: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}
