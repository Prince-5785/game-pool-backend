module.exports = (sequelize, DataTypes) => {
  const Prediction = sequelize.define(
    "Prediction",
    {
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Value of the prediction option",
      },
    },
    {
      tableName: "prediction",
      timestamps: false,
      underscored: true,
    }
  );
  
  return Prediction;
};
