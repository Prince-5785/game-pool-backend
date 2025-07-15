// module.exports = (sequelize, DataTypes) => {
//   const PredictionDistributor = sequelize.define(
//     "PredictionDistributor",
//     {
//       distributor_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       pool_match_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       Prediction_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//     },
//     {
//       tableName: "prediction_distributor",
//       timestamps: true,
//       underscored: true,
//       indexes: [
//         {
//           unique: true,
//           fields: ["distributor_id", "pool_match_id"],
//         },
//       ],
//     }
//   );

//   PredictionDistributor.associate = (models) => {
//     PredictionDistributor.belongsTo(models.Distributer, {
//       foreignKey: "distributor_id",
//       targetKey: "id",
//       as: "distributor",
//     });
//     PredictionDistributor.belongsTo(models.PoolMatch, {
//       foreignKey: "pool_match_id",
//       targetKey: "[pool_id, match_id]",
//       as: "PoolMatch",
//     });
//     PredictionDistributor.belongsTo(models.Prediction, {
//       foreignKey: "Prediction_id",
//       targetKey: "id",
//       as: "Prediction",
//     });
//   };

//   return PredictionDistributor;
// };

'use strict';

module.exports = (sequelize, DataTypes) => {
  const PredictionDistributor = sequelize.define(
    "PredictionDistributor",
    {
      distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pool_match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prediction_id: {
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
          fields: ["distributor_id", "pool_match_id"],
        },
      ],
    }
  );

  PredictionDistributor.associate = (models) => {
    PredictionDistributor.belongsTo(models.Distributer, {
      foreignKey: "distributor_id",
      as: "distributor",
    });
    PredictionDistributor.belongsTo(models.PoolMatch, {
      foreignKey: "pool_match_id",
      as: "poolMatch",
    });
    PredictionDistributor.belongsTo(models.Prediction, {
      foreignKey: "prediction_id",
      as: "prediction",
    });
  };

  return PredictionDistributor;
};
