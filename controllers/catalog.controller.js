const { Tournament, Team, Match, League, Country, Region, Sport, TournamentTeam } = require("../models");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col, or, where } = require("sequelize");
const attributes = require("../config/attributes");
const { raw } = require("express");
const express = require("express");

/**
 * Sport Controllers
 */

// Create a new sport
exports.createSport = catchAsync(async (req, res) => {
  const { key, name, allows_tie } = req.body;

  // Check if sport with same key already exists
  const sportExists = await Sport.findOne({
    where: { key }
  });

  if (sportExists) {
    return sendError(res, "Sport with this key already exists", httpStatus.CONFLICT);
  }

  const sport = await Sport.create({
    key,
    name,
    allows_tie: allows_tie || false
  });

  return sendSuccess(res, "Sport created successfully", httpStatus.CREATED, sport);
});

// Update a sport
exports.updateSport = catchAsync(async (req, res) => {
  const { sport_id } = req.params;
  const { key, name, allows_tie } = req.body;

  const sport = await Sport.findByPk(sport_id);
  if (!sport) {
    return sendError(res, "Sport not found", httpStatus.NOT_FOUND);
  }

  // If key is being changed, make sure it's not already in use
  if (key && key !== sport.key) {
    const keyExists = await Sport.findOne({
      where: { key , id: { [Op.ne]: sport_id } }
    });

    if (keyExists) {
      return sendError(res, "Sport with this key already exists", httpStatus.CONFLICT);
    }
  }

  await sport.update({
    key: key || sport.key,
    name: name || sport.name,
    allows_tie: allows_tie !== undefined ? allows_tie : sport.allows_tie
  });

  return sendSuccess(res, "Sport updated successfully", httpStatus.OK, sport);
});

// Get all sports
exports.getAllSports = catchAsync(async (req, res) => {
  const sports = await Sport.findAll({
    attributes: ['id', 'key', 'name', 'allows_tie'],
    order: [['name', 'ASC']]
  });

  return sendSuccess(res, "Sports retrieved successfully", httpStatus.OK, sports);
});

// Get sport by id
exports.getSportById = catchAsync(async (req, res) => {
  const { sport_id } = req.params;

  const sport = await Sport.findByPk(sport_id, {
    attributes: ['id', 'key', 'name', 'allows_tie'],
    include: [
      {
        model: League,
        as: 'league',
        attributes: ['id', 'key', 'name']
      },
      {
        model: Team,
        as: 'team',
        attributes: ['id', 'key', 'name']
      }
    ]
  });

  if (!sport) {
    return sendError(res, "Sport not found", httpStatus.NOT_FOUND);
  }

  return sendSuccess(res, "Sport retrieved successfully", httpStatus.OK, sport);
});

exports.deleteSport = catchAsync(async (req, res) => {
  const { sport_id } = req.params;
  const sport = await Sport.findByPk(sport_id);
  if (!sport) {
    return sendError(res, "Sport not found", httpStatus.NOT_FOUND);
  }

  await sport.destroy();
  return sendSuccess(res, "Sport deleted successfully", httpStatus.OK);
});

/**
 * Region Controllers
 */

// Create a new region
exports.createRegion = catchAsync(async (req, res) => {
  const { key, name } = req.body;

  // Check if region with same key already exists
  const regionExists = await Region.findOne({
    where: { key }
  });

  if (regionExists) {
    return sendError(res, "Region with this key already exists", httpStatus.CONFLICT);
  }

  const region = await Region.create({
    key,
    name
  });

  return sendSuccess(res, "Region created successfully", httpStatus.CREATED, region);
});

// Update a region
exports.updateRegion = catchAsync(async (req, res) => {
  const { region_id } = req.params;
  const { key, name } = req.body;

  const region = await Region.findByPk(region_id);
  if (!region) {
    return sendError(res, "Region not found", httpStatus.NOT_FOUND);
  }

  // If key is being changed, make sure it's not already in use
  if (key && key !== region.key) {
    const keyExists = await Region.findOne({
      where: { key , id: { [Op.ne]: region_id } }
    });

    if (keyExists) {
      return sendError(res, "Region with this key already exists", httpStatus.CONFLICT);
    }
  }

  await region.update({
    key: key || region.key,
    name: name || region.name
  });

  return sendSuccess(res, "Region updated successfully", httpStatus.OK, region);
});

// Get all regions
exports.getAllRegions = catchAsync(async (req, res) => {
  const regions = await Region.findAll({
    attributes: ['id', 'key', 'name'],
    order: [['name', 'ASC']]
  });

  return sendSuccess(res, "Regions retrieved successfully", httpStatus.OK, regions);
});

// Get region by id
exports.getRegionById = catchAsync(async (req, res) => {
  const { region_id } = req.params;

  const region = await Region.findByPk(region_id, {
    attributes: ['id', 'key', 'name']
  });

  if (!region) {
    return sendError(res, "Region not found", httpStatus.NOT_FOUND);
  }

  return sendSuccess(res, "Region retrieved successfully", httpStatus.OK, region);
});

exports.deleteRegion = catchAsync(async (req, res) => {
  const { region_id } = req.params;
  const region = await Region.findByPk(region_id);
  if (!region) {
    return sendError(res, "Region not found", httpStatus.NOT_FOUND);
  }

  await region.destroy();
  return sendSuccess(res, "Region deleted successfully", httpStatus.OK);
});

/**
 * Country Controllers
 */

exports.listCountryKeys = catchAsync(async (req, res) => {
  const countries = await Country.findAll({
    attributes: ['id', 'key', 'name'],
    order: [['name', 'ASC']]
  });
  if (!countries || countries.length === 0) {
    return sendError(res, "No countries found", httpStatus.NOT_FOUND);
  }
  return sendSuccess(res, "Countries retrieved successfully", httpStatus.OK, countries);
});
