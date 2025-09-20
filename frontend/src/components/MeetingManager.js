import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, MessageCircle, CheckCircle, XCircle, AlertCircle, Eye, MoreVertical } from 'lucide-react';

const MeetingManager = ({ userId, userType }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/meetings/user/${userId}?page=1&page_size=50`);
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/meetings/stats/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching meeting stats:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchMeetings();
    fetchStats();
  }, [fetchMeetings, fetchStats]);

  const updateMeetingStatus = async (meetingId, status, selectedTimeSlot = null) => {
    try {
      const response = await fetch(`http://localhost:8000/api/meetings/${meetingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          selected_time_slot: selectedTimeSlot
        })
      });

      if (response.ok) {
        await fetchMeetings();
        await fetchStats();
        setShowDetails(false);
        setSelectedMeeting(null);
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (filter === 'all') return true;
    return meeting.status === filter;
  });

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Meetings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_meetings || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.pending_requests || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.confirmed_meetings || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-green-600">{stats.completed_meetings || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'completed', label: 'Completed' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any meetings yet. Start by requesting a meeting with someone!"
                : `No ${filter} meetings found.`
              }
            </p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div key={meeting.meeting_id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(meeting.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {meeting.meeting_type === 'startup_to_investor' ? 'Startup → Investor' : 'Investor → Startup'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {meeting.requester_id === userId ? 'You requested' : 'Requested by'} 
                        {meeting.requester_id === userId ? ' this meeting' : ' this meeting'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {meeting.preferred_time_slots.length} time slot{meeting.preferred_time_slots.length !== 1 ? 's' : ''} proposed
                      </span>
                    </div>
                    
                    {meeting.message && (
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="text-sm text-gray-600 line-clamp-2">{meeting.message}</span>
                      </div>
                    )}
                    
                    {meeting.selected_time_slot && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Confirmed Time:</p>
                        <p className="text-sm text-blue-700">
                          {formatDateTime(meeting.selected_time_slot.start_time)} - {formatDateTime(meeting.selected_time_slot.end_time)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setShowDetails(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {meeting.status === 'pending' && meeting.recipient_id === userId && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateMeetingStatus(meeting.meeting_id, 'accepted')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateMeetingStatus(meeting.meeting_id, 'rejected')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Meeting Details Modal */}
      {showDetails && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedMeeting.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMeeting.status)}`}>
                    {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Preferred Time Slots:</h4>
                  <div className="space-y-2">
                    {selectedMeeting.preferred_time_slots.map((slot, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {formatDateTime(slot.start_time)} - {formatDateTime(slot.end_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedMeeting.message && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedMeeting.message}
                    </p>
                  </div>
                )}
                
                {selectedMeeting.status === 'pending' && selectedMeeting.recipient_id === userId && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => updateMeetingStatus(selectedMeeting.meeting_id, 'accepted')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Meeting
                    </button>
                    <button
                      onClick={() => updateMeetingStatus(selectedMeeting.meeting_id, 'rejected')}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Meeting
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingManager;
