"use client";

import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Negotiation, Offer } from "@/types/marketplace";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { NegotiationStatus } from "@/components/ui/Status";
import { addCounterOffer, concludeNegotiation, getAISuggestedRate } from "@/services/marketplaceService";
import Link from "next/link";

interface NegotiationChatProps {
  negotiation: Negotiation;
  offer: Offer;
  onNegotiationUpdated: (negotiation: Negotiation) => void;
}

export default function NegotiationChat({
  negotiation,
  offer,
  onNegotiationUpdated,
}: NegotiationChatProps) {
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(negotiation.isAIEnabled);
  const [aiSettings, setAiSettings] = useState({
    targetRate: negotiation.targetRate,
    maxRate: negotiation.maxRate
  });
  const [isLoadingAiSuggestion, setIsLoadingAiSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedRate: number;
    confidence: "high" | "medium" | "low";
    reasoning: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [negotiation.counterOffers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message || !rate || isSubmitting) return;
    
    const numericRate = parseInt(rate.replace(/\D/g, ""), 10);
    if (isNaN(numericRate) || numericRate <= 0) {
      alert("Please enter a valid rate");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedNegotiation = await addCounterOffer(
        negotiation.id,
        numericRate,
        message,
        false
      );
      
      onNegotiationUpdated(updatedNegotiation);
      setMessage("");
      setRate("");
      
      // If AI is enabled, it will automatically respond
      if (isAIEnabled) {
        setTimeout(async () => {
          const aiResponse = await getAISuggestedRate(offer.id);
          const aiResponseRate = Math.min(
            Math.max(aiResponse.suggestedRate, aiSettings.targetRate),
            aiSettings.maxRate
          );
          
          const negotiationWithAiResponse = await addCounterOffer(
            negotiation.id,
            aiResponseRate,
            aiResponse.reasoning,
            true
          );
          
          onNegotiationUpdated(negotiationWithAiResponse);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting counter offer:", error);
      alert("Failed to submit your offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAIControl = async () => {
    setIsAIEnabled(!isAIEnabled);
    // You could add an API call here to update the negotiation settings
  };

  const handleAcceptOffer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const updatedNegotiation = await concludeNegotiation(
        negotiation.id,
        "accepted"
      );
      onNegotiationUpdated(updatedNegotiation);
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Failed to accept the offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectOffer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const updatedNegotiation = await concludeNegotiation(
        negotiation.id,
        "rejected"
      );
      onNegotiationUpdated(updatedNegotiation);
    } catch (error) {
      console.error("Error rejecting offer:", error);
      alert("Failed to reject the offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAiSuggestion = async () => {
    setIsLoadingAiSuggestion(true);
    
    try {
      const suggestion = await getAISuggestedRate(offer.id);
      setAiSuggestion(suggestion);
      // Pre-fill the rate input with the suggested rate
      setRate(suggestion.suggestedRate.toString());
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      alert("Failed to get AI suggestion. Please try again.");
    } finally {
      setIsLoadingAiSuggestion(false);
    }
  };

  const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Negotiation: {offer.title}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-500 space-x-2">
            <span>ID: {negotiation.id.substring(0, 8)}</span>
            <span>•</span>
            <span>Started: {formatDateTime(negotiation.startedAt)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-3 flex items-center">
            <input
              id="ai-toggle"
              type="checkbox"
              checked={isAIEnabled}
              onChange={toggleAIControl}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="ai-toggle" className="ml-2 text-sm text-gray-700">
              AI Assistance
            </label>
          </div>
          <NegotiationStatus status={negotiation.status} />
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Initial price info card */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Initial Listing Price</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(negotiation.initialRate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Offer</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(negotiation.currentRate)}</p>
              </div>
            </div>
          </div>
          
          {/* Each message as an email-like thread item */}
          {negotiation.counterOffers.map((counterOffer, index) => (
            <div 
              key={counterOffer.id}
              className={`rounded-lg border ${
                counterOffer.fromAI 
                  ? 'border-gray-200 bg-white' 
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    counterOffer.fromAI ? 'bg-gray-200' : 'bg-blue-200'
                  }`}>
                    <span className="text-sm font-medium">
                      {counterOffer.fromAI ? 'MP' : 'You'}
                    </span>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">
                      {counterOffer.fromAI ? `${offer.contactInfo.name} (Marketplace)` : 'You'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(counterOffer.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    index === 0 ? 'bg-blue-100 text-blue-800' : 
                    index === negotiation.counterOffers.length - 1 ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {index === 0 ? 'Initial' : 
                     index === negotiation.counterOffers.length - 1 ? 'Latest' : 
                     `Offer #${index + 1}`}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Offered Price:</span>
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    {formatCurrency(counterOffer.rate)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {counterOffer.message}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* AI Settings Summary */}
      {isAIEnabled && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Target Rate:</span>
              <span className="ml-2 font-medium">{formatCurrency(aiSettings.targetRate)}</span>
            </div>
            <div>
              <span className="text-gray-500">Max Rate:</span>
              <span className="ml-2 font-medium">{formatCurrency(aiSettings.maxRate)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      {negotiation.status === "active" && (
        <div className="p-4 border-t border-gray-200">
          {aiSuggestion && (
            <div className="mb-4 rounded-md bg-blue-50 p-3 border border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium">AI Suggestion:</span>
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full ${getConfidenceColor(
                    aiSuggestion.confidence
                  )}`}
                >
                  {aiSuggestion.confidence.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{aiSuggestion.reasoning}</p>
              <p className="text-base font-bold mt-1">
                {formatCurrency(aiSuggestion.suggestedRate)}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="rate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Counter Offer
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="0"
                  required
                />
                {!isLoadingAiSuggestion ? (
                  <button
                    type="button"
                    onClick={fetchAiSuggestion}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    title="Get AI Suggestion"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent" />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Explain your reasoning for this price..."
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="submit"
                className="col-span-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Offer
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleAcceptOffer}
                className="col-span-1 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Accept Price
              </button>
              <button
                type="button"
                onClick={handleRejectOffer}
                className="col-span-1 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Decline
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Concluded Negotiation */}
      {negotiation.status !== "active" && (
        <div className="p-6 border-t border-gray-200">
          <div className={`p-4 mb-4 rounded-lg ${
            negotiation.status === "accepted" ? "bg-green-50 border border-green-200" :
            negotiation.status === "rejected" ? "bg-red-50 border border-red-200" :
            "bg-yellow-50 border border-yellow-200"
          }`}>
            {negotiation.status === "accepted" ? (
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-green-700">
                  Offer Accepted
                </p>
                <p className="font-bold text-2xl text-green-800">
                  {formatCurrency(negotiation.currentRate)}
                </p>
                <p className="text-sm text-green-700">
                  You saved{" "}
                  {formatCurrency(negotiation.initialRate - negotiation.currentRate)}{" "}
                  ({Math.round(
                    ((negotiation.initialRate - negotiation.currentRate) /
                      negotiation.initialRate) *
                      100
                  )}
                  % off the initial price)
                </p>
              </div>
            ) : negotiation.status === "rejected" ? (
              <div className="text-center">
                <p className="text-lg font-medium text-red-700">
                  Offer Rejected
                </p>
                <p className="text-sm text-red-600 mt-1">
                  The negotiation was unsuccessful. The offer may still be available.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium text-yellow-700">
                  Negotiation Expired
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  The negotiation time limit has been reached.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse More Offers
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 