const User = require("../models/User");

const saveUserDetails = async (req, res) => {
  const { name, email, password, age, contact_no, role, providerDetails, consumerDetails } = req.body;
  console.log(req.body);

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the new email already exists in the database and belongs to a different user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: "Email already exists" });
      }
      user.email = email;
    }

    // Update existing user details
    if (name) user.name = name;
    if (password) user.password = password;
    if (age) user.age = age;
    if (contact_no) user.contact_no = contact_no;
    if (role) user.role = role;
    if (role === "provider" && providerDetails) {
      user.providerDetails = providerDetails;
    }
    if (role === "consumer" && consumerDetails) {
      user.consumerDetails = consumerDetails;
    }

    await user.save();

    res.status(200).json({ message: "User details saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveUserDetails };