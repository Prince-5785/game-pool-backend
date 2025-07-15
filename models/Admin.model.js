const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  /**
   * Admin model
   * - includes password hashing hooks
   */
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'admin',
        validate: { len: [3, 32] },
      },
      first_name: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      employee_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      position: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'admins',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (admin) => {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        },
        beforeUpdate: async (admin) => {
          if (admin.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(admin.password, salt);
          }
        },
      },
    }
  );

  /**
   * Compare raw password with hashed password
   * @param {string} plainText
   * @returns {Promise<boolean>}
   */
  Admin.prototype.verify_password = function (plainText) {
    return bcrypt.compare(plainText, this.password);
  };

  return Admin;
};