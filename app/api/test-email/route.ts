import { NextResponse } from "next/server"
import { ResendEmailService } from "@/lib/resend-email-service"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    const emailService = new ResendEmailService()
    await emailService.sendTestEmail(email)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      email: email
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 