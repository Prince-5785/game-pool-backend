

module.exports = (sequelize, DataTypes) => {
  const DigitalProductPool = sequelize.define(
    "DigitalProductPool",
    {
      digital_product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      pool_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      }
    },
    {
      tableName: "digital_product_pool",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["digital_product_id", "pool_id"],
        },
      ],
    }
  );

  // Define associations if needed
  DigitalProductPool.associate = (models) => {
    DigitalProductPool.belongsTo(models.DigitalProduct, {
      foreignKey: "digital_product_id",
      targetKey: "id",
      as: "digitalProduct",
    });
    DigitalProductPool.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "pools",
    });
    DigitalProductPool.belongsTo(models.PoolView, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "poolView",
    });
  };

  return DigitalProductPool;
};

