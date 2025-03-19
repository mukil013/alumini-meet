import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/Events.css";
import loader from "../assets/Iphone-spinner-2.gif";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/event/getAllEvents"
      );
      setEvents(response.data.events);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="loading">
        <img src={loader} alt="Loading..." />
      </div>
    );
  if (error) return <div className="error">{error}</div>;

  const openDescriptionDialog = (description: string) => {
    setSelectedDescription(description);
    setIsDialogOpen(true);
  };

  const closeDescriptionDialog = () => {
    setIsDialogOpen(false);
    setSelectedDescription("");
  };

  const logger = (any) => {
    console.log(any)
  }

  return (
    <>
      <ul id="events-body">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <li key={event._id} className="event-container">
              <img src={event.eventImg} alt="event picture" />
              <div className="event-details">
                <div className="event-title">{event.eventTitle}</div>
                <div
                  className="event-description"
                  onClick={() => openDescriptionDialog(event.eventDescription)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {event.eventDescription.slice(0, 50)}...
                </div>
              </div>
              <button
                onClick={() => window.open(event.applyLink, "_blank")}
                className="register-btn-events"
              >
                Register
              </button>
            </li>
          ))
        )}
      </ul>

      {isDialogOpen && (
        <div className="dialog-overlay" onClick={closeDescriptionDialog}>
          <dialog className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>Event Description</h2>
            <p>{selectedDescription}</p>
            <button onClick={closeDescriptionDialog}>Close</button>
          </dialog>
        </div>
      )}
    </>
  );
}
