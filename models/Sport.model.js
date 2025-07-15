const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sport = sequelize.define(
    "Sport",
    {
      key:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
     allows_tie:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Indicates if the sport allows a tie in matches",
     }
    },
    {
      tableName: "sport",
      timestamps: true, 
    }     
  );
  Sport.associate = (models) => {
    Sport.hasMany(models.League, {
      foreignKey: "sports_key",
      sourceKey: "key",
      as: "league",
    });
    Sport.hasMany(models.Team, {
      foreignKey: "sports_key",
      sourceKey: "key",
      as: "team",
    });
  };
  return Sport;
}
