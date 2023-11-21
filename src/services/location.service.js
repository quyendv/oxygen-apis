import { Op } from 'sequelize';
import responseHandler from '../configs/response.config';
import db from '../models';

export async function getLocationHistoryByTimeRange(res, userId, from, to) {
  const locations = await db.LocationHistory.findAll({
    where: { userId, timestamp: { [Op.between]: [from, to] } },
    order: [['timestamp', 'ASC']],
  });
  return responseHandler.ok(res, locations);
}
