// models/City.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const City = sequelize.define('City', {
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_abbr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    county: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    count_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }
  }, {
    tableName: 'city',
    timestamps: true,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  return City;
};
// models/City.js