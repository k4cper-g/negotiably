"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { getAnalyticsData, getOffersByType, getMarketplaces, getNegotiations } from "@/services/marketplaceService";
import { AnalyticsData, Offer, CargoOffer, Marketplace, Negotiation } from "@/types/marketplace";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import OfferCard from "@/components/marketplace/OfferCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [marketplacesMap, setMarketplacesMap] = useState<Record<string, Marketplace>>({});
  const [activeNegotiations, setActiveNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch marketplaces
        const marketplacesData = await getMarketplaces();
        setMarketplaces(marketplacesData);
        
        // Create marketplaces map
        const marketplacesMapData: Record<string, Marketplace> = {};
        marketplacesData.forEach(mp => {
          marketplacesMapData[mp.id] = mp;
        });
        setMarketplacesMap(marketplacesMapData);
        
        // Fetch active cargo offers (most recent 5)
        const offersData = await getOffersByType('cargo');
        setRecentOffers(offersData.filter(offer => offer.status === 'available').slice(0, 5));
        
        // Fetch analytics data
        const analyticsData = await getAnalyticsData();
        setAnalytics(analyticsData);
        
        // Fetch active negotiations
        const negotiationsData = await getNegotiations();
        setActiveNegotiations(negotiationsData.filter(n => n.status === 'active'));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <p className="mt-2 text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Analytics Summary */}
          {analytics && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Market Analytics</h2>
                <Link href="/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  View all analytics
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <AnalyticsSummary data={analytics} />
            </div>
          )}
          
          {/* Recent Offers */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Available Offers</h2>
              <Link href="/marketplace" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                View all offers
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentOffers.length > 0 ? (
                recentOffers.map(offer => (
                  <OfferCard 
                    key={offer.id}
                    offer={offer}
                    marketplace={marketplacesMap[offer.marketplaceId] || {
                      id: '',
                      name: 'Unknown',
                      description: '',
                      logo: '/images/logos/placeholder.svg',
                      website: ''
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200 col-span-3">
                  <p className="text-gray-500">No available offers at the moment</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Active Negotiations */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Active Negotiations</h2>
              <Link href="/negotiations" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                View all negotiations
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              {activeNegotiations.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {activeNegotiations.map(negotiation => {
                    const correspondingOffer = recentOffers.find(o => o.id === negotiation.offerId);
                    
                    return (
                      <Link
                        key={negotiation.id}
                        href={`/negotiations/${negotiation.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {correspondingOffer ? correspondingOffer.title : 'Negotiation'}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Active
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {negotiation.offerType.charAt(0).toUpperCase() + negotiation.offerType.slice(1)}
                              </p>
                              {correspondingOffer && marketplacesMap[correspondingOffer.marketplaceId] && (
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  {marketplacesMap[correspondingOffer.marketplaceId].name}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Current offer: ${negotiation.currentRate}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active negotiations</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Start a negotiation from the marketplace to see it here
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
