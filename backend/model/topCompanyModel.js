const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  alumni: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      remarks: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Company", companySchema);
