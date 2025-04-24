// Payment service for handling payment-related functionality

export interface PaymentMethod {
  id: string
  type: "card" | "wallet" | "cash"
  name: string
  details: string
  isDefault: boolean
}

export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  paymentMethodId?: string
  savePaymentMethod?: boolean
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
}

// Mock saved payment methods
const savedPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "card",
    name: "Visa ending in 4242",
    details: "Expires 12/25",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "wallet",
    name: "Mobile Wallet",
    details: "Connected",
    isDefault: false,
  },
]

// Get saved payment methods
export function getSavedPaymentMethods(): PaymentMethod[] {
  return savedPaymentMethods
}

// Process payment
export async function processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful payment (95% success rate)
      const isSuccessful = Math.random() < 0.95

      if (isSuccessful) {
        resolve({
          success: true,
          transactionId: `tx_${Date.now()}`,
        })
      } else {
        resolve({
          success: false,
          error: "Payment failed. Please try again.",
        })
      }
    }, 1500)
  })
}

// Add payment method
export async function addPaymentMethod(
  type: "card" | "wallet",
  details: { cardNumber?: string; expiryDate?: string; cvv?: string; walletId?: string },
): Promise<PaymentMethod | null> {
  // Simulate adding a payment method
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful addition (90% success rate)
      const isSuccessful = Math.random() < 0.9

      if (isSuccessful) {
        const newMethod: PaymentMethod = {
          id: `pm_${Date.now()}`,
          type,
          name: type === "card" ? `Card ending in ${details.cardNumber?.slice(-4)}` : "Mobile Wallet",
          details: type === "card" ? `Expires ${details.expiryDate}` : "Connected",
          isDefault: false,
        }

        savedPaymentMethods.push(newMethod)
        resolve(newMethod)
      } else {
        resolve(null)
      }
    }, 1000)
  })
}

// Remove payment method
export async function removePaymentMethod(id: string): Promise<boolean> {
  // Simulate removing a payment method
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = savedPaymentMethods.findIndex((method) => method.id === id)
      if (index !== -1) {
        savedPaymentMethods.splice(index, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

// Set default payment method
export async function setDefaultPaymentMethod(id: string): Promise<boolean> {
  // Simulate setting default payment method
  return new Promise((resolve) => {
    setTimeout(() => {
      const method = savedPaymentMethods.find((m) => m.id === id)
      if (method) {
        savedPaymentMethods.forEach((m) => (m.isDefault = false))
        method.isDefault = true
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}
