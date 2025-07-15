module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define(
    "Tournament",
    {
      key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      league_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "tournaments",
      timestamps: true,
      underscored: true,
    }
  );
  Tournament.associate = (models) => {
    Tournament.belongsTo(models.League, {
      foreignKey: "league_key",
      targetKey: "key",
      as: "league",
    });

    // Many-to-many relationship with Teams through TournamentTeam
    Tournament.belongsToMany(models.Team, {
      through: models.TournamentTeam,
      foreignKey: "tournament_id",
      otherKey: "team_id",
      as: "team",
    });

    // Direct association with TournamentTeam
    Tournament.hasMany(models.TournamentTeam, {
      foreignKey: "tournament_id",
      as: "tournamentTeam",
    });

    // Association with Matches
    Tournament.hasMany(models.Match, {
      foreignKey: "tournament_key",
      as: "matches",
    });
  };
  return Tournament;
};
