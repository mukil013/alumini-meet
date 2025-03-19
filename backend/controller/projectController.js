const Project = require("../model/projectModel");

const addProject = async (req, res) => {
  try {
    const project = await Project.create({
      projectTitle: req.body.projectTitle,
      projectDescription: req.body.projectDescription,
      gitLink: req.body.gitLink,
      userId: req.params.id
    });

    const projectDetail = {
      projectTitle: project.projectTitle,
      projectDescription: project.projectDescription,
      gitLink: project.gitLink,
      userId: project.userId
    };

    res.status(200).json({
      status: "Success",
      message: "project added successfully.",
      event: projectDetail,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: "project cannot be added.",
    });
  }
};

const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      status: "Success",
      message: "fetched the project successfully.",
      projects: projects,
    });
  } catch (error) {
    res.status(200).json({
      status: "failure",
      message: `cannot fetch the project ${error}`,
    });
  }
};

const getUserProject = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        status: "failure",
        message: "User Id is required to fetch projects.",
      });
    }

    const projects = await Project.find({ userId });

    if (projects.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "No projects found for the given user ID.",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Projects fetched successfully.",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: `cannot fetch the project of particular user ${error}.`,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Success",
      message: "project deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: `project cannot be deleted ${error}`,
    });
  }
};

const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = {
      projectTitle: req.body.projectTitle,
      projectDescription: req.body.projectDescription,
      gitLink: req.body.gitLink,
    };
    const result = await Project.findByIdAndUpdate(id, updatedProject, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({
        status: "failure",
        message: "project not found.",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "project details editted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "project details cannot be editted.",
    });
  }
};

module.exports = {
  addProject,
  getAllProject,
  editProject,
  deleteProject,
  getUserProject,
};
