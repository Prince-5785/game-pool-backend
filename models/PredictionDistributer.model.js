const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PredictionDistributor = sequelize.define(
    "PredictionDistributor",
    {
      distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      poolMatch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Prediction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "prediction_distributor",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["distributor_id", "poolMatch_id"],
        },
      ],
    }
  );

  PredictionDistributor.associate = (models) => {
    PredictionDistributor.belongsTo(models.Distributer, {
      foreignKey: "distributor_id",
      targetKey: "id",
      as: "distributor",
    });
    PredictionDistributor.belongsTo(models.PoolMatch, {
      foreignKey: "poolMatch_id",
      targetKey: "id",
      as: "poolMatch",
    });
    PredictionDistributor.belongsTo(models.Prediction, {
      foreignKey: "Prediction_id",
      targetKey: "id",
      as: "Prediction",
    });
  };

  return PredictionDistributor;
};
