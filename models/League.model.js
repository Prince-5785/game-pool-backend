module.exports = (sequelize, DataTypes) => {
  const League = sequelize.define(
    "League",
    {
      key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sports_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "league",
      timestamps: true,
      underscored: true,
    }
  );
  League.associate = (models) => {
    League.hasMany(models.Tournament, {
      foreignKey: "league_key",
      sourceKey: "key",
      as: "tournaments",
    });

    League.belongsTo(models.Country, {
      foreignKey: "country_key",
      targetKey: "key",
      as: "country",
    });
    League.belongsTo(models.Sport, {
      foreignKey: "sports_key",
      targetKey: "key",
      as: "sport",
    });
    League.belongsTo(models.Region, {
      foreignKey: "region_key",
      targetKey: "key",
      as: "region",
    });
  };
  return League;
};
