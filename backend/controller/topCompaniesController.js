const Company = require("../model/topCompanyModel");
const User = require("../model/userModel");

// Public access endpoints
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate(
      "alumni.user",
      "firstName lastName position"
    );
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCompanyAlumni = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "alumni.user",
      "firstName lastName batch position profilePicture"
    );
    res.json(company?.alumni || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unprotected admin endpoints
exports.createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: "Error creating company", error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: "Error updating company", error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting company", error: error.message });
  }
};

// Public user data
exports.getAlumniUsers = async (req, res) => {
  try {
    const alumni = await User.find({ role: "alumni" }).select("firstName lastName _id");
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alumni", error: error.message });
  }
};

// Unprotected comment system
exports.addComment = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { remarks } = req.body;
    const userId = req.user ? req.user._id : req.body.userId; // Get user ID from auth or request body

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Add the comment to the company
    company.alumni.push({
      user: userId,
      remarks: remarks
    });

    // Save the updated company
    const updatedCompany = await company.save();

    res.json({ message: "Comment added successfully", company: updatedCompany });
  } catch (error) {
    res.status(400).json({ message: "Error adding comment", error: error.message });
  }
};

// Delete alumni comment
exports.deleteComment = async (req, res) => {
  try {
    const { companyId, commentId } = req.params;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Filter out the comment to be deleted
    const updatedAlumni = company.alumni.filter(
      comment => comment._id.toString() !== commentId
    );
    
    // Update the company with the filtered alumni array
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { alumni: updatedAlumni },
      { new: true, runValidators: true }
    );
    
    res.json({ message: "Comment deleted successfully", company: updatedCompany });
  } catch (error) {
    res.status(400).json({ message: "Error deleting comment", error: error.message });
  }
};

// Update alumni comment
exports.updateComment = async (req, res) => {
  try {
    const { companyId, commentId } = req.params;
    const { remarks } = req.body;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Find and update the specific comment
    const commentIndex = company.alumni.findIndex(
      comment => comment._id.toString() === commentId
    );
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Update the comment
    company.alumni[commentIndex].remarks = remarks;
    
    // Save the updated company
    const updatedCompany = await company.save();
    
    res.json({ message: "Comment updated successfully", company: updatedCompany });
  } catch (error) {
    res.status(400).json({ message: "Error updating comment", error: error.message });
  }
};