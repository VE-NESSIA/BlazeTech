import nodemailer from 'nodemailer';

export async function sendOtpEmail({ toEmail, otp }) {
if (!toEmail || !otp) {
    throw new Error('toEmail and otp are requires');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
    user: process.env.SMTP_USER,      // sender email
    pass: process.env.SMTP_PASS 
    }
});

await transporter.sendMail({
    from: `"BlazeTech" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your email',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
});
}
