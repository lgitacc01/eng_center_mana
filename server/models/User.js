import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  role_id: { type: Number, required: true },
}, { collection: "users" }); // 👈 chỉ định collection là "users"

const User = mongoose.model("User", userSchema);
export default User;
