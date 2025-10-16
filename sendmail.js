import { google } from "googleapis";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GMAIL_ADDRESS,
} = process.env;

console.log("GMAIL_ADDRESS:", GMAIL_ADDRESS);

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

// Helper to build raw message
function buildRaw({ from, to, subject, html }) {
  const message =
    `From: ${from}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
    html;
  return Buffer.from(message).toString("base64url");
}

// Send email
export async function sendMail({ to, subject, html }) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const raw = buildRaw({ from: GMAIL_ADDRESS, to, subject, html });
  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
  console.log("Email sent successfully!");
}

// Example usage
sendMail({
  to: "creativesoftware.dev1009@gmail.com",
  subject: "Hello from Gmail API",
  html: "<p>This email was sent securely via Gmail API 🎉</p>",
}).catch(console.error);
