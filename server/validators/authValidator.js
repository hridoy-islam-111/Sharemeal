/**
 * Auth Input Validators
 */

const validateRegister = (req, res, next) => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'Email, password, name, and role are required.' });
  }

  const validRoles = ['donor', 'ngo', 'receiver', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: `Role must be one of: ${validRoles.join(', ')}` });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
