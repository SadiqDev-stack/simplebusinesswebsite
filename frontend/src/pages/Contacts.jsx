import { useEffect, useState } from 'react';
import { Button, Input, Select } from '../components/FormComponents';
import { ContactCard } from '../components/ContactCard';
import { Modal } from '../components/Modal';
import { contactAPI, assistantAPI } from '../services/api';
import { Search, ChevronLeft, ChevronRight, MessageSquare, Send, MessageCircle } from 'lucide-react';
import { truncateText } from '../utils/helpers';

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterFlag, setFilterFlag] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchContacts();
  }, [page, search, filterFlag, filterPriority]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getHistory(page, ITEMS_PER_PAGE, {
        search,
        flag: filterFlag,
        priority: filterPriority,
      });
      if (response.data.success) {
        setContacts(response.data.contacts || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      fetchContacts();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleToggleFlag = async (id, currentFlag) => {
    const newFlag = currentFlag === 'important' ? 'default' : 'important';
    try {
      await contactAPI.updateFlag(id, newFlag);
      fetchContacts();
    } catch (error) {
      console.error('Error updating flag:', error);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    
    setAiLoading(true);
    setAiResponse('');
    try {
      const response = await assistantAPI.getResponse(aiQuestion, selectedContact);
      if (response.data.success) {
        setAiResponse(response.data.message);
      }
    } catch (error) {
      setAiResponse('Error getting AI response. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (selectedContact?.phone) {
      window.open(`https://wa.me/${selectedContact.phone}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Manage and respond to all your contact messages</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search by email, subject..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select
            options={[
              { value: '', label: 'All Flags' },
              { value: 'important', label: 'Important' },
              { value: 'followup', label: 'Follow-up' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            value={filterFlag}
            onChange={(e) => {
              setFilterFlag(e.target.value);
              setPage(1);
            }}
          />

          <Select
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setPage(1);
            }}
          />

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setFilterFlag('');
              setFilterPriority('');
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading messages...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 bg-black rounded-lg border border-gray-200">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No messages found. Try adjusting your filters.</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                onRead={() => handleMarkAsRead(contact._id)}
                onFlag={() => handleToggleFlag(contact._id, contact.flag)}
                onView={() => handleViewContact(contact)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={18} className="mr-2" />
              Previous
            </Button>

            <span className="text-gray-600 text-sm">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedContact(null);
          setAiQuestion('');
          setAiResponse('');
        }}
        title="Message Details"
        maxWidth="max-w-2xl"
      >
        {selectedContact && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">From</p>
                <p className="text-lg font-semibold text-gray-900">{selectedContact.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{selectedContact.phone}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleWhatsApp}
                  className="mt-2 text-green-600 hover:text-green-700"
                >
                  <MessageCircle size={16} className="mr-1" />
                  Open WhatsApp
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Subject</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedContact.subject}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded blackspace-pre-wrap">{selectedContact.message}</p>
            </div>

            {/* AI Assistant Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={18} />
                AI Assistant
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ask AI for suggestions
                  </label>
                  <textarea
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g., How should I respond to this inquiry?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleAskAI}
                  disabled={!aiQuestion.trim() || aiLoading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {aiLoading ? 'Thinking...' : 'Get AI Suggestion'}
                </Button>

                {aiResponse && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">AI Suggestion:</p>
                    <p className="text-blue-800 text-sm">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button onClick={handleWhatsApp} className="flex items-center gap-2">
                <MessageCircle size={16} />
                Reply on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
