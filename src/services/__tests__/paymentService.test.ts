import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializePayment, verifyPayment, loadFlutterwaveScript, type PaymentResponse, type PaymentProvider } from '../paymentService';

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
vi.stubEnv('VITE_PAYSTACK_PUBLIC_KEY', 'test_paystack_key');
vi.stubEnv('VITE_FLUTTERWAVE_PUBLIC_KEY', 'test_flutterwave_key');
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5173');

describe('Payment Service', () => {
  const mockPaymentData = {
    courseId: 'course-123',
    userId: 'user-123',
    email: 'test@example.com',
    fullName: 'Test User',
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('Paystack Integration', () => {
    it('should initialize Paystack payment successfully', async () => {
      const mockResponse = {
        status: true,
        message: 'Authorization URL created',
        data: {
          authorization_url: 'https://checkout.paystack.com/test',
          reference: 'test-ref-123',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await initializePayment(
        'paystack',
        10000,
        'test@example.com',
        mockPaymentData
      );

      expect(result.success).toBe(true);
      expect(result.paymentLink).toBe(mockResponse.data.authorization_url);
      expect(result.reference).toBe(mockResponse.data.reference);
    });

    it('should verify Paystack payment successfully', async () => {
      const mockVerification = {
        status: true,
        data: {
          status: 'success',
          reference: 'test-ref-123',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVerification,
      });

      const result = await verifyPayment('test-ref-123', 'paystack');
      expect(result).toBe(true);
    });
  });

  describe('Flutterwave Integration', () => {
    beforeEach(() => {
      // Mock Flutterwave script loading
      document.head.innerHTML = '';
      // @ts-ignore - Mocking global FlutterwaveCheckout
      global.window.FlutterwaveCheckout = vi.fn();
    });

    it('should load Flutterwave script', async () => {
      await loadFlutterwaveScript();
      
      const script = document.head.querySelector('script#flutterwave-script') as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(script.src).toBe('https://checkout.flutterwave.com/v3.js');
    });

    it('should initialize Flutterwave payment', async () => {
      const mockFlutterwave = {
        close: vi.fn(),
      };
      
      // @ts-ignore
      window.FlutterwaveCheckout.mockImplementation((options) => {
        // Simulate successful payment
        options.callback({
          status: 'successful',
          transaction_id: 'flw-ref-123',
        });
        return mockFlutterwave;
      });

      const result = await initializePayment(
        'flutterwave',
        10000,
        'test@example.com',
        mockPaymentData
      );

      expect(result.success).toBe(true);
      expect(result.reference).toBe('flw-ref-123');
    });
  });

  describe('Error Handling', () => {
    it('should handle payment initialization failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await initializePayment(
        'paystack',
        10000,
        'test@example.com',
        mockPaymentData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid payment provider', async () => {
      // Using type assertion to test invalid provider case
      const invalidProvider = 'invalid-provider' as PaymentProvider;
      const result = await initializePayment(
        invalidProvider,
        10000,
        'test@example.com',
        mockPaymentData
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unsupported payment provider');
    });
  });
});
