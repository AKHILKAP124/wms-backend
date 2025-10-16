import User from "../models/UserModel.js";

const updateProfile = async (req, res) => {
  try {
    var { firstName, lastName, email, avatar, role } = req.body;

    const userId = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName === "") {
      firstName = user.firstName;
    }
    if (lastName === "") {
      lastName  = user.lastName;
    }

    if (email === "") {
      email = user.email;
    }
    if (avatar === "") {
      avatar = user.avatar;
    }
    if (role === "") {
      role = user.role;
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.avatar = avatar;
    user.role = role;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUser = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    console.error("Error getting user:", error);
    if (error.name === "TokenExpiredError") {
      return (
        res.clearCookie("accessToken"),
        res.status(401).json({ message: "Token expired" })
      );
    }

    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  updateProfile,
  getUser,
  getAllUsers,
  getUserById,
};
