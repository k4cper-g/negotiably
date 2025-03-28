import { delay } from '@/utils/helpers';
import { TeamCollaboration, TeamCollaborationFile, TeamCollaborationMessage, Offer, OfferStatus } from '@/types/marketplace';
import { mockOffers } from './mockData';

// Mock team collaborations data store
const mockTeamCollaborations: TeamCollaboration[] = [];
const mockTeamFiles: TeamCollaborationFile[] = [];
const mockTeamMessages: TeamCollaborationMessage[] = [];

/**
 * Creates a new team collaboration space for an accepted offer
 */
export const createTeamCollaboration = async (
  offer: Offer,
  buyerUserId: string,
  buyerName: string,
  buyerRole: 'carrier' | 'shipper' | 'broker' | 'warehouse'
): Promise<TeamCollaboration> => {
  await delay(500);
  
  const now = new Date().toISOString();
  const teamId = `team-${Date.now()}`;
  
  // Create the team
  const newTeam: TeamCollaboration = {
    id: teamId,
    offerId: offer.id,
    name: `Collaboration: ${offer.title}`,
    participants: [
      {
        userId: offer.userId, // Seller/creator of the offer
        name: offer.contactInfo.name,
        role: 'carrier', // Assuming the primary role for forwarders is carrier
        joinedAt: now
      },
      {
        userId: buyerUserId, 
        name: buyerName,
        role: buyerRole,
        joinedAt: now
      }
    ],
    messages: [],
    files: [],
    createdAt: now,
    updatedAt: now,
    status: 'active'
  };
  
  // Add welcome message
  const welcomeMessage: TeamCollaborationMessage = {
    id: `msg-${Date.now()}`,
    teamId: teamId,
    userId: 'system',
    userName: 'System',
    content: `Welcome to the collaboration space for "${offer.title}". You can share files, documents, and coordinate details here.`,
    createdAt: now
  };
  
  newTeam.messages.push(welcomeMessage);
  mockTeamMessages.push(welcomeMessage);
  mockTeamCollaborations.push(newTeam);
  
  return { ...newTeam };
};

/**
 * Gets a team collaboration by ID
 */
export const getTeamById = async (teamId: string): Promise<TeamCollaboration | null> => {
  await delay(200);
  
  const team = mockTeamCollaborations.find(t => t.id === teamId);
  if (!team) return null;
  
  return { ...team };
};

/**
 * Gets a team collaboration by offer ID
 */
export const getTeamByOfferId = async (offerId: string): Promise<TeamCollaboration | null> => {
  await delay(200);
  
  const team = mockTeamCollaborations.find(t => t.offerId === offerId);
  if (!team) return null;
  
  return { ...team };
};

/**
 * Adds a message to a team collaboration
 */
export const addTeamMessage = async (
  teamId: string,
  userId: string,
  userName: string,
  content: string,
  attachments?: TeamCollaborationFile[]
): Promise<TeamCollaborationMessage> => {
  await delay(300);
  
  const team = mockTeamCollaborations.find(t => t.id === teamId);
  if (!team) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  const now = new Date().toISOString();
  const newMessage: TeamCollaborationMessage = {
    id: `msg-${Date.now()}`,
    teamId,
    userId,
    userName,
    content,
    createdAt: now,
    attachments
  };
  
  team.messages.push(newMessage);
  mockTeamMessages.push(newMessage);
  team.updatedAt = now;
  
  return { ...newMessage };
};

/**
 * Uploads a file to a team collaboration
 */
export const uploadTeamFile = async (
  teamId: string,
  userId: string,
  name: string,
  fileType: 'document' | 'transport' | 'invoice' | 'customs' | 'other',
  size: number,
  description?: string
): Promise<TeamCollaborationFile> => {
  await delay(700); // Simulate upload time
  
  const team = mockTeamCollaborations.find(t => t.id === teamId);
  if (!team) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  const now = new Date().toISOString();
  const fileId = `file-${Date.now()}`;
  
  // Mock URL
  const url = `https://example.com/files/${fileId}`;
  
  const newFile: TeamCollaborationFile = {
    id: fileId,
    teamId,
    name,
    fileType,
    url,
    uploadedBy: userId,
    uploadedAt: now,
    size,
    description
  };
  
  team.files.push(newFile);
  mockTeamFiles.push(newFile);
  team.updatedAt = now;
  
  return { ...newFile };
};

/**
 * Gets a list of teams that a user is part of
 */
export const getUserTeams = async (userId: string): Promise<TeamCollaboration[]> => {
  await delay(300);
  
  const teams = mockTeamCollaborations.filter(team => 
    team.participants.some(p => p.userId === userId)
  );
  
  return teams.map(team => ({ ...team }));
};

/**
 * Finalizes a team collaboration and updates the related offer status
 */
export const finalizeTeam = async (
  teamId: string,
  userId: string,
  reason: string
): Promise<TeamCollaboration> => {
  await delay(600);
  
  const team = mockTeamCollaborations.find(t => t.id === teamId);
  if (!team) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  if (team.status !== 'active') {
    throw new Error(`Team is already ${team.status}`);
  }
  
  const now = new Date().toISOString();
  
  // Update team status
  team.status = 'finalized';
  team.finalizedAt = now;
  team.finalizedBy = userId;
  team.finalizedReason = reason;
  team.updatedAt = now;
  
  // Add system message about finalization
  const finalizationMessage: TeamCollaborationMessage = {
    id: `msg-${Date.now()}`,
    teamId: teamId,
    userId: 'system',
    userName: 'System',
    content: `This collaboration has been finalized by ${team.participants.find(p => p.userId === userId)?.name || 'a participant'}. Reason: ${reason}`,
    createdAt: now
  };
  
  team.messages.push(finalizationMessage);
  mockTeamMessages.push(finalizationMessage);
  
  // Update related offer status
  const offer = mockOffers.find(o => o.id === team.offerId);
  if (offer) {
    offer.status = 'finalized' as OfferStatus;
    offer.updatedAt = now;
  }
  
  return { ...team };
};

/**
 * Sends invites to users to join a team
 */
export const sendTeamInvites = async (
  teamId: string,
  inviterUserId: string,
  emails: string[],
  role: 'carrier' | 'shipper' | 'broker' | 'warehouse',
  message: string
): Promise<{success: boolean, invitedEmails: string[]}> => {
  await delay(800); // Simulate API call
  
  const team = mockTeamCollaborations.find(t => t.id === teamId);
  if (!team) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  const inviter = team.participants.find(p => p.userId === inviterUserId);
  if (!inviter) {
    throw new Error(`Inviter is not a participant of this team`);
  }
  
  // In a real implementation, this would:
  // 1. Create invite records in the database
  // 2. Send emails to each recipient with an invite link
  // 3. Track status of invites
  
  // For this mock, we'll just log the invites
  console.log(`Invites sent for team ${teamId} by ${inviterUserId}:`);
  emails.forEach(email => {
    console.log(`- ${email} (Role: ${role})`);
  });
  console.log(`Message: ${message}`);
  
  // Add a system message to the team chat about the invites
  const now = new Date().toISOString();
  const systemMessage: TeamCollaborationMessage = {
    id: `msg-${Date.now()}`,
    teamId,
    userId: 'system',
    userName: 'System',
    content: `${inviter.name} invited ${emails.length} people to join this team.`,
    createdAt: now
  };
  
  team.messages.push(systemMessage);
  mockTeamMessages.push(systemMessage);
  
  return {
    success: true,
    invitedEmails: emails
  };
}; 