interface TeamStatusBadgeProps {
  status: 'active' | 'completed' | 'cancelled' | 'finalized';
  className?: string;
}

export default function TeamStatusBadge({
  status,
  className = '',
}: TeamStatusBadgeProps) {
  let statusClasses;
  
  switch (status) {
    case 'active':
      statusClasses = 'bg-green-100 text-green-800';
      break;
    case 'completed':
      statusClasses = 'bg-blue-100 text-blue-800';
      break;
    case 'finalized':
      statusClasses = 'bg-purple-100 text-purple-800';
      break;
    case 'cancelled':
      statusClasses = 'bg-red-100 text-red-800';
      break;
    default:
      statusClasses = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 