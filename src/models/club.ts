import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

export default Club;
