const nodemailer = require("nodemailer");
const portfolioEmailSender = ( async (req, res) => {
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
  
      const mailOptions = {
        from: email,
        to: process.env.VERIFIER_EMAIL,
        subject: subject || "New Contact Form Message",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f3f4f6;
              padding: 0;
              margin: 0;
            }
      
            .wrapper {
              width: 100%;
              background: linear-gradient(135deg, #3b82f6, #9333ea);
              padding: 50px 20px;
              box-sizing: border-box;
              min-height: 100vh;
            }
      
            .container {
              background: white;
              max-width: 600px;
              margin: auto;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              padding: 30px 40px;
              animation: fadeInUp 0.6s ease-in-out;
            }
      
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
      
            h2 {
              color: #3b82f6;
              margin-bottom: 20px;
              font-size: 24px;
              text-align: center;
            }
      
            .label {
              font-weight: 600;
              color: #6b7280;
            }
      
            p {
              color: #111827;
              line-height: 1.6;
              margin: 8px 0;
            }
      
            .footer {
              margin-top: 30px;
              font-size: 0.85rem;
              color: #9ca3af;
              text-align: center;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
      
            .from-site {
              color: #10b981;
              font-weight: bold;
            }
      
            .emoji {
              font-size: 1.5rem;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <h2><span class="emoji">📨</span> Yangi xabar qabul qilindi!</h2>
              <p><span class="label">Mavzu:</span> ${subject || "Mavzu ko‘rsatilmagan"}</p>
              <p><span class="label">Ism:</span> ${name}</p>
              <p><span class="label">Email:</span> ${email}</p>
              <p><span class="label">Xabar:</span></p>
              <p style="white-space: pre-wrap;">${message}</p>
      
              <div class="footer">
                Ushbu xabar <span class="from-site">Portfolio Websaytingiz</span> orqali yuborilgan.
              </div>
            </div>
          </div>
        </body>
        </html>
        `
      };      
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: "Email sent!" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ success: false, message: "Email failed to send" });
    }
  });

  module.exports = portfolioEmailSender