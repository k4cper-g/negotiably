"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Marketplace, Offer, OfferType } from "@/types/marketplace";
import { getAllOffers, getMarketplaces, getOffersByType, createNegotiation } from "@/services/marketplaceService";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import OfferCard from "@/components/marketplace/OfferCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Tab } from '@headlessui/react';
import { TruckIcon, HomeModernIcon, BuildingStorefrontIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

const offerTypeLabels: Record<OfferType, { name: string, icon: any }> = {
  'cargo': { name: 'Cargo', icon: CubeTransparentIcon },
  'vehicle': { name: 'Vehicles', icon: TruckIcon },
  'warehouse': { name: 'Warehouses', icon: BuildingStorefrontIcon },
  'service': { name: 'Services', icon: HomeModernIcon }
};

const offerTypes: OfferType[] = ['cargo', 'vehicle', 'warehouse', 'service'];

export default function MarketplacePage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<OfferType[]>(['cargo']);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingNegotiation, setIsStartingNegotiation] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch marketplaces
        const fetchedMarketplaces = await getMarketplaces();
        setMarketplaces(fetchedMarketplaces);
        
        // Default to selecting all marketplaces
        setSelectedMarketplaces(fetchedMarketplaces.map(m => m.id));
        
        // Fetch initial offers (cargo by default)
        const fetchedOffers = await getOffersByType('cargo');
        setOffers(fetchedOffers);
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        
        let fetchedOffers;
        if (selectedTypes.length === 1) {
          fetchedOffers = await getOffersByType(selectedTypes[0]);
        } else {
          fetchedOffers = await getAllOffers();
          if (selectedTypes.length > 0 && selectedTypes.length < offerTypes.length) {
            fetchedOffers = fetchedOffers.filter(offer => selectedTypes.includes(offer.type));
          }
        }
        
        // Filter by selected marketplaces
        if (selectedMarketplaces.length > 0 && selectedMarketplaces.length < marketplaces.length) {
          fetchedOffers = fetchedOffers.filter(offer => 
            selectedMarketplaces.includes(offer.marketplaceId)
          );
        }
        
        setOffers(fetchedOffers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffers();
  }, [selectedMarketplaces, selectedTypes]);

  const handleMarketplaceFilterChange = (marketplaceIds: string[]) => {
    setSelectedMarketplaces(marketplaceIds);
  };

  const handleTypeChange = (type: OfferType) => {
    setSelectedTypes([type]);
  };

  const handleStartNegotiation = async (offerId: string, offerType: OfferType, targetRate: number, maxRate: number, isAIEnabled: boolean) => {
    try {
      setIsStartingNegotiation(true);
      
      // Create a new negotiation
      const negotiation = await createNegotiation(offerId, offerType, targetRate, maxRate, isAIEnabled);
      
      // Navigate to negotiation detail page
      router.push(`/negotiations/${negotiation.id}`);
    } catch (error) {
      console.error("Error starting negotiation:", error);
      alert("Failed to start negotiation. Please try again.");
      setIsStartingNegotiation(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse and negotiate from multiple marketplaces in one place
        </p>
      </div>
      
      <MarketplaceFilters 
        marketplaces={marketplaces}
        selectedMarketplaces={selectedMarketplaces}
        onFilterChange={handleMarketplaceFilterChange}
      />
      
      <div className="mt-8">
        <Tab.Group onChange={(index) => handleTypeChange(offerTypes[index])}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1">
            {offerTypes.map((type) => (
              <Tab
                key={type}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                  ${
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                  }
                  `
                }
              >
                <div className="flex items-center justify-center">
                  {React.createElement(offerTypeLabels[type].icon, { className: "h-5 w-5 mr-2" })}
                  {offerTypeLabels[type].name}
                </div>
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : offers.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              marketplace={marketplaces.find(m => m.id === offer.marketplaceId) || {
                id: '',
                name: 'Unknown',
                description: '',
                logo: '/images/logos/placeholder.svg',
                website: ''
              }}
              onStartNegotiation={(targetRate, maxRate, isAIEnabled) => 
                handleStartNegotiation(offer.id, offer.type, targetRate, maxRate, isAIEnabled)
              }
              isLoading={isStartingNegotiation}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-500">
            No offers found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
} 