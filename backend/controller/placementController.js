const Placement = require("../model/placementModel");

const addPlacement = async (req, res) => {
  try {
    const placement = await Placement.create({
      companyName: req.body.companyName,
      companyImageUrl: req.body.companyImageUrl,
      location: req.body.location,
      jobRole: req.body.jobRole,
      jobType: req.body.jobType,
      jobDescription: req.body.jobDescription,
      applyLink: req.body.applyLink,
    });

    const placementDetail = {
      companyName: placement.companyName,
      companyImageUrl: placement.companyImageUrl,
      location: placement.location,
      jobRole: placement.jobRole,
      jobType: placement.jobType,
      jobDescription: placement.jobDescription,
      applyLink: placement.applyLink,
    };

    res.status(200).json({
      status: "Success",
      message: "placement details added successfully.",
      placementDetail: placementDetail,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: `placement details cannot be added ${error}`,
    });
  }
};

const deletePlacement = async (res, req) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Success",
      message: "placement deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: `placement details cannot be deleted ${error}`,
    });
  }
};

const getAllPlacement = async (req, res) => {
  try {
    const getPlacement = await Placement.find();
    res.status(200).json({
      status: "Success",
      message: "fetched all the placements successfully.",
      placements: getPlacement,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "unable to fetch the placement details.",
    });
  }
};

const editPlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlacement = {
      companyName: req.body.companyName,
      companyImageUrl: req.body.companyImageUrl,
      location: req.body.location,
      jobRole: req.body.jobRole,
      jobType: req.body.jobType,
      jobDescription: req.body.jobDescription,
      applyLink: req.body.applyLink
    };
    const result = await Placement.findByIdAndUpdate(id, updatedPlacement, {
      new: true,
    });
    if (!result) {
        return res.status(404).json({
          status: "failure",
          message: "Placement not found.",
        });
      }
    res.status(200).json({
      status: "Success",
      message: "placement details editted successfully.",
      editedPlacement: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "placement details cannot be editted.",
    });
  }
};

module.exports = { addPlacement, deletePlacement, editPlacement, getAllPlacement };
