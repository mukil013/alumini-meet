import React, { useEffect, useState } from "react";
import "./style/Profile.css";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  dept: string;
  gender: string;
  phoneNumber: number;
  skills: string[];
  bio: string;
  linkedIn: string;
  github: string;
  twitter: string;
  interests: string[];
  companyName: string;
  batch: number;
  role: string;
  userId: string;
}

export default function DefaultHome() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("User not authenticated");
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load profile"
        );
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="no-data">No user data found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src=""
          alt={`logged in as ${(user.role === 'user') ? 'student' : user.role}`}
          className="profile-img"
        />
        <h1 className="profile-name">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="email-id">{user.email}</p>
        <p className="education">
          <b>Education:</b> {user.dept}, {user.batch}
        </p>
        <div className="bio">
          <b>Bio:</b> {user.bio || "No bio available"}
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills">
            {user.skills != undefined
              ? user.skills.map((skill, index) => (
                  <div className="skill" key={index}>
                    {skill}
                  </div>
                ))
              : ""}
          </div>
        </div>

        <div className="social-links">
          <h3>Social Links</h3>
          <div className="links">
            {user.linkedIn && (
              <a
                href={user.linkedIn || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
            {user.github && (
              <a
                href={user.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
            {user.twitter && (
              <a
                href={user.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        <div className="interests-section">
          <h3>Interests</h3>
          <div className="interests">
            {user.interests != undefined
              ? user.interests.map((interest, index) => (
                  <div className="interest" key={index}>
                    {interest}
                  </div>
                ))
              : ""}
          </div>
        </div>

        {user.companyName && (
          <div className="company">
            <b>Company:</b> {user.companyName}
          </div>
        )}
      </div>
    </div>
  );
}