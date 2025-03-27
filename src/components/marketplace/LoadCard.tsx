"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, MapPinIcon, TagIcon } from "@heroicons/react/24/outline";
import { Offer, Marketplace } from "@/types/marketplace";
import { LoadStatus } from "@/components/ui/Status";
import {
  formatCurrency,
  formatDate,
} from "@/utils/formatters";

interface OfferCardProps {
  offer: Offer;
  marketplace: Marketplace;
}

export default function OfferCard({ offer, marketplace }: OfferCardProps) {
  const renderOfferDetails = () => {
    switch (offer.type) {
      case 'cargo':
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Pickup</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.pickupLocation.city}, {offer.pickupLocation.state}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Delivery</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.deliveryLocation.city}, {offer.deliveryLocation.state}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Cargo Type</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.cargoType}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Date</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(offer.dateRange.start)}
              </p>
            </div>
          </div>
        );
      case 'vehicle':
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Vehicle Type</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.vehicleType}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Route</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.route.origin.city} to {offer.route.destination.city}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Capacity</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.capacity} {offer.capacityUnit}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Available</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(offer.dateRange.start)}
              </p>
            </div>
          </div>
        );
      case 'warehouse':
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Type</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.warehouseType} warehouse
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Location</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.location.city}, {offer.location.state}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Space</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.totalSpace} {offer.spaceUnit}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Available</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(offer.dateRange.start)}
              </p>
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Service Type</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.serviceType}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Coverage</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.coverage.global ? "Global" : offer.coverage.regions.join(", ")}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Response</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {offer.responseTime}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                <span>Available</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(offer.dateRange.start)}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 relative">
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
            <p className="text-sm text-gray-500">
              {marketplace.name} • {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
            </p>
          </div>
        </div>
        <LoadStatus status={offer.status} />
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {renderOfferDetails()}
      </div>
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(offer.price)}
          </div>
        </div>
        <div>
          {offer.status === "available" ? (
            <Link
              href={`/offers/${offer.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </Link>
          ) : (
            <Link
              href={`/offers/${offer.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 