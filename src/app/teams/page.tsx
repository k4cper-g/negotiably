"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserTeams } from "@/services/teamService";
import { TeamCollaboration } from "@/types/marketplace";
import Link from "next/link";
import { formatDateTime } from "@/utils/formatters";
import TeamStatusBadge from "@/components/ui/TeamStatusBadge";
import { UserGroupIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Mock current user - in a real app this would come from authentication
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  role: 'carrier'
};

// Helper function to get teams (using the existing getUserTeams function)
const getTeams = async () => {
  return getUserTeams(currentUser.id);
};

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamCollaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'finalized'>('all');
  const [hasInvites, setHasInvites] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await getTeams();
        setTeams(teams);
        // Check if there are any pending invites (mock functionality)
        setHasInvites(teams.length > 2);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team => {
    if (statusFilter === 'all') return true;
    return team.status === statusFilter;
  });

  const handleStatusFilterChange = (status: 'all' | 'active' | 'finalized') => {
    setStatusFilter(status);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team collaborations
          </p>
        </div>
      </div>

      {/* Filters and tab navigation */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => handleStatusFilterChange('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => handleStatusFilterChange('active')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilterChange('finalized')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'finalized'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Finalized
            </button>
          </div>

          {hasInvites && (
            <Link
              href="/teams?tab=invites"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              Pending Invites
              <span className="ml-1.5 py-0.5 px-2 text-xs font-medium rounded-full bg-indigo-100">
                3
              </span>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="py-12 text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No teams found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter === 'all' 
              ? "You haven't joined any teams yet."
              : statusFilter === 'active'
                ? "You don't have any active teams."
                : "You don't have any finalized teams."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Link 
              key={team.id} 
              href={`/teams/${team.id}`}
              className="block bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-medium text-gray-900 mb-1">{team.name}</h2>
                  <TeamStatusBadge status={team.status} />
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {`Team collaboration for offer #${team.offerId.slice(0, 8)}`}
                </p>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Participants</p>
                      <p className="font-medium">{team.participants.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Messages</p>
                      <p className="font-medium">{team.messages.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Files</p>
                      <p className="font-medium">{team.files.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  {team.status === 'finalized' ? (
                    <p>Finalized: {formatDateTime(team.finalizedAt || '', true)}</p>
                  ) : (
                    <p>Created: {formatDateTime(team.createdAt, true)}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 