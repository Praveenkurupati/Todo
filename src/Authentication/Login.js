const { User } = require("../models/Db_schemas");
const bcrypt = require('bcryptjs');
const signJwt = require("./jwt_handler");

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if the user exists with the provided email
    const userData = await User.findOne({
      where: {
        email: email
      }
    });

    if (!userData) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = signJwt(userData);

    res.status(200).json({ token, message: 'Login successful.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
};
