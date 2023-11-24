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

    const locations = await locationService.getLocationHistoryByTimeRange(userId, from, to);
    return responseHandler.ok(res, locations);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function getLocationHistoryToday(req, res) {
  try {
    const [from, to] = getTimeRangeByDate();
    const locations = await locationService.getLocationHistoryByTimeRange(req.user.id, from, to);
    const formattedLocations = locations.map((item) => ({
      ...item.toJSON(),
      time: item.epoch,
      epoch: undefined,
      timestamp: undefined,
    }));
    return responseHandler.ok(res, formattedLocations);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function getLocationHistoryLast7Days(req, res) {
  try {
    const [from, to] = getTimeRange();
    const locations = await locationService.getLocationHistoryByTimeRange(req.user.id, from, to);

    /** Record<dateStr, FormattedLocationEntity[], (FormattedLocationEntity rename prop "epoch" to "time", and remove "timestamp" prop) */
    const filteredByDate = locations.reduce((acc, cur) => {
      const vnDate = new Date(cur.timestamp); // UTC
      vnDate.setTime(vnDate.getTime() + 7 * 60 * 60 * 1000);

      const vnISO = vnDate.toISOString().slice(0, 10);
      if (!acc[vnISO]) acc[vnISO] = [];

      const jsonCur = cur.toJSON(); // get JSON data from entity db
      acc[vnISO].push({ ...jsonCur, time: jsonCur.epoch, epoch: undefined, timestamp: undefined });

      return acc;
    }, {});

    /** Array<{ time: startDayEpoch, history: FormattedLocationEntity[] }> */
    const result = Object.keys(filteredByDate).map((dateStr) => {
      return {
        time: Math.ceil(new Date(dateStr).getTime() / 1000),
        history: filteredByDate[dateStr],
      };
    });
    return responseHandler.ok(res, result);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function addLocationHistory(req, res) {
  const dto = Joi.object({
    lat: Joi.number().required(),
    long: Joi.number().required(),
    aqi: Joi.number().integer().required(),
    time: Joi.number().integer().min(0).required(),
  }).required();
  const { error } = dto.validate(req.body);
  if (error) return responseHandler.badRequest(res, error.details[0]?.message);

  try {
    // TODO: check timestamp < now
    const { id: userId } = req.user;
    const location = await db.LocationHistory.create({
      userId,
      ...req.body,
      epoch: req.body.time,
      timestamp: new Date(req.body.time * 1000),
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
