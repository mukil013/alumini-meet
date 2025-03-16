import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');

  // Fetch all events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/event/getAllEvents');
        console.log(response)
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <ul id="events-body">
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.foreach((event) => (
          <li key={event._id}>
            <div className="events-container">
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
            </div>
          </li>
        ))
      )}
    </ul>
  );
}