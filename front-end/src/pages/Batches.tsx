import React, { useState } from 'react';
import './style/Batches.css';

export default function Batches() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  // Function to open the dialog and set the selected batch
  const handleBatchClick = (batch: string) => {
    setSelectedBatch(batch);
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBatch('');
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
          <div className="dialog-box">
            <h2>{selectedBatch}</h2>
            <p>This is the dialog for {selectedBatch}.</p>
            <button onClick={handleCloseDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}