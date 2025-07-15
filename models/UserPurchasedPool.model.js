module.exports = (sequelize, DataTypes) => {
  const UserPurchasedPool = sequelize.define(
    "UserPurchasedPool",
    {
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pool_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unique_code: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      full_code: {
        type: DataTypes.STRING,
        unique: true,
      },
      purchase_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_amount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
      },
      purchase_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      prize_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      tableName: "user_purchased_pools",
      timestamps: true,
      underscored: true,
    }
  );

  UserPurchasedPool.associate = (models) => {
    UserPurchasedPool.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "pool",
    });
    UserPurchasedPool.belongsTo(models.PoolView, {
      foreignKey: "pool_id",
      targetKey: "id",
      as: "poolView",
    });
    UserPurchasedPool.belongsTo(models.Distributer, {
      foreignKey: "distributor_id",
      targetKey: "id",
      as: "distributor",
    });
    UserPurchasedPool.hasMany(models.UserPoolMatch, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "userPoolMatches",
    });
    UserPurchasedPool.hasMany(models.PublicTicketValidateRequest, {
      foreignKey: "full_id",
      sourceKey: "full_code",
      as: "publicTicketRequests",
    });
  };

  // Auto-generate full_code before save
  UserPurchasedPool.beforeCreate((instance) => {
    instance.full_code = `${instance.phone_number}-${instance.pool_key}-${instance.unique_code}`;
  });

  return UserPurchasedPool;
};
