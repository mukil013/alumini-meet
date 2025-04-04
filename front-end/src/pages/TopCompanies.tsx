import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/TopCompanies.css";
import { mainUrlPrefix } from "../main";

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  workers: string[];
  alumni: Alumni[];
}

interface Alumni {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    batch: string;
    position: string;
    profilePicture: string;
  };
  remarks: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

export default function TopCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [alumniUsers, setAlumniUsers] = useState<User[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get user data from sessionStorage
  const role = sessionStorage.getItem("role") || "";
  const userId = sessionStorage.getItem("userId") || "";
  const token = sessionStorage.getItem("token") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [companiesRes, alumniRes] = await Promise.all([
          axios.get(`${mainUrlPrefix}/top-companies`),
          role === "admin"
            ? axios.get(`${mainUrlPrefix}/alumni-users`)
            : Promise.resolve(null),
        ]);

        setCompanies(companiesRes.data);
        if (alumniRes?.data) setAlumniUsers(alumniRes.data);
      } catch (err) {
        setError("Failed to load data" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, role]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = formData._id
        ? `${mainUrlPrefix}/companies/${formData._id}`
        : `${mainUrlPrefix}/companies`;

      const method = formData._id ? "put" : "post";

      const { data } = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompanies((prev) =>
        formData._id
          ? prev.map((c) => (c._id === data._id ? data : c))
          : [...prev, data]
      );

      setShowForm(false);
      setFormData({});
    } catch (err) {
      setError("Operation failed" + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`${mainUrlPrefix}/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        setError("Delete failed" + err);
      }
    }
  };

  const handleAddComment = async (companyId: string) => {
    try {
      await axios.post(
        `${mainUrlPrefix}/companies/${companyId}/comments`,
        { remarks: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = await axios.get(
        `${mainUrlPrefix}/companies/${companyId}/alumni`
      );
      setSelectedCompany((prev) => (prev ? { ...prev, alumni: data } : null));
      setComment("");
    } catch (err) {
      setError("Failed to add comment" + err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="top-companies-container">
      {role === "admin" && (
        <button className="add-company-btn" onClick={() => setShowForm(true)}>
          Add New Company
        </button>
      )}

      {showForm && (
        <div
          className="form-modal"
          onClick={() => {
            setShowForm(false);
            setFormData({});
          }}
        >
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <h2>{formData._id ? "Edit" : "Add"} Company</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Name:
                <input
                  required
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </label>

              <label>
                Logo URL:
                <input
                  required
                  value={formData.logo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                />
              </label>

              <label>
                Description:
                <textarea
                  required
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </label>

              <label>
                Website:
                <input
                  required
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </label>

              {role === "admin" && (
                <label>
                  Workers:
                  <select
                    multiple
                    value={formData.workers || []}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workers: Array.from(
                          e.target.selectedOptions,
                          (opt) => opt.value
                        ),
                      })
                    }
                  >
                    {alumniUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="form-buttons">
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="companies-grid">
        {companies.map((company) => (
          <div
            key={company._id}
            className="company-card"
            onClick={() => setSelectedCompany(company)}
          >
            <img
              src={company.logo}
              alt={company.name}
              className="company-logo"
            />
            <h3>{company.name}</h3>
            <p className="company-description">{company.description}</p>

            {role === "admin" && (
              <div className="admin-controls">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData(company);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(company._id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="company-modal" onClick={() => setSelectedCompany(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedCompany(null)}>
              &times;
            </span>

            <div className="modal-header">
              <img
                src={selectedCompany.logo}
                alt={selectedCompany.name}
                className="modal-logo"
              />
              <h2>{selectedCompany.name}</h2>
              <a
                href={selectedCompany.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </div>

            <div className="alumni-list">
              <h3>Alumni Experiences ({selectedCompany.alumni.length})</h3>
              {selectedCompany.alumni.map((alumni) => (
                <div key={alumni._id} className="alumni-card">
                  <div className="alumni-header">
                    <img
                      src={alumni.user.profilePicture || "/default-avatar.png"}
                      alt={`${alumni.user.firstName} ${alumni.user.lastName}`}
                      className="profile-pic"
                    />
                    <div>
                      <h4>
                        {alumni.user.firstName} {alumni.user.lastName}
                      </h4>
                      <p>
                        Batch of {alumni.user.batch} • {alumni.user.position}
                      </p>
                    </div>
                  </div>
                  <p className="remarks">"{alumni.remarks}"</p>
                </div>
              ))}
            </div>

            {role === "alumni" &&
              selectedCompany.workers.includes(userId) &&
              !selectedCompany.alumni.some((a) => a.user._id === userId) && (
                <div className="add-comment-section">
                  <h4>Add Your Experience</h4>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience working at this company..."
                    rows={4}
                  />
                  <button
                    onClick={() => handleAddComment(selectedCompany._id)}
                    disabled={!comment.trim()}
                  >
                    Submit Experience
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
