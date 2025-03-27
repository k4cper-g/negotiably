"use client";

import { useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Marketplace } from "@/types/marketplace";

interface MarketplaceFiltersProps {
  marketplaces: Marketplace[];
  selectedMarketplaces: string[];
  onFilterChange: (marketplaceIds: string[]) => void;
}

export default function MarketplaceFilters({
  marketplaces,
  selectedMarketplaces,
  onFilterChange,
}: MarketplaceFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { id: "available", name: "Available" },
    { id: "negotiating", name: "Negotiating" },
    { id: "booked", name: "Booked" },
  ];

  const equipmentOptions = [
    { id: "Dry Van", name: "Dry Van" },
    { id: "Reefer", name: "Reefer" },
    { id: "Flatbed", name: "Flatbed" },
    { id: "Specialized", name: "Specialized" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    updateFilters({
      search: e.target.value,
      marketplaces: selectedMarketplaces,
      status: selectedStatus,
      equipment: selectedEquipment,
    });
  };

  const handleMarketplaceToggle = (marketplaceId: string) => {
    const newSelectedMarketplaces = [...selectedMarketplaces];
    
    if (newSelectedMarketplaces.includes(marketplaceId)) {
      // Remove marketplace from selection
      const index = newSelectedMarketplaces.indexOf(marketplaceId);
      newSelectedMarketplaces.splice(index, 1);
    } else {
      // Add marketplace to selection
      newSelectedMarketplaces.push(marketplaceId);
    }
    
    onFilterChange(newSelectedMarketplaces);
  };
  
  const handleSelectAll = () => {
    onFilterChange(marketplaces.map(m => m.id));
  };
  
  const handleSelectNone = () => {
    onFilterChange([]);
  };

  const toggleStatus = (id: string) => {
    const updatedStatus = selectedStatus.includes(id)
      ? selectedStatus.filter((s) => s !== id)
      : [...selectedStatus, id];
    
    setSelectedStatus(updatedStatus);
    updateFilters({
      search,
      marketplaces: selectedMarketplaces,
      status: updatedStatus,
      equipment: selectedEquipment,
    });
  };

  const toggleEquipment = (id: string) => {
    const updatedEquipment = selectedEquipment.includes(id)
      ? selectedEquipment.filter((e) => e !== id)
      : [...selectedEquipment, id];
    
    setSelectedEquipment(updatedEquipment);
    updateFilters({
      search,
      marketplaces: selectedMarketplaces,
      status: selectedStatus,
      equipment: updatedEquipment,
    });
  };

  const updateFilters = (filters: {
    search: string;
    marketplaces: string[];
    status: string[];
    equipment: string[];
  }) => {
    onFilterChange(filters.marketplaces);
  };

  const clearFilters = () => {
    setSearch("");
    onFilterChange([]);
    setSelectedStatus([]);
    setSelectedEquipment([]);
    updateFilters({
      search: "",
      marketplaces: [],
      status: [],
      equipment: [],
    });
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:p-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Search loads by origin, destination, or equipment"
            />
          </div>
        </div>

        {/* Filter button */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          
          {/* Filter count and clear button */}
          {(selectedMarketplaces.length > 0 || selectedStatus.length > 0 || selectedEquipment.length > 0) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear Filters
              <span className="ml-1.5 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs font-medium">
                {selectedMarketplaces.length + selectedStatus.length + selectedEquipment.length}
              </span>
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Marketplaces */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Marketplaces</h3>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectNone}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {marketplaces.map((marketplace) => (
                  <label
                    key={marketplace.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedMarketplaces.includes(marketplace.id)
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMarketplaces.includes(marketplace.id)}
                      onChange={() => handleMarketplaceToggle(marketplace.id)}
                      className="sr-only"
                    />
                    <div className="h-6 w-6 relative mr-2">
                      <Image
                        src={marketplace.logo}
                        alt={marketplace.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        selectedMarketplaces.includes(marketplace.id)
                          ? "font-medium text-blue-600"
                          : "font-normal text-gray-600"
                      }`}
                    >
                      {marketplace.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`status-${option.id}`}
                      type="checkbox"
                      checked={selectedStatus.includes(option.id)}
                      onChange={() => toggleStatus(option.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`status-${option.id}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Equipment</h3>
              <div className="space-y-3">
                {equipmentOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`equipment-${option.id}`}
                      type="checkbox"
                      checked={selectedEquipment.includes(option.id)}
                      onChange={() => toggleEquipment(option.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`equipment-${option.id}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 