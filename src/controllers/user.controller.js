import Joi from 'joi';
import responseHandler from '../configs/response.config';
import db from '../models';

// async function createUser(req, res) {
//   try {
//     const data = { email: 'quyendv@example.com', uid: '123', name: 'quyen' }; // req.body

//     const [user, isNew] = await db.User.findOrCreate({
//       where: { email: data.email },
//       default: { name: data.name, uid: data.uid },
//     });
//     // if (!isNew) console.log('Already created');

//     return responseHandler.created(res, user);
//   } catch (error) {
//     return responseHandler.internalServerError(res);
//   }
// }

async function updateUser(req, res) {
  const nameDto = Joi.string().optional();
  const profileDto = Joi.object({
    sex: Joi.bool().optional(),
    dateOfBirth: Joi.string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .message('"profile.dateOfBirth" require "yyyy-mm-dd" format')
      .optional(),
    country: Joi.string().optional(),
    province: Joi.string().optional(),
    district: Joi.string().optional(),
    ward: Joi.string().optional(),
    address: Joi.string().optional(),
    height: Joi.number().max(10).message('"profile.height" must be a number (meters)').optional(), // m
    weight: Joi.number().optional(), // kg
  });

  const { error } = Joi.object({ name: nameDto, profile: profileDto })
    .min(1) /* require at least one key to update */
    .validate(req.body);
  if (error) return responseHandler.badRequest(res, error.details[0]?.message);

  try {
    const userPayload = req.user;
    const { name, profile } = req.body;

    // NOTE: User existence is already checked at the verifyToken middleware.

    if (name) {
      const [updatedCount] = await db.User.update(
        { name },
        { where: { email: userPayload.email } },
      );
      if (!updatedCount) {
        return responseHandler.badRequest(
          res,
          `Cannot update username. User ${email} may be not found`,
        );
      }
    }

    if (profile) {
      const existingProfile = await db.Profile.findOne({ where: { userId: userPayload.id } });
      if (!existingProfile) {
        await db.Profile.create({
          ...profile,
          userId: userPayload.id,
        });
      } else {
        const [updatedCount] = await db.Profile.update(
          { ...profile },
          { where: { userId: userPayload.id } },
        );
        if (!updatedCount)
          return responseHandler.badRequest(
            res,
            `Update profile's user "${userPayload.email}" failed`,
          );
      }
    }

    const newData = await db.User.findOne({
      where: { id: userPayload.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        { model: db.Profile, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'profile' },
      ],
    });

    return responseHandler.created(res, newData);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function getOwnInfo(req, res) {
  try {
    const response = await db.User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        { model: db.Disease, attributes: ['id', 'name'], as: 'diseases' },
        { model: db.Profile, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'profile' },
      ],
    });
    return responseHandler.ok(res, response);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function setDiseases(req, res) {
  const diseasesDto = Joi.array().required().items(Joi.string().required());
  const { error } = Joi.object({ diseases: diseasesDto }).validate(req.body);
  if (error) return responseHandler.badRequest(res, error.details[0]?.message);

  try {
    const user = req.user;
    const { diseases: newDiseases } = req.body;

    const existingDiseases = await db.Disease.findAll({
      where: { userId: user.id },
      attributes: ['name'],
    }); // { name: string }[]

    const toDelete = existingDiseases.filter((d) => !newDiseases.includes(d.name));
    const toAdd = newDiseases.filter((d) => !existingDiseases.some((cd) => cd.name === d));

    if (toDelete.length > 0) {
      await db.Disease.destroy({ where: { name: toDelete.map((d) => d.name), userId: user.id } });
    }

    if (toAdd.length > 0) {
      await db.Disease.bulkCreate(toAdd.map((name) => ({ name, userId: user.id })));
    }

    const newData = await db.Disease.findAll({ userId: user.id });
    return responseHandler.created(res, newData);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

export default { updateUser, setDiseases, getOwnInfo };
