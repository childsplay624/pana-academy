# Payment Integration Guide

This document outlines the payment integration with Paystack and Flutterwave for PANA Academy.

## Setup

1. **Environment Variables**
   - `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack public key
   - `VITE_FLUTTERWAVE_PUBLIC_KEY`: Your Flutterwave public key
   - `VITE_API_BASE_URL`: Base URL for callbacks (e.g., `http://localhost:5173`)

2. **Database**
   - Run the migration to create the `payments` table:
     ```sql
     -- See: supabase/migrations/20250825000000_create_payments_table.sql
     ```

## Payment Flow

1. **Initialization**
   - User selects a payment provider (Paystack or Flutterwave)
   - System generates a unique reference and initializes payment
   - User is redirected to the payment gateway

2. **Verification**
   - After payment, user is redirected back to `/payment/callback`
   - System verifies the payment with the provider
   - On success, user is enrolled in the course

3. **Components**
   - `PaymentButton`: Handles payment UI and initialization
   - `PaymentHistory`: Displays user's payment history
   - `paymentService`: Core payment logic and API calls

## Testing

1. **Unit Tests**
   ```bash
   npm test
   ```

2. **Test Cards**
   - **Paystack**:
     - Card: 4084 0838 0555 1111
     - CVV: 408
     - Expiry: Any future date
     - PIN: 1111
     - OTP: 12345

   - **Flutterwave**:
     - Card: 5531 8866 5214 2950
     - CVV: 564
     - Expiry: Any future date
     - PIN: 3310
     - OTP: 12345

## Error Handling

- Failed payments are logged and users can retry
- Payment status is tracked in the database
- Users can view payment history in their dashboard

## Security

- Payment verification happens server-side
- Sensitive data is not stored in the frontend
- All API calls use HTTPS

## Extending

To add a new payment provider:

1. Add provider to `PaymentProvider` type
2. Implement initialization and verification functions
3. Update the payment service to handle the new provider
4. Add test cases
