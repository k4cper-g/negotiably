export interface Location {
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface User {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: 'carrier' | 'shipper' | 'broker' | 'warehouse';
}

export interface Marketplace {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  apiKey?: string;
}

export type OfferType = 'cargo' | 'vehicle' | 'warehouse' | 'service';
export type OfferStatus = 'available' | 'negotiating' | 'booked' | 'completed' | 'cancelled' | 'finalized';

export interface BaseOffer {
  id: string;
  marketplaceId: string;
  type: OfferType;
  status: OfferStatus;
  title: string;
  description: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  dateRange: DateRange;
  location: Location;
  features: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  transactionId?: string;
  teamId?: string;
}

export interface CargoOffer extends BaseOffer {
  type: 'cargo';
  pickupLocation: Location;
  deliveryLocation: Location;
  distance: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  cargoType: string;
  requiresSpecialEquipment: boolean;
  specialRequirements: string[];
  hazardousMaterials: boolean;
  temperatureControlled: boolean;
  temperatureRange?: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
}

export interface VehicleOffer extends BaseOffer {
  type: 'vehicle';
  vehicleType: string;
  capacity: number;
  capacityUnit: 'kg' | 'lbs';
  availableSpace: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  route: {
    origin: Location;
    destination: Location;
    waypoints?: Location[];
  };
  specialEquipment: string[];
  temperatureControlled: boolean;
  temperatureRange?: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
  driversCount: number;
  hazardousMaterialsCapability: boolean;
}

export interface WarehouseOffer extends BaseOffer {
  type: 'warehouse';
  warehouseType: 'dry' | 'cold' | 'bonded' | 'hazmat' | 'cross-dock';
  totalSpace: number;
  spaceUnit: 'sqm' | 'sqft';
  palletPositions?: number;
  doorCount?: {
    dockDoors: number;
    groundDoors: number;
  };
  minimumStoragePeriod?: string;
  securityFeatures: string[];
  certifications: string[];
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  additionalServices: string[];
}

export interface ServiceOffer extends BaseOffer {
  type: 'service';
  serviceType: 'transport' | 'logistics' | 'customs' | 'consulting' | 'other';
  specializations: string[];
  coverage: {
    global: boolean;
    regions: string[];
    countries: string[];
  };
  serviceArea: {
    radius: number;
    unit: 'km' | 'miles';
  };
  responseTime: string;
  certifications: string[];
  equipmentTypes: string[];
}

export type Offer = CargoOffer | VehicleOffer | WarehouseOffer | ServiceOffer;

export interface CounterOffer {
  id: string;
  negotiationId: string;
  rate: number;
  message: string;
  fromAI: boolean;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  offerId: string;
  offerType: OfferType;
  initialRate: number;
  currentRate: number;
  counterOffers: CounterOffer[];
  status: 'active' | 'accepted' | 'rejected' | 'expired';
  startedAt: string;
  updatedAt: string;
  isAIEnabled: boolean;
  targetRate: number;
  maxRate: number;
}

export interface AnalyticsData {
  totalLoads: number;
  activeNegotiations: number;
  completedNegotiations: number;
  avgSavings: number;
  marketTrends: {
    date: string;
    avgRate: number;
  }[];
  negotiationSuccess: {
    type: 'success' | 'fail';
    count: number;
  }[];
  loadDistribution: {
    status: string;
    count: number;
  }[];
  topLanes: {
    origin: string;
    destination: string;
    count: number;
    avgRate: number;
  }[];
}

export interface TeamCollaborationFile {
  id: string;
  teamId: string;
  name: string;
  fileType: 'document' | 'transport' | 'invoice' | 'customs' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  description?: string;
}

export interface TeamCollaborationMessage {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  attachments?: TeamCollaborationFile[];
}

export interface TeamCollaboration {
  id: string;
  offerId: string;
  name: string;
  participants: {
    userId: string;
    name: string;
    role: 'carrier' | 'shipper' | 'broker' | 'warehouse';
    joinedAt: string;
  }[];
  messages: TeamCollaborationMessage[];
  files: TeamCollaborationFile[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'cancelled' | 'finalized';
  finalizedAt?: string;
  finalizedBy?: string;
  finalizedReason?: string;
} 