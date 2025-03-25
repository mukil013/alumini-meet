const express = require("express");
const Mentorship = require("../models/Mentorship");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


async function AddGroup (req, res){
  try {
    const { userId, groupTitle, groupDescription, title, description } = req.body;
    
    const newMentorship = new Mentorship({
      userId,
      groupTitle,
      groupDescription,
      posts: [
        {
          post: {
            title,
            description,
            image: req.file
              ? {
                  data: req.file.buffer,
                  contentType: req.file.mimetype,
                }
              : null,
          },
        },
      ],
    });

    await newMentorship.save();
    res.status(201).json({ message: "Mentorship group created successfully", newMentorship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing mentorship group, including updating the image

async function EditGroup (req, res){
  try {
    const { id } = req.params;
    const { groupTitle, groupDescription, title, description } = req.body;

    const updateData = {
      groupTitle,
      groupDescription,
    };

    if (title || description || req.file) {
      updateData.$set = {
        "posts.0.post.title": title,
        "posts.0.post.description": description,
        "posts.0.post.image": req.file
          ? {
              data: req.file.buffer,
              contentType: req.file.mimetype,
            }
          : null,
      };
    }

    const updatedMentorship = await Mentorship.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMentorship) {
      return res.status(404).json({ message: "Mentorship group not found" });
    }

    res.json({ message: "Mentorship group updated successfully", updatedMentorship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mentorship groups

async function GetAllGroup (req, res) {
  try {
    const mentorshipGroups = await Mentorship.find();
    res.json(mentorshipGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific mentorship group by ID

async function GetGroupById (req, res){
  try {
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship group not found" });
    }
    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a mentorship group by ID

async function DeleteGroup(req, res){
  try {
    const deletedMentorship = await Mentorship.findByIdAndDelete(req.params.id);
    if (!deletedMentorship) {
      return res.status(404).json({ message: "Mentorship group not found" });
    }
    res.json({ message: "Mentorship group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  AddGroup,
  EditGroup,
  GetAllGroup,
  GetGroupById,
  DeleteGroup
};
