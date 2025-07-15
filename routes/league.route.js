const express = require('express');
const router = express.Router();
const leagueController = require('../controllers/league.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createLeagueValidateSchema, updateLeagueValidateSchema, getLeagueValidateSchema, createTournamentValidateSchema, updateTournamentValidateSchema, getTournamentValidateSchema, createTeamValidateSchema, updateTeamValidateSchema, getTeamValidateSchema, createMatchValidateSchema, updateMatchValidateSchema, getMatchValidateSchema, deleteLeagueValidateSchema, deleteMatchValidateSchema, deleteTeamValidateSchema,deleteTournamentValidateSchema } = require('../validations/league.validation');
router.use(authMiddleware, authorizeRoles('admin'));


router.post('/tournament',validate(createTournamentValidateSchema),leagueController.createTournament);
router.put('/tournament/:tournament_id', validate(updateTournamentValidateSchema), leagueController.updateTournament);
router.get('/tournament', leagueController.listTournaments);
router.get('/tournament/:tournament_id', validate(getTournamentValidateSchema), leagueController.getTournamentById);
router.delete('/tournament/:tournament_id', validate(deleteTournamentValidateSchema), leagueController.deleteTournament);

// Team routes
router.post('/team', validate(createTeamValidateSchema), leagueController.createTeam);
router.put('/team/:team_id', validate(updateTeamValidateSchema), leagueController.updateTeam);
router.get('/team/:team_id', validate(getTeamValidateSchema), leagueController.getTeamById);
router.get('/team', leagueController.listTeams);
router.delete('/team/:team_id', validate(deleteTeamValidateSchema), leagueController.deleteTeam);

// Match routes
router.post('/match', validate(createMatchValidateSchema), leagueController.createMatch);
router.put('/match/:match_id', validate(updateMatchValidateSchema), leagueController.updateMatch);
router.get('/match/:match_id', validate(getMatchValidateSchema), leagueController.getMatchById);
router.get('/match', leagueController.listMatches);
router.delete('/match/:match_id', validate(deleteMatchValidateSchema), leagueController.deleteMatch);

router.post('/', validate(createLeagueValidateSchema), leagueController.createLeague);
router.put('/:league_id', validate(updateLeagueValidateSchema), leagueController.updateLeague);
router.get('/:league_id', validate(getLeagueValidateSchema), leagueController.getLeagueById);
router.get('/', leagueController.listLeagues);
router.delete('/:league_id', validate(deleteLeagueValidateSchema), leagueController.deleteLeague);


// router.post('/league/:league_id/teams', validate(insertTeamsIntoLeagueValidateSchema), leagueController.insertTeamsIntoLeague);
// router.post('/league/:league_id/match', validate(createMatchValidateSchema), leagueController.createMatch);
// router.post(
//   "/",
//   validate(tournamentCreateValidateSchema),
//   tournamentController.createTournament
// );

// router.get('/league', tournamentController.listAllLeagues);
// router.get('/', tournamentController.listTournaments);
// router.get('/:tournament_id/league',validate(listLeaguesValidateSchema),tournamentController.listLeagues);
// router.get('/league/:league_id/teams',validate(listAllTeamsValidateSchema),tournamentController.listAllTeams);
// router.get('/league/:league_id/matches',validate(listMatchesValidateSchema),tournamentController.listMatches);

module.exports = router;
