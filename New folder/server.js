import express from "express"
import cors from "cors"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("[v0] ERROR: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env file")
  console.error("[v0] TELEGRAM_BOT_TOKEN:", TELEGRAM_BOT_TOKEN ? "✓ Set" : "✗ Missing")
  console.error("[v0] TELEGRAM_CHAT_ID:", TELEGRAM_CHAT_ID ? "✓ Set" : "✗ Missing")
}

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    console.log("[v0] Form submitted with:", { name, email, subject })

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Format message for Telegram
    const telegramMessage = `
📧 <b>New Contact Form Submission</b>

<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Subject:</b> ${subject}

<b>Message:</b>
${message}
    `.trim()

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    console.log("[v0] Sending to Telegram URL:", telegramUrl.replace(TELEGRAM_BOT_TOKEN, "***"))
    console.log("[v0] Chat ID:", TELEGRAM_CHAT_ID)

    const response = await axios.post(telegramUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: "HTML",
    })

    console.log("[v0] Telegram response:", response.status, response.data)

    // Send success response
    res.json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("[v0] Error sending message:")
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error response:", error.response?.data)
    console.error("[v0] Error status:", error.response?.status)

    res.status(500).json({
      error: "Failed to send message. Please try again.",
      details: error.response?.data?.description || error.message,
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
