// models/match.model.js
module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define(
    "Match",
    {
      key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      match_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      match_start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      tournament_key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      local_team_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visit_team_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      local_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      visit_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Indicates false = pending, true = completed",
      }
    },
    {
      tableName: "matches",
      timestamps: true,
      underscored: true,
      validate: {
        teamsAreDifferent() {
          if (this.local_team_key === this.visit_team_key) {
            throw new Error("A team cannot play against itself");
          }
          if( this.local_team_key === null || this.visit_team_key === null) {
            throw new Error("Both teams must be specified for a match");
          }  
          if( this.local_team_key === "" || this.visit_team_key === "") {
            throw new Error("Both teams must be specified for a match");
          }
          if( this.match_start_date <= new Date() && this.match_start_time <= new Date()) {
            throw new Error("Match start date and time must be in the future");
          }
        },
      },
    }
  );

  Match.associate = (models) => {
    Match.belongsTo(models.Team, {
      foreignKey: "local_team_key",
      targetKey: "key",
      as: "local_team",
    });

    Match.belongsTo(models.Team, {
      foreignKey: "visit_team_key",
      targetKey: "key",
      as: "visit_team",
    });

    Match.belongsToMany(models.Pool, {
      through: models.PoolMatch,
      foreignKey: "match_id",
      otherKey: "pool_id",
      as: "pools",
    });
    Match.belongsTo(models.Tournament, {
      foreignKey: "tournament_key",
      targetKey: "key",
      as: "tournament",
    });
  };

  return Match;
};
