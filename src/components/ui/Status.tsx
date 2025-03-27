import { 
  getStatusColor,
  getStatusText,
  getNegotiationStatusColor,
  getNegotiationStatusText
} from "@/utils/formatters";
import { OfferStatus } from "@/types/marketplace";

interface LoadStatusProps {
  status: OfferStatus;
  className?: string;
}

export function LoadStatus({ status, className = '' }: LoadStatusProps) {
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}
    >
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