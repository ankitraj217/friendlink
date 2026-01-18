// templates/emailTemplate.js

// Base styles
const baseStyles = `
  margin:0;
  padding:0;
  background-color:#f5f5f5;
  font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
`;

// Container wrapper
const container = `
  max-width:480px;
  margin:0 auto;
  padding:20px;
`;

// Card style
const card = `
  background:#ffffff;
  border-radius:14px;
  padding:24px;
  box-shadow:0 6px 24px rgba(0,0,0,.08);
`;

// Heading style
const heading = `
  font-size:22px;
  font-weight:600;
  color:#212121;
  margin-bottom:8px;
`;

// Text style
const text = `
  font-size:15px;
  color:#455a64;
  line-height:1.6;
`;

// Button style
const button = `
  display:inline-block;
  margin-top:20px;
  padding:12px 20px;
  background:#ff9900;
  color:#212121;
  font-weight:600;
  border-radius:10px;
  text-decoration:none;
`;

// Footer style
const footer = `
  margin-top:24px;
  font-size:12px;
  color:#90a4ae;
  text-align:center;
`;

// Logo (replace with actual brand logo URL or SVG)
const logo = `
  <img src="${process.env.SERVER_URL}/brand/logo.png" alt="FriendLink Logo" width="48" height="48" style="display:block;margin:0 auto;"/>
`;

// Dark theme support
const themeCSS = `
<style>
@media (prefers-color-scheme: dark) {
  body { background:#212121 !important; }
  .card { background:#263238 !important; }
  h1 { color:#f5f5f5 !important; }
  p { color:#90a4ae !important; }
  a { color:#ff9900 !important; }
}
</style>
`;

// Wrapper for all emails
const wrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
${themeCSS}
</head>
<body style="${baseStyles}">
  <div style="${container}">
    <div style="text-align:center;margin-bottom:20px">
      ${logo}
    </div>
    <div class="card" style="${card}">
      ${content}
    </div>
    <div style="${footer}">
      © ${new Date().getFullYear()} FriendLink · All rights reserved
    </div>
  </div>
</body>
</html>
`;

// Welcome email template
export const welcomeTemplate = (name) =>
    wrapper(
        'Welcome to FriendLink',
        `
      <h1 style="${heading}">Welcome, ${name} 👋</h1>
      <p style="${text}">
        You’re officially part of <b>FriendLink</b> — a place to connect,
        share moments, and build real friendships.
      </p>
      <p style="${text}">
        Start exploring and make your first connection today.
      </p>
    `
    );

// Email verification template
export const emailVerificationTemplate = (verifyLink) =>
    wrapper(
        'Verify your email',
        `
      <h1 style="${heading}">Verify your email</h1>
      <p style="${text}">
        Please confirm your email address to activate your FriendLink account.
      </p>
      <a href="${verifyLink}" style="${button}">
        Verify Email
      </a>
      <p style="${text};margin-top:16px">
        This link expires in 30 minutes.
      </p>
    `
    );

// Alert template for security changes
export const alertTemplate = (type) =>
    wrapper(
        'Security Alert',
        `
      <h1 style="${heading}">Security alert</h1>
      <p style="${text}">
        Your ${type} was recently changed.
      </p>
      <p style="${text}">
        If this wasn’t you, please secure your account immediately.
      </p>
    `
    );

// Password reset template
export const resetTemplate = (resetLink) =>
    wrapper(
        'Reset your password',
        `
      <h1 style="${heading}">Reset your password</h1>
      <p style="${text}">
        Click the button below to set a new password for your FriendLink account.
      </p>
      <a href="${resetLink}" style="${button}">
        Reset Password
      </a>
      <p style="${text};margin-top:16px">
        If you didn’t request this, you can safely ignore this email.
      </p>
    `
    );
