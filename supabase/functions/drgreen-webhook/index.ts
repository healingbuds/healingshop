import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

// Verify webhook signature from Dr Green API
async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex === signature || btoa(String.fromCharCode(...new Uint8Array(hashBuffer))) === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

interface WebhookPayload {
  event: string;
  orderId: string;
  status?: string;
  paymentStatus?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

// Email template for order status updates
function getOrderStatusEmail(orderId: string, status: string, event: string): { subject: string; html: string } {
  const statusMessages: Record<string, { subject: string; body: string; color: string }> = {
    'order.shipped': {
      subject: '🚚 Your order has been shipped!',
      body: 'Great news! Your order has been shipped and is on its way to you.',
      color: '#3b82f6',
    },
    'order.delivered': {
      subject: '✅ Your order has been delivered!',
      body: 'Your order has been successfully delivered. We hope you enjoy your products!',
      color: '#22c55e',
    },
    'order.cancelled': {
      subject: '❌ Your order has been cancelled',
      body: 'Your order has been cancelled. If you have any questions, please contact our support team.',
      color: '#ef4444',
    },
    'payment.completed': {
      subject: '💳 Payment confirmed for your order',
      body: 'Your payment has been successfully processed. Your order is now being prepared.',
      color: '#22c55e',
    },
    'payment.failed': {
      subject: '⚠️ Payment failed for your order',
      body: 'Unfortunately, your payment could not be processed. Please try again or contact support.',
      color: '#ef4444',
    },
    'order.status_updated': {
      subject: `📦 Order status update: ${status}`,
      body: `Your order status has been updated to: ${status}`,
      color: '#8b5cf6',
    },
  };

  const template = statusMessages[event] || statusMessages['order.status_updated'];

  return {
    subject: template.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${template.color}; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Update</h1>
          </div>
          <div style="padding: 32px;">
            <p style="color: #18181b; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
              ${template.body}
            </p>
            <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #71717a; font-size: 14px;">Order ID</p>
              <p style="margin: 4px 0 0 0; color: #18181b; font-size: 18px; font-family: monospace; font-weight: 600;">
                ${orderId}
              </p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://healingbuds.co.uk/orders" style="display: inline-block; background-color: ${template.color}; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
                View Order Details
              </a>
            </div>
          </div>
          <div style="background-color: #f4f4f5; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #71717a; font-size: 12px;">
              Healing Buds Medical Cannabis
            </p>
            <p style="margin: 8px 0 0 0; color: #a1a1aa; font-size: 11px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

// Send email using Resend API via fetch
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Healing Buds <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const rawPayload = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const privateKey = Deno.env.get("DRGREEN_PRIVATE_KEY");

    if (privateKey && signature) {
      const isValid = await verifyWebhookSignature(rawPayload, signature, privateKey);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const payload: WebhookPayload = JSON.parse(rawPayload);
    console.log('Received webhook:', payload);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user email for the order
    let userEmail: string | null = null;
    const { data: orderData } = await supabase
      .from('drgreen_orders')
      .select('user_id')
      .eq('drgreen_order_id', payload.orderId)
      .single();

    if (orderData?.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(orderData.user_id);
      userEmail = userData?.user?.email || null;
    }

    // Handle webhook events
    const updates: Record<string, string> = {};
    let shouldSendEmail = false;

    switch (payload.event) {
      case 'order.status_updated':
      case 'order.updated': {
        if (payload.status) updates.status = payload.status;
        if (payload.paymentStatus) updates.payment_status = payload.paymentStatus;
        shouldSendEmail = true;
        break;
      }
      case 'order.shipped': {
        updates.status = 'SHIPPED';
        shouldSendEmail = true;
        break;
      }
      case 'order.delivered': {
        updates.status = 'DELIVERED';
        shouldSendEmail = true;
        break;
      }
      case 'order.cancelled': {
        updates.status = 'CANCELLED';
        shouldSendEmail = true;
        break;
      }
      case 'payment.completed': {
        updates.payment_status = 'PAID';
        shouldSendEmail = true;
        break;
      }
      case 'payment.failed': {
        updates.payment_status = 'FAILED';
        shouldSendEmail = true;
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${payload.event}`);
    }

    // Update order in database
    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('drgreen_orders')
        .update(updates)
        .eq('drgreen_order_id', payload.orderId);

      if (error) {
        console.error('Error updating order:', error);
      } else {
        console.log(`Order ${payload.orderId} updated:`, updates);
      }
    }

    // Send email notification
    let emailSent = false;
    if (shouldSendEmail && userEmail) {
      const emailContent = getOrderStatusEmail(
        payload.orderId,
        payload.status || updates.status || 'Updated',
        payload.event
      );
      emailSent = await sendEmail(userEmail, emailContent.subject, emailContent.html);
      if (emailSent) {
        console.log(`Email sent to ${userEmail} for order ${payload.orderId}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, event: payload.event, emailSent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
