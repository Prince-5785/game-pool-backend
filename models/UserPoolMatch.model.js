module.exports = (sequelize, DataTypes) => {
  const UserPoolMatch = sequelize.define(
    "UserPoolMatch",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      },
    },
    {
      tableName: "user_pool_match",
      timestamps: false,
      underscored: true,
    //   indexes: [
    //     {
    //       unique: true,
    //       fields: ["user_id", "pool_match_id"],
    //     },
    //   ],
    }
  );

  UserPoolMatch.associate = (models) => {
    UserPoolMatch.belongsTo(models.UserPurchasedPool, {
      foreignKey: "user_id",
      targetKey: "id",
      as: "user",
    });
    UserPoolMatch.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "pool",
    });
    UserPoolMatch.belongsTo(models.Match, {
      foreignKey: "match_id",
      targetKey: "id",
      as: "match",
    });
    UserPoolMatch.belongsTo(models.Prediction, {
      foreignKey: "prediction_id",
      targetKey: "id",
      as: "prediction",
    });
  };

  return UserPoolMatch;
  
};
