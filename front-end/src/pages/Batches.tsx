import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/Batches.css';

export default function Batches() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [allUsers, setAllUsers] = useState([]); // State to store all users
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(''); // State for error handling

  // Fetch all users on component mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('http://localhost:8000/admin/getAllUsers');
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Function to open the dialog and filter users for the selected batch
  const handleBatchClick = (batch) => {
    setSelectedBatch(batch);
    setIsDialogOpen(true);

    // Filter users based on the selected batch
    const filtered = allUsers.filter((user) => user.batch === batch);
    setFilteredUsers(filtered);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBatch('');
    setFilteredUsers([]); // Clear filtered users when closing the dialog
  };

  return (
    <div className="batches-body">
      <ul id="batches">
        {[...Array(9)].map((_, index) => {
          const year = 2015 + index;
          return (
            <li key={year}>
              <button onClick={() => handleBatchClick(`Batch of ${year}`)}>
                Batch of {year}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBatch}</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : filteredUsers.length === 0 ? (
              <p>No users found for this batch.</p>
            ) : (
              <ul className="user-list">
                {filteredUsers.map((user) => (
                  <li key={user.id} className="user-item">
                    <p><strong>Name:</strong> {user.firstName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={handleCloseDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}