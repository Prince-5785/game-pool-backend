// FIX: Export as a function, not as a property
module.exports = (sequelize, DataTypes) => {
  const ConditionalDistributorPool = sequelize.define(
    "ConditionalDistributorPool",
    {
      pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "conditional_distributor_pools",
      timestamps: true,
      underscored: true,
    }
  );

  ConditionalDistributorPool.associate = (models) => {
    ConditionalDistributorPool.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "pool",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    ConditionalDistributorPool.belongsTo(models.Distributer, {
      foreignKey: "distributor_id",
      targetKey: "id",
      as: "distributor",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return ConditionalDistributorPool;
};
