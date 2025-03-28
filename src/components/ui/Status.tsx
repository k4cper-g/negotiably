import { 
  getStatusColor,
  getStatusText,
  getNegotiationStatusColor,
  getNegotiationStatusText
} from "@/utils/formatters";
import { OfferStatus } from "@/types/marketplace";

interface LoadStatusProps {
  status: 'available' | 'negotiating' | 'booked' | 'completed' | 'cancelled' | 'finalized';
  className?: string;
}

export function LoadStatus({ status, className = '' }: LoadStatusProps) {
  let statusColor;
  
  switch (status) {
    case 'available':
      statusColor = 'bg-green-100 text-green-800';
      break;
    case 'negotiating':
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case 'booked':
      statusColor = 'bg-yellow-100 text-yellow-800';
      break;
    case 'completed':
      statusColor = 'bg-gray-100 text-gray-800';
      break;
    case 'cancelled':
      statusColor = 'bg-red-100 text-red-800';
      break;
    case 'finalized':
      statusColor = 'bg-purple-100 text-purple-800';
      break;
    default:
      statusColor = 'bg-gray-100 text-gray-800';
  }
  
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}>
      {statusText}
    </span>
  );
}

interface NegotiationStatusProps {
  status: 'active' | 'accepted' | 'rejected' | 'expired';
  className?: string;
}

export function NegotiationStatus({ status, className = '' }: NegotiationStatusProps) {
  const statusColor = getNegotiationStatusColor(status);
  const statusText = getNegotiationStatusText(status);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}
    >
      {statusText}
    </span>
  );
} 