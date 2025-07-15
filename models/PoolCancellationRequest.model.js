module.exports = (sequelize, DataTypes) => {
  const PoolCancellationRequest = sequelize.define(
    "PoolCancellationRequest",
    {
      user_purchased_pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attention_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      attention_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      attended_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      request_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = Pending
        validate: {
          isIn: [[0, 1, 2]],
        },
        comment: "0 = Pending, 1 = Authorized, 2 = Rejected",
      },
    },
    {
      tableName: "pool_cancellation_requests",
      timestamps: true,
      underScored: true,
      indexes: [
        {
          unique: true,
          fields: ["pool_id", "distributor_id"],
        },
      ],
    }
  );

  PoolCancellationRequest.associate = (models) => {
    PoolCancellationRequest.belongsTo(models.Distributer, {
      foreignKey: "distributor_id",
      targetKey: "id",
      as: "distributor",
    });
    PoolCancellationRequest.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "pool",
    });
  };

  return PoolCancellationRequest;
};
