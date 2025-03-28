import { useState } from "react";
import {
  UserPlusIcon,
  EnvelopeIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// Mock data for pending invites
interface PendingInvite {
  id: string;
  email: string;
  role: 'carrier' | 'shipper' | 'broker' | 'warehouse';
  status: 'pending' | 'accepted' | 'expired';
  sentAt: string;
  expiresAt: string;
}

interface InvitesTabProps {
  teamId: string;
  isActive: boolean;
  onInvite: () => void;
}

export default function InvitesTab({
  teamId,
  isActive,
  onInvite,
}: InvitesTabProps) {
  const [invites, setInvites] = useState<PendingInvite[]>([
    {
      id: 'inv-1',
      email: 'john.smith@company.com',
      role: 'carrier',
      status: 'pending',
      sentAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      expiresAt: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    },
    {
      id: 'inv-2',
      email: 'sarah.parker@logistics.com',
      role: 'broker',
      status: 'accepted',
      sentAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      expiresAt: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
    },
    {
      id: 'inv-3',
      email: 'mike.johnson@transport.com',
      role: 'shipper',
      status: 'pending',
      sentAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      expiresAt: new Date(Date.now() + 648000000).toISOString(), // 7.5 days from now
    }
  ]);
  
  const [isResending, setIsResending] = useState<Record<string, boolean>>({});
  const [isCancelling, setIsCancelling] = useState<Record<string, boolean>>({});
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleResendInvite = async (inviteId: string) => {
    setIsResending(prev => ({ ...prev, [inviteId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would call your API to resend the invite
    
    // Update the invite's expiration date
    setInvites(invites.map(invite => {
      if (invite.id === inviteId) {
        const newExpiresAt = new Date(Date.now() + 604800000).toISOString(); // 7 days from now
        return { ...invite, expiresAt: newExpiresAt };
      }
      return invite;
    }));
    
    setIsResending(prev => ({ ...prev, [inviteId]: false }));
  };
  
  const handleCancelInvite = async (inviteId: string) => {
    setIsCancelling(prev => ({ ...prev, [inviteId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would call your API to cancel the invite
    
    // Remove the invite from the list
    setInvites(invites.filter(invite => invite.id !== inviteId));
    
    setIsCancelling(prev => ({ ...prev, [inviteId]: false }));
  };
  
  const getStatusBadge = (status: 'pending' | 'accepted' | 'expired') => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'accepted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Accepted</span>;
      case 'expired':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Expired</span>;
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Team Invites</h2>
        <button
          onClick={onInvite}
          disabled={!isActive}
          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isActive
              ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <UserPlusIcon className="h-4 w-4 mr-1" />
          Invite People
        </button>
      </div>
      
      {invites.length === 0 ? (
        <div className="p-6 text-center">
          <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending invites</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by inviting team members.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onInvite}
              disabled={!isActive}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isActive
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Invite Team Members
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {invites.map((invite) => (
            <div key={invite.id} className="p-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {invite.email}
                      </p>
                      <div className="ml-2">
                        {getStatusBadge(invite.status)}
                      </div>
                    </div>
                    <div className="mt-1 flex">
                      <p className="text-sm text-gray-500 truncate capitalize">
                        <span className="font-medium">Role:</span> {invite.role}
                      </p>
                      <p className="ml-4 text-sm text-gray-500 truncate">
                        <span className="font-medium">Sent:</span> {formatDate(invite.sentAt)}
                      </p>
                      {invite.status === 'pending' && (
                        <p className="ml-4 text-sm text-gray-500 truncate">
                          <span className="font-medium">Expires:</span> {formatDate(invite.expiresAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {invite.status === 'pending' && isActive && (
                  <div className="flex-shrink-0 flex">
                    <button
                      type="button"
                      onClick={() => handleResendInvite(invite.id)}
                      disabled={isResending[invite.id]}
                      className="inline-flex items-center ml-3 px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isResending[invite.id] ? (
                        <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <ArrowPathIcon className="h-3 w-3 mr-1" />
                      )}
                      Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelInvite(invite.id)}
                      disabled={isCancelling[invite.id]}
                      className="inline-flex items-center ml-3 px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {isCancelling[invite.id] ? (
                        <span className="h-3 w-3 mr-1 animate-pulse">...</span>
                      ) : (
                        <XMarkIcon className="h-3 w-3 mr-1" />
                      )}
                      Cancel
                    </button>
                  </div>
                )}
                {invite.status === 'accepted' && (
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 