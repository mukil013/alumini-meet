import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./style/TopCompanies.css";
import { mainUrlPrefix } from "../main";

interface Alumni {
  _id: string;
  name: string;
  profilePic: string;
  remarks: string;
  user: string;
}

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  workers: string[];
  alumni: Alumni[];
}

interface User {
  _id: string;
  name: string;
  role: string;
}

export default function TopCompanies() {
  const [state, setState] = useState({
    companies: [] as Company[],
    selectedCompany: null as Company | null,
    loading: true,
    error: null as string | null,
    successMessage: null as string | null,
    comment: "",
    user: null as User | null,
    showDescriptionDialog: false,
    selectedDescription: "",
    editingComment: null as { id: string; text: string } | null,
    operationLoading: false
  });

  const {
    companies,
    selectedCompany,
    loading,
    error,
    successMessage,
    comment,
    user,
    showDescriptionDialog,
    selectedDescription,
    editingComment,
    operationLoading
  } = state;

  const updateState = (newState: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const getUserData = useCallback(() => {
    try {
      const userStr = sessionStorage.getItem("user");
      const role = sessionStorage.getItem("role");
      const company = sessionStorage.getItem("company");

      if (userStr && role) {
        return {
          _id: userStr,
          name: company || "User",
          role: role
        };
      }
      return null;
    } catch (err) {
      console.error("Error accessing sessionStorage:", err);
      return null;
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const response = await axios.get(`${mainUrlPrefix}/top-companies/companies`);
      
      // Debug companies data
      console.log("Companies data:", response.data);
      
      updateState({ companies: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching companies:", err);
      updateState({ 
        error: "Failed to load companies. Please try again later.",
        loading: false 
      });
    }
  }, []);

  useEffect(() => {
    const userData = getUserData();
    updateState({ user: userData });
    
    // Debug user data
    console.log("User data:", userData);
    
    fetchCompanies();
  }, [getUserData, fetchCompanies]);

  const canComment = useCallback((company: Company) => {
    if (!user) return false;
    
    // Check if user is an alumni
    if (user.role !== "alumni") return false;
    
    // Check if user works at this company
    return company.workers.includes(user._id);
  }, [user]);

  const hasCommented = useCallback((company: Company) => {
    if (!user) return false;
    return company.alumni.some(alum => alum.user === user._id);
  }, [user]);

  const canModifyComment = useCallback((alumniUserId: string, action: 'edit' | 'delete') => {
    if (!user) return false;
    return action === 'edit' 
      ? user._id === alumniUserId 
      : user._id === alumniUserId || user.role === "admin";
  }, [user]);

  const handleCompanyClick = (company: Company) => {
    updateState({ selectedCompany: company });
  };

  const handleCloseModal = () => {
    updateState({ 
      selectedCompany: null,
      comment: "",
      editingComment: null
    });
  };

  const handleReadMore = (description: string) => {
    updateState({
      showDescriptionDialog: true,
      selectedDescription: description
    });
  };

  const handleCloseDescriptionDialog = () => {
    updateState({ showDescriptionDialog: false });
  };

  const truncateDescription = (description: string, maxLines = 4) => {
    const lines = description.split('\n');
    return lines.length <= maxLines 
      ? description 
      : lines.slice(0, maxLines).join('\n') + '...';
  };

  const handleAddComment = async () => {
    if (!selectedCompany || !comment.trim() || !user) return;

    try {
      updateState({ operationLoading: true });
      
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${mainUrlPrefix}/top-companies/companies/${selectedCompany._id}/comments`,
        { remarks: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Get the updated company from the response
      const updatedCompany = response.data.company;
      
      // Update the local state with the new company data
      const updatedCompanies = companies.map(company => 
        company._id === selectedCompany._id ? updatedCompany : company
      );

      updateState({
        companies: updatedCompanies,
        selectedCompany: updatedCompany,
        comment: "",
        operationLoading: false,
        successMessage: "Comment added successfully!"
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      console.error("Error adding comment:", err);
      updateState({ 
        error: "Failed to add comment. Please try again.",
        operationLoading: false 
      });
    }
  };

  const handleDeleteComment = async (companyId: string, alumniId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      updateState({ operationLoading: true });
      const token = sessionStorage.getItem("token");
      
      await axios.delete(
        `${mainUrlPrefix}/top-companies/companies/${companyId}/comments/${alumniId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCompany = {
        ...selectedCompany!,
        alumni: selectedCompany!.alumni.filter(alum => alum._id !== alumniId)
      };

      const updatedCompanies = companies.map(company => 
        company._id === companyId ? updatedCompany : company
      );

      updateState({
        companies: updatedCompanies,
        selectedCompany: updatedCompany,
        operationLoading: false,
        successMessage: "Comment deleted successfully!"
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      console.error("Error deleting comment:", err);
      updateState({ 
        error: "Failed to delete comment. Please try again.",
        operationLoading: false 
      });
    }
  };

  const handleEditComment = async (companyId: string, commentId: string, newText: string) => {
    if (!newText.trim()) return;

    try {
      updateState({ operationLoading: true });
      const token = sessionStorage.getItem("token");
      
      await axios.put(
        `${mainUrlPrefix}/top-companies/companies/${companyId}/comments/${commentId}`,
        { remarks: newText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCompany = {
        ...selectedCompany!,
        alumni: selectedCompany!.alumni.map(alum => 
          alum._id === commentId ? { ...alum, remarks: newText } : alum
        )
      };

      const updatedCompanies = companies.map(company => 
        company._id === companyId ? updatedCompany : company
      );

      updateState({
        companies: updatedCompanies,
        selectedCompany: updatedCompany,
        editingComment: null,
        operationLoading: false,
        successMessage: "Comment updated successfully!"
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      console.error("Error updating comment:", err);
      updateState({ 
        error: "Failed to update comment. Please try again.",
        operationLoading: false 
      });
    }
  };

  if (loading && !companies.length) {
    return <div className="loading">Loading companies...</div>;
  }

  if (error && !companies.length) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="top-companies-container">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="companies-grid">
        {companies.map(company => (
          <div
            key={company._id}
            className="company-card"
            onClick={() => handleCompanyClick(company)}
          >
            <img src={company.logo} alt={company.name} className="company-logo" />
            <h3>{company.name}</h3>
            <div className="company-description-container">
              <p className="company-description">{truncateDescription(company.description)}</p>
              <button 
                className="read-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadMore(company.description);
                }}
              >
                Read more...
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="company-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <div className="modal-header">
              <img src={selectedCompany.logo} alt={selectedCompany.name} className="modal-logo" />
              <h2>{selectedCompany.name}</h2>
            </div>
            <div className="company-description-container">
              <p>{selectedCompany.description}</p>
            </div>
            <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="website-link">
              Visit Website
            </a>

            <div className="alumni-list">
              <h3>Alumni Comments</h3>
              {selectedCompany.alumni.length === 0 ? (
                <p className="no-comments">No comments yet</p>
              ) : (
                selectedCompany.alumni.map(alumni => (
                  <div key={alumni._id} className="alumni-card">
                    <div className="alumni-header">
                      <img
                        src={alumni.profilePic || "/default-profile.png"}
                        alt={alumni.name}
                        className="profile-pic"
                      />
                      <h4>{alumni.name}</h4>
                    </div>
                    {editingComment?.id === alumni._id ? (
                      <div className="edit-comment-form">
                        <textarea
                          value={editingComment.text}
                          onChange={(e) => updateState({ 
                            editingComment: { ...editingComment, text: e.target.value }
                          })}
                          placeholder="Edit your comment..."
                        />
                        <div className="edit-comment-actions">
                          <button
                            onClick={() => handleEditComment(selectedCompany._id, alumni._id, editingComment.text)}
                            disabled={!editingComment.text.trim() || operationLoading}
                          >
                            {operationLoading ? "Saving..." : "Save"}
                          </button>
                          <button onClick={() => updateState({ editingComment: null })}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="remarks">{alumni.remarks}</p>
                        <div className="comment-actions">
                          {canModifyComment(alumni.user, 'edit') && (
                            <button
                              className="edit-comment-btn"
                              onClick={() => updateState({ 
                                editingComment: { id: alumni._id, text: alumni.remarks }
                              })}
                            >
                              Edit Comment
                            </button>
                          )}
                          {canModifyComment(alumni.user, 'delete') && (
                            <button
                              className="delete-comment-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteComment(selectedCompany._id, alumni._id);
                              }}
                            >
                              Delete Comment
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Debug information */}
            {user && (
              <div className="debug-info" style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                <p>User ID: {user._id}</p>
                <p>User Role: {user.role}</p>
                <p>Can Comment: {canComment(selectedCompany) ? 'Yes' : 'No'}</p>
                <p>Has Commented: {hasCommented(selectedCompany) ? 'Yes' : 'No'}</p>
                <p>Company Workers: {selectedCompany.workers.join(', ')}</p>
              </div>
            )}

            {canComment(selectedCompany) && !hasCommented(selectedCompany) && (
              <div className="add-comment-section">
                <h4>Add Your Comment</h4>
                <textarea
                  value={comment}
                  onChange={(e) => updateState({ comment: e.target.value })}
                  placeholder="Share your experience working at this company..."
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || operationLoading}
                >
                  {operationLoading ? "Adding..." : "Add Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showDescriptionDialog && (
        <div className="description-dialog">
          <div className="description-dialog-content">
            <span className="close" onClick={handleCloseDescriptionDialog}>&times;</span>
            <h3>Company Description</h3>
            <div className="description-content">
              {selectedDescription.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}