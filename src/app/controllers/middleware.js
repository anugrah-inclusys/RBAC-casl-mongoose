const defineAbilitiesFor = require('../services/abilities');

function authorize(action, subject) {
  return (req, res, next) => {
    req.user = {
      id: '12345',  // mock user ID
      role: 'admin' // mock user role
    };
  console.log("rOLE",req.user.role);

    const userRole = req.user.role;  // Assume req.user is set after authentication
    const ability = defineAbilitiesFor(userRole);

    if (ability.can(action, subject)) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
}

module.exports = authorize;
