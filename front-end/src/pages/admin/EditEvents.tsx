import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditEvent() {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate(); // For navigation after deletion
  const [event, setEvent] = useState({
    eventTitle: '',
    eventDescription: '',
    applyLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the event details on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/event/getAllEvents`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to fetch event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  // Handle form submission (update event)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:8000/event/editEvent/${id}`,
        event
      );
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      setError('');

      try {
        await axios.delete(`http://localhost:8000/event/deleteEvent/${id}`);
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        setError('Failed to delete event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            name="eventTitle"
            value={event.eventTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Description</label>
          <textarea
            name="eventDescription"
            value={event.eventDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apply Link</label>
          <input
            type="url"
            name="applyLink"
            value={event.applyLink}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Event'}
        </button>
        <button type="button" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete Event'}
        </button>
      </form>
    </div>
  );
}