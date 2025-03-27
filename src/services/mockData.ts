import { 
  Marketplace, 
  Negotiation, 
  CargoOffer, 
  VehicleOffer, 
  WarehouseOffer, 
  ServiceOffer,
  Offer,
  AnalyticsData
} from "@/types/marketplace";

// Marketplaces
export const mockMarketplaces: Marketplace[] = [
  {
    id: "market-1",
    name: "DAT Freight & Analytics",
    description: "The largest on-demand freight marketplace in North America",
    logo: "/images/logos/dat-logo.svg",
    website: "https://www.dat.com"
  },
  {
    id: "market-2",
    name: "Truckstop.com",
    description: "Freight matching platform connecting carriers and brokers",
    logo: "/images/logos/truckstop-logo.svg",
    website: "https://truckstop.com"
  },
  {
    id: "market-3",
    name: "123Loadboard",
    description: "Load board for owner-operators and small carriers",
    logo: "/images/logos/123loadboard-logo.svg",
    website: "https://www.123loadboard.com"
  },
  {
    id: "market-4",
    name: "Uber Freight",
    description: "Digital freight matching platform",
    logo: "/images/logos/uber-freight-logo.svg",
    website: "https://www.uberfreight.com"
  }
];

// Cargo Offers (previously Loads)
export const mockCargoOffers: CargoOffer[] = [
  {
    id: "cargo-1",
    marketplaceId: "market-1",
    type: "cargo",
    status: "available",
    title: "Dry Goods from Chicago to New York",
    description: "Full truckload of packaged dry goods requiring standard equipment",
    price: 2750,
    currency: "USD",
    createdAt: "2023-05-01T08:00:00Z",
    updatedAt: "2023-05-01T08:00:00Z",
    userId: "user-1",
    dateRange: {
      start: "2023-05-05T08:00:00Z",
      end: "2023-05-07T17:00:00Z"
    },
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60601",
      latitude: 41.8781,
      longitude: -87.6298
    },
    features: ["Full Truckload", "No Touch", "Dock to Dock"],
    contactInfo: {
      name: "John Smith",
      phone: "555-123-4567",
      email: "john@example.com"
    },
    pickupLocation: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60601",
      latitude: 41.8781,
      longitude: -87.6298
    },
    deliveryLocation: {
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
      latitude: 40.7128,
      longitude: -74.0060
    },
    distance: 790,
    weight: 42000,
    weightUnit: "lbs",
    dimensions: {
      length: 53,
      width: 102,
      height: 110,
      unit: "in"
    },
    cargoType: "Dry Goods",
    requiresSpecialEquipment: false,
    specialRequirements: [],
    hazardousMaterials: false,
    temperatureControlled: false
  },
  {
    id: "cargo-2",
    marketplaceId: "market-2",
    type: "cargo",
    status: "available",
    title: "Refrigerated Produce from Miami to Atlanta",
    description: "Refrigerated load of fresh produce requiring temperature control",
    price: 1800,
    currency: "USD",
    createdAt: "2023-05-01T10:30:00Z",
    updatedAt: "2023-05-01T10:30:00Z",
    userId: "user-2",
    dateRange: {
      start: "2023-05-04T06:00:00Z",
      end: "2023-05-05T14:00:00Z"
    },
    location: {
      city: "Miami",
      state: "FL",
      country: "USA",
      zipCode: "33101",
      latitude: 25.7617,
      longitude: -80.1918
    },
    features: ["Refrigerated", "Temperature Monitoring", "Produce"],
    contactInfo: {
      name: "Maria Garcia",
      phone: "555-987-6543",
      email: "maria@example.com"
    },
    pickupLocation: {
      city: "Miami",
      state: "FL",
      country: "USA",
      zipCode: "33101",
      latitude: 25.7617,
      longitude: -80.1918
    },
    deliveryLocation: {
      city: "Atlanta",
      state: "GA",
      country: "USA",
      zipCode: "30301",
      latitude: 33.7490,
      longitude: -84.3880
    },
    distance: 662,
    weight: 38000,
    weightUnit: "lbs",
    dimensions: {
      length: 53,
      width: 102,
      height: 110,
      unit: "in"
    },
    cargoType: "Fresh Produce",
    requiresSpecialEquipment: true,
    specialRequirements: ["Continuous Temperature Monitoring"],
    hazardousMaterials: false,
    temperatureControlled: true,
    temperatureRange: {
      min: 34,
      max: 38,
      unit: "F"
    }
  },
  {
    id: "cargo-3",
    marketplaceId: "market-3",
    type: "cargo",
    status: "negotiating",
    title: "Automotive Parts from Detroit to Dallas",
    description: "Partial load of automotive parts. Requires careful handling.",
    price: 1950,
    currency: "USD",
    createdAt: "2023-05-02T09:15:00Z",
    updatedAt: "2023-05-02T14:20:00Z",
    userId: "user-3",
    dateRange: {
      start: "2023-05-08T07:00:00Z",
      end: "2023-05-10T16:00:00Z"
    },
    location: {
      city: "Detroit",
      state: "MI",
      country: "USA",
      zipCode: "48201",
      latitude: 42.3314,
      longitude: -83.0458
    },
    features: ["Partial Load", "High Value", "Time Sensitive"],
    contactInfo: {
      name: "Robert Johnson",
      phone: "555-234-5678",
      email: "robert@example.com"
    },
    pickupLocation: {
      city: "Detroit",
      state: "MI",
      country: "USA",
      zipCode: "48201",
      latitude: 42.3314,
      longitude: -83.0458
    },
    deliveryLocation: {
      city: "Dallas",
      state: "TX",
      country: "USA",
      zipCode: "75201",
      latitude: 32.7767,
      longitude: -96.7970
    },
    distance: 1045,
    weight: 22000,
    weightUnit: "lbs",
    dimensions: {
      length: 40,
      width: 96,
      height: 90,
      unit: "in"
    },
    cargoType: "Automotive Parts",
    requiresSpecialEquipment: false,
    specialRequirements: ["Handle With Care", "Proof of Delivery Required"],
    hazardousMaterials: false,
    temperatureControlled: false
  }
];

// Vehicle Offers
export const mockVehicleOffers: VehicleOffer[] = [
  {
    id: "vehicle-1",
    marketplaceId: "market-1",
    type: "vehicle",
    status: "available",
    title: "53' Dry Van Available - Chicago to East Coast",
    description: "53' dry van with experienced driver available for loads heading to the East Coast",
    price: 2.85, // per mile
    currency: "USD",
    createdAt: "2023-05-01T08:00:00Z",
    updatedAt: "2023-05-01T08:00:00Z",
    userId: "user-4",
    dateRange: {
      start: "2023-05-06T00:00:00Z",
      end: "2023-05-10T23:59:59Z"
    },
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60601",
      latitude: 41.8781,
      longitude: -87.6298
    },
    features: ["Team Drivers", "E-Track", "Logistics Tracking"],
    contactInfo: {
      name: "David Wilson",
      phone: "555-345-6789",
      email: "david@example.com"
    },
    vehicleType: "53' Dry Van",
    capacity: 45000,
    capacityUnit: "lbs",
    availableSpace: {
      length: 53,
      width: 102,
      height: 110,
      unit: "in"
    },
    route: {
      origin: {
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601",
        latitude: 41.8781,
        longitude: -87.6298
      },
      destination: {
        city: "Boston",
        state: "MA",
        country: "USA",
        zipCode: "02101",
        latitude: 42.3601,
        longitude: -71.0589
      }
    },
    specialEquipment: ["Liftgate", "Pallet Jack"],
    temperatureControlled: false,
    driversCount: 2,
    hazardousMaterialsCapability: false
  },
  {
    id: "vehicle-2",
    marketplaceId: "market-2",
    type: "vehicle",
    status: "available",
    title: "Refrigerated Truck - Florida to Southeast",
    description: "48' refrigerated trailer looking for loads from Florida to anywhere in the Southeast",
    price: 3.25, // per mile
    currency: "USD",
    createdAt: "2023-05-02T10:30:00Z",
    updatedAt: "2023-05-02T10:30:00Z",
    userId: "user-5",
    dateRange: {
      start: "2023-05-05T00:00:00Z",
      end: "2023-05-08T23:59:59Z"
    },
    location: {
      city: "Orlando",
      state: "FL",
      country: "USA",
      zipCode: "32801",
      latitude: 28.5383,
      longitude: -81.3792
    },
    features: ["Temperature Logger", "GPS Tracking", "Experienced Driver"],
    contactInfo: {
      name: "Sarah Martinez",
      phone: "555-456-7890",
      email: "sarah@example.com"
    },
    vehicleType: "48' Refrigerated Trailer",
    capacity: 42000,
    capacityUnit: "lbs",
    availableSpace: {
      length: 48,
      width: 98,
      height: 108,
      unit: "in"
    },
    route: {
      origin: {
        city: "Orlando",
        state: "FL",
        country: "USA",
        zipCode: "32801",
        latitude: 28.5383,
        longitude: -81.3792
      },
      destination: {
        city: "Nashville",
        state: "TN",
        country: "USA",
        zipCode: "37201",
        latitude: 36.1627,
        longitude: -86.7816
      },
      waypoints: [
        {
          city: "Atlanta",
          state: "GA",
          country: "USA",
          zipCode: "30301",
          latitude: 33.7490,
          longitude: -84.3880
        }
      ]
    },
    specialEquipment: ["Temperature Recorder", "Satellite Tracking"],
    temperatureControlled: true,
    temperatureRange: {
      min: 32,
      max: 40,
      unit: "F"
    },
    driversCount: 1,
    hazardousMaterialsCapability: false
  }
];

// Warehouse Offers
export const mockWarehouseOffers: WarehouseOffer[] = [
  {
    id: "warehouse-1",
    marketplaceId: "market-3",
    type: "warehouse",
    status: "available",
    title: "Warehouse Space Available in Chicago",
    description: "Short-term storage space available in Chicago industrial district. Climate controlled.",
    price: 2.50, // per sq ft per month
    currency: "USD",
    createdAt: "2023-05-03T11:15:00Z",
    updatedAt: "2023-05-03T11:15:00Z",
    userId: "user-6",
    dateRange: {
      start: "2023-05-10T00:00:00Z",
      end: "2023-08-10T23:59:59Z"
    },
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60632",
      latitude: 41.8781,
      longitude: -87.6298
    },
    features: ["24/7 Access", "Security", "Sprinkler System", "Dock High Doors"],
    contactInfo: {
      name: "Michael Brown",
      phone: "555-567-8901",
      email: "michael@example.com"
    },
    warehouseType: "dry",
    totalSpace: 15000,
    spaceUnit: "sqft",
    palletPositions: 500,
    doorCount: {
      dockDoors: 4,
      groundDoors: 2
    },
    minimumStoragePeriod: "30 days",
    securityFeatures: ["24/7 Security", "CCTV", "Controlled Access"],
    certifications: ["FDA Compliant"],
    operatingHours: {
      weekdays: "6:00 AM - 10:00 PM",
      weekends: "8:00 AM - 6:00 PM"
    },
    additionalServices: ["Inventory Management", "Cross-docking", "Labeling"]
  },
  {
    id: "warehouse-2",
    marketplaceId: "market-4",
    type: "warehouse",
    status: "available",
    title: "Cold Storage in Los Angeles",
    description: "Cold storage facility with multiple temperature zones for food products",
    price: 4.25, // per sq ft per month
    currency: "USD",
    createdAt: "2023-05-04T14:45:00Z",
    updatedAt: "2023-05-04T14:45:00Z",
    userId: "user-7",
    dateRange: {
      start: "2023-05-15T00:00:00Z",
      end: "2023-12-15T23:59:59Z"
    },
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zipCode: "90023",
      latitude: 34.0522,
      longitude: -118.2437
    },
    features: ["Temperature Controlled", "Food Grade", "HACCP Certified"],
    contactInfo: {
      name: "Jennifer Lee",
      phone: "555-678-9012",
      email: "jennifer@example.com"
    },
    warehouseType: "cold",
    totalSpace: 8000,
    spaceUnit: "sqft",
    palletPositions: 300,
    doorCount: {
      dockDoors: 3,
      groundDoors: 1
    },
    minimumStoragePeriod: "60 days",
    securityFeatures: ["Alarm System", "CCTV", "24/7 Monitoring"],
    certifications: ["HACCP", "USDA", "FDA Registered"],
    operatingHours: {
      weekdays: "5:00 AM - 11:00 PM",
      weekends: "6:00 AM - 8:00 PM"
    },
    additionalServices: ["Blast Freezing", "Thawing", "Inventory Control", "Order Fulfillment"]
  }
];

// Service Offers
export const mockServiceOffers: ServiceOffer[] = [
  {
    id: "service-1",
    marketplaceId: "market-1",
    type: "service",
    status: "available",
    title: "Specialized Chemical Transport Service",
    description: "Hazardous materials transport service specialized in chemical products",
    price: 3.50, // per mile
    currency: "USD",
    createdAt: "2023-05-05T09:30:00Z",
    updatedAt: "2023-05-05T09:30:00Z",
    userId: "user-8",
    dateRange: {
      start: "2023-05-10T00:00:00Z",
      end: "2023-06-10T23:59:59Z"
    },
    location: {
      city: "Houston",
      state: "TX",
      country: "USA",
      zipCode: "77002",
      latitude: 29.7604,
      longitude: -95.3698
    },
    features: ["Hazmat Certified", "Trained Drivers", "Spill Response Team"],
    contactInfo: {
      name: "Thomas Clark",
      phone: "555-789-0123",
      email: "thomas@example.com"
    },
    serviceType: "transport",
    specializations: ["Chemical Transport", "HAZMAT", "Tanker"],
    coverage: {
      global: false,
      regions: ["North America"],
      countries: ["USA", "Canada", "Mexico"]
    },
    serviceArea: {
      radius: 1000,
      unit: "miles"
    },
    responseTime: "Within 24 hours",
    certifications: ["Hazmat Certified", "ISO 9001", "EPA Compliant"],
    equipmentTypes: ["Tanker Trucks", "Box Trucks with Hazmat Equipment", "Specialized Containment"]
  },
  {
    id: "service-2",
    marketplaceId: "market-2",
    type: "service",
    status: "available",
    title: "Customs Brokerage & Clearance",
    description: "Complete customs clearance service for international shipments",
    price: 250, // flat rate per shipment
    currency: "USD",
    createdAt: "2023-05-06T13:45:00Z",
    updatedAt: "2023-05-06T13:45:00Z",
    userId: "user-9",
    dateRange: {
      start: "2023-05-15T00:00:00Z",
      end: "2023-12-31T23:59:59Z"
    },
    location: {
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
      latitude: 40.7128,
      longitude: -74.0060
    },
    features: ["Fast Clearance", "Document Preparation", "Duty Calculation"],
    contactInfo: {
      name: "Anna Rodriguez",
      phone: "555-890-1234",
      email: "anna@example.com"
    },
    serviceType: "customs",
    specializations: ["Import Clearance", "Export Documentation", "Tariff Classification"],
    coverage: {
      global: true,
      regions: ["North America", "Europe", "Asia"],
      countries: ["USA", "Canada", "Mexico", "EU Countries", "China", "Japan"]
    },
    serviceArea: {
      radius: 0,
      unit: "miles"
    },
    responseTime: "Same day",
    certifications: ["Certified Customs Specialist", "Licensed Customs Broker"],
    equipmentTypes: []
  }
];

// Combine all offer types for a common list
export const mockOffers: Offer[] = [
  ...mockCargoOffers,
  ...mockVehicleOffers,
  ...mockWarehouseOffers,
  ...mockServiceOffers
];

// Negotiations
export const mockNegotiations: Negotiation[] = [
  {
    id: "nego-1",
    offerId: "cargo-3",
    offerType: "cargo",
    initialRate: 1950,
    currentRate: 1800,
    counterOffers: [
      {
        id: "offer-1",
        negotiationId: "nego-1",
        rate: 1750,
        message: "I can move this load for $1,750",
        fromAI: false,
        createdAt: "2023-04-30T14:20:00Z"
      },
      {
        id: "offer-2",
        negotiationId: "nego-1",
        rate: 1900,
        message: "Our current rate is $1,900 due to the specialized handling required",
        fromAI: true,
        createdAt: "2023-04-30T14:25:00Z"
      },
      {
        id: "offer-3",
        negotiationId: "nego-1",
        rate: 1800,
        message: "I can go up to $1,800, considering current fuel prices",
        fromAI: false,
        createdAt: "2023-04-30T14:30:00Z"
      }
    ],
    status: "active",
    startedAt: "2023-04-30T14:20:00Z",
    updatedAt: "2023-04-30T14:30:00Z",
    isAIEnabled: true,
    targetRate: 1750,
    maxRate: 1850
  }
];

// Analytics
export const mockAnalytics: AnalyticsData = {
  totalLoads: 235,
  activeNegotiations: 42,
  completedNegotiations: 193,
  avgSavings: 0.12,
  marketTrends: [
    { date: "2023-04-01", avgRate: 2.45 },
    { date: "2023-04-08", avgRate: 2.48 },
    { date: "2023-04-15", avgRate: 2.51 },
    { date: "2023-04-22", avgRate: 2.53 },
    { date: "2023-04-29", avgRate: 2.49 }
  ],
  negotiationSuccess: [
    { type: "success", count: 178 },
    { type: "fail", count: 57 }
  ],
  loadDistribution: [
    { status: "Dry Van", count: 95 },
    { status: "Refrigerated", count: 58 },
    { status: "Flatbed", count: 42 },
    { status: "Specialized", count: 40 }
  ],
  topLanes: [
    { origin: "Chicago, IL", destination: "Dallas, TX", count: 28, avgRate: 2.35 },
    { origin: "Los Angeles, CA", destination: "Seattle, WA", count: 22, avgRate: 2.78 },
    { origin: "Atlanta, GA", destination: "Miami, FL", count: 19, avgRate: 2.21 },
    { origin: "New York, NY", destination: "Chicago, IL", count: 17, avgRate: 2.65 }
  ]
}; 