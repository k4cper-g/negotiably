"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TeamCollaboration, TeamCollaborationFile, TeamCollaborationMessage } from "@/types/marketplace";
import { getTeamById, addTeamMessage, uploadTeamFile, finalizeTeam, sendTeamInvites } from "@/services/teamService";
import { formatDateTime } from "@/utils/formatters";
import Link from "next/link";
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon, InformationCircleIcon, DocumentIcon, CheckCircleIcon, UserPlusIcon, UserGroupIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import FinalizeTeamModal from "@/components/teams/FinalizeTeamModal";
import InviteModal from "@/components/teams/InviteModal";
import InvitesTab from "@/components/teams/InvitesTab";
import TeamStatusBadge from "@/components/ui/TeamStatusBadge";

// Mock current user - in a real app this would come from authentication
const currentUser = {
  id: "user-123",
  name: "John Forwarder",
  role: "carrier" as const
};

export default function TeamPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [team, setTeam] = useState<TeamCollaboration | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileType, setFileType] = useState<'document' | 'transport' | 'invoice' | 'customs' | 'other'>('document');
  const [fileDescription, setFileDescription] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'collaboration' | 'invites'>('collaboration');
  
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeam();
  }, [teamId]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || !team) return;
    
    setIsSending(true);
    
    try {
      const newMessage = await addTeamMessage(
        team.id,
        currentUser.id,
        currentUser.name,
        message
      );
      
      setTeam({
        ...team,
        messages: [...team.messages, newMessage],
        updatedAt: new Date().toISOString()
      });
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || uploadingFile || !team) return;
    
    setUploadingFile(true);
    
    try {
      const newFile = await uploadTeamFile(
        team.id,
        currentUser.id,
        selectedFile.name,
        fileType,
        selectedFile.size,
        fileDescription
      );
      
      setTeam({
        ...team,
        files: [...team.files, newFile],
        updatedAt: new Date().toISOString()
      });
      
      // Reset form
      setSelectedFile(null);
      setFileDescription("");
      setShowFileUpload(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };
  
  const handleFinalizeTeam = async (reason: string) => {
    if (!team) return;
    
    try {
      const updatedTeam = await finalizeTeam(team.id, currentUser.id, reason);
      setTeam(updatedTeam);
    } catch (error) {
      console.error("Error finalizing team:", error);
      alert("Failed to finalize the team collaboration. Please try again.");
    }
  };
  
  const handleInviteTeamMembers = async (emails: string[], role: 'carrier' | 'shipper' | 'broker' | 'warehouse', message: string) => {
    if (!team) return;
    
    try {
      const result = await sendTeamInvites(
        team.id,
        currentUser.id,
        emails,
        role,
        message
      );
      
      // Update UI to show success message
      if (result.success) {
        // The system message is already added by the service
        // Just refresh the team data to show it
        const updatedTeam = await getTeamById(team.id);
        if (updatedTeam) {
          setTeam(updatedTeam);
        }
      }
      
    } catch (error) {
      console.error("Error inviting team members:", error);
      alert("Failed to invite team members. Please try again.");
    }
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <DocumentIcon className="h-5 w-5 text-blue-500" />;
      case 'transport':
        return <DocumentIcon className="h-5 w-5 text-green-500" />;
      case 'invoice':
        return <DocumentIcon className="h-5 w-5 text-yellow-500" />;
      case 'customs':
        return <DocumentIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading team space...</p>
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Not Found</h1>
          <p className="text-gray-600 mb-6">The team collaboration space you're looking for doesn't exist or you don't have access.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-500">Created {formatDateTime(team.createdAt)}</p>
              <TeamStatusBadge status={team.status} />
            </div>
          </div>
          <div className="flex space-x-3">
            <Link 
              href={`/offers/${team.offerId}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Offer Details
            </Link>
            
            {team.status === 'active' && (
              <>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlusIcon className="h-4 w-4 mr-1" />
                  Invite
                </button>
                <button
                  onClick={() => setShowFinalizeModal(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Finalize
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Finalized info banner */}
      {team.status === 'finalized' && (
        <div className="mb-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-purple-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">Collaboration Finalized</h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>This collaboration was finalized on {formatDateTime(team.finalizedAt || '')}.</p>
                {team.finalizedReason && (
                  <p className="mt-1">Reason: {team.finalizedReason}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab navigation */}
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'collaboration' | 'invites')}
          >
            <option value="collaboration">Collaboration</option>
            <option value="invites">Team Invites</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('collaboration')}
                className={`${
                  activeTab === 'collaboration'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <UserGroupIcon
                  className={`${
                    activeTab === 'collaboration' ? 'text-indigo-500' : 'text-gray-400'
                  } -ml-0.5 mr-2 h-5 w-5`}
                  aria-hidden="true"
                />
                Collaboration
              </button>
              <button
                onClick={() => setActiveTab('invites')}
                className={`${
                  activeTab === 'invites'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <EnvelopeIcon
                  className={`${
                    activeTab === 'invites' ? 'text-indigo-500' : 'text-gray-400'
                  } -ml-0.5 mr-2 h-5 w-5`}
                  aria-hidden="true"
                />
                Team Invites
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {activeTab === 'collaboration' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Chat */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden h-[60vh] flex flex-col">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Team Chat</h2>
                  <p className="text-sm text-gray-500">
                    Share updates and coordinate with your team
                  </p>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  {team.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <InformationCircleIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {team.messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`rounded-lg p-4 ${
                            message.userId === currentUser.id
                              ? 'bg-blue-50 ml-6'
                              : message.userId === 'system'
                                ? 'bg-yellow-50 border border-yellow-200'
                                : 'bg-gray-50 mr-6'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                message.userId === 'system'
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : message.userId === currentUser.id
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-gray-200 text-gray-800'
                              }`}>
                                <span className="text-sm font-medium">
                                  {message.userId === 'system'
                                    ? 'S'
                                    : message.userName.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-2">
                                <p className="text-sm font-medium">
                                  {message.userName}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-800 whitespace-pre-line">
                              {message.content}
                            </p>
                          </div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 border-t border-gray-200 pt-3">
                              <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                              <div className="space-y-2">
                                {message.attachments.map((file) => (
                                  <div 
                                    key={file.id}
                                    className="flex items-center p-2 rounded border border-gray-200 bg-white"
                                  >
                                    {getFileIcon(file.fileType)}
                                    <div className="ml-2 flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                      </p>
                                    </div>
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      View
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <textarea
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="ml-3">
                        <button
                          type="submit"
                          disabled={!message.trim() || isSending}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {isSending ? (
                            <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full" />
                          ) : (
                            <PaperAirplaneIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Files and Participants */}
            <div className="space-y-6">
              {/* Files Section */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Files</h2>
                  <button
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {showFileUpload ? "Cancel" : "Upload File"}
                  </button>
                </div>
                
                {showFileUpload && (
                  <div className="p-4 border-b border-gray-200">
                    <form onSubmit={handleFileUpload}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                            Select File
                          </label>
                          <input
                            type="file"
                            id="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="file-type" className="block text-sm font-medium text-gray-700 mb-1">
                            File Type
                          </label>
                          <select
                            id="file-type"
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value as any)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value="document">Document</option>
                            <option value="transport">Transport Document</option>
                            <option value="invoice">Invoice</option>
                            <option value="customs">Customs Document</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                          </label>
                          <textarea
                            id="description"
                            rows={2}
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Describe the contents of this file..."
                          />
                        </div>
                        
                        <div>
                          <button
                            type="submit"
                            disabled={!selectedFile || uploadingFile}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {uploadingFile ? "Uploading..." : "Upload File"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="p-4 max-h-[30vh] overflow-y-auto">
                  {team.files.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No files have been shared yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {team.files.map((file) => (
                        <div 
                          key={file.id}
                          className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          {getFileIcon(file.fileType)}
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            {file.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {file.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              Uploaded {formatDateTime(file.uploadedAt)}
                            </p>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Participants Section */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Participants</h2>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-gray-200">
                    {team.participants.map((participant) => (
                      <li key={participant.userId} className="py-3 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {participant.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{participant.role}</p>
                        </div>
                        {participant.userId === currentUser.id && (
                          <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            You
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <InvitesTab 
          teamId={team.id}
          isActive={team.status === 'active'}
          onInvite={() => setShowInviteModal(true)}
        />
      )}
      
      {/* Finalize Modal */}
      <FinalizeTeamModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleFinalizeTeam}
      />
      
      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteTeamMembers}
        teamName={team.name}
      />
    </div>
  );
} 