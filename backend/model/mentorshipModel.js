const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  groupTitle: { type: String, required: true },
  groupDescription: { type: String, required: true },
  followers: {
    type: [String],
  },
  posts: {
    type: [
      {
        post: {
          title: String,
          description: String,
          image: {
            data: Buffer,
            contentType: String
          },
        },
      },
    ],
  },
});

module.exports = mongoose.model("Mentorship", mentorshipSchema);
