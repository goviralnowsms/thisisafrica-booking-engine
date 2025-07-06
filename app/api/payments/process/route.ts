export async function POST(request: Request) {
  try {
    const paymentData = await request.json()
    console.log("Processing payment:", paymentData)

    // Simulate payment processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate successful payment
    return Response.json({
      success: true,
      paymentId: `pay_${Date.now()}`,
      transactionId: `txn_${Date.now()}`,
      message: "Payment processed successfully in demo mode",
      demo: true,
    })
  } catch (error) {
    console.error("Payment processing failed:", error)
    return Response.json(
      {
        error: "Payment processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
