import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const FLUTTERWAVE_SECRET_KEY = Deno.env.get('FLUTTERWAVE_SECRET_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
    action: 'initialize' | 'verify';
    provider: 'paystack' | 'flutterwave';
    data: any;
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, provider, data }: PaymentRequest = await req.json()

        if (action === 'initialize') {
            if (provider === 'paystack') {
                const res = await fetch('https://api.paystack.co/transaction/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                    body: JSON.stringify(data),
                })
                const result = await res.json()
                return new Response(JSON.stringify(result), {
                    status: res.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            } else if (provider === 'flutterwave') {
                const res = await fetch('https://api.flutterwave.com/v3/payments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                    },
                    body: JSON.stringify(data),
                })
                const result = await res.json()
                return new Response(JSON.stringify(result), {
                    status: res.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }
        }

        if (action === 'verify') {
            if (provider === 'paystack') {
                const { reference } = data
                const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                    headers: {
                        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                })
                const result = await res.json()
                return new Response(JSON.stringify(result), {
                    status: res.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            } else if (provider === 'flutterwave') {
                const { transactionId } = data
                const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
                    headers: {
                        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                    },
                })
                const result = await res.json()
                return new Response(JSON.stringify(result), {
                    status: res.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }
        }

        throw new Error(`Invalid action or provider: ${action}/${provider}`)

    } catch (error) {
        console.error('Error:', error)
        return new Response(JSON.stringify({ status: false, message: error instanceof Error ? error.message : 'Internal server error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
