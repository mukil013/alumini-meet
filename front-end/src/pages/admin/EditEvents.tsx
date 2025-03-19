import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/EditEvent.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventImg: null, // This will hold the File object for new uploads
    eventTitle: "",
    eventDescription: "",
    applyLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/event/getAllEvents"
      );
      console.log(response.data.events);
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddDialog = () => {
    setCurrentEvent(null);
    setFormData({
      eventImg: null,
      eventTitle: "",
      eventDescription: "",
      applyLink: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setCurrentEvent(event);
    setFormData({
      eventImg: null, // Reset eventImg for editing (file input won't accept strings)
      eventTitle: event.eventTitle,
      eventDescription: event.eventDescription,
      applyLink: event.applyLink,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      if (formData.eventImg instanceof File) {
        formDataToSend.append("eventImg", formData.eventImg); // Append new image if uploaded
      }
      formDataToSend.append("eventTitle", formData.eventTitle);
      formDataToSend.append("eventDescription", formData.eventDescription);
      formDataToSend.append("applyLink", formData.applyLink);

      if (!currentEvent && !formData.eventImg) {
        setError("Event image is required.");
        return;
      }

      if (currentEvent) {
        await axios.put(
          `http://localhost:8000/event/editEvent/${currentEvent._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Event updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/event/addEvents",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Event added successfully!");
      }

      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      setError("");

      try {
        await axios.delete(`http://localhost:8000/event/deleteEvent/${id}`);
        alert("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        setError("Failed to delete event. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-container">
      <button className="floating-add-btn" onClick={openAddDialog}>
        +
      </button>

      <ul id="events-body">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <li key={event._id}>
              <div className="event-item">
                <img
                  src={`data:image/jpeg;base64,${event.eventImg.toString(
                    "base64"
                  )}`}
                  alt="event image"
                />
                <div className="event-title">{event.eventTitle}</div>
                <div className="event-description">
                  {event.eventDescription}
                </div>
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
                  <button onClick={() => handleDelete(event._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <dialog className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>{currentEvent ? "Edit Event" : "Add Event"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Image</label>
                <input
                  required
                  type="file"
                  name="eventImg"
                  accept=".jpg,.png,.jpeg"
                  onChange={(e) =>
                    setFormData({ ...formData, eventImg: e.target.files[0] })
                  }
                />
                {/* Display current image if editing */}
                {currentEvent && (
                  <img
                    src={currentEvent.eventImg}
                    alt="current event"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </div>
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
              <div className="btn-grp">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </div>
  );
}
