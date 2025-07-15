module.exports = (sequelize, DataTypes) => {
  const PublicTicketValidateRequest = sequelize.define(
    "PublicTicketValidateRequest",
    {
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      pool_id: {
        type: DataTypes.STRING,
        allowNull: false, // Allow null for public tickets
      },
      full_id: {
        type: DataTypes.STRING,
        unique: true,
      }
    },
    {
      tableName: "public_ticket_validates",
      timestamps: true,
      underscored: true,
    }
  );

  PublicTicketValidateRequest.associate = (models) => {
    PublicTicketValidateRequest.belongsTo(models.UserPurchasedPool, {
      foreignKey: "full_id",
      targetKey: "full_code",
      as: "user_purchased_pool",
    });
    PublicTicketValidateRequest.belongsTo(models.Pool, {
      foreignKey: "pool_id",
      targetKey: "key",
      as: "pool",
    });
  };

  // Auto-generate full_id before save

  return PublicTicketValidateRequest;
};
