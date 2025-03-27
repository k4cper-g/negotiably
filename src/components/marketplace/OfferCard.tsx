import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Marketplace, Offer, CargoOffer, VehicleOffer, WarehouseOffer, ServiceOffer } from '@/types/marketplace';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { TruckIcon, HomeModernIcon, BuildingStorefrontIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

interface OfferCardProps {
  offer: Offer;
  marketplace: Marketplace;
  onStartNegotiation?: (targetRate: number, maxRate: number, isAIEnabled: boolean) => void;
  isLoading?: boolean;
}

export default function OfferCard({ offer, marketplace, onStartNegotiation, isLoading = false }: OfferCardProps) {
  const [targetRate, setTargetRate] = useState(Math.round(offer.price * 0.9).toString());
  const [maxRate, setMaxRate] = useState(Math.round(offer.price * 0.95).toString());
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onStartNegotiation || isLoading) return;
    
    const numericTargetRate = parseInt(targetRate.replace(/\D/g, ""), 10);
    const numericMaxRate = parseInt(maxRate.replace(/\D/g, ""), 10);
    
    if (isNaN(numericTargetRate) || numericTargetRate <= 0) {
      alert("Please enter a valid target rate");
      return;
    }
    
    if (isNaN(numericMaxRate) || numericMaxRate <= 0) {
      alert("Please enter a valid maximum rate");
      return;
    }
    
    if (numericMaxRate < numericTargetRate) {
      alert("Maximum rate cannot be lower than target rate");
      return;
    }
    
    onStartNegotiation(numericTargetRate, numericMaxRate, isAIEnabled);
  };
  
  // Render different card content based on offer type
  const renderOfferContent = () => {
    switch (offer.type) {
      case 'cargo':
        return renderCargoContent(offer as CargoOffer);
      case 'vehicle':
        return renderVehicleContent(offer as VehicleOffer);
      case 'warehouse':
        return renderWarehouseContent(offer as WarehouseOffer);
      case 'service':
        return renderServiceContent(offer as ServiceOffer);
      default:
        return null;
    }
  };
  
  const renderCargoContent = (cargo: CargoOffer) => (
    <>
      <div className="flex items-start">
        <CubeTransparentIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
        <div>
          <p className="font-medium">{cargo.cargoType}</p>
          <p className="text-sm text-gray-500">{cargo.weight} {cargo.weightUnit}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-500">Origin</p>
          <p className="font-medium">{cargo.pickupLocation.city}, {cargo.pickupLocation.state}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(cargo.dateRange.start)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Destination</p>
          <p className="font-medium">{cargo.deliveryLocation.city}, {cargo.deliveryLocation.state}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(cargo.dateRange.end)}</p>
        </div>
      </div>
      <p className="text-sm mt-4">{cargo.distance} miles • {cargo.requiresSpecialEquipment ? 'Special equipment required' : 'Standard equipment'}</p>
    </>
  );
  
  const renderVehicleContent = (vehicle: VehicleOffer) => (
    <>
      <div className="flex items-start">
        <TruckIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
        <div>
          <p className="font-medium">{vehicle.vehicleType}</p>
          <p className="text-sm text-gray-500">Capacity: {vehicle.capacity} {vehicle.capacityUnit}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-500">Available From</p>
          <p className="font-medium">{vehicle.route.origin.city}, {vehicle.route.origin.state}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(vehicle.dateRange.start)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Heading To</p>
          <p className="font-medium">{vehicle.route.destination.city}, {vehicle.route.destination.state}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(vehicle.dateRange.end)}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm">{vehicle.driversCount > 1 ? `${vehicle.driversCount} drivers` : '1 driver'} • {vehicle.temperatureControlled ? 'Temperature controlled' : 'Regular'}</p>
      </div>
    </>
  );
  
  const renderWarehouseContent = (warehouse: WarehouseOffer) => (
    <>
      <div className="flex items-start">
        <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
        <div>
          <p className="font-medium">{warehouse.warehouseType.charAt(0).toUpperCase() + warehouse.warehouseType.slice(1)} Storage</p>
          <p className="text-sm text-gray-500">{warehouse.totalSpace} {warehouse.spaceUnit}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500">Location</p>
        <p className="font-medium">{warehouse.location.city}, {warehouse.location.state}</p>
        <p className="text-xs text-gray-500 mt-2">Available Period</p>
        <p className="text-sm">{formatDate(warehouse.dateRange.start)} - {formatDate(warehouse.dateRange.end)}</p>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500">Features</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {warehouse.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {feature}
            </span>
          ))}
          {warehouse.features.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              +{warehouse.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    </>
  );
  
  const renderServiceContent = (service: ServiceOffer) => (
    <>
      <div className="flex items-start">
        <HomeModernIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
        <div>
          <p className="font-medium">{service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)} Service</p>
          <p className="text-sm text-gray-500">{service.specializations.join(', ')}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500">Location</p>
        <p className="font-medium">{service.location.city}, {service.location.state}</p>
        <p className="text-xs text-gray-500 mt-2">Service Period</p>
        <p className="text-sm">{formatDate(service.dateRange.start)} - {formatDate(service.dateRange.end)}</p>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500">Response Time</p>
        <p className="text-sm">{service.responseTime}</p>
        <p className="text-xs text-gray-500 mt-2">Coverage</p>
        <p className="text-sm">{service.coverage.global ? 'Global' : service.coverage.regions.join(', ')}</p>
      </div>
    </>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative group">
      <div className="absolute inset-0 z-10">
        <Link 
          href={`/offers/${offer.id}`}
          className="absolute inset-0"
          aria-label="View offer details"
        >
          <span className="sr-only">View offer details</span>
        </Link>
      </div>
      
      {/* Header with marketplace logo */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center relative z-20">
        <div className="flex items-center">
          <div className="h-6 w-6 relative mr-2">
            <Image
              src={marketplace.logo}
              alt={marketplace.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{marketplace.name}</span>
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            offer.status === 'available' ? 'bg-green-100 text-green-800' :
            offer.status === 'negotiating' ? 'bg-blue-100 text-blue-800' : 
            'bg-purple-100 text-purple-800'
          }`}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Offer content */}
      <div className="p-4 relative z-20">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{offer.title}</h3>
        
        {/* Offer details */}
        <div className="space-y-4">
          {renderOfferContent()}
          
          {/* Price */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(offer.price)}</p>
            </div>
            <Link 
              href={`/offers/${offer.id}`}
              className="relative z-30 inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
              onClick={(e) => e.stopPropagation()}
            >
              See Details
            </Link>
          </div>
        </div>
      </div>
      
      {/* Negotiation form */}
      {isExpanded && onStartNegotiation && offer.status === 'available' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 relative z-30" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id={`ai-enabled-${offer.id}`}
                    name="ai-enabled"
                    type="checkbox"
                    checked={isAIEnabled}
                    onChange={(e) => setIsAIEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor={`ai-enabled-${offer.id}`} className="ml-2 block text-sm text-gray-900">
                    AI Negotiation
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`target-rate-${offer.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Target Rate
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="target-rate"
                      id={`target-rate-${offer.id}`}
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label
                    htmlFor={`max-rate-${offer.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Max Rate
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="max-rate"
                      id={`max-rate-${offer.id}`}
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {isLoading ? "Starting..." : "Start Negotiation"}
                </button>
                
                <Link
                  href={`/offers/${offer.id}`}
                  className="inline-flex justify-center items-center rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
                >
                  See Details
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 