import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Placement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your API endpoint or link
    const apiUrl = "https://api.example.com/data";

    axios.get(apiUrl)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul id="events-body">
      {data && data.map((item) => (
        <li key={item.id}>
          <div className="events-container">
            <img src={item.imageLink} alt="Company Image" />
            <div className="events-title">
              {item.title}
            </div>
            <div className="events-description">
              {item.description}
            </div>
            <a href={item.link}><button className="register-btn-events">Register</button></a>
          </div>
        </li>
      ))}
    </ul>
  );
}