const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PoolPrizeCondition = sequelize.define(
    "PoolPrizeCondition",
    {
      condition_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]], // Example values: 0 = 'total correct answers', 1 = 'position'
        },
        comment:
          "Type of condition for the prize (e.g., 'total correct answers', 'position')",
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment:
          "Value associated with the condition (e.g., percentage or score)",
      },
      award: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Amount of the prize awarded if the condition is met",
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Key of the pool this condition belongs to",
        references: {
          model: "dmquiniela",
          key: "key",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "pool_prize_conditions",
      timestamps: true,
      underscored: true,
    }
  );

  // Define associations if needed
  PoolPrizeCondition.associate = (models) => {
    PoolPrizeCondition.belongsTo(models.Dmquiniela, {
      foreignKey: "key",
      targetKey: "key",
      as: "dmquiniela",
    });
  };

  return PoolPrizeCondition;
};
