import { Op } from 'sequelize';
import db from '../models';

export async function getLocationHistoryByTimeRange(userId, from, to) {
  const locations = await db.LocationHistory.findAll({
    where: { userId, timestamp: { [Op.between]: [from, to] } },
    order: [['timestamp', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  return locations;
}
