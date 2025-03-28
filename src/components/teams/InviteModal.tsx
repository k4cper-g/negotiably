import { useState } from "react";
import { XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[], role: 'carrier' | 'shipper' | 'broker' | 'warehouse', message: string) => Promise<void>;
  teamName: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  onInvite,
  teamName
}: InviteModalProps) {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<'carrier' | 'shipper' | 'broker' | 'warehouse'>('carrier');
  const [message, setMessage] = useState(`I'd like to invite you to collaborate on ${teamName}.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emails.trim() || isSubmitting) return;
    
    const emailsList = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    if (emailsList.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await onInvite(emailsList, role, message);
      // Reset form
      setEmails("");
      setMessage(`I'd like to invite you to collaborate on ${teamName}.`);
      onClose();
    } catch (error) {
      console.error("Error sending invites:", error);
      alert("Failed to send invites. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div 
          className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <UserPlusIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                Invite Team Members
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Invite colleagues to collaborate with you on this transport arrangement.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="emails"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Addresses <span className="text-gray-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  id="emails"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="email@example.com, another@example.com"
                  required
                />
              </div>
              
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="carrier">Carrier</option>
                  <option value="shipper">Shipper</option>
                  <option value="broker">Broker</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
              
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Personal Message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!emails.trim() || isSubmitting}
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm"
              >
                {isSubmitting ? "Sending Invites..." : "Send Invites"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 