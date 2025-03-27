import { 
  Marketplace, 
  Negotiation, 
  Offer,
  CargoOffer,
  VehicleOffer,
  WarehouseOffer,
  ServiceOffer,
  CounterOffer, 
  OfferType,
  AnalyticsData
} from "@/types/marketplace";
import { 
  mockMarketplaces,
  mockOffers, 
  mockCargoOffers,
  mockVehicleOffers,
  mockWarehouseOffers,
  mockServiceOffers,
  mockNegotiations,
  mockAnalytics
} from "./mockData";

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Marketplace APIs
export const getMarketplaces = async (): Promise<Marketplace[]> => {
  await delay(500);
  return [...mockMarketplaces];
};

// Offer APIs
export const getAllOffers = async (): Promise<Offer[]> => {
  await delay(800);
  return [...mockOffers];
};

export const getOffersByType = async (type: OfferType): Promise<Offer[]> => {
  await delay(700);
  switch (type) {
    case 'cargo':
      return [...mockCargoOffers];
    case 'vehicle':
      return [...mockVehicleOffers];
    case 'warehouse':
      return [...mockWarehouseOffers];
    case 'service':
      return [...mockServiceOffers];
    default:
      return [...mockOffers];
  }
};

export const getOffersByMarketplace = async (marketplaceId: string): Promise<Offer[]> => {
  await delay(700);
  return mockOffers.filter(offer => offer.marketplaceId === marketplaceId);
};

export const getOfferById = async (offerId: string): Promise<Offer | null> => {
  await delay(300);
  const offer = mockOffers.find(o => o.id === offerId);
  return offer ? { ...offer } : null;
};

export const getCargoOfferById = async (offerId: string): Promise<CargoOffer | null> => {
  await delay(300);
  const offer = mockCargoOffers.find(o => o.id === offerId);
  return offer ? { ...offer } : null;
};

export const getVehicleOfferById = async (offerId: string): Promise<VehicleOffer | null> => {
  await delay(300);
  const offer = mockVehicleOffers.find(o => o.id === offerId);
  return offer ? { ...offer } : null;
};

export const getWarehouseOfferById = async (offerId: string): Promise<WarehouseOffer | null> => {
  await delay(300);
  const offer = mockWarehouseOffers.find(o => o.id === offerId);
  return offer ? { ...offer } : null;
};

export const getServiceOfferById = async (offerId: string): Promise<ServiceOffer | null> => {
  await delay(300);
  const offer = mockServiceOffers.find(o => o.id === offerId);
  return offer ? { ...offer } : null;
};

// Negotiation APIs
export const getNegotiations = async (): Promise<Negotiation[]> => {
  await delay(600);
  return [...mockNegotiations].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

export const getNegotiationById = async (negotiationId: string): Promise<Negotiation | null> => {
  await delay(400);
  const negotiation = mockNegotiations.find(n => n.id === negotiationId);
  return negotiation ? { ...negotiation } : null;
};

export const getNegotiationByOfferId = async (offerId: string): Promise<Negotiation | null> => {
  await delay(400);
  const negotiation = mockNegotiations.find(n => n.offerId === offerId);
  return negotiation ? { ...negotiation } : null;
};

export const createNegotiation = async (
  offerId: string,
  offerType: OfferType,
  targetRate: number,
  maxRate: number,
  isAIEnabled: boolean = true
): Promise<Negotiation> => {
  await delay(700);
  
  const offer = mockOffers.find(o => o.id === offerId);
  if (!offer) {
    throw new Error(`Offer with id ${offerId} not found`);
  }
  
  if (offer.status !== 'available') {
    throw new Error(`Offer is not available for negotiation`);
  }
  
  // Update offer status
  offer.status = 'negotiating';
  
  // Create new negotiation
  const newNegotiation: Negotiation = {
    id: `nego-${Date.now()}`,
    offerId,
    offerType,
    initialRate: offer.price,
    currentRate: targetRate,
    counterOffers: [
      {
        id: `offer-${Date.now()}`,
        negotiationId: `nego-${Date.now()}`,
        rate: targetRate,
        message: `Initial offer: ${targetRate}`,
        fromAI: false,
        createdAt: new Date().toISOString()
      }
    ],
    status: 'active',
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAIEnabled,
    targetRate,
    maxRate
  };
  
  mockNegotiations.push(newNegotiation);
  
  return { ...newNegotiation };
};

export const addCounterOffer = async (
  negotiationId: string,
  rate: number,
  message: string,
  fromAI: boolean
): Promise<Negotiation> => {
  await delay(500);
  
  const negotiation = mockNegotiations.find(n => n.id === negotiationId);
  if (!negotiation) {
    throw new Error(`Negotiation with id ${negotiationId} not found`);
  }
  
  if (negotiation.status !== 'active') {
    throw new Error(`Negotiation is not active`);
  }
  
  // Create new counter offer
  const newCounterOffer: CounterOffer = {
    id: `offer-${Date.now()}`,
    negotiationId,
    rate,
    message,
    fromAI,
    createdAt: new Date().toISOString()
  };
  
  // Update negotiation
  negotiation.counterOffers.push(newCounterOffer);
  negotiation.currentRate = rate;
  negotiation.updatedAt = new Date().toISOString();
  
  // Find the associated offer and update it
  const offer = mockOffers.find(o => o.id === negotiation.offerId);
  if (offer) {
    offer.price = rate;
    offer.updatedAt = new Date().toISOString();
  }
  
  return { ...negotiation };
};

export const concludeNegotiation = async (
  negotiationId: string,
  status: 'accepted' | 'rejected' | 'expired'
): Promise<Negotiation> => {
  await delay(600);
  
  const negotiation = mockNegotiations.find(n => n.id === negotiationId);
  if (!negotiation) {
    throw new Error(`Negotiation with id ${negotiationId} not found`);
  }
  
  // Update negotiation status
  negotiation.status = status;
  negotiation.updatedAt = new Date().toISOString();
  
  // Update related offer status
  const offer = mockOffers.find(o => o.id === negotiation.offerId);
  if (offer) {
    offer.status = status === 'accepted' ? 'booked' : 'available';
    offer.updatedAt = new Date().toISOString();
  }
  
  return { ...negotiation };
};

// AI Suggestions
export const getAISuggestedRate = async (offerId: string): Promise<{
  suggestedRate: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}> => {
  await delay(1500);
  
  const offer = mockOffers.find(o => o.id === offerId);
  if (!offer) {
    throw new Error(`Offer with id ${offerId} not found`);
  }
  
  // Simulate AI response based on offer type
  let baseRate = offer.price;
  let confidenceLevel: 'high' | 'medium' | 'low';
  let reason = '';
  
  switch (offer.type) {
    case 'cargo':
      confidenceLevel = 'high';
      const cargoOffer = offer as CargoOffer;
      const ratePerMile = baseRate / cargoOffer.distance;
      const discount = getRandomInt(5, 12) / 100;
      const suggestedRate = Math.round(baseRate * (1 - discount));
      
      reason = `Based on current market conditions for ${cargoOffer.cargoType}, rates along this lane are trending ${discount * 100}% lower than listed prices. Historical data suggests $${ratePerMile.toFixed(2)}/mile is competitive.`;
      
      return {
        suggestedRate,
        confidence: confidenceLevel,
        reasoning: reason
      };
      
    case 'vehicle':
      confidenceLevel = 'medium';
      const vehicleOffer = offer as VehicleOffer;
      const suggestedVehicleRate = Math.round(baseRate * 0.92);
      
      reason = `Current demand for ${vehicleOffer.vehicleType} vehicles is moderate. You can negotiate a competitive rate approximately 8% below asking price based on similar routes.`;
      
      return {
        suggestedRate: suggestedVehicleRate,
        confidence: confidenceLevel,
        reasoning: reason
      };
      
    case 'warehouse':
      confidenceLevel = 'high';
      const warehouseOffer = offer as WarehouseOffer;
      const suggestedWarehouseRate = Math.round(baseRate * 0.85);
      
      reason = `${warehouseOffer.warehouseType} warehouse space in ${warehouseOffer.location.city} currently has 15% vacancy rate. Negotiate for a 15% discount for longer-term commitments.`;
      
      return {
        suggestedRate: suggestedWarehouseRate,
        confidence: confidenceLevel,
        reasoning: reason
      };
      
    case 'service':
      confidenceLevel = 'low';
      const serviceOffer = offer as ServiceOffer;
      const suggestedServiceRate = Math.round(baseRate * 0.90);
      
      reason = `The market for ${serviceOffer.serviceType} services is competitive but hard to predict. Suggest starting with a 10% discount request with room for negotiation.`;
      
      return {
        suggestedRate: suggestedServiceRate,
        confidence: confidenceLevel,
        reasoning: reason
      };
      
    default:
      confidenceLevel = 'medium';
      return {
        suggestedRate: Math.round(baseRate * 0.95),
        confidence: confidenceLevel,
        reasoning: "Based on general market conditions, a 5% discount from the listed rate would be a reasonable starting point."
      };
  }
};

// Analytics
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  await delay(800);
  return { ...mockAnalytics };
}; 