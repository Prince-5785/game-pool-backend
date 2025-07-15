module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "Team",
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
      country_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sports_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "teams",
      timestamps: true,
      underscored: true,
    }
  );

  Team.associate = (models) => {
    Team.hasMany(models.Match, {
      as: "homeMatches",
      foreignKey: "local_team_key",
    });

    Team.hasMany(models.Match, {
      as: "awayMatches",
      foreignKey: "visit_team_key",
    });
    Team.belongsTo(models.Country, {
      foreignKey: "country_key",
      targetKey: "key",
      as: "country",
    });
    Team.belongsTo(models.Sport, {
      foreignKey: "sports_key",
      targetKey: "key",
      as: "sport",
    });

    // Many-to-many relationship with Tournaments through TournamentTeam
    Team.belongsToMany(models.Tournament, {
      through: models.TournamentTeam,
      foreignKey: "team_id",
      otherKey: "tournament_id",
      as: "tournament",
    });

    // Direct association with TournamentTeam
    Team.hasMany(models.TournamentTeam, {
      foreignKey: "team_id",
      as: "tournamentTeam",
    });
  };
  return Team;
};
