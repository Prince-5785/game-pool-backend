const {
  Tournament,
  Team,
  Match,
  League,
  Country,
  Region,
  Sport,
  TournamentTeam,
} = require("../models");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col, or, where, Transaction } = require("sequelize");
const attributes = require("../config/attributes");
const { raw } = require("express");
const express = require("express");
const { now } = require("sequelize/lib/utils");

exports.createLeague = catchAsync(async (req, res) => {
  const { key, name, sports_key, region_key, country_key } = req.body;

  const leagueExists = await League.findOne({
    where: {
      key: key,

    },
  });

  if (leagueExists) {
    return sendError(
      res,
      "League with this key already exists",
      httpStatus.BAD_REQUEST
    );
  }

  const league = await League.create({
    name,
    key,
    sports_key,
    region_key,
    country_key,
  });

  if (!league) {
    return sendError(
      res,
      "Failed to create league",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return sendSuccess(
    res,
    "League created successfully",
    httpStatus.CREATED,
    league
  );
});

exports.updateLeague = catchAsync(async (req, res) => {
  const { league_id } = req.params;
  const { name, key, sports_key, region_key, country_key } = req.body;
  const league = await League.findByPk(league_id);
  if (!league) {
    return sendError(res, "League not found", httpStatus.NOT_FOUND);
  }

  if (key && key !== league.key) {
    const existingLeague = await League.findOne({
      where: {
        key,
        id: { [Op.ne]: league_id }, // Exclude current league
      },
    });
    if (existingLeague) {
      return sendError(
        res,
        "League with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  const updatedLeague = await league.update({
    name: name || league.name,
    key: key || league.key,
    sports_key: sports_key || league.sports_key,
    region_key: region_key || league.region_key,
    country_key: country_key || league.country_key,
  });
  if (!updatedLeague) {
    return sendError(
      res,
      "Failed to update league",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
  return sendSuccess(
    res,
    "League updated successfully",
    httpStatus.OK,
    updatedLeague
  );
});

exports.listLeagues = catchAsync(async (req, res) => {
  const allLeagues = await League.findAll({
    attributes: [
      "id",
      "key",
      "name",
      "sports_key",
      "region_key",
      "country_key",
    ],
    include: [
      {
        model: Sport,
        as: "sport",
        attributes: ["id", "key", "name"],
      },
      {
        model: Region,
        as: "region",
        attributes: ["id", "key", "name"],
      },
      {
        model: Country,
        as: "country",
        attributes: ["id", "key", "name"],
      },
    ],
  });
  if (!allLeagues || allLeagues.length === 0) {
    return sendError(res, "No leagues found", httpStatus.OK);
  }
  return sendSuccess(
    res,
    "Leagues retrieved successfully",
    httpStatus.OK,
    allLeagues
  );
});

exports.getLeagueById = catchAsync(async (req, res) => {
  const { league_id } = req.params;
  const league = await League.findByPk(league_id, {
    attributes: [
      "id",
      "key",
      "name",
      "sports_key",
      "region_key",
      "country_key",
    ],
    include: [
      {
        model: Sport,
        as: "sport",
        attributes: ["id", "key", "name"],
      },
      {
        model: Region,
        as: "region",
        attributes: ["id", "key", "name"],
      },
      {
        model: Country,
        as: "country",
        attributes: ["id", "key", "name"],
      },
    ],
  });
  if (!league) {
    return sendError(res, "League not found", httpStatus.NOT_FOUND);
  }
  return sendSuccess(
    res,
    "League retrieved successfully",
    httpStatus.OK,
    league
  );
});

exports.deleteLeague = catchAsync(async (req, res) => {
  const { league_id } = req.params;
  const league = await League.findByPk(league_id);
  if (!league) {
    return sendError(res, "League not found", httpStatus.NOT_FOUND);
  }
  await league.destroy();
  return sendSuccess(res, "League deleted successfully", httpStatus.OK);
});

exports.createTournament = catchAsync(async (req, res) => {
  const { key, name, start_date, end_date, league_key, teams } = req.body;

  const tournamentExists = await Tournament.findOne({
    where: {
      key: key,
    },
  });
  if (tournamentExists) {
    return sendError(
      res,
      "Tournament with this key already exists",
      httpStatus.BAD_REQUEST
    );
  }

  if (!teams || teams.length === 0) {
    return sendError(
      res,
      "Teams are required to create a tournament",
      httpStatus.BAD_REQUEST
    );
  }

  const teamIds = teams.map((team) => team.id);

  const existingTeams = await Team.findAll({
    where: {
      id: {
        [Op.in]: teamIds,
      },
    },
    attributes: ["id", "name"],
  });

  if (existingTeams.length !== teams.length) {
    return sendError(
      res,
      "Some teams do not exist. Please check the team IDs.",
      httpStatus.BAD_REQUEST
    );
  }

  const tournament = await Tournament.create(
    {
      key,
      name,
      start_date,
      end_date,
      league_key,
    },
    {
      transaction: req.transaction,
    }
  );

  const tournamentTeamData = existingTeams.map((team) => ({
    tournament_id: tournament.id,
    team_id: team.id,
  }));

  await TournamentTeam.bulkCreate(tournamentTeamData, {
    transaction: req.transaction,
  });

  return sendSuccess(
    res,
    "Tournament created successfully",
    httpStatus.CREATED,
    {
      tournament: tournament,
      teams: existingTeams.map((team) => ({
        id: team.id,
        name: team.name,
      })),
    }
  );
});

exports.updateTournament = catchAsync(async (req, res) => {
  const { tournament_id } = req.params;
  const { name, key, start_date, end_date, league_key, teamsIds } = req.body;

  const tournament = await Tournament.findByPk(tournament_id);
  if (!tournament) {
    return sendError(res, "Tournament not found", httpStatus.NOT_FOUND);
  }

  // Check if the key is being updated and if it already exists
  if (key && key !== tournament.key) {
    const existingTournament = await Tournament.findOne({
      where: {
        key,
        id: { [Op.ne]: tournament_id }, // Exclude current tournament
      },
    });
    if (existingTournament) {
      return sendError(
        res,
        "Tournament with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  // Update tournament details
  const updatedTournament = await tournament.update({
    name: name || tournament.name,
    key: key || tournament.key,
    start_date: start_date || tournament.start_date,
    end_date: end_date || tournament.end_date,
    league_key: league_key || tournament.league_key,
  });

  // Remove all existing teams from the tournament
  await TournamentTeam.destroy({
    where: { tournament_id: updatedTournament.id },
    transaction: req.transaction,
  });

  // Add new teams to the tournament from teamIds
  let teams = [];
  if (teamsIds && teamsIds.length > 0) {
    const teamIds = teamsIds.map((teamId) => teamId.id);

    // Validate all team IDs exist
    const existingTeams = await Team.findAll({
      where: {
        id: {
          [Op.in]: teamIds,
        },
      },
      attributes: ["id", "name"],
    });

    if (existingTeams.length !== teamIds.length) {
      return sendError(
        res,
        "Some teams do not exist. Please check the team IDs.",
        httpStatus.BAD_REQUEST
      );
    }

    // Create new TournamentTeam entries
    const tournamentTeamData = teamIds.map((id) => ({
      tournament_id: updatedTournament.id,
      team_id: id,
    }));
    teams = await TournamentTeam.bulkCreate(tournamentTeamData, {
      transaction: req.transaction,
    });
  }

  return sendSuccess(res, "Tournament updated successfully", httpStatus.OK, {
    tournament: updatedTournament,
    teams,
  });
});

exports.listTournaments = catchAsync(async (req, res) => {
  const allTournaments = await Tournament.findAll({
    attributes: ["id", "key", "name", "start_date", "end_date"],
    include: [
      {
        model: League,
        as: "league",
        attributes: ["key", "name"],
      },
      {
        model: TournamentTeam,
        as: "tournamentTeam",
        attributes: ["team_id"],
        include: [
          {
            model: Team,
            as: "team",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  });

  if (!allTournaments || allTournaments.length === 0) {
    return sendError(res, "No tournaments found", httpStatus.OK);
  }
  return sendSuccess(
    res,
    "Tournaments retrieved successfully",
    httpStatus.OK,
    allTournaments
  );
});

exports.getTournamentById = catchAsync(async (req, res) => {
  const { tournament_id } = req.params;
  const tournament = await Tournament.findByPk(tournament_id, {
    attributes: ["id", "key", "name", "start_date", "end_date"],
    include: [
      {
        model: League,
        as: "league",
        attributes: ["key", "name"],
      },
      {
        model: TournamentTeam,
        as: "tournamentTeam",
        attributes: ["team_id"],
        include: [
          {
            model: Team,
            as: "team",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  });
  if (!tournament) {
    return sendError(res, "Tournament not found", httpStatus.NOT_FOUND);
  }
  return sendSuccess(
    res,
    "Tournament retrieved successfully",
    httpStatus.OK,
    tournament
  );
});

exports.deleteTournament = catchAsync(async (req, res) => {
  const { tournament_id } = req.params;
  const tournament = await Tournament.findByPk(tournament_id);
  if (!tournament) {
    return sendError(res, "Tournament not found", httpStatus.NOT_FOUND);
  }
  await tournament.destroy();
  return sendSuccess(res, "Tournament deleted successfully", httpStatus.OK);
});

exports.createTeam = catchAsync(async (req, res) => {
  const { name, key, country_key, sports_key } = req.body;
  const teamExists = await Team.findOne({
    where: {
      key: key,
    },
  });
  if (teamExists) {
    return sendError(res, "Team already exists", httpStatus.BAD_REQUEST);
  }

  const team = await Team.create({
    name,
    key,
    country_key,
    sports_key,
  });
  if (!team) {
    return sendError(
      res,
      "Failed to create team",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
  return sendSuccess(
    res,
    "Team created successfully",
    httpStatus.CREATED,
    team
  );
});

exports.updateTeam = catchAsync(async (req, res) => {
  const { team_id } = req.params;
  const { name, key, country_key, sports_key } = req.body;
  const team = await Team.findByPk(team_id);
  if (!team) {
    return sendError(res, "Team not found", httpStatus.NOT_FOUND);
  }

  if (key && key !== team.key) {
    const existingTeam = await Team.findOne({
      where: {
        key,
        id: { [Op.ne]: team_id }, // Exclude current team
      },
    });
    if (existingTeam) {
      return sendError(
        res,
        "Team with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  const updatedTeam = await team.update({
    name: name || team.name,
    key: key || team.key,
    country_key: country_key || team.country_key,
    sports_key: sports_key || team.sports_key,
  });
  if (!updatedTeam) {
    return sendError(
      res,
      "Failed to update team",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
  return sendSuccess(
    res,
    "Team updated successfully",
    httpStatus.OK,
    updatedTeam
  );
});

exports.listTeams = catchAsync(async (req, res) => {
  const allTeams = await Team.findAll({
    attributes: ["id", "key", "name", "country_key", "sports_key"],
    include: [
      {
        model: Country,
        as: "country",
        attributes: ["id", "key", "name"],
      },
      {
        model: Sport,
        as: "sport",
        attributes: ["id", "key", "name"],
      },
    ],
  });
  if (!allTeams || allTeams.length === 0) {
    return sendError(res, "No teams found", httpStatus.OK);
  }
  return sendSuccess(
    res,
    "Teams retrieved successfully",
    httpStatus.OK,
    allTeams
  );
});

exports.getTeamById = catchAsync(async (req, res) => {
  const { team_id } = req.params;
  const team = await Team.findByPk(team_id, {
    attributes: ["id", "key", "name", "country_key", "sports_key"],
    include: [
      {
        model: Country,
        as: "country",
        attributes: ["id", "key", "name"],
      },
      {
        model: Sport,
        as: "sport",
        attributes: ["id", "key", "name"],
      },
    ],
  });
  if (!team) {
    return sendError(res, "Team not found", httpStatus.NOT_FOUND);
  }
  return sendSuccess(res, "Team retrieved successfully", httpStatus.OK, team);
});

exports.deleteTeam = catchAsync(async (req, res) => {
  const { team_id } = req.params;
  const team = await Team.findByPk(team_id);
  if (!team) {
    return sendError(res, "Team not found", httpStatus.NOT_FOUND);
  }
  await team.destroy();
  return sendSuccess(res, "Team deleted successfully", httpStatus.OK);
});

exports.createMatch = catchAsync(async (req, res) => {
  const {
    key,
    match_start_date,
    match_start_time,
    tournament_key,
    local_team_key,
    visit_team_key,
  } = req.body;
  const localTeam = await Team.findOne({
    where: {
      key: local_team_key,
    },
  });
  if (!localTeam) {
    return sendError(res, "Local team not found", httpStatus.NOT_FOUND);
  }
  const visitTeam = await Team.findOne({
    where: {
      key: visit_team_key,
    },
  });
  if (!visitTeam) {
    return sendError(res, "Visit team not found", httpStatus.NOT_FOUND);
  }

  const tournamentDates = await Tournament.findOne({
    where: {
      key: tournament_key,
    },
    attributes: ["id", "name", "start_date", "end_date"],
  });
  if (!tournamentDates) {
    return sendError(
      res,
      "League not found or does not belong to a tournament",
      httpStatus.NOT_FOUND
    );
  }

  const { start_date, end_date } = tournamentDates;
  if (
    new Date(match_start_date) < new Date(start_date) ||
    new Date(match_start_date) > new Date(end_date)
  ) {
    return sendError(
      res,
      "Match start time must be within the tournament dates",
      httpStatus.BAD_REQUEST
    );
  }

  const existingMatch = await Match.findOne({
    where: {
      local_team_key: local_team_key || visit_team_key,
      visit_team_key: visit_team_key || local_team_key,
      match_start_date: match_start_date,
      match_start_time: match_start_time,
      tournament_key: tournament_key,
    },
  });
  if (existingMatch) {
    return sendError(
      res,
      "Match already exists between these teams at the specified time",
      httpStatus.BAD_REQUEST
    );
  }

  const match = await Match.create({
    key,
    match_start_date,
    match_start_time,
    tournament_key,
    local_team_key: localTeam.key,
    visit_team_key: visitTeam.key,
    local_team_points: 0,
    visit_team_points: 0,
    status: false, // false = pending, true = completed
  });

  if (!match) {
    return sendError(
      res,
      "Failed to create match",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return sendSuccess(
    res,
    "Match created successfully",
    httpStatus.CREATED,
    match
  );
});

exports.updateMatch = catchAsync(async (req, res) => {
  const { match_id } = req.params;
  const {
    key,
    match_start_date,
    match_start_time,
    tournament_key,
    local_team_key,
    visit_team_key,
    local_team_points,
    visit_team_points,
    status,
  } = req.body;
  const match = await Match.findByPk(match_id);
  if (!match) {
    return sendError(res, "Match not found", httpStatus.NOT_FOUND);
  }

  if (key && key !== match.key) {
    const existingMatch = await Match.findOne({
      where: {
        key,
        id: { [Op.ne]: match_id }, // Exclude current match
      },
    });
    if (existingMatch) {
      return sendError(
        res,
        "Match with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  if (
    new Date(match_start_date) > new Date(now) &&
    new Date(match_start_time) > new Date(now)
  ) {
    if (
      local_team_points !== undefined ||
      visit_team_points !== undefined ||
      status === true
    ) {
      return sendError(
        res,
        "Cannot update points and status for a match that has not started",
        httpStatus.BAD_REQUEST
      );
    }
  }

  const updatedMatch = await match.update({
    key: key || match.key,
    match_start_date: match_start_date || match.match_start_date,
    match_start_time: match_start_time || match.match_start_time,
    tournament_key: tournament_key || match.tournament_key,
    local_team_key: local_team_key || match.local_team_key,
    visit_team_key: visit_team_key || match.visit_team_key,
    local_team_points:
      local_team_points !== undefined
        ? local_team_points
        : match.local_team_points,
    visit_team_points:
      visit_team_points !== undefined
        ? visit_team_points
        : match.visit_team_points,
    status: status !== undefined ? status : match.status,
  });
  if (!updatedMatch) {
    return sendError(
      res,
      "Failed to update match",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return sendSuccess(
    res,
    "Match updated successfully",
    httpStatus.OK,
    updatedMatch
  );
});

exports.listMatches = catchAsync(async (req, res) => {
  const allMatches = await Match.findAll({
    attributes: [
      "id",
      "key",
      "match_start_date",
      "match_start_time",
      "tournament_key",
      "local_team_key",
      "visit_team_key",
      "local_points",
      "visit_points",
      "status",
    ],
    include: [
      {
        model: Team,
        as: "local_team",
        attributes: ["id", "name"],
      },
      {
        model: Team,
        as: "visit_team",
        attributes: ["id", "name"],
      },
      {
        model: Tournament,
        as: "tournament",
        attributes: ["id", "key", "name"],
        include: [
          {
            model: League,
            as: "league",
            attributes: ["id", "key", "name"],
          },
        ],
      },
    ],
  });
  if (!allMatches || allMatches.length === 0) {
    return sendError(res, "No matches found", httpStatus.OK);
  }
  return sendSuccess(
    res,
    "Matches retrieved successfully",
    httpStatus.OK,
    allMatches
  );
});

exports.getMatchById = catchAsync(async (req, res) => {
  const { match_id } = req.params;
  const match = await Match.findByPk(match_id, {
    attributes: [
      "id",
      "key",
      "match_start_date",
      "match_start_time",
      "tournament_key",
      "local_team_key",
      "visit_team_key",
      "local_points",
      "visit_points",
      "status",
    ],
    include: [
      {
        model: Team,
        as: "local_team",
        attributes: ["id", "name"],
      },
      {
        model: Team,
        as: "visit_team",
        attributes: ["id", "name"],
      },
    ],
  });
  if (!match) {
    return sendError(res, "Match not found", httpStatus.NOT_FOUND);
  }
  return sendSuccess(res, "Match retrieved successfully", httpStatus.OK, match);
});

exports.deleteMatch = catchAsync(async (req, res) => {
  const { match_id } = req.params;
  const match = await Match.findByPk(match_id);
  if (!match) {
    return sendError(res, "Match not found", httpStatus.NOT_FOUND);
  }
  await match.destroy();
  return sendSuccess(res, "Match deleted successfully", httpStatus.OK);
});
