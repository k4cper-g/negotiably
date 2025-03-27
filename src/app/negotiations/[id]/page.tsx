"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  getNegotiationById,
  getOfferById,
  getMarketplaces,
} from "@/services/marketplaceService";
import { Offer, Marketplace, Negotiation } from "@/types/marketplace";
import OfferDetails from "@/components/marketplace/OfferDetails";
import NegotiationChat from "@/components/negotiation/NegotiationChat";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function NegotiationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const negotiationId = params.id as string;
  
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch negotiation
        const negotiationData = await getNegotiationById(negotiationId);
        if (!negotiationData) {
          router.push("/negotiations");
          return;
        }
        setNegotiation(negotiationData);
        
        // Fetch offer
        const offerData = await getOfferById(negotiationData.offerId);
        if (offerData) {
          setOffer(offerData);
          
          // Fetch marketplace
          const marketplacesData = await getMarketplaces();
          const matchingMarketplace = marketplacesData.find(
            (mp) => mp.id === offerData.marketplaceId
          );
          if (matchingMarketplace) {
            setMarketplace(matchingMarketplace);
          }
        }
      } catch (error) {
        console.error("Error fetching negotiation details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [negotiationId, router]);
  
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
  
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/negotiations"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Negotiations
        </Link>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <p className="mt-2 text-gray-500">Loading negotiation details...</p>
        </div>
      ) : (
        <>
          {negotiation && offer && marketplace && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <OfferDetails
                  offer={offer}
                  marketplace={marketplace}
                />
              </div>
              
              <div className="h-full">
                <NegotiationChat
                  negotiation={negotiation}
                  offer={offer}
                  onNegotiationUpdated={handleNegotiationUpdated}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 