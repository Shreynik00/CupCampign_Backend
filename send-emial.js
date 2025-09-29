export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone } = req.body;

  const data = {
    sender: { email: "jainsy@rknec.edu" },
    to: [{ email: "shreynikjain05@gmail.com" }],
    subject: "New Contact Form Submission",
    htmlContent: `
      <h3>New Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY, // 🔒 Secure in env vars
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.messageId) {
      res.status(200).json({ success: true, message: "Message sent successfully!" });
    } else {
      res.status(400).json({ success: false, error: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
