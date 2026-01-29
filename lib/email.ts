import { Resend } from 'resend';

// Resend initialization (you need RESEND_API_KEY in .env.local)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendDriverApprovalEmail(email: string, name: string) {
    if (!resend) {
        console.warn("RESEND_API_KEY is missing. Skipping email.");
        return;
    }

    try {
        await resend.emails.send({
            from: 'Foody Delivery <onboarding@resend.dev>',
            to: email,
            subject: '🎉 Welcome to the Fleet! Your Driver Account is Approved',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #f97316;">Congratulations, ${name}!</h2>
                    <p>Your driver application has been <strong>approved</strong>. You are now part of the Foody delivery fleet!</p>
                    <p>You can now log in to the driver dashboard to start receiving orders and earning.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
                    </div>
                    <p>Happy delivering!</p>
                    <p>Team Foody</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Failed to send approval email:", error);
    }
}

export async function sendDriverRejectionEmail(email: string, name: string, reason: string) {
    if (!resend) return;

    try {
        await resend.emails.send({
            from: 'Foody Delivery <onboarding@resend.dev>',
            to: email,
            subject: 'Update on your Driver Application',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ef4444;">Application Update</h2>
                    <p>Hello ${name},</p>
                    <p>Thank you for your interest in joining Foody. After reviewing your application, we are unable to approve it at this time.</p>
                    <p><strong>Reason:</strong> ${reason || 'Incomplete documentation'}</p>
                    <p>You may update your documents and try reapplying in the future.</p>
                    <p>Best regards,</p>
                    <p>Team Foody</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Failed to send rejection email:", error);
    }
}
