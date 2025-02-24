const { User } = require("../models/User");

const saveUserDetails = async (req, res) => {
  const { name, email, password, age, contact_no, role, providerDetails, consumerDetails } = req.body;
  console.log(req.body);

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update existing user details
    if (name) user.name = name;
    if (email) user.email = email;
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
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveUserDetails };