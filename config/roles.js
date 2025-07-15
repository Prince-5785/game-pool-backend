// /config/roles.js
// Defines the two roles and their allowed permission strings.
const rolesPermissions = {
    admin: [
      'identity:read',
      'identity:write',
      'settings:modify',
      // …add any other admin rights here
    ],
    user: [
      'identity:read',
      // …add any other “user” rights here
    ]
  };
  
  module.exports = rolesPermissions;
  