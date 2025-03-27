"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  createNegotiation,
  getOfferById,
  getMarketplaces,
  getNegotiationByOfferId,
} from "@/services/marketplaceService";
import { Offer, Marketplace, Negotiation } from "@/types/marketplace";
import OfferDetails from "@/components/marketplace/OfferDetails";
import NegotiationChat from "@/components/negotiation/NegotiationChat";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function OfferPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingNegotiation, setIsStartingNegotiation] = useState(false);
  const [escrowTransactionId, setEscrowTransactionId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch offer details
        const offerData = await getOfferById(offerId);
        if (!offerData) {
          router.push("/marketplace");
          return;
        }
        setOffer(offerData);
        
        // Fetch marketplace
        const marketplacesData = await getMarketplaces();
        const matchingMarketplace = marketplacesData.find(
          (mp) => mp.id === offerData.marketplaceId
        );
        if (matchingMarketplace) {
          setMarketplace(matchingMarketplace);
        }
        
        // Check if there's an existing negotiation
        const negotiationData = await getNegotiationByOfferId(offerId);
        if (negotiationData) {
          setNegotiation(negotiationData);
        }
      } catch (error) {
        console.error("Error fetching offer details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [offerId, router]);
  
  const handleStartNegotiation = async (targetRate: number, maxRate: number, isAIEnabled: boolean) => {
    if (isStartingNegotiation || !offer) return;
    
    setIsStartingNegotiation(true);
    
    try {
      const newNegotiation = await createNegotiation(
        offerId, 
        offer.type, 
        targetRate, 
        maxRate, 
        isAIEnabled
      );
      setNegotiation(newNegotiation);
      setOffer({
        ...offer,
        status: "negotiating",
      });
    } catch (error) {
      console.error("Error starting negotiation:", error);
      alert("Failed to start negotiation. Please try again.");
    } finally {
      setIsStartingNegotiation(false);
    }
  };
  
  const handleNegotiationUpdated = (updatedNegotiation: Negotiation) => {
    setNegotiation(updatedNegotiation);
    
    // Update offer status if negotiation is concluded
    if (updatedNegotiation.status !== "active" && offer) {
      const newStatus =
        updatedNegotiation.status === "accepted"
          ? "booked"
          : "available";
      
      setOffer({
        ...offer,
        status: newStatus,
        price: updatedNegotiation.status === "accepted"
          ? updatedNegotiation.currentRate
          : offer.price,
      });
    }
  };
  
  const handlePaymentComplete = (transactionId: string) => {
    if (!offer) return;
    
    setEscrowTransactionId(transactionId);
    
    // Update offer status to booked
    setOffer({
      ...offer,
      status: "booked",
      transactionId: transactionId
    });
    
    // In a real app, you would call an API to update the status in the backend
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <p className="mt-2 text-gray-500">Loading offer details...</p>
        </div>
      ) : (
        <>
          {offer && marketplace && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <OfferDetails
                  offer={offer}
                  marketplace={marketplace}
                  onStartNegotiation={
                    !negotiation && offer.status === 'available' ? handleStartNegotiation : undefined
                  }
                  onPaymentComplete={handlePaymentComplete}
                />
                
                {/* Show transaction confirmation if there's an escrow transaction */}
                {escrowTransactionId && offer.status === 'booked' && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Payment Successful</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Your payment for this offer has been placed in escrow.</p>
                          <p className="mt-1">Transaction ID: {escrowTransactionId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                {negotiation ? (
                  <NegotiationChat
                    negotiation={negotiation}
                    offer={offer}
                    onNegotiationUpdated={handleNegotiationUpdated}
                  />
                ) : (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Negotiation
                    </h2>
                    {offer.status === "available" ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          No active negotiation for this offer.
                        </p>
                        <p className="text-sm text-gray-400">
                          Use the form on the left to start a negotiation.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          This offer is not available for negotiation.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 