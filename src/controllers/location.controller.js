import Joi from 'joi';
import responseHandler from '../configs/response.config';
import { getTimeRange, getTimeRangeByDate } from '../helpers/common.helper';
import db from '../models';
import * as locationService from '../services/location.service';

async function getLocationHistory(req, res) {
  const dateQueryDto = Joi.date().iso().required();
  const { error } = Joi.object({ date: dateQueryDto }).validate(req.query);
  if (error) return responseHandler.badRequest(res, error.details[0]?.message);

  try {
    const { id: userId } = req.user;
    const { date } = req.query;
    const [from, to] = getTimeRangeByDate(date);

    return locationService.getLocationHistoryByTimeRange(res, userId, from, to);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function getLocationHistoryToday(req, res) {
  try {
    const [from, to] = getTimeRangeByDate();
    return locationService.getLocationHistoryByTimeRange(res, req.user.id, from, to);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function getLocationHistoryLast7Days(req, res) {
  try {
    const [from, to] = getTimeRange();
    return locationService.getLocationHistoryByTimeRange(res, req.user.id, from, to);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function addLocationHistory(req, res) {
  const dto = Joi.object({
    lat: Joi.number().required(),
    long: Joi.number().required(),
    aqi: Joi.number().required(),
    timestamp: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/)
      .message('"timestamp" require iso format, eg: "2023-12-21T00:00:00Z"')
      .required(),
  }).required();
  const { error } = dto.validate(req.body);
  if (error) return responseHandler.badRequest(res, error.details[0]?.message);

  try {
    // TODO: check timestamp < now
    const { id: userId } = req.user;
    const location = await db.LocationHistory.create({
      userId,
      ...req.body,
      timestamp: new Date(req.body.timestamp),
    });
    return responseHandler.created(res, location);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

export default {
  getLocationHistory,
  addLocationHistory,
  getLocationHistoryToday,
  getLocationHistoryLast7Days,
};
