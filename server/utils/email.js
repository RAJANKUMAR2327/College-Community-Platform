import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendVerificationEmail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your CampusConnect account',
    html: `
      <h2>Welcome to CampusConnect!</h2>
      <p>Click the link below to verify your college email:</p>
      <a href="${url}" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `,
  })
}

export const sendPasswordResetEmail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your CampusConnect password',
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password. Link expires in 1 hour.</p>
      <a href="${url}" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
        Reset Password
      </a>
    `,
  })
}