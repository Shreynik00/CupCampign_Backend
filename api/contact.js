export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone } = req.body;

    // Prepare email data for Brevo API
    const data = {
      sender: { email: "jainsy@rknec.edu" },
      to: [{ email: "shreynikjain05@gmail.com" }],
      subject: "New Contact Form Submission",
      htmlContent: `
        <h3>New Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    };

    // Call Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // 🔑 Store in Vercel env
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.messageId) {
      return res.status(200).json({ status: "success", result });
    } else {
      return res.status(500).json({ status: "error", result });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
}
