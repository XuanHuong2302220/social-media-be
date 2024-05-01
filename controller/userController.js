import User from "./../models/userModel.js";
import bcryptjs from "bcryptjs";
export const getUsers = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Please enter a name" });
    }

    const users = await User.find({
      fullName: { $regex: fullName, $options: "i" },
    }).select("-password");

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNameUser = async (req, res) => {
  try {
    const id = req.user._id;
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Please enter a name" });
    }

    const user = await User.findByIdAndUpdate(id, { fullName }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.log("Error in updateNameUser", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const id = req.user._id;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isHashedPassword = await bcryptjs.compare(
      password,
      user?.password || " "
    );

    if (isHashedPassword) {
      return res
        .status(400)
        .json({ message: "Password is same as old password" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in updatePassword", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePicture = async (req, res) => {
  try {
    const id = req.user._id;
    const { picture } = req.body;
    if (!picture) {
      return res.status(400).json({ message: "Please upload a picture" });
    }

    const user = await User.findByIdAndUpdate(id, { picture }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Picture updated successfully" });
  } catch (error) {
    console.log("Error in updatePicture", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBirthday = async (req, res) => {
  try {
    const id = req.user._id;
    const { birthday } = req.body;
    if (!birthday) {
      return res.status(400).json({ message: "Please enter a birthday" });
    }

    const birthdatDate = new Date(birthday);

    const user = await User.findByIdAndUpdate(
      id,
      { birthday: birthdatDate },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Birthday updated successfully" });
  } catch (error) {
    console.log("Error in updateBirthday", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateGender = async (req, res) => {
  try {
    const id = req.user._id;
    const { gender } = req.body;

    if (!gender)
      return res.status(400).json({ message: "Please enter your gender" });

    const user = await User.findByIdAndUpdate(
      id,
      { gender: gender },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Update gender successfully" });
  } catch (error) {
    console.log("Error in updateGender", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
