module.exports = (sequelize, DataTypes) => {
  const TournamentTeam = sequelize.define(
    "TournamentTeam",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tournament_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "tournament_team",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["tournament_id", "team_id"],
          name: "tournament_team_unique",
        },
      ],
    }
  );

  TournamentTeam.associate = (models) => {
    TournamentTeam.belongsTo(models.Tournament, {
      foreignKey: "tournament_id",
      targetKey: "id",
      as: "tournament",
    });

    TournamentTeam.belongsTo(models.Team, {
      foreignKey: "team_id",
      targetKey: "id",
      as: "team",
    });
  };

  return TournamentTeam;
};
