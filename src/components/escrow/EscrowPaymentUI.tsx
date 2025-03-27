import { useState } from "react";
import Image from "next/image";
import { Offer } from "@/types/marketplace";
import { formatCurrency } from "@/utils/formatters";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface EscrowPaymentUIProps {
  offer: Offer;
  onCancel: () => void;
  onPaymentComplete: (transactionId: string) => void;
}

enum PaymentStep {
  METHOD_SELECTION = 0,
  ESCROW_TERMS = 1,
  PAYMENT_DETAILS = 2,
  CONFIRMATION = 3,
  COMPLETION = 4,
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "/images/icons/bank-transfer.svg",
    description: "Direct bank transfer to seller's account (2-3 business days)"
  },
  {
    id: "credit_card",
    name: "Credit/Debit Card",
    icon: "/images/icons/credit-card.svg",
    description: "Pay with Visa, Mastercard, or American Express (instant)"
  },
  {
    id: "wire",
    name: "Wire Transfer",
    icon: "/images/icons/wire-transfer.svg",
    description: "International wire transfer (1-2 business days)"
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: "/images/icons/crypto.svg",
    description: "Pay with BTC, ETH, USDC or other cryptocurrencies (varies)"
  }
];

export default function EscrowPaymentUI({ offer, onCancel, onPaymentComplete }: EscrowPaymentUIProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.METHOD_SELECTION);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };
  
  const handleNextStep = () => {
    if (currentStep === PaymentStep.METHOD_SELECTION && !selectedMethod) {
      setPaymentError("Please select a payment method");
      return;
    }
    
    if (currentStep === PaymentStep.ESCROW_TERMS && !isAgreedToTerms) {
      setPaymentError("You must agree to the escrow terms");
      return;
    }
    
    setPaymentError(null);
    setCurrentStep(prev => (prev + 1) as PaymentStep);
    
    // Simulate payment processing
    if (currentStep === PaymentStep.PAYMENT_DETAILS) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        // Generate a mock transaction ID
        const mockTransactionId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setTransactionId(mockTransactionId);
        setCurrentStep(PaymentStep.COMPLETION);
      }, 3000);
    }
    
    // Notify parent component about payment completion
    if (currentStep === PaymentStep.COMPLETION) {
      onPaymentComplete(transactionId!);
    }
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case PaymentStep.METHOD_SELECTION:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 relative">
                      {/* Replace with actual icons or use appropriate fallbacks */}
                      <div className="bg-gray-200 h-full w-full rounded flex items-center justify-center">
                        <span className="text-xs">{method.name.substring(0, 2)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{method.name}</h4>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case PaymentStep.ESCROW_TERMS:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Escrow Terms</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800">How P2P Escrow Works</h4>
              <ol className="mt-2 text-sm text-yellow-700 list-decimal pl-5 space-y-1">
                <li>When you accept the offer, funds are placed in our secure escrow.</li>
                <li>Seller is notified and begins to prepare the goods/services.</li>
                <li>After delivery is confirmed, funds are released to the seller.</li>
                <li>If there's a dispute, our dispute resolution team will assist.</li>
              </ol>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900">Escrow Fee</h4>
              <p className="mt-1 text-sm text-gray-500">A fee of 2% will be charged for the escrow service, which includes payment processing and dispute resolution if needed.</p>
              
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">Offer price:</span>
                <span className="font-medium">{formatCurrency(offer.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Escrow fee (2%):</span>
                <span className="font-medium">{formatCurrency(offer.price * 0.02)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 mt-2">
                <span>Total amount:</span>
                <span>{formatCurrency(offer.price * 1.02)}</span>
              </div>
            </div>
            
            <div className="flex items-start mt-4">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={isAgreedToTerms}
                onChange={(e) => setIsAgreedToTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 mt-1"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Escrow Terms and Conditions</a> and understand the escrow process
              </label>
            </div>
          </div>
        );
        
      case PaymentStep.PAYMENT_DETAILS:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
            
            {/* Display appropriate payment form based on selected method */}
            {selectedMethod === 'bank_transfer' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-4">
                  Please provide your bank details to proceed with the escrow payment.
                </p>
                
                <form className="space-y-3">
                  <div>
                    <label htmlFor="account-name" className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                    <input
                      type="text"
                      id="account-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">Account Number</label>
                    <input
                      type="text"
                      id="account-number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="routing-number" className="block text-sm font-medium text-gray-700">Routing Number</label>
                    <input
                      type="text"
                      id="routing-number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="XXXXXXXXX"
                    />
                  </div>
                </form>
              </div>
            )}
            
            {selectedMethod === 'credit_card' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-4">
                  Enter your credit card information to proceed with the escrow payment.
                </p>
                
                <form className="space-y-3">
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      id="card-number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        id="expiry-date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="XXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cardholder-name" className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardholder-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </form>
              </div>
            )}
            
            {selectedMethod === 'crypto' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-4">
                  Select a cryptocurrency to deposit into escrow.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="crypto-type" className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
                    <select
                      id="crypto-type"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="btc">Bitcoin (BTC)</option>
                      <option value="eth">Ethereum (ETH)</option>
                      <option value="usdc">USD Coin (USDC)</option>
                      <option value="usdt">Tether (USDT)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deposit Address</label>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        readOnly
                        value="0x3a4e98b5ff2b778c1b3f5edf9e430c3166e4f87b"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
                      />
                      <button type="button" className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Copy
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Send the exact amount shown above to this address. The transaction will be automatically detected.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                    <p className="text-xs text-yellow-800">
                      Important: Send only the cryptocurrency selected above to this address. Sending any other cryptocurrency may result in permanent loss.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {selectedMethod === 'wire' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-4">
                  Please provide your wire transfer details.
                </p>
                
                <form className="space-y-3">
                  <div>
                    <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input
                      type="text"
                      id="bank-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Bank of America"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="swift-code" className="block text-sm font-medium text-gray-700">SWIFT/BIC Code</label>
                    <input
                      type="text"
                      id="swift-code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="BOFAUS3N"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="account-name-wire" className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                    <input
                      type="text"
                      id="account-name-wire"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="iban" className="block text-sm font-medium text-gray-700">IBAN/Account Number</label>
                    <input
                      type="text"
                      id="iban"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="DE89 3704 0044 0532 0130 00"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
        );
        
      case PaymentStep.CONFIRMATION:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Confirm Payment</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800">Payment Summary</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Offer:</span>
                  <span>{offer.title}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Amount:</span>
                  <span>{formatCurrency(offer.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Escrow Fee:</span>
                  <span>{formatCurrency(offer.price * 0.02)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-blue-800 border-t border-blue-200 pt-2 mt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(offer.price * 1.02)}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Payment Method:</span>
                  <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                </div>
              </div>
            </div>
            
            {isProcessing ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Processing your payment...</p>
              </div>
            ) : null}
          </div>
        );
        
      case PaymentStep.COMPLETION:
        return (
          <div className="space-y-4 text-center">
            <div className="h-16 w-16 mx-auto">
              <CheckCircleIcon className="h-full w-full text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Payment Successful!</h3>
            <p className="text-sm text-gray-600">
              Your payment has been placed in escrow and the seller has been notified.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-xs mx-auto">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="text-sm font-medium text-gray-900 break-all">{transactionId}</p>
            </div>
            <p className="text-sm text-gray-600">
              You will be notified when the seller confirms the transaction.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">P2P Escrow Payment</h2>
      
      {/* Progress steps */}
      <div className="flex justify-between">
        {["Payment Method", "Escrow Terms", "Payment Details", "Confirmation", "Complete"].map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                i < currentStep ? 'bg-blue-600 text-white' : 
                i === currentStep ? 'bg-blue-100 text-blue-800 border-2 border-blue-600' : 
                'bg-gray-100 text-gray-400'
              }`}
            >
              {i < currentStep ? (
                <CheckCircleIcon className="h-6 w-6" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className={`text-xs mt-1 ${
              i <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      
      {/* Error message */}
      {paymentError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{paymentError}</p>
          </div>
        </div>
      )}
      
      {/* Step content */}
      <div className="border border-gray-200 rounded-lg p-4">
        {renderCurrentStep()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        {currentStep < PaymentStep.COMPLETION ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {currentStep === PaymentStep.CONFIRMATION ? (isProcessing ? 'Processing...' : 'Confirm Payment') : 
               currentStep === PaymentStep.COMPLETION ? 'Done' : 'Continue'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Offer
          </button>
        )}
      </div>
    </div>
  );
} 