import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import './style/Projects.css'

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
                View on GitHub
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
