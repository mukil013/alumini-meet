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
    const company = await Company.findById(req.params.companyId);
    const userId = req.body.userId; // Expecting userId in request body

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $push: {
          alumni: { 
            user: userId, 
            remarks: req.body.remarks 
          }
        }
      },
      { new: true, runValidators: true }
    );

    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: "Error adding comment", error: error.message });
  }
};