// models/Client.js
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const Distributer = sequelize.define(
    "Distributer",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: "distributor",
        validate: { len: [3, 32] },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rfc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      contact: DataTypes.STRING,
      outstanding_balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      allow_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      street: DataTypes.STRING,
      exterior_number: DataTypes.STRING,
      interior_number: DataTypes.STRING,
      neighborhood: DataTypes.STRING,
      locality: DataTypes.STRING,
      state: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      country: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: DataTypes.STRING,
      latitude: DataTypes.DECIMAL(10, 6),
      longitude: DataTypes.DECIMAL(10, 6),
      account_number: DataTypes.STRING,
      clabe: DataTypes.STRING,
      bank: DataTypes.STRING,
      comments: DataTypes.TEXT,
    },
    {
      tableName: "distributers", // Customize table name if needed
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (distributer) => {
          const salt = await bcrypt.genSalt(10);
          distributer.password = await bcrypt.hash(distributer.password, salt);
        },
        beforeUpdate: async (distributer) => {
          if (distributer.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            distributer.password = await bcrypt.hash(
              distributer.password,
              salt
            );
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
  Distributer.prototype.verify_password = function (plainText) {
    return bcrypt.compare(plainText, this.password);
  };

  Distributer.associate = (models) => {
    Distributer.hasMany(models.ConditionalDistributorPool, {
      foreignKey: "distributor_id",
      as: "conditionalDistributorPools",
    });
    Distributer.hasMany(models.DistributerSalePool, {
      foreignKey: "distributor_id",
      as: "distributorSalePool",
    });
  };

  return Distributer;
};
  