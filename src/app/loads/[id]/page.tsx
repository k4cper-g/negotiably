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

export default function LoadPage() {
  const params = useParams();
  const router = useRouter();
  const loadId = params.id as string;
  
  // Redirect to the offers route
  useEffect(() => {
    router.push(`/offers/${loadId}`);
  }, [loadId, router]);
  
  return (
    <div className="py-12 text-center">
      <div className="flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
      <p className="mt-2 text-gray-500">Redirecting to updated offer page...</p>
    </div>
  );
} 