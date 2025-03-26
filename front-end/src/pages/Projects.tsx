import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import "./style/Projects.css";

export default function Projects() {
  const [tab, setTab] = useState("Explore");
  const { role, userId } = JSON.parse(localStorage.getItem("user")!);
  const [projects, setProjects] = useState([]);
  const [fundRaiser, setFundRaiser] = useState(false);
  const [addProjectForm, setAddProjectForm] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    gitLink: "",
    upiQR: null,
  });

  // Fetch projects from backend
  const fetchProjects = useCallback(async () => {
    try {
      const endpoint =
        role === "user"
          ? `http://localhost:8000/project/getUserProject/${userId}`
          : "http://localhost:8000/project/getAllProjects";

      const response = await axios.get(endpoint);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    }
  }, [userId, role]);

  useEffect(() => {
    if ((role === "user" && userId) || role !== "user") {
      fetchProjects();
    }
  }, [userId, role, fetchProjects]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file uploads
  const handleFileChange = (fieldName) => (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  // Add a new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("projectTitle", formData.projectTitle);
      formDataToSend.append("projectDescription", formData.projectDescription);
      formDataToSend.append("gitLink", formData.gitLink);

      // Append project image if exists
      if (formData.projectImage) {
        formDataToSend.append("projectImage", formData.projectImage);
      }

      // Append UPI QR if exists
      if (formData.upiQR) {
        formDataToSend.append("upiQR", formData.upiQR);
      }
      const response = await axios.post(
        `http://localhost:8000/project/addProject/${userId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(
        "FormData to send:",
        Object.fromEntries(formDataToSend.entries())
      );
      if (response.data.status === "Success") {
        setAddProjectForm(false);
        setFormData({
          projectTitle: "",
          projectDescription: "",
          gitLink: "",
          upiQR: null,
        });
        fetchProjects();
        setAddProjectForm(false);
      }
    } catch (error) {
      console.error("Failed to add project:", error.message);
    }
  };

  return (
    <>
      <div className="projects-container">
        <div className="tabs">
          <button
            className={`tab ${tab === "Explore" ? "active" : ""}`}
            onClick={() => setTab("Explore")}
          >
            Explore
          </button>
          {role === "user" && (
            <button
              className={`tab ${tab === "Yours" ? "active" : ""}`}
              onClick={() => setTab("Yours")}
            >
              Yours
            </button>
          )}
        </div>

        <div className="projects-grid">
          {(tab === "Explore"
            ? projects
            : projects.filter((project) => project.userId === userId)
          ).map((project) => (
            <div key={project._id} className="project-card">
              {project.upiQR && (
                <img
                  src={`http://localhost:8000/project/projectImage/${project._id}`}
                  alt="UPI QR Code"
                  className="project-image"
                />
              )}
              <h3>{project.projectTitle}</h3>
              <p>{project.projectDescription}</p>
              <a
                href={project.gitLink}
                target="_blank"
                rel="noopener noreferrer"
                className="know-more-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 50 50"
                  fill="#fff"
                  height="24px"
                  width="24px"
                >
                  <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
                </svg>
                <p>View on GitHub</p>
              </a>
            </div>
          ))}
        </div>

        {role === "user" && (
          <button
            className="add-project-btn"
            onClick={() => setAddProjectForm(true)}
          >
            Add Project
          </button>
        )}

        {addProjectForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Project</h2>
              <form onSubmit={handleAddProject}>
                <input
                  type="text"
                  name="projectTitle"
                  placeholder="Project Title"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="projectDescription"
                  placeholder="Project Description"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                />
                <input
                  type="url"
                  name="gitLink"
                  placeholder="GitHub Link"
                  value={formData.gitLink}
                  onChange={handleInputChange}
                  required
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={fundRaiser}
                    onChange={(e) => setFundRaiser(e.target.checked)}
                  />
                  Include Fundraiser
                </label>

                {fundRaiser && (
                  <div className="file-input">
                    <label>UPI QR Code:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("upiQR")}
                    />
                  </div>
                )}

                <div className="modal-buttons">
                  <button type="submit" className="submit-btn">
                    Add Project
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setAddProjectForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
