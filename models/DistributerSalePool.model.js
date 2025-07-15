module.exports = (sequelize, DataTypes) => {
  const DistributerSalePool = sequelize.define(
    "DistributerSalePool",
    {
      pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sold_pool_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      amount_sold: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      prize_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      tableName: "distributor_sales_pools",
      timestamps: true,
      underscored: true,
      index: [
        {
          unique: true,
          fields: ["pool_id", "distributor_id"],
        },
      ],
    }
  );

  DistributerSalePool.associate = (models) => {
    DistributerSalePool.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "pool",
    });
    DistributerSalePool.belongsTo(models.Distributer, {
      foreignKey: "distributor_id",
      targetKey: "id",
      as: "distributor",
    });
  };

  return DistributerSalePool;
};
