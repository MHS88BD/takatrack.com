import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
    html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    // 1) Create a transporter
    // For production, use a real service like SendGrid, Mailgun, or Gmail
    // For development, we can use Ethereal or just log if no creds provided

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: `TakaTracker <${process.env.EMAIL_FROM || 'noreply@takatracker.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // 3) Actually send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.error('Error sending email:', error);

        // In development, if we don't have valid credentials, just log the message and pretend it worked
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            console.log('\n--- EMAIL PREVIEW (Simulated) ---');
            console.log(`To: ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Message: ${options.message}`);
            console.log('---------------------------------\n');
            return; // Don't throw, let the flow continue
        }

        throw error;
    }
};
