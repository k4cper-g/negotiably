export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateString: string, compact: boolean = false): string => {
  const date = new Date(dateString);
  
  if (compact) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const formatDistance = (miles: number): string => {
  return `${miles.toLocaleString()} mi`;
};

export const formatWeight = (weight: number): string => {
  return `${(weight / 1000).toFixed(1)}k lbs`;
};

export const formatRatePerMile = (rate: number, miles: number): string => {
  const ratePerMile = rate / miles;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(ratePerMile);
};

export const getLocationString = (city: string, state: string): string => {
  return `${city}, ${state}`;
};

export const getOriginDestinationString = (
  originCity: string, 
  originState: string, 
  destinationCity: string, 
  destinationState: string
): string => {
  return `${originCity}, ${originState} → ${destinationCity}, ${destinationState}`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'text-green-600 bg-green-100';
    case 'negotiating':
      return 'text-blue-600 bg-blue-100';
    case 'booked':
      return 'text-purple-600 bg-purple-100';
    case 'completed':
      return 'text-gray-600 bg-gray-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'finalized':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'negotiating':
      return 'Negotiating';
    case 'booked':
      return 'Booked';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'finalized':
      return 'Finalized';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const getNegotiationStatusColor = (
  status: 'active' | 'accepted' | 'rejected' | 'expired'
): string => {
  switch (status) {
    case 'active':
      return 'text-blue-600 bg-blue-100';
    case 'accepted':
      return 'text-green-600 bg-green-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    case 'expired':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getNegotiationStatusText = (
  status: 'active' | 'accepted' | 'rejected' | 'expired'
): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    case 'expired':
      return 'Expired';
    default:
      return status;
  }
}; 