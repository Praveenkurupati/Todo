const bcrypt = require("bcryptjs");
const { User, PasswordResetToken } = require("../models/Db_schemas");
const nodemailer = require("nodemailer");
const { errFunction } = require("../errFunction");


exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      DateofBirth,
      password,
      confirmPassword,
    } = req.body;


    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword || !DateofBirth) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)

    // Create the user in the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      dateOfBirth:DateofBirth,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error) {
    errFunction(error,res)

  }
};


exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
  
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching all users." });
    }
  };

exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user by ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching the user." });
    }
  };

  
  exports.updateUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const { firstName, lastName, email, mobileNumber, DateofBirth } = req.body;
  
      // Find the user by ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Update user properties if they are provided in the request body
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (mobileNumber) user.mobileNumber = mobileNumber;
      if (DateofBirth) user.DateofBirth = DateofBirth;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating the user." });
    }
  };
  

  exports.updateUserActiveStatus = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user by userId
      const userData = await User.findByPk(userId);
  
      if (!userData) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Update the isActive status
      userData.isActive = false;
      await userData.save();
  
      res.status(200).json({ message: `User's isActive status updated to ${isActive}.`, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating the user's isActive status." });
    }
  };

  exports.deleteUserById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user by ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Delete the user
      await user.destroy();
  
      res.status(204).json();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while deleting the user." });
    }
  };
  



// Generate a random token (e.g., using crypto)
function generateToken() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

// Send a password reset email
async function sendPasswordResetEmail(email, token) {
  // Configure nodemailer to send email (use your email service settings)
  const transporter = nodemailer.createTransport({
    service: "your_email_service",
    auth: {
      user: "your_email@example.com",
      pass: "your_email_password",
    },
  });

  // Email content
  const mailOptions = {
    from: "your_email@example.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: http://example.com/reset-password/${token}`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the provided old password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the password." });
  }
};





// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send the OTP via email
async function sendOTPEmail(email, otp) {
  // Configure nodemailer to send email (use your email service settings)
  const transporter = nodemailer.createTransport({
    service: "your_email_service",
    auth: {
      user: "your_email@example.com",
      pass: "your_email_password",
    },
  });

  // Email content
  const mailOptions = {
    from: "your_email@example.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the email exists in the database
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Generate a 6-digit OTP
      const otp = generateOTP();
  
      // Store the OTP in a database table (PasswordResetToken)
      await PasswordResetToken.create({
        userId: user.id,
        token: otp,
      });
  
      // Send the OTP to the user's email
      await sendOTPEmail(email, otp);
  
      res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while processing your request." });
    }
  }
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the OTP matches the one stored in the database
    const storedOTP = await PasswordResetToken.findOne({
      where: { userId: user.id, token: otp },
    });

    if (!storedOTP) {
      return res.status(401).json({ error: "Invalid OTP." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Delete the used OTP
    await storedOTP.destroy();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
