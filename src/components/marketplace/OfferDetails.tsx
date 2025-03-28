"use client";

import Image from "next/image";
import { useState } from "react";
import { Offer, Marketplace, CargoOffer, VehicleOffer, WarehouseOffer, ServiceOffer } from "@/types/marketplace";
import { LoadStatus } from "@/components/ui/Status";
import {
  MapIcon,
  CalendarIcon,
  TagIcon,
  ScaleIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatWeight,
  getLocationString,
  formatDateTime,
} from "@/utils/formatters";
import { createNegotiation, acceptOffer } from "@/services/marketplaceService";
import EscrowPaymentUI from "@/components/escrow/EscrowPaymentUI";

interface OfferDetailsProps {
  offer: Offer;
  marketplace: Marketplace;
  onStartNegotiation?: (targetRate: number, maxRate: number, isAIEnabled: boolean) => void;
  onPaymentComplete?: (transactionId: string) => void;
}

// Mock current user - in a real app this would come from authentication
const currentUser = {
  id: "user-123",
  name: "John Forwarder",
  role: "carrier" as const
};

export default function OfferDetails({
  offer,
  marketplace,
  onStartNegotiation,
  onPaymentComplete,
}: OfferDetailsProps) {
  const [targetRate, setTargetRate] = useState(Math.round(offer.price * 0.9).toString());
  const [maxRate, setMaxRate] = useState(Math.round(offer.price * 0.95).toString());
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNegotiationForm, setShowNegotiationForm] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
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
    
    setIsSubmitting(true);
    
    try {
      if (onStartNegotiation) {
        onStartNegotiation(numericTargetRate, numericMaxRate, isAIEnabled);
      }
    } catch (error) {
      console.error("Error starting negotiation:", error);
      alert("Failed to start negotiation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = (transactionId: string) => {
    // Update offer status and notify parent component
    if (offer) {
      // In a real app, you would call an API to update the status
      const updatedOffer = {
        ...offer,
        status: "booked",
        transactionId: transactionId
      };
      
      // Notify parent if needed
      if (onPaymentComplete) {
        onPaymentComplete(transactionId);
      }
      
      // Close payment UI
      setShowPaymentUI(false);
    }
  };

  const handleDirectAccept = async () => {
    setIsSubmitting(true);
    
    try {
      const updatedOffer = await acceptOffer(
        offer.id,
        currentUser.id,
        currentUser.name,
        currentUser.role
      );
      
      // If payment complete handler exists, call it with a dummy transaction ID
      if (onPaymentComplete) {
        const transactionId = `tx-${Date.now()}`;
        onPaymentComplete(transactionId);
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Failed to accept offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOfferDetails = () => {
    switch (offer.type) {
      case 'cargo':
        return renderCargoDetails(offer as CargoOffer);
      case 'vehicle':
        return renderVehicleDetails(offer as VehicleOffer);
      case 'warehouse':
        return renderWarehouseDetails(offer as WarehouseOffer);
      case 'service':
        return renderServiceDetails(offer as ServiceOffer);
      default:
        return null;
    }
  };

  const renderCargoDetails = (cargoOffer: CargoOffer) => (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Origin */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <MapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Origin</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {getLocationString(cargoOffer.pickupLocation.city, cargoOffer.pickupLocation.state)}
        </p>
        <p className="text-sm text-gray-500">{cargoOffer.pickupLocation.zipCode}</p>
      </div>
      
      {/* Destination */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <MapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Destination</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {getLocationString(cargoOffer.deliveryLocation.city, cargoOffer.deliveryLocation.state)}
        </p>
        <p className="text-sm text-gray-500">{cargoOffer.deliveryLocation.zipCode}</p>
      </div>
      
      {/* Distance */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <ArrowRightIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Distance</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDistance(cargoOffer.distance)}
        </p>
      </div>
      
      {/* Pickup Date */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Pickup Date</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(cargoOffer.dateRange.start)}
        </p>
      </div>
      
      {/* Delivery Date */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Delivery Date</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(cargoOffer.dateRange.end)}
        </p>
      </div>
      
      {/* Cargo Type */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Cargo Type</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {cargoOffer.cargoType}
        </p>
      </div>
      
      {/* Weight */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <ScaleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Weight</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatWeight(cargoOffer.weight)} {cargoOffer.weightUnit}
        </p>
      </div>
      
      {/* Rate */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CurrencyDollarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Listed Rate</span>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(cargoOffer.price)}
        </p>
      </div>

      {/* Special Requirements */}
      {cargoOffer.specialRequirements && cargoOffer.specialRequirements.length > 0 && (
        <div className="sm:col-span-2">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
            <InformationCircleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            <span>Special Requirements</span>
          </div>
          <ul className="text-base text-gray-900 pl-5 list-disc">
            {cargoOffer.specialRequirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderVehicleDetails = (vehicleOffer: VehicleOffer) => (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Vehicle Type */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <TruckIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Vehicle Type</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {vehicleOffer.vehicleType}
        </p>
      </div>
      
      {/* Origin */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <MapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Origin</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {getLocationString(vehicleOffer.route.origin.city, vehicleOffer.route.origin.state)}
        </p>
        <p className="text-sm text-gray-500">{vehicleOffer.route.origin.zipCode}</p>
      </div>
      
      {/* Destination */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <MapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Destination</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {getLocationString(vehicleOffer.route.destination.city, vehicleOffer.route.destination.state)}
        </p>
        <p className="text-sm text-gray-500">{vehicleOffer.route.destination.zipCode}</p>
      </div>
      
      {/* Available Dates */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available From</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(vehicleOffer.dateRange.start)}
        </p>
      </div>
      
      {/* To Date */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available Until</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(vehicleOffer.dateRange.end)}
        </p>
      </div>
      
      {/* Capacity */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <ScaleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Capacity</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {vehicleOffer.capacity} {vehicleOffer.capacityUnit}
        </p>
      </div>
      
      {/* Available Space */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <InformationCircleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available Space</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {vehicleOffer.availableSpace.length} × {vehicleOffer.availableSpace.width} × {vehicleOffer.availableSpace.height} {vehicleOffer.availableSpace.unit}
        </p>
      </div>
      
      {/* Rate */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CurrencyDollarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Listed Rate</span>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(vehicleOffer.price)}
        </p>
      </div>

      {/* Special Equipment */}
      {vehicleOffer.specialEquipment && vehicleOffer.specialEquipment.length > 0 && (
        <div className="sm:col-span-2">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
            <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            <span>Special Equipment</span>
          </div>
          <ul className="text-base text-gray-900 pl-5 list-disc">
            {vehicleOffer.specialEquipment.map((eq, index) => (
              <li key={index}>{eq}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderWarehouseDetails = (warehouseOffer: WarehouseOffer) => (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Warehouse Type */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <BuildingOfficeIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Warehouse Type</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {warehouseOffer.warehouseType.charAt(0).toUpperCase() + warehouseOffer.warehouseType.slice(1)}
        </p>
      </div>
      
      {/* Location */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <MapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Location</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {getLocationString(warehouseOffer.location.city, warehouseOffer.location.state)}
        </p>
        <p className="text-sm text-gray-500">{warehouseOffer.location.zipCode}</p>
      </div>
      
      {/* Space */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <InformationCircleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Total Space</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {warehouseOffer.totalSpace} {warehouseOffer.spaceUnit}
        </p>
      </div>
      
      {/* Available From */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available From</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(warehouseOffer.dateRange.start)}
        </p>
      </div>
      
      {/* Available Until */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available Until</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(warehouseOffer.dateRange.end)}
        </p>
      </div>
      
      {/* Minimum Storage */}
      {warehouseOffer.minimumStoragePeriod && (
        <div>
          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
            <InformationCircleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            <span>Minimum Storage</span>
          </div>
          <p className="text-base font-medium text-gray-900">
            {warehouseOffer.minimumStoragePeriod}
          </p>
        </div>
      )}
      
      {/* Rate */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CurrencyDollarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Listed Rate</span>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(warehouseOffer.price)}
        </p>
      </div>

      {/* Certifications */}
      {warehouseOffer.certifications && warehouseOffer.certifications.length > 0 && (
        <div className="sm:col-span-2">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
            <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            <span>Certifications</span>
          </div>
          <ul className="text-base text-gray-900 pl-5 list-disc">
            {warehouseOffer.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderServiceDetails = (serviceOffer: ServiceOffer) => (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Service Type */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Service Type</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {serviceOffer.serviceType.charAt(0).toUpperCase() + serviceOffer.serviceType.slice(1)}
        </p>
      </div>
      
      {/* Location */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <MapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Location</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {getLocationString(serviceOffer.location.city, serviceOffer.location.state)}
        </p>
        <p className="text-sm text-gray-500">{serviceOffer.location.zipCode}</p>
      </div>
      
      {/* Service Area */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <InformationCircleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Service Area</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {serviceOffer.serviceArea.radius} {serviceOffer.serviceArea.unit}
        </p>
      </div>
      
      {/* Available From */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available From</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(serviceOffer.dateRange.start)}
        </p>
      </div>
      
      {/* Available Until */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Available Until</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {formatDate(serviceOffer.dateRange.end)}
        </p>
      </div>
      
      {/* Response Time */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <InformationCircleIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Response Time</span>
        </div>
        <p className="text-base font-medium text-gray-900">
          {serviceOffer.responseTime}
        </p>
      </div>
      
      {/* Rate */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
          <CurrencyDollarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
          <span>Listed Rate</span>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(serviceOffer.price)}
        </p>
      </div>

      {/* Specializations */}
      {serviceOffer.specializations && serviceOffer.specializations.length > 0 && (
        <div className="sm:col-span-2">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
            <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            <span>Specializations</span>
          </div>
          <ul className="text-base text-gray-900 pl-5 list-disc">
            {serviceOffer.specializations.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 relative">
            <Image
              src={marketplace.logo || "/images/logos/placeholder.svg"}
              alt={marketplace.name}
              fill
              className="object-contain rounded"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {offer.title}
            </h3>
            <p className="text-sm text-gray-500">{marketplace.name} • {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</p>
          </div>
        </div>
        <LoadStatus status={offer.status} />
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {renderOfferDetails()}
        
        {/* Description */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
          <p className="text-base text-gray-900">
            {offer.description}
          </p>
        </div>
      </div>
      
      {/* Actions */}
      {offer.status === "available" && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {showPaymentUI ? (
            <EscrowPaymentUI 
              offer={offer} 
              onCancel={() => setShowPaymentUI(false)}
              onPaymentComplete={handlePaymentComplete}
            />
          ) : (
            <>
              <h4 className="text-base font-medium text-gray-900 mb-4">
                Offer Actions
              </h4>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                {onStartNegotiation && (
                  <button
                    type="button"
                    onClick={() => setShowNegotiationForm(!showNegotiationForm)}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Start Negotiation
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDirectAccept}
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Accept Offer"}
                </button>
              </div>
              
              {showNegotiationForm && onStartNegotiation && (
                <div className="mt-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="ai-enabled"
                            name="ai-enabled"
                            type="checkbox"
                            checked={isAIEnabled}
                            onChange={(e) => setIsAIEnabled(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                          <label htmlFor="ai-enabled" className="ml-2 block text-sm text-gray-900">
                            Let AI handle the negotiation
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="target-rate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Target Rate (Ideal Price)
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="text"
                              name="target-rate"
                              id="target-rate"
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
                            htmlFor="max-rate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Maximum Rate (Your Limit)
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="text"
                              name="max-rate"
                              id="max-rate"
                              value={maxRate}
                              onChange={(e) => setMaxRate(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              placeholder="0"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Starting Negotiation..." : "Start Negotiation"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 