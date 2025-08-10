package com.medical.app.util;

import com.medical.app.model.Payment;

public class EmailTemplate {
    
    public static String getPaymentConfirmationTemplate(Payment payment, String appBaseUrl) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light dark">
                <meta name="supported-color-schemes" content="light dark">
                <title>Payment Confirmation - Tabib.life</title>
                <!--[if mso]>
                <noscript>
                    <xml>
                        <o:OfficeDocumentSettings>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                </noscript>
                <![endif]-->
                <style>
                    /* Reset styles */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    /* Base styles */
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                        background-color: #f4f4f4; 
                        margin: 0; 
                        padding: 0; 
                        width: 100%% !important; 
                        -webkit-text-size-adjust: 100%%; 
                        -ms-text-size-adjust: 100%%; 
                    }
                    
                    /* Dark mode support */
                    @media (prefers-color-scheme: dark) {
                        body { background-color: #1a1a1a !important; }
                        .container { background-color: #2d2d2d !important; }
                        .header { background-color: #667eea !important; }
                        .success-title { color: #ffffff !important; }
                        .success-subtitle { color: #cccccc !important; }
                        .payment-details { background-color: #3a3a3a !important; border-color: #4a4a4a !important; }
                        .payment-details h3 { color: #ffffff !important; border-bottom-color: #667eea !important; }
                        .detail-label { color: #cccccc !important; }
                        .detail-value { color: #ffffff !important; }
                        .amount-value { color: #ffffff !important; }
                        .thank-you { background-color: #3a3a3a !important; }
                        .thank-you p { color: #ffffff !important; }
                        .footer { background-color: #3a3a3a !important; border-top-color: #4a4a4a !important; }
                        .footer h4 { color: #ffffff !important; }
                        .footer p { color: #cccccc !important; }
                    }
                    
                    /* Container */
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff; 
                        border-radius: 8px; 
                        overflow: hidden; 
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                    }
                    
                    /* Header */
                    .header { 
                        background-color: #667eea; 
                        padding: 30px 20px; 
                        text-align: center; 
                    }
                    
                    .header h1 { 
                        color: #ffffff; 
                        font-size: 28px; 
                        font-weight: 700; 
                        margin-bottom: 8px; 
                        letter-spacing: -0.5px; 
                        line-height: 1.2; 
                    }
                    
                    .header p { 
                        color: rgba(255,255,255,0.9); 
                        font-size: 16px; 
                        margin: 0; 
                    }
                    
                    /* Success section */
                    .success-section { 
                        text-align: center; 
                        padding: 30px 20px 20px; 
                        background-color: #ffffff; 
                    }
                    
                    .success-icon { 
                        width: 80px; 
                        height: 80px; 
                        background-color: #4CAF50; 
                        border-radius: 50%%; 
                        margin: 0 auto 20px; 
                        display: inline-block; 
                        line-height: 80px; 
                        text-align: center; 
                    }
                    
                    .success-icon span { 
                        color: #ffffff; 
                        font-size: 40px; 
                        font-weight: bold; 
                    }
                    
                    .success-title { 
                        color: #2c3e50; 
                        font-size: 24px; 
                        font-weight: 700; 
                        margin-bottom: 10px; 
                        line-height: 1.3; 
                    }
                    
                    .success-subtitle { 
                        color: #7f8c8d; 
                        font-size: 16px; 
                        margin-bottom: 25px; 
                        line-height: 1.4; 
                    }
                    
                    /* Payment details */
                    .payment-details { 
                        background-color: #f8f9fa; 
                        margin: 0 20px 20px; 
                        border-radius: 8px; 
                        padding: 25px; 
                        border: 1px solid #e9ecef; 
                    }
                    
                    .payment-details h3 { 
                        color: #2c3e50; 
                        font-size: 18px; 
                        font-weight: 600; 
                        margin-bottom: 20px; 
                        border-bottom: 2px solid #667eea; 
                        padding-bottom: 10px; 
                    }
                    
                    .detail-row { 
                        display: block; 
                        margin-bottom: 15px; 
                        padding: 10px 0; 
                        border-bottom: 1px solid rgba(0,0,0,0.05); 
                    }
                    
                    .detail-row:last-child { 
                        border-bottom: none; 
                        margin-bottom: 0; 
                    }
                    
                    .detail-label { 
                        color: #7f8c8d; 
                        font-weight: 500; 
                        font-size: 14px; 
                        display: block; 
                        margin-bottom: 5px; 
                    }
                    
                    .detail-value { 
                        color: #2c3e50; 
                        font-weight: 600; 
                        font-size: 14px; 
                        display: block; 
                    }
                    
                    .amount-value { 
                        color: #2c3e50; 
                        font-weight: 700; 
                        font-size: 18px; 
                    }
                    
                    .payment-id { 
                        color: #667eea; 
                        font-family: 'Courier New', monospace; 
                        font-size: 12px; 
                        background-color: rgba(102, 126, 234, 0.1); 
                        padding: 4px 8px; 
                        border-radius: 4px; 
                        word-break: break-all; 
                    }
                    
                    /* Thank you section */
                    .thank-you { 
                        text-align: center; 
                        padding: 25px; 
                        background-color: #f8f9fa; 
                        margin: 0 20px 20px; 
                        border-radius: 8px; 
                    }
                    
                    .thank-you p { 
                        color: #2c3e50; 
                        font-size: 16px; 
                        line-height: 1.6; 
                        margin-bottom: 15px; 
                    }
                    
                    .thank-you .highlight { 
                        color: #667eea; 
                        font-weight: 600; 
                    }
                    
                    /* CTA section */
                    .cta-section { 
                        text-align: center; 
                        padding: 20px; 
                        background-color: #ffffff; 
                    }
                    
                    .cta-button { 
                        display: inline-block; 
                        background-color: #667eea; 
                        color: #ffffff !important; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: 600; 
                        font-size: 16px; 
                        line-height: 1.4; 
                        text-align: center; 
                        min-width: 200px; 
                    }
                    
                    /* Footer */
                    .footer { 
                        background-color: #f8f9fa; 
                        padding: 25px 20px; 
                        text-align: center; 
                        border-top: 1px solid #e9ecef; 
                    }
                    
                    .footer h4 { 
                        color: #2c3e50; 
                        font-size: 16px; 
                        margin-bottom: 15px; 
                    }
                    
                    .footer p { 
                        color: #7f8c8d; 
                        font-size: 14px; 
                        margin-bottom: 8px; 
                        line-height: 1.4; 
                    }
                    
                    .footer .contact { 
                        color: #667eea; 
                        font-weight: 500; 
                    }
                    
                    .footer .copyright { 
                        color: #95a5a6; 
                        font-size: 12px; 
                        margin-top: 20px; 
                        padding-top: 20px; 
                        border-top: 1px solid #e9ecef; 
                    }
                    
                    /* Mobile responsive */
                    @media only screen and (max-width: 600px) {
                        .container { 
                            margin: 10px; 
                            border-radius: 6px; 
                        }
                        
                        .header { 
                            padding: 25px 15px; 
                        }
                        
                        .header h1 { 
                            font-size: 24px; 
                        }
                        
                        .success-section { 
                            padding: 25px 15px 15px; 
                        }
                        
                        .success-icon { 
                            width: 70px; 
                            height: 70px; 
                            line-height: 70px; 
                        }
                        
                        .success-icon span { 
                            font-size: 35px; 
                        }
                        
                        .success-title { 
                            font-size: 20px; 
                        }
                        
                        .payment-details { 
                            margin: 0 15px 15px; 
                            padding: 20px; 
                        }
                        
                        .thank-you { 
                            margin: 0 15px 15px; 
                            padding: 20px; 
                        }
                        
                        .cta-section { 
                            padding: 15px; 
                        }
                        
                        .cta-button { 
                            padding: 12px 25px; 
                            font-size: 15px; 
                            min-width: 180px; 
                        }
                        
                        .footer { 
                            padding: 20px 15px; 
                        }
                    }
                    
                    /* Outlook specific styles */
                    .ExternalClass { width: 100%%; }
                    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%%; }
                    
                    /* Gmail specific */
                    u + .body .gmail { color: inherit; }
                    span.gmail { color: inherit; }
                    a.gmail { color: inherit; }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td class="header" style="background-color: #667eea; padding: 30px 20px; text-align: center;">
                                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; line-height: 1.2;">Tabib.life</h1>
                                        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Your Health, Our Priority</p>
                                    </td>
                                </tr>
                                
                                <!-- Success Section -->
                                <tr>
                                    <td class="success-section" style="text-align: center; padding: 30px 20px 20px; background-color: #ffffff;">
                                        <div class="success-icon" style="width: 80px; height: 80px; background-color: #4CAF50; border-radius: 50%%; margin: 0 auto 20px; display: inline-block; line-height: 80px; text-align: center;">
                                            <span style="color: #ffffff; font-size: 40px; font-weight: bold;">✓</span>
                                        </div>
                                        <h2 class="success-title" style="color: #2c3e50; font-size: 24px; font-weight: 700; margin-bottom: 10px; line-height: 1.3;">Payment Successful!</h2>
                                        <p class="success-subtitle" style="color: #7f8c8d; font-size: 16px; margin-bottom: 25px; line-height: 1.4;">Your payment has been processed successfully</p>
                                    </td>
                                </tr>
                                
                                <!-- Payment Details -->
                                <tr>
                                    <td class="payment-details" style="background-color: #f8f9fa; margin: 0 20px 20px; border-radius: 8px; padding: 25px; border: 1px solid #e9ecef;">
                                        <h3 style="color: #2c3e50; font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Payment Details</h3>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Amount</span>
                                            <span class="detail-value amount-value" style="color: #2c3e50; font-weight: 700; font-size: 18px; display: block;">%.2f %s</span>
                                        </div>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Payment Method</span>
                                            <span class="detail-value" style="color: #2c3e50; font-weight: 600; font-size: 14px; display: block;">%s</span>
                                        </div>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Payment ID</span>
                                            <span class="detail-value payment-id" style="color: #667eea; font-family: 'Courier New', monospace; font-size: 12px; background-color: rgba(102, 126, 234, 0.1); padding: 4px 8px; border-radius: 4px; word-break: break-all; display: block;">%s</span>
                                        </div>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Transaction ID</span>
                                            <span class="detail-value payment-id" style="color: #667eea; font-family: 'Courier New', monospace; font-size: 12px; background-color: rgba(102, 126, 234, 0.1); padding: 4px 8px; border-radius: 4px; word-break: break-all; display: block;">%s</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Thank You Section -->
                                <tr>
                                    <td class="thank-you" style="text-align: center; padding: 25px; background-color: #f8f9fa; margin: 0 20px 20px; border-radius: 8px;">
                                        <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Thank you for choosing <span class="highlight" style="color: #667eea; font-weight: 600;">Tabib.life</span> for your healthcare needs.</p>
                                        <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">We're committed to providing you with the best medical consultation experience and ensuring your health journey is smooth and professional.</p>
                                    </td>
                                </tr>
                                
                                <!-- CTA Section -->
                                <tr>
                                    <td class="cta-section" style="text-align: center; padding: 20px; background-color: #ffffff;">
                                        <a href="%s" class="cta-button" style="display: inline-block; background-color: #667eea; color: #ffffff !important; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; line-height: 1.4; text-align: center; min-width: 200px;">View Your Consultation</a>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td class="footer" style="background-color: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #e9ecef;">
                                        <h4 style="color: #2c3e50; font-size: 16px; margin-bottom: 15px;">Need Help?</h4>
                                        <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 8px; line-height: 1.4;">Our support team is here to assist you</p>
                                        <p class="contact" style="color: #667eea; font-weight: 500; font-size: 14px; margin-bottom: 8px;">support@tabib.life</p>
                                        <div class="copyright" style="color: #95a5a6; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                            © 2024 Tabib.life. All rights reserved.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """,
            payment.getAmount() != null ? payment.getAmount() : 0.0,
            payment.getCurrency() != null ? payment.getCurrency() : "MAD",
            payment.getPaymentMethod() != null ? payment.getPaymentMethod().getDisplayName() : "Unknown",
            payment.getPaymentId() != null ? payment.getPaymentId() : "N/A",
            payment.getTransactionId() != null ? payment.getTransactionId() : "N/A",
            appBaseUrl != null ? appBaseUrl : "#"
        );
    }
    
    public static String getRefundConfirmationTemplate(Payment payment, Double refundAmount) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light dark">
                <meta name="supported-color-schemes" content="light dark">
                <title>Refund Confirmation - Tabib.life</title>
                <!--[if mso]>
                <noscript>
                    <xml>
                        <o:OfficeDocumentSettings>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                </noscript>
                <![endif]-->
                <style>
                    /* Reset styles */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    /* Base styles */
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                        background-color: #f4f4f4; 
                        margin: 0; 
                        padding: 0; 
                        width: 100%% !important; 
                        -webkit-text-size-adjust: 100%%; 
                        -ms-text-size-adjust: 100%%; 
                    }
                    
                    /* Dark mode support */
                    @media (prefers-color-scheme: dark) {
                        body { background-color: #1a1a1a !important; }
                        .container { background-color: #2d2d2d !important; }
                        .header { background-color: #667eea !important; }
                        .refund-title { color: #ffffff !important; }
                        .refund-subtitle { color: #cccccc !important; }
                        .refund-details { background-color: #3a3a3a !important; border-color: #4a4a4a !important; }
                        .refund-details h3 { color: #ffffff !important; border-bottom-color: #FF6B6B !important; }
                        .detail-label { color: #cccccc !important; }
                        .detail-value { color: #ffffff !important; }
                        .amount-value { color: #ffffff !important; }
                        .reason-value { color: #FF6B6B !important; }
                        .processing-info { background-color: #3a3a3a !important; border-color: #4a4a4a !important; }
                        .processing-info h4 { color: #ffffff !important; }
                        .processing-info p { color: #cccccc !important; }
                        .support-section { background-color: #3a3a3a !important; }
                        .support-section p { color: #ffffff !important; }
                        .footer { background-color: #3a3a3a !important; border-top-color: #4a4a4a !important; }
                        .footer h4 { color: #ffffff !important; }
                        .footer p { color: #cccccc !important; }
                    }
                    
                    /* Container */
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff; 
                        border-radius: 8px; 
                        overflow: hidden; 
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                    }
                    
                    /* Header */
                    .header { 
                        background-color: #667eea; 
                        padding: 30px 20px; 
                        text-align: center; 
                    }
                    
                    .header h1 { 
                        color: #ffffff; 
                        font-size: 28px; 
                        font-weight: 700; 
                        margin-bottom: 8px; 
                        letter-spacing: -0.5px; 
                        line-height: 1.2; 
                    }
                    
                    .header p { 
                        color: rgba(255,255,255,0.9); 
                        font-size: 16px; 
                        margin: 0; 
                    }
                    
                    /* Refund section */
                    .refund-section { 
                        text-align: center; 
                        padding: 30px 20px 20px; 
                        background-color: #ffffff; 
                    }
                    
                    .refund-icon { 
                        width: 80px; 
                        height: 80px; 
                        background-color: #FF6B6B; 
                        border-radius: 50%%; 
                        margin: 0 auto 20px; 
                        display: inline-block; 
                        line-height: 80px; 
                        text-align: center; 
                    }
                    
                    .refund-icon span { 
                        color: #ffffff; 
                        font-size: 40px; 
                        font-weight: bold; 
                    }
                    
                    .refund-title { 
                        color: #2c3e50; 
                        font-size: 24px; 
                        font-weight: 700; 
                        margin-bottom: 10px; 
                        line-height: 1.3; 
                    }
                    
                    .refund-subtitle { 
                        color: #7f8c8d; 
                        font-size: 16px; 
                        margin-bottom: 25px; 
                        line-height: 1.4; 
                    }
                    
                    /* Refund details */
                    .refund-details { 
                        background-color: #fff5f5; 
                        margin: 0 20px 20px; 
                        border-radius: 8px; 
                        padding: 25px; 
                        border: 1px solid #fed7d7; 
                        border-left: 4px solid #FF6B6B; 
                    }
                    
                    .refund-details h3 { 
                        color: #2c3e50; 
                        font-size: 18px; 
                        font-weight: 600; 
                        margin-bottom: 20px; 
                        border-bottom: 2px solid #FF6B6B; 
                        padding-bottom: 10px; 
                    }
                    
                    .detail-row { 
                        display: block; 
                        margin-bottom: 15px; 
                        padding: 10px 0; 
                        border-bottom: 1px solid rgba(0,0,0,0.05); 
                    }
                    
                    .detail-row:last-child { 
                        border-bottom: none; 
                        margin-bottom: 0; 
                    }
                    
                    .detail-label { 
                        color: #7f8c8d; 
                        font-weight: 500; 
                        font-size: 14px; 
                        display: block; 
                        margin-bottom: 5px; 
                    }
                    
                    .detail-value { 
                        color: #2c3e50; 
                        font-weight: 600; 
                        font-size: 14px; 
                        display: block; 
                    }
                    
                    .amount-value { 
                        color: #2c3e50; 
                        font-weight: 700; 
                        font-size: 18px; 
                    }
                    
                    .payment-id { 
                        color: #667eea; 
                        font-family: 'Courier New', monospace; 
                        font-size: 12px; 
                        background-color: rgba(102, 126, 234, 0.1); 
                        padding: 4px 8px; 
                        border-radius: 4px; 
                        word-break: break-all; 
                    }
                    
                    .reason-value { 
                        color: #FF6B6B; 
                        font-weight: 500; 
                    }
                    
                    /* Processing info */
                    .processing-info { 
                        background-color: #f0f9ff; 
                        margin: 0 20px 20px; 
                        border-radius: 8px; 
                        padding: 25px; 
                        border: 1px solid #e0f2fe; 
                        border-left: 4px solid #0ea5e9; 
                    }
                    
                    .processing-info h4 { 
                        color: #0c4a6e; 
                        font-size: 18px; 
                        font-weight: 600; 
                        margin-bottom: 12px; 
                    }
                    
                    .processing-info p { 
                        color: #0369a1; 
                        font-size: 14px; 
                        line-height: 1.5; 
                    }
                    
                    /* Support section */
                    .support-section { 
                        text-align: center; 
                        padding: 25px; 
                        background-color: #f8f9fa; 
                        margin: 0 20px 20px; 
                        border-radius: 8px; 
                    }
                    
                    .support-section p { 
                        color: #2c3e50; 
                        font-size: 16px; 
                        line-height: 1.6; 
                        margin-bottom: 15px; 
                    }
                    
                    /* CTA section */
                    .cta-section { 
                        text-align: center; 
                        padding: 20px; 
                        background-color: #ffffff; 
                    }
                    
                    .cta-button { 
                        display: inline-block; 
                        background-color: #FF6B6B; 
                        color: #ffffff !important; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: 600; 
                        font-size: 16px; 
                        line-height: 1.4; 
                        text-align: center; 
                        min-width: 200px; 
                    }
                    
                    /* Footer */
                    .footer { 
                        background-color: #f8f9fa; 
                        padding: 25px 20px; 
                        text-align: center; 
                        border-top: 1px solid #e9ecef; 
                    }
                    
                    .footer h4 { 
                        color: #2c3e50; 
                        font-size: 16px; 
                        margin-bottom: 15px; 
                    }
                    
                    .footer p { 
                        color: #7f8c8d; 
                        font-size: 14px; 
                        margin-bottom: 8px; 
                        line-height: 1.4; 
                    }
                    
                    .footer .contact { 
                        color: #667eea; 
                        font-weight: 500; 
                    }
                    
                    .footer .copyright { 
                        color: #95a5a6; 
                        font-size: 12px; 
                        margin-top: 20px; 
                        padding-top: 20px; 
                        border-top: 1px solid #e9ecef; 
                    }
                    
                    /* Mobile responsive */
                    @media only screen and (max-width: 600px) {
                        .container { 
                            margin: 10px; 
                            border-radius: 6px; 
                        }
                        
                        .header { 
                            padding: 25px 15px; 
                        }
                        
                        .header h1 { 
                            font-size: 24px; 
                        }
                        
                        .refund-section { 
                            padding: 25px 15px 15px; 
                        }
                        
                        .refund-icon { 
                            width: 70px; 
                            height: 70px; 
                            line-height: 70px; 
                        }
                        
                        .refund-icon span { 
                            font-size: 35px; 
                        }
                        
                        .refund-title { 
                            font-size: 20px; 
                        }
                        
                        .refund-details { 
                            margin: 0 15px 15px; 
                            padding: 20px; 
                        }
                        
                        .processing-info { 
                            margin: 0 15px 15px; 
                            padding: 20px; 
                        }
                        
                        .support-section { 
                            margin: 0 15px 15px; 
                            padding: 20px; 
                        }
                        
                        .cta-section { 
                            padding: 15px; 
                        }
                        
                        .cta-button { 
                            padding: 12px 25px; 
                            font-size: 15px; 
                            min-width: 180px; 
                        }
                        
                        .footer { 
                            padding: 20px 15px; 
                        }
                    }
                    
                    /* Outlook specific styles */
                    .ExternalClass { width: 100%%; }
                    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%%; }
                    
                    /* Gmail specific */
                    u + .body .gmail { color: inherit; }
                    span.gmail { color: inherit; }
                    a.gmail { color: inherit; }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td class="header" style="background-color: #667eea; padding: 30px 20px; text-align: center;">
                                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; line-height: 1.2;">Tabib.life</h1>
                                        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Your Health, Our Priority</p>
                                    </td>
                                </tr>
                                
                                <!-- Refund Section -->
                                <tr>
                                    <td class="refund-section" style="text-align: center; padding: 30px 20px 20px; background-color: #ffffff;">
                                        <div class="refund-icon" style="width: 80px; height: 80px; background-color: #FF6B6B; border-radius: 50%%; margin: 0 auto 20px; display: inline-block; line-height: 80px; text-align: center;">
                                            <span style="color: #ffffff; font-size: 40px; font-weight: bold;">💰</span>
                                        </div>
                                        <h2 class="refund-title" style="color: #2c3e50; font-size: 24px; font-weight: 700; margin-bottom: 10px; line-height: 1.3;">Refund Processed!</h2>
                                        <p class="refund-subtitle" style="color: #7f8c8d; font-size: 16px; margin-bottom: 25px; line-height: 1.4;">Your refund has been successfully processed</p>
                                    </td>
                                </tr>
                                
                                <!-- Refund Details -->
                                <tr>
                                    <td class="refund-details" style="background-color: #fff5f5; margin: 0 20px 20px; border-radius: 8px; padding: 25px; border: 1px solid #fed7d7; border-left: 4px solid #FF6B6B;">
                                        <h3 style="color: #2c3e50; font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 2px solid #FF6B6B; padding-bottom: 10px;">Refund Details</h3>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Refund Amount</span>
                                            <span class="detail-value amount-value" style="color: #2c3e50; font-weight: 700; font-size: 18px; display: block;">%.2f %s</span>
                                        </div>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Original Payment ID</span>
                                            <span class="detail-value payment-id" style="color: #667eea; font-family: 'Courier New', monospace; font-size: 12px; background-color: rgba(102, 126, 234, 0.1); padding: 4px 8px; border-radius: 4px; word-break: break-all; display: block;">%s</span>
                                        </div>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Payment Method</span>
                                            <span class="detail-value" style="color: #2c3e50; font-weight: 600; font-size: 14px; display: block;">%s</span>
                                        </div>
                                        
                                        <div class="detail-row" style="display: block; margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                            <span class="detail-label" style="color: #7f8c8d; font-weight: 500; font-size: 14px; display: block; margin-bottom: 5px;">Refund Reason</span>
                                            <span class="detail-value reason-value" style="color: #FF6B6B; font-weight: 500; font-size: 14px; display: block;">%s</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Processing Info -->
                                <tr>
                                    <td class="processing-info" style="background-color: #f0f9ff; margin: 0 20px 20px; border-radius: 8px; padding: 25px; border: 1px solid #e0f2fe; border-left: 4px solid #0ea5e9;">
                                        <h4 style="color: #0c4a6e; font-size: 18px; font-weight: 600; margin-bottom: 12px;">⏱️ Processing Time</h4>
                                        <p style="color: #0369a1; font-size: 14px; line-height: 1.5;">The refund will be credited to your original payment method within <strong>3-5 business days</strong>. You will receive a notification once the refund is completed.</p>
                                    </td>
                                </tr>
                                
                                <!-- Support Section -->
                                <tr>
                                    <td class="support-section" style="text-align: center; padding: 25px; background-color: #f8f9fa; margin: 0 20px 20px; border-radius: 8px;">
                                        <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">If you have any questions about this refund, please don't hesitate to contact our support team.</p>
                                        <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">We're here to help you with any concerns and ensure your experience with Tabib.life remains positive.</p>
                                    </td>
                                </tr>
                                
                                <!-- CTA Section -->
                                <tr>
                                    <td class="cta-section" style="text-align: center; padding: 20px; background-color: #ffffff;">
                                        <a href="mailto:support@tabib.life" class="cta-button" style="display: inline-block; background-color: #FF6B6B; color: #ffffff !important; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; line-height: 1.4; text-align: center; min-width: 200px;">Contact Support</a>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td class="footer" style="background-color: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #e9ecef;">
                                        <h4 style="color: #2c3e50; font-size: 16px; margin-bottom: 15px;">Need Help?</h4>
                                        <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 8px; line-height: 1.4;">Our support team is here to assist you</p>
                                        <p class="contact" style="color: #667eea; font-weight: 500; font-size: 14px; margin-bottom: 8px;">support@tabib.life</p>
                                        <div class="copyright" style="color: #95a5a6; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                            © 2024 Tabib.life. All rights reserved.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """,
            refundAmount,
            payment.getCurrency() != null ? payment.getCurrency() : "MAD",
            payment.getPaymentId() != null ? payment.getPaymentId() : "N/A",
            payment.getPaymentMethod() != null ? payment.getPaymentMethod().getDisplayName() : "Unknown",
            payment.getRefundReason() != null ? payment.getRefundReason() : "Not specified"
        );
    }
}
