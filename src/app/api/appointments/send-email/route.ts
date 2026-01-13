import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, appointmentDetails } = await req.json();

    // Validate input
    if (!email || !appointmentDetails) {
      return NextResponse.json(
        { error: "Email and appointment details required" },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Get status badge styling
  const getStatusBadge = (status: string) => {
  const normalizedStatus = status?.toLowerCase() as
    | "confirmed"
    | "cancelled"
    | "pending"
    | "completed";

  const statusStyles = {
    confirmed: { bg: "#10b981", text: "Confirmed" },
    cancelled: { bg: "#ef4444", text: "Cancelled" },
    pending: { bg: "#f59e0b", text: "Pending" },
    completed: { bg: "#3b82f6", text: "Completed" },
  };

  const style =
    statusStyles[normalizedStatus] || statusStyles.confirmed;

  return `<span style="display: inline-block; background: ${style.bg}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">${style.text}</span>`;
};


    // Email content
    const mailOptions = {
      from: `"E-Channelling Telco Agent" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Appointment ${
        appointmentDetails.status === "cancelled" ? "Cancelled" : "Confirmation"
      } - ${appointmentDetails.appointmentId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment ${
            appointmentDetails.status === "cancelled"
              ? "Cancellation"
              : "Confirmation"
          }</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
                        ${
                          appointmentDetails.status === "cancelled"
                            ? "Appointment Cancelled"
                            : "Appointment Confirmed"
                        }
                      </h1>
                      <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px;">
                        Reference ID: <strong>${
                          appointmentDetails.appointmentId
                        }</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                    

                      ${
                        appointmentDetails.status === "cancelled"
                          ? `
                        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin-bottom: 30px; border-radius: 6px;">
                          <p style="margin: 0; color: #991b1b; font-size: 14px;">
                            <strong>⚠️ Notice:</strong> This appointment has been cancelled. If you believe this is an error, please contact our support team.
                          </p>
                        </div>
                      `
                          : `
                        <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 30px; border-radius: 6px;">
                          <p style="margin: 0; color: #065f46; font-size: 14px;">
                            <strong>✓ Success:</strong> Your appointment has been successfully confirmed. Please arrive 15 minutes early.
                          </p>
                        </div>
                      `
                      }

                      <!-- Appointment Details -->
                      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                        Appointment Details
                      </h2>
                      
                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">Doctor</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${
                              appointmentDetails.doctor
                            }</strong>
                            ${
                              appointmentDetails.specialization
                                ? `<br><span style="color: #6b7280; font-size: 13px;">${appointmentDetails.specialization}</span>`
                                : ""
                            }
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">Hospital</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${
                              appointmentDetails.hospital || "N/A"
                            }</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">Date</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${
                              appointmentDetails.date
                            }</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">Time</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${
                              appointmentDetails.time || "N/A"
                            }</strong>
                          </td>
                        </tr>
                      </table>

                      <!-- Patient Information -->
                      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                         Patient Information
                      </h2>
                      
                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">Name</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${
                              appointmentDetails.patientName
                            }</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">Phone</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${
                              appointmentDetails.patientPhone || "N/A"
                            }</strong>
                          </td>
                        </tr>
                        ${
                          appointmentDetails.patientNIC
                            ? `
                        <tr>
                          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px;">NIC</span>
                          </td>
                          <td style="padding: 14px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #1f2937; font-size: 15px;">${appointmentDetails.patientNIC}</strong>
                          </td>
                        </tr>
                        `
                            : ""
                        }
                      </table>

                      ${
                        appointmentDetails.total || appointmentDetails.basePrice
                          ? `
                      <!-- Payment Summary -->
                      <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin-bottom: 30px; border: 2px solid #0ea5e9;">
                        <h3 style="margin: 0 0 20px 0; color: #0369a1; font-size: 18px;">Payment Summary</h3>
                        
                        ${
                          appointmentDetails.basePrice ||
                          appointmentDetails.refundDeposit
                            ? `
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                          ${
                            appointmentDetails.basePrice
                              ? `
                          <tr style="background: #f8fafc;">
                            <td style="padding: 14px 16px; color: #475569; font-size: 15px;">
                              Base Price:
                            </td>
                            <td style="padding: 14px 16px; text-align: right; color: #0f172a; font-size: 16px; font-weight: 700;">
                              Rs. ${appointmentDetails.basePrice}
                            </td>
                          </tr>
                          `
                              : ""
                          }
                          
                          ${
                            appointmentDetails.refundDeposit &&
                            appointmentDetails.refundDeposit > 0
                              ? `
                          <tr style="background: #f8fafc;">
                            <td style="padding: 14px 16px; color: #475569; font-size: 15px;">
                              Refund Deposit:
                            </td>
                            <td style="padding: 14px 16px; text-align: right; color: #0891b2; font-size: 16px; font-weight: 700;">
                              Rs. ${appointmentDetails.refundDeposit}
                            </td>
                          </tr>
                          `
                              : ""
                          }
                        </table>
                        `
                            : ""
                        }
                        
                        <div style="background: #e0f2fe; padding: 16px; border-radius: 6px; border-top: 2px solid #0ea5e9;">
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="color: #0f172a; font-size: 16px; font-weight: 700;">
                                Total:
                              </td>
                              <td style="text-align: right; color: #0891b2; font-size: 20px; font-weight: 700;">
                                Rs. ${appointmentDetails.total}
                              </td>
                            </tr>
                          </table>
                        </div>
                        
                        ${
                          appointmentDetails.refundDeposit &&
                          appointmentDetails.refundDeposit > 0
                            ? `
                      
                        `
                            : ""
                        }
                      </div>
                      `
                          : ""
                      }

                      ${
                        appointmentDetails.status !== "cancelled"
                          ? `
                      <!-- Important Note -->
                      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                          <strong>📌 Important Reminders:</strong>
                        </p>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #92400e; font-size: 14px;">
                          <li>Please arrive 15 minutes before your scheduled time</li>
                          <li>Bring your NIC or identification document</li>
                          <li>Keep this email for your records</li>
                        </ul>
                      </div>
                      `
                          : ""
                      }

                      <!-- Need Help Section -->
                      <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px;">
                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Need assistance?</p>
                        <p style="margin: 0; color: #4b5563; font-size: 14px;">
                          Contact us at <a href="mailto:support@echannelling.com" style="color: #667eea; text-decoration: none; font-weight: 600;">support@echannelling.com</a>
                        </p>
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                        This is an automated message. Please do not reply to this email.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} E-Channelling System. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("❌ Email error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to send email",
        details: error.code,
      },
      { status: 500 }
    );
  }
}
