import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Events() {
  const [events, setEvents] = useState([]); // State to store events
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [currentEvent, setCurrentEvent] = useState(null); // State to store the event being edited
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDescription: '',
    applyLink: '',
  });
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(''); // State for error handling

  // Fetch all events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/event/getAllEvents');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open dialog for adding a new event
  const openAddDialog = () => {
    setCurrentEvent(null); // Reset current event
    setFormData({
      eventTitle: '',
      eventDescription: '',
      applyLink: '',
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing an event
  const openEditDialog = (event) => {
    setCurrentEvent(event); // Set the current event being edited
    setFormData({
      eventTitle: event.eventTitle,
      eventDescription: event.eventDescription,
      applyLink: event.applyLink,
    });
    setIsDialogOpen(true);
  };

  // Handle form submission (add/edit event)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (currentEvent) {
        // Update existing event
        await axios.put(
          `http://localhost:8000/event/editEvents/${currentEvent._id}`,
          formData
        );
        alert('Event updated successfully!');
      } else {
        // Add new event
        await axios.post('http://localhost:8000/event/addEvents', formData);
        alert('Event added successfully!');
      }
      setIsDialogOpen(false); // Close the dialog
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      setError('');

      try {
        await axios.delete(`http://localhost:8000/event/deleteEvent/${id}`);
        alert('Event deleted successfully!');
        fetchEvents(); // Refresh the events list
      } catch (error) {
        console.error('Error deleting event:', error);
        setError('Failed to delete event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-container">
      {/* Floating Add Button */}
      <button className="floating-add-btn" onClick={openAddDialog}>
        +
      </button>

      {/* Events List */}
      <ul id="events-body">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <li key={event._id}>
              <div className="events-container">
                <img src="https://placehold.co/600x400" alt={event.eventTitle} />
                <div className="events-title">{event.eventTitle}</div>
                <div className="events-description">{event.eventDescription}</div>
                <a
                  href={event.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register-btn-events"
                >
                  Register
                </a>
                <div className="event-actions">
                  <button onClick={() => openEditDialog(event)}>Edit</button>
                  <button onClick={() => handleDelete(event._id)}>Delete</button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Dialog for Adding/Editing Events */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <dialog className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>{currentEvent ? 'Edit Event' : 'Add Event'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Description</label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apply Link</label>
                <input
                  type="url"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
            </form>
          </dialog>
        </div>
      )}
    </div>
  );
}