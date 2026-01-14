"use client";
import html2canvas from 'html2canvas';

import {
  X,
  FileText,
  Mail,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

type AppointmentDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCancelled?: () => void;
  appointment?: {
    id: number;
    appointmentId: string;
    status: string;
    doctor: string;
    specialization?: string;
    hospital?: string;
    date: string;
    time: string;
    amount?: number;
    patientName: string;
    patientPhone?: string;
    patientEmail?: string;
    patientNIC?: string;
    patientDOB?: string;
    patientGender?: string;
    patientAge?: number;
    basePrice?: number;
    refundDeposit?: number;
    total?: number;
    refundEligible?: string;
  };
};

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  onAppointmentCancelled,
  appointment,
}: AppointmentDetailsModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailSuccessPopup, setShowEmailSuccessPopup] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    // Check if email exists in appointment data
    if (!appointment?.patientEmail || appointment.patientEmail === "N/A") {
      setEmailError(
        "No email address found for this patient. Please add an email address to the patient details."
      );
      setTimeout(() => setEmailError(null), 5000);
      return;
    }

    setIsSendingEmail(true);
    setEmailError(null);
    setShowEmailSuccessPopup(false);

    try {
      // Get the total amount
      const totalAmount = appointment.total || appointment.amount || 0; // ✅ Remove appointment.total_amount

      // Calculate base price and refund deposit
      let basePrice = appointment.basePrice;
      let refundDeposit = appointment.refundDeposit || 0;

      // If basePrice is not available, calculate it
      if (!basePrice) {
        if (appointment.refundEligible) {
          // ✅ Remove appointment.refund_eligible
          refundDeposit = 250;
          basePrice = totalAmount - refundDeposit;
        } else {
          basePrice = totalAmount;
          refundDeposit = 0;
        }
      }

      const response = await fetch("/api/appointments/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: appointment.patientEmail,
          appointmentDetails: {
            appointmentId: appointment.appointmentId,
            doctor: appointment.doctor,
            specialization: appointment.specialization,
            hospital: appointment.hospital,
            date: appointment.date,
            time: appointment.time,
            patientName: appointment.patientName,
            patientPhone: appointment.patientPhone,
            patientNIC: appointment.patientNIC,
            basePrice: basePrice,
            refundDeposit: refundDeposit,
            total: totalAmount,
            status: currentStatus,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setIsSendingEmail(false);
      setShowEmailSuccessPopup(true);

      setTimeout(() => {
        setShowEmailSuccessPopup(false);
      }, 3000);
    } catch (err: any) {
      setIsSendingEmail(false);
      setEmailError(err.message);
      console.error("Error sending email:", err);

      setTimeout(() => setEmailError(null), 5000);
    }
  };

  // Local state to track current appointment status
  const [currentStatus, setCurrentStatus] = useState(appointment?.status || "");

  // Update local status when appointment prop changes
  useEffect(() => {
    if (appointment?.status) {
      setCurrentStatus(appointment.status);
    }
  }, [appointment?.status]);

  if (!isOpen || !appointment) return null;

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-rose-100 text-rose-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
  };

// වඩාත්ම reliable method - PDF එකේ style එකම image එකටත් ගන්නවා
const downloadAsImage = async () => {
  if (!receiptRef.current) {
    alert('Receipt not found!');
    return;
  }

  try {
    // Loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Generating image...';
    loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 9999; font-family: sans-serif;';
    document.body.appendChild(loadingMsg);

    // PDF එකේ HTML එක ගන්නවා (එකම style එක)
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              padding: 0;
              margin: 0;
              width: 210mm;
            }
            
            .receipt-container {
              width: 210mm;
              background: white;
              border: 2px solid #2563eb;
              overflow: hidden;
            }
            
            .receipt-header {
              background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
              color: white;
              padding: 20px 30px;
              text-align: center;
              position: relative;
            }
            
            .receipt-header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 3px;
              background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
            }
            
            .receipt-header h1 {
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 5px;
              letter-spacing: -0.5px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .receipt-header .appointment-id {
              font-size: 12px;
              opacity: 0.95;
              font-weight: 500;
              background: rgba(255, 255, 255, 0.25);
              display: inline-block;
              padding: 4px 12px;
              border-radius: 15px;
              margin-top: 4px;
              border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .receipt-body {
              padding: 20px 30px;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 15px;
              font-weight: 600;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            
            .status-confirmed {
              background: #d1fae5;
              color: #065f46;
            }
            
            .status-cancelled {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .status-pending {
              background: #fef3c7;
              color: #92400e;
            }
            
            .status-completed {
              background: #dbeafe;
              color: #1e40af;
            }
            
            .section {
              margin-bottom: 16px;
            }
            
            .section-title {
              font-size: 13px;
              font-weight: 700;
              color: #1e40af;
              margin-bottom: 8px;
              padding-bottom: 4px;
              border-bottom: 2px solid #3b82f6;
              display: inline-block;
              padding-right: 15px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-bottom: 12px;
            }
            
            .info-item {
              background: #eff6ff;
              padding: 8px 10px;
              border-radius: 5px;
              border-left: 3px solid #2563eb;
              border: 1px solid #bfdbfe;
              border-left: 3px solid #2563eb;
            }
            
            .info-label {
              font-size: 9px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              margin-bottom: 3px;
              font-weight: 600;
            }
            
            .info-value {
              font-size: 12px;
              color: #111827;
              font-weight: 600;
              line-height: 1.2;
            }
            
            .info-value-large {
              font-size: 16px;
              color: #1e40af;
              font-weight: 700;
            }
            
            .pricing-box {
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 12px;
              margin-top: 8px;
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
            }
            
            .pricing-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 11px;
            }
            
            .pricing-row.total {
              border-top: 2px solid #3b82f6;
              margin-top: 6px;
              padding-top: 8px;
              font-size: 13px;
              font-weight: 700;
              background: white;
              padding: 10px;
              border-radius: 5px;
              margin: 6px -4px 0;
            }
            
            .pricing-row .label {
              color: #1e40af;
              font-weight: 500;
            }
            
            .pricing-row .value {
              color: #1e3a8a;
              font-weight: 600;
            }
            
            .pricing-row.total .value {
              color: #1e40af;
              font-size: 16px;
            }
            
            .refund-notice {
              background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 10px;
              margin-top: 10px;
            }
            
            .refund-notice h4 {
              color: #065f46;
              font-size: 11px;
              font-weight: 700;
              margin-bottom: 4px;
            }
            
            .refund-notice p {
              color: #047857;
              font-size: 10px;
              line-height: 1.4;
            }
            
            .patient-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
            }
            
            .patient-item {
              background: white;
              padding: 7px 10px;
              border-radius: 5px;
              border: 1px solid #bfdbfe;
            }
            
            .receipt-footer {
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              padding: 12px 30px;
              text-align: center;
              border-top: 2px solid #3b82f6;
            }
            
            .receipt-footer p {
              color: #1e40af;
              font-size: 9px;
              margin: 2px 0;
            }
            
            .footer-logo {
              font-size: 11px;
              font-weight: 700;
              color: #1e40af;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-header">
              <h1>Appointment Receipt</h1>
              <div class="appointment-id">ID: ${appointment.appointmentId}</div>
            </div>
            
            <div class="receipt-body">
              <div class="section">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value">
                      <span class="status-badge status-${currentStatus.toLowerCase()}">
                        ${getStatusLabel(currentStatus)}
                      </span>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">Total Amount</div>
                    <div class="info-value-large">Rs. ${appointment.total || appointment.amount || 0}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">Doctor</div>
                    <div class="info-value">${appointment.doctor}</div>
                    ${appointment.specialization ? `<div style="font-size: 10px; color: #6b7280; margin-top: 2px;">${appointment.specialization}</div>` : ''}
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">Hospital</div>
                    <div class="info-value">${appointment.hospital || 'N/A'}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">Date</div>
                    <div class="info-value">${appointment.date}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">Time</div>
                    <div class="info-value">${appointment.time || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              ${appointment.basePrice ? `
              <div class="section">
                <h3 class="section-title">Pricing Breakdown</h3>
                <div class="pricing-box">
                  <div class="pricing-row">
                    <span class="label">Base Price:</span>
                    <span class="value">Rs. ${appointment.basePrice}</span>
                  </div>
                  ${(appointment.refundDeposit ?? 0) > 0 ? `
  <div class="pricing-row">
    <span class="label">Refund Deposit:</span>
    <span class="value">Rs. ${appointment.refundDeposit}</span>
  </div>
` : ``}

                  <div class="pricing-row total">
                    <span class="label">Total Amount:</span>
                    <span class="value">Rs. ${appointment.total || appointment.amount || 0}</span>
                  </div>
                </div>
              </div>
              ` : ''}
              
              ${appointment.refundEligible && (appointment.refundDeposit ?? 0) > 0 ? `
  <div class="refund-notice">
    <h4>✓ Refund Eligibility</h4>
    <p>${appointment.refundEligible}</p>
  </div>
` : ''}

              
              <div class="section">
                <h3 class="section-title">Patient Information</h3>
                <div class="patient-grid">
                  <div class="patient-item">
                    <div class="info-label">Patient Name</div>
                    <div class="info-value">${appointment.patientName || 'N/A'}</div>
                  </div>
                  
                  <div class="patient-item">
                    <div class="info-label">Mobile Number</div>
                    <div class="info-value">${appointment.patientPhone || 'N/A'}</div>
                  </div>
                  
                  <div class="patient-item">
                    <div class="info-label">Email Address</div>
                    <div class="info-value" style="word-break: break-all; font-size: 10px;">${appointment.patientEmail || 'N/A'}</div>
                  </div>
                  
                  <div class="patient-item">
                    <div class="info-label">NIC Number</div>
                    <div class="info-value">${appointment.patientNIC || 'N/A'}</div>
                  </div>
                  
                  <div class="patient-item">
                    <div class="info-label">Date of Birth</div>
                    <div class="info-value">${appointment.patientDOB || 'N/A'}</div>
                  </div>
                  
                  <div class="patient-item">
                    <div class="info-label">Gender</div>
                    <div class="info-value">${appointment.patientGender ? appointment.patientGender.charAt(0).toUpperCase() + appointment.patientGender.slice(1) : 'N/A'}</div>
                  </div>
                  
                  <div class="patient-item">
                    <div class="info-label">Age</div>
                    <div class="info-value">${appointment.patientAge ? `${appointment.patientAge} years` : 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="receipt-footer">
              <div class="footer-logo">Healthcare Appointment System</div>
              <p>This is an electronically generated receipt</p>
              <p>Generated on: ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
              <p style="margin-top: 12px; font-style: italic;">Thank you for choosing our services</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // New window එකක් open කරලා HTML එක load කරනවා
    const newWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!newWindow) {
      throw new Error('Could not open new window. Please allow pop-ups.');
    }

    newWindow.document.write(receiptHTML);
    newWindow.document.close();

    // Window එක load වෙනකන් wait කරනවා
    await new Promise(resolve => {
      newWindow.onload = resolve;
      setTimeout(resolve, 1000);
    });

    // html2canvas භාවිතා කරලා capture කරනවා
    const canvas = await html2canvas(newWindow.document.body, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794, // A4 width in pixels (210mm)
      windowHeight: 1123, // A4 height in pixels (297mm)
    });

    // Window එක close කරනවා
    newWindow.close();

    // Canvas එක PNG බවට convert කරනවා
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt_${appointment.appointmentId || Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Remove loading message
        document.body.removeChild(loadingMsg);
        
        // Success message
        const successMsg = document.createElement('div');
        successMsg.textContent = '✓ Receipt downloaded as PNG!';
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; font-family: sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        document.body.appendChild(successMsg);
        setTimeout(() => document.body.removeChild(successMsg), 3000);
      }
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download image. Error: ' + error.message);
  }
};
  const downloadAsPdf = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=900,height=700");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Appointment Receipt - ${appointment.appointmentId}</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                @page {
                  size: A4;
                  margin: 0;
                }
                
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background: white;
                  padding: 0;
                  margin: 0;
                }
                
                .receipt-container {
                  width: 210mm;
                  height: 297mm;
                  margin: 0 auto;
                  background: white;
                  border: 2px solid #2563eb;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                  page-break-after: avoid;
                  page-break-inside: avoid;
                }
                
                .receipt-header {
                  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
                  color: white;
                  padding: 20px 30px;
                  text-align: center;
                  position: relative;
                  flex-shrink: 0;
                }
                
                .receipt-header::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 3px;
                  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
                }
                
                .receipt-header h1 {
                  font-size: 22px;
                  font-weight: 700;
                  margin-bottom: 5px;
                  letter-spacing: -0.5px;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .receipt-header .appointment-id {
                  font-size: 12px;
                  opacity: 0.95;
                  font-weight: 500;
                  background: rgba(255, 255, 255, 0.25);
                  display: inline-block;
                  padding: 4px 12px;
                  border-radius: 15px;
                  margin-top: 4px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                .receipt-body {
                  padding: 20px 30px;
                  flex-grow: 1;
                  overflow: hidden;
                }
                
                .status-badge {
                  display: inline-block;
                  padding: 4px 12px;
                  border-radius: 15px;
                  font-weight: 600;
                  font-size: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.3px;
                }
                
                .status-confirmed {
                  background: #d1fae5;
                  color: #065f46;
                }
                
                .status-cancelled {
                  background: #fee2e2;
                  color: #991b1b;
                }
                
                .status-pending {
                  background: #fef3c7;
                  color: #92400e;
                }
                
                .status-completed {
                  background: #dbeafe;
                  color: #1e40af;
                }
                
                .section {
                  margin-bottom: 16px;
                  page-break-inside: avoid;
                }
                
                .section-title {
                  font-size: 13px;
                  font-weight: 700;
                  color: #1e40af;
                  margin-bottom: 8px;
                  padding-bottom: 4px;
                  border-bottom: 2px solid #3b82f6;
                  display: inline-block;
                  padding-right: 15px;
                }
                
                .info-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 10px;
                  margin-bottom: 12px;
                }
                
                .info-item {
                  background: #eff6ff;
                  padding: 8px 10px;
                  border-radius: 5px;
                  border-left: 3px solid #2563eb;
                  border: 1px solid #bfdbfe;
                  border-left: 3px solid #2563eb;
                }
                
                .info-label {
                  font-size: 9px;
                  color: #6b7280;
                  text-transform: uppercase;
                  letter-spacing: 0.3px;
                  margin-bottom: 3px;
                  font-weight: 600;
                }
                
                .info-value {
                  font-size: 12px;
                  color: #111827;
                  font-weight: 600;
                  line-height: 1.2;
                }
                
                .info-value-large {
                  font-size: 16px;
                  color: #1e40af;
                  font-weight: 700;
                }
                
                .pricing-box {
                  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                  border: 2px solid #3b82f6;
                  border-radius: 8px;
                  padding: 12px;
                  margin-top: 8px;
                  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
                  page-break-inside: avoid;
                }
                
                .pricing-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 5px 0;
                  font-size: 11px;
                }
                
                .pricing-row.total {
                  border-top: 2px solid #3b82f6;
                  margin-top: 6px;
                  padding-top: 8px;
                  font-size: 13px;
                  font-weight: 700;
                  background: white;
                  padding: 10px;
                  border-radius: 5px;
                  margin: 6px -4px 0;
                }
                
                .pricing-row .label {
                  color: #1e40af;
                  font-weight: 500;
                }
                
                .pricing-row .value {
                  color: #1e3a8a;
                  font-weight: 600;
                }
                
                .pricing-row.total .value {
                  color: #1e40af;
                  font-size: 16px;
                }
                
                .refund-notice {
                  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
                  border: 2px solid #10b981;
                  border-radius: 8px;
                  padding: 10px;
                  margin-top: 10px;
                  page-break-inside: avoid;
                }
                
                .refund-notice h4 {
                  color: #065f46;
                  font-size: 11px;
                  font-weight: 700;
                  margin-bottom: 4px;
                }
                
                .refund-notice p {
                  color: #047857;
                  font-size: 10px;
                  line-height: 1.4;
                }
                
                .patient-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 8px;
                }
                
                .patient-item {
                  background: white;
                  padding: 7px 10px;
                  border-radius: 5px;
                  border: 1px solid #bfdbfe;
                }
                
                .receipt-footer {
                  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                  padding: 12px 30px;
                  text-align: center;
                  border-top: 2px solid #3b82f6;
                  flex-shrink: 0;
                }
                
                .receipt-footer p {
                  color: #1e40af;
                  font-size: 9px;
                  margin: 2px 0;
                }
                
                .footer-logo {
                  font-size: 11px;
                  font-weight: 700;
                  color: #1e40af;
                  margin-bottom: 4px;
                  text-transform: uppercase;
                  letter-spacing: 0.8px;
                }
                
                @media print {
                  body {
                    background: white;
                    padding: 0;
                    margin: 0;
                  }
                  
                  .receipt-container {
                    box-shadow: none;
                    border: none;
                    page-break-after: avoid;
                    page-break-inside: avoid;
                  }
                  
                  .section {
                    page-break-inside: avoid;
                  }
                  
                  .pricing-box, .refund-notice {
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                <div class="receipt-header">
                  <h1>Appointment Receipt</h1>
                  <div class="appointment-id">ID: ${appointment.appointmentId}</div>
                </div>
                
                <div class="receipt-body">
                  <div class="section">
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">
                          <span class="status-badge status-${currentStatus.toLowerCase()}">
                            ${getStatusLabel(currentStatus)}
                          </span>
                        </div>
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">Total Amount</div>
                        <div class="info-value-large">Rs. ${appointment.total || appointment.amount || 0}</div>
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">Doctor</div>
                        <div class="info-value">${appointment.doctor}</div>
                        ${appointment.specialization ? `<div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${appointment.specialization}</div>` : ''}
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">Hospital</div>
                        <div class="info-value">${appointment.hospital || 'N/A'}</div>
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">Date</div>
                        <div class="info-value">${appointment.date}</div>
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">Time</div>
                        <div class="info-value">${appointment.time || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  
                  ${appointment.basePrice ? `
                  <div class="section">
                    <h3 class="section-title">Pricing Breakdown</h3>
                    <div class="pricing-box">
                      <div class="pricing-row">
                        <span class="label">Base Price:</span>
                        <span class="value">Rs. ${appointment.basePrice}</span>
                      </div>
                      ${appointment.refundDeposit > 0 ? `
                      <div class="pricing-row">
                        <span class="label">Refund Deposit:</span>
                        <span class="value">Rs. ${appointment.refundDeposit}</span>
                      </div>
                      ` : ''}
                      <div class="pricing-row total">
                        <span class="label">Total Amount:</span>
                        <span class="value">Rs. ${appointment.total || appointment.amount || 0}</span>
                      </div>
                    </div>
                  </div>
                  ` : ''}
                  
                  ${appointment.refundEligible && appointment.refundDeposit > 0 ? `
                  <div class="refund-notice">
                    <h4>✓ Refund Eligibility</h4>
                    <p>${appointment.refundEligible}</p>
                  </div>
                  ` : ''}
                  
                  <div class="section">
                    <h3 class="section-title">Patient Information</h3>
                    <div class="patient-grid">
                      <div class="patient-item">
                        <div class="info-label">Patient Name</div>
                        <div class="info-value">${appointment.patientName || 'N/A'}</div>
                      </div>
                      
                      <div class="patient-item">
                        <div class="info-label">Mobile Number</div>
                        <div class="info-value">${appointment.patientPhone || 'N/A'}</div>
                      </div>
                      
                      <div class="patient-item">
                        <div class="info-label">Email Address</div>
                        <div class="info-value" style="word-break: break-all;">${appointment.patientEmail || 'N/A'}</div>
                      </div>
                      
                      <div class="patient-item">
                        <div class="info-label">NIC Number</div>
                        <div class="info-value">${appointment.patientNIC || 'N/A'}</div>
                      </div>
                      
                      <div class="patient-item">
                        <div class="info-label">Date of Birth</div>
                        <div class="info-value">${appointment.patientDOB || 'N/A'}</div>
                      </div>
                      
                      <div class="patient-item">
                        <div class="info-label">Gender</div>
                        <div class="info-value">${appointment.patientGender ? appointment.patientGender.charAt(0).toUpperCase() + appointment.patientGender.slice(1) : 'N/A'}</div>
                      </div>
                      
                      <div class="patient-item">
                        <div class="info-label">Age</div>
                        <div class="info-value">${appointment.patientAge ? `${appointment.patientAge} years` : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="receipt-footer">
                  <div class="footer-logo">Healthcare Appointment System</div>
                  <p>This is an electronically generated receipt</p>
                  <p>Generated on: ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  <p style="margin-top: 12px; font-style: italic;">Thank you for choosing our services</p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };
  const hasRefundDeposit =
    appointment.refundDeposit && appointment.refundDeposit > 0;

  const handleCancelAppointment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          withRefund: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel appointment");
      }

      setIsProcessing(false);
      setShowCancelModal(false);

      // Update local status immediately
      setCurrentStatus("cancelled");

      setCancellationSuccess(true);

      // Auto close success message and refresh after 3 seconds
      setTimeout(() => {
        setCancellationSuccess(false);
        if (onAppointmentCancelled) {
          onAppointmentCancelled();
        }
        onClose();
      }, 3000);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message);
      console.error("Error cancelling appointment:", err);
    }
  };

  const handleCancelWithRefund = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          withRefund: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process refund");
      }

      setIsProcessing(false);
      setShowRefundModal(false);

      // Update local status immediately
      setCurrentStatus("cancelled");

      setCancellationSuccess(true);

      // Auto close success message and refresh after 3 seconds
      setTimeout(() => {
        setCancellationSuccess(false);
        if (onAppointmentCancelled) {
          onAppointmentCancelled();
        }
        onClose();
      }, 3000);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message);
      console.error("Error processing refund:", err);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Email Error Message */}
            {emailError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{emailError}</p>
              </div>
            )}

            {/* Appointment Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Summary
              </h3>
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                {/* Appointment ID */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Appointment ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.appointmentId}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      currentStatus
                    )}`}
                  >
                    {getStatusLabel(currentStatus)}
                  </span>
                </div>

                {/* Doctor */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="text-base font-semibold text-gray-900">
                    {appointment.doctor}
                  </p>
                  {appointment.specialization && (
                    <p className="text-xs text-gray-600">
                      {appointment.specialization}
                    </p>
                  )}
                </div>

                {/* Hospital */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hospital</p>
                  <p className="text-base font-semibold text-gray-900">
                    {appointment.hospital || "N/A"}
                  </p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="text-base font-semibold text-gray-900">
                    {appointment.date}
                  </p>
                  <p className="text-sm text-gray-700">
                    {appointment.time || "N/A"}
                  </p>
                </div>

                {/* Total Amount */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-emerald-600">
                    Rs. {appointment.total || appointment.amount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            {(appointment.basePrice || appointment.refundDeposit) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing Breakdown
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                  {appointment.basePrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Base Price:</span>
                      <span className="font-semibold text-gray-900">
                        Rs. {appointment.basePrice}
                      </span>
                    </div>
                  )}
                  {appointment.refundDeposit &&
                    appointment.refundDeposit > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Refund Deposit:</span>
                        <span className="font-semibold text-cyan-600">
                          Rs. {appointment.refundDeposit}
                        </span>
                      </div>
                    )}
                  <div className="border-t border-blue-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-cyan-600">
                        Rs. {appointment.total || appointment.amount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Refund Eligibility */}
            {appointment.refundEligible &&
              appointment.refundDeposit &&
              appointment.refundDeposit > 0 && (
                <div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">
                        Refund Eligibility
                      </p>
                      <p className="text-sm text-emerald-800">
                        {appointment.refundEligible}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={appointment.patientName || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={appointment.patientPhone || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={appointment.patientEmail || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    value={appointment.patientNIC || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={appointment.patientDOB || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={
                      appointment.patientGender
                        ? appointment.patientGender.charAt(0).toUpperCase() +
                          appointment.patientGender.slice(1)
                        : "N/A"
                    }
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Age
                  </label>
                  <input
                    type="text"
                    value={
                      appointment.patientAge
                        ? `${appointment.patientAge} years`
                        : "N/A"
                    }
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
              </div>
            </div>
            <div>
              {/* Action Buttons */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition">
                  <FileText className="w-5 h-5" />
                  Send SMS Receipt
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5" />
                  {isSendingEmail ? "Sending..." : "Send Email Receipt"}
                </button>
                <button
                  onClick={downloadAsPdf}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={downloadAsImage}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    !hasRefundDeposit ? "col-span-2" : ""
                  }`}
                  onClick={() => setShowCancelModal(true)}
                  disabled={currentStatus === "cancelled"}
                >
                  <X className="w-5 h-5" />
                  {currentStatus === "cancelled"
                    ? "Appointment Cancelled"
                    : "Cancel Appointment"}
                </button>
                {hasRefundDeposit && (
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShowRefundModal(true)}
                    disabled={currentStatus === "cancelled"}
                  >
                    <AlertCircle className="w-5 h-5" />
                    {currentStatus === "cancelled"
                      ? "Cancelled"
                      : "Cancel & Refund"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hidden Receipt for Printing/Export */}
          <div ref={receiptRef} className="hidden">
            <div className="w-full max-w-2xl bg-white p-8">
              <div className="border-b-2 border-gray-300 pb-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Appointment Receipt
                </h1>
                <p className="text-gray-600 mt-2">
                  ID: {appointment.appointmentId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.doctor}
                  </p>
                  {appointment.specialization && (
                    <p className="text-sm text-gray-700">
                      {appointment.specialization}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900">
                    {getStatusLabel(currentStatus)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.date}
                  </p>
                  <p className="text-sm text-gray-700">
                    {appointment.time || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.hospital || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Patient Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientPhone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientEmail || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIC</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientNIC || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientDOB || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientGender
                        ? appointment.patientGender.charAt(0).toUpperCase() +
                          appointment.patientGender.slice(1)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientAge
                        ? `${appointment.patientAge} years`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {appointment.basePrice && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Pricing
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Base Price:</span>
                      <span className="font-semibold">
                        Rs. {appointment.basePrice}
                      </span>
                    </div>
                    {appointment.refundDeposit &&
                      appointment.refundDeposit > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Refund Deposit:</span>
                          <span className="font-semibold">
                            Rs. {appointment.refundDeposit}
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-lg">
                        Rs. {appointment.total || appointment.amount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {appointment.refundEligible &&
                appointment.refundDeposit &&
                appointment.refundDeposit > 0 && (
                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <p className="font-semibold text-gray-900 mb-2">
                      Refund Eligibility
                    </p>
                    <p className="text-sm text-gray-700">
                      {appointment.refundEligible}
                    </p>
                  </div>
                )}

              <div className="text-center text-xs text-gray-500 border-t-2 border-gray-300 pt-4 mt-6">
                <p>This is an electronically generated receipt</p>
                <p>Printed on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Appointment Confirmation Modal */}
      {showCancelModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => !isProcessing && setShowCancelModal(false)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Cancel Appointment?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to cancel this appointment with{" "}
                  {appointment.doctor}? This action cannot be undone.
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                    disabled={isProcessing}
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cancel & Refund Confirmation Modal */}
      {showRefundModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => !isProcessing && setShowRefundModal(false)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-emerald-100 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Cancel & Request Refund?
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Are you sure you want to cancel this appointment and request a
                  refund?
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">
                      Refund Amount:
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      Rs. {appointment.refundDeposit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {appointment.refundEligible ||
                      "Refund will be processed within 5-7 business days"}
                  </p>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                    disabled={isProcessing}
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancelWithRefund}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Yes, Refund"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Appointment Cancellation Success Popup */}
      {cancellationSuccess && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {hasRefundDeposit
                    ? "Refund Initiated!"
                    : "Appointment Cancelled"}
                </h3>
                <p className="text-gray-600">
                  {hasRefundDeposit
                    ? `Your appointment has been cancelled and a refund of Rs. ${appointment.refundDeposit} will be processed within 5-7 business days.`
                    : "Your appointment has been successfully cancelled."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Email Success Popup */}
      {showEmailSuccessPopup && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[70]" />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-scale-in">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-1">Receipt has been sent to:</p>
                <p className="text-blue-600 font-semibold">
                  {appointment.patientEmail}
                </p>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ The patient will receive the appointment details via email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
