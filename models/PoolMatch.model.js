module.exports = (sequelize, DataTypes) => {
  const PoolMatch = sequelize.define(
    "PoolMatch",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prediction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the prediction associated with this match in the pool",
      }
    },
    {
      tableName: "pool_match",
      timestamps: false,
      underscored: true,
      // indexes: [
      //   {
      //     unique: true,
      //     fields: ["pool_id", "match_id"],
      //   },
      // ],
    }
  );

  PoolMatch.associate = (models) => {
    PoolMatch.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      as: "pool",
    });
    PoolMatch.belongsTo(models.Match, {
      foreignKey: "match_id",
      as: "match",
    });
    PoolMatch.belongsTo(models.Prediction, {
      foreignKey: "prediction_id",
      targetKey: "id",
      as: "prediction",
    });
    PoolMatch.hasMany(models.PredictionDistributor, {
      foreignKey: "pool_match_id",
      as: "predictionDistributors",
    });
  };

  return PoolMatch;
};
