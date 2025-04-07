const Company = require("../model/topCompanyModel");

exports.getCompany = async (req, res) => {
  try{
    const response = await Company.find()
    res.status(201).json(response);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}

// Company CRUD operations
exports.addCompany = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedCompany) return res.status(404).json({ message: "Company not found" });
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Alumni Remarks Operations
exports.addRemarks = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.alumni.push({
      userId: req.body.userId,
      remarks: req.body.remarks,
    });

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRemarks = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const alumniIndex = company.alumni.findIndex(
      a => a.userId === req.params.userId
    );
    
    if (alumniIndex === -1) return res.status(404).json({ message: "Remarks not found" });
    
    company.alumni[alumniIndex].remarks = req.body.remarks;
    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRemarks = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const initialLength = company.alumni.length;
    company.alumni = company.alumni.filter(
      a => a.userId !== req.params.userId
    );

    if (initialLength === company.alumni.length) {
      return res.status(404).json({ message: "Remarks not found" });
    }

    await company.save();
    res.json({ message: "Remarks deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRemarksAdmin = async (req, res) => {
  try{
    const { Id } = req.params;
    const company = await Company.findById(req.params.companyId);
    const initialLength = company.alumni.length;
    company.alumni = company.alumni.filter(
      a => a._Id !== Id
    );

    if (initialLength === company.alumni.length) {
      return res.status(404).json({ message: "Remarks not found" });
    }

    await company.save();
    res.json({ message: "Remarks deleted successfully" });
  }catch(err){

  }
}