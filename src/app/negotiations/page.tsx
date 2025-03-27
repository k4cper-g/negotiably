"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOffers, getMarketplaces, getNegotiations } from "@/services/marketplaceService";
import { Offer, Marketplace, Negotiation } from "@/types/marketplace";
import { NegotiationStatus } from "@/components/ui/Status";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function NegotiationsPage() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [offers, setOffers] = useState<Record<string, Offer>>({});
  const [marketplaces, setMarketplaces] = useState<Record<string, Marketplace>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'concluded'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all negotiations
        const negotiationsData = await getNegotiations();
        setNegotiations(negotiationsData);
        
        // Fetch all offers
        const offerIds = negotiationsData.map(n => n.offerId);
        const offersData = await getAllOffers();
        
        // Create offers map
        const offersMap: Record<string, Offer> = {};
        for (const offer of offersData) {
          if (offerIds.includes(offer.id)) {
            offersMap[offer.id] = offer;
          }
        }
        setOffers(offersMap);
        
        // Fetch all marketplaces
        const marketplacesData = await getMarketplaces();
        const marketplacesMap: Record<string, Marketplace> = {};
        marketplacesData.forEach(mp => {
          marketplacesMap[mp.id] = mp;
        });
        setMarketplaces(marketplacesMap);
      } catch (error) {
        console.error("Error fetching negotiations data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getFilteredNegotiations = () => {
    switch (activeTab) {
      case 'active':
        return negotiations.filter(n => n.status === 'active');
      case 'concluded':
        return negotiations.filter(n => n.status !== 'active');
      default:
        return negotiations;
    }
  };

  const filteredNegotiations = getFilteredNegotiations();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Negotiations</h1>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'active', 'concluded'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'active' && (
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs bg-blue-100 text-blue-800">
                  {negotiations.filter(n => n.status === 'active').length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <p className="mt-2 text-gray-500">Loading negotiations...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredNegotiations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredNegotiations.map((negotiation) => {
                const offer = offers[negotiation.offerId];
                if (!offer) return null;
                
                const marketplace = marketplaces[offer.marketplaceId];
                if (!marketplace) return null;
                
                return (
                  <li key={negotiation.id}>
                    <Link
                      href={`/negotiations/${negotiation.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 relative mr-3">
                              <Image
                                src={marketplace.logo || "/images/logos/placeholder.svg"}
                                alt={marketplace.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {offer.title}
                              </p>
                              <p className="mt-1 text-xs text-gray-500 truncate">
                                {marketplace.name} • {negotiation.offerType.charAt(0).toUpperCase() + negotiation.offerType.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <NegotiationStatus status={negotiation.status} />
                          </div>
                        </div>
                        <div className="mt-4 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="mr-6">
                              <p className="text-xs text-gray-500">Initial Rate</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatCurrency(negotiation.initialRate)}
                              </p>
                            </div>
                            <div className="mt-3 sm:mt-0">
                              <p className="text-xs text-gray-500">Current Rate</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatCurrency(negotiation.currentRate)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-0">
                            <p className="text-xs text-gray-500">
                              {negotiation.status === 'active' ? 'Started' : 'Last Updated'}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatDateTime(
                                negotiation.status === 'active'
                                  ? negotiation.startedAt
                                  : negotiation.updatedAt
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No negotiations found</p>
              <p className="mt-2 text-sm text-gray-400">
                {activeTab === 'all'
                  ? 'Start a negotiation from the marketplace to see it here'
                  : activeTab === 'active'
                  ? 'No active negotiations at the moment'
                  : 'No concluded negotiations yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 