export const portfolioEmailSender = ( async (req, res) => {
    const { name, email, subject, message } = req.body;
  
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
  
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.VERIFIER_EMAIL,
          pass: process.env.VERIFIER_GOOGLE_PASS_KEY,
        },
      });
  
      // Email options
      const mailOptions = {
        from: email,
        to: process.env.VERIFIER_EMAIL,
        subject: subject || "New Contact Form Message",
        text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: "Email sent!" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ success: false, message: "Email failed to send" });
    }
  });