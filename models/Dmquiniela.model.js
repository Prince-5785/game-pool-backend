module.exports = (sequelize, DataTypes) => {
  const Dmquiniela = sequelize.define(
    "Dmquiniela",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prize_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = Percentage, 1 = Actual Price
        validate: {
          isIn: [[0, 1]], // Example values: 0 = Percentage, // 1 = Actual Price
        },
        description:
          "Indicates if the prize is an actual amount (1) or a percentage of the pool price (0)",
        comment:
          "Indicates if the prize is an actual amount (1) or a percentage of the pool price (0)",  
      },
      total_matches: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Total number of matches in the pool",
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "Price of the pool in USD",
      },
      percentage_profit: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "Percentage of profit from the pool price",
      },
      game_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = LEV-style win/draw/loss predictions
        validate: {
          isIn: [[0, 1]], // Example values: 0 = LEV-style, 1 = Marker
        },
        comment:
          "Type of game logic used. Example: '0' = LEV-style win/draw/loss predictions or '1' = Marker",
      },
      top_scoreboard: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dissemble_doubles_triples: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment:
          "Indicates if the pool allows disassembling doubles and triples",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Description of the pool",
      },
      legend: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Legend or rules of the pool",
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Terms and conditions of the pool",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = Pending
        validate: {
          isIn: [[0, 1, 2]],
        },
        comment: "0 = Pending, 1 = Authorized, 2 = Rejected",
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "dmquiniela",
      timestamps: true,
      underscored: true,
    }
  );

  Dmquiniela.associate = (models) => {
  
    // Pool.belongsTo(models.Dmquiniela, {
    //   foreignKey: "dm_quiniela",
    //   targetKey: "code",
    //   as: "Dmquiniela",
    // });

    Dmquiniela.hasMany(models.PoolPrizeCondition, {
      foreignKey: "key",
      targetKey: "key",
      as: "prizeCondition",
    });

    Dmquiniela.hasMany(models.PoolView, {
      foreignKey: "dmquiniela_id",
      targetKey: "id",
      as: "poolView",
    });

    Dmquiniela.hasMany(models.Pool, {
      foreignKey: "dmquiniela_id",
      targetKey: "id",
      as: "pools",
    });
  };
  return Dmquiniela;
};
