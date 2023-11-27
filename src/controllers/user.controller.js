import Joi from 'joi';
import responseHandler from '../configs/response.config';
import db from '../models';
import storageService from '../services/storage.service';

async function createUser(req, res) {
  try {
    const { name, email, picture } = req.user;

    const [user, isNew] = await db.User.findOrCreate({
      where: { email },
      defaults: { name: name ?? email.split('@')[0], avatar: picture },
      attributes: { exclude: ['createdAt', 'updatedAt', 'avatarKey'] },
    });

    return responseHandler.created(res, user);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function updateUser(req, res) {
  const nameDto = Joi.string().optional();
  const profileDto = Joi.object({
    sex: Joi.bool().optional(),
    dateOfBirth: Joi.number().integer().optional(),
    country: Joi.string().optional(),
    province: Joi.string().optional(),
    district: Joi.string().optional(),
    ward: Joi.string().optional(),
    address: Joi.string().optional(),
    height: Joi.number().max(10).message('"profile.height" must be a number (meters)').optional(), // m
    weight: Joi.number().min(0).optional(), // kg
  });

  const { error } = Joi.object({ name: nameDto, profile: profileDto })
    .min(1) /* require at least one key to update */
    .validate(req.body);
  if (error) return responseHandler.badRequest(res, error.details[0]?.message);

  try {
    const { email } = req.user;
    const { name, profile } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (!existingUser) return responseHandler.notFound(res, `User "${email}" has not logged in.`);

    if (name) {
      const [updatedCount] = await db.User.update({ name }, { where: { email } });
      if (!updatedCount) {
        return responseHandler.badRequest(
          res,
          `Cannot update username. User ${email} may be not found`,
        );
      }
    }

    if (profile) {
      const existingProfile = await db.Profile.findOne({ where: { userId: existingUser.id } });
      if (!existingProfile) {
        await db.Profile.create({ ...profile, userId: existingUser.id });
      } else {
        const [updatedCount] = await db.Profile.update(
          { ...profile },
          { where: { userId: existingUser.id } },
        );
        if (!updatedCount)
          return responseHandler.badRequest(res, `Update profile's user "${email}" failed`);
      }
    }

    const newData = await db.User.findOne({
      where: { id: existingUser.id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'avatarKey'] },
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
    const { email } = req.user;
    const response = await db.User.findOne({
      where: { email },
      attributes: { exclude: ['createdAt', 'updatedAt', 'avatarKey'] },
      include: [
        { model: db.Disease, attributes: ['id', 'name'], as: 'diseases' },
        { model: db.Profile, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'profile' },
      ],
    });
    if (!response) return responseHandler.notFound(res, `User "${email}" has not logged in.`);
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
    const { diseases: newDiseases } = req.body;
    const { email } = req.user;

    const existingUser = await db.User.findOne({ where: { email } });
    if (!existingUser) return responseHandler.notFound(res, `User "${email}" has not logged in.`);

    const existingDiseases = await db.Disease.findAll({
      where: { userId: existingUser.id },
      attributes: ['name'],
    }); // { name: string }[]

    const toDelete = existingDiseases.filter((d) => !newDiseases.includes(d.name));
    const toAdd = newDiseases.filter((d) => !existingDiseases.some((cd) => cd.name === d));

    if (toDelete.length > 0) {
      await db.Disease.destroy({
        where: { name: toDelete.map((d) => d.name), userId: existingUser.id },
      });
    }

    if (toAdd.length > 0) {
      await db.Disease.bulkCreate(toAdd.map((name) => ({ name, userId: existingUser.id })));
    }

    const newData = await db.Disease.findAll({ userId: existingUser.id });
    return responseHandler.created(res, newData);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

async function setAvatar(req, res) {
  if (!req.file) return responseHandler.badRequest(res, '"file" is require');

  try {
    const { email } = req.user;
    const user = await db.User.findOne({ where: { email } });
    if (!user) return responseHandler.notFound(res, `User ${email} not found`);

    const { filename, publicUrl } = await storageService.uploadFile(req.file, 'avatars');
    if (user.avatarKey) {
      await storageService.deleteFile(user.avatarKey);
    }

    user.avatar = publicUrl;
    user.avatarKey = filename;
    await user.save();
    await user.reload();

    return responseHandler.ok(res, user);
  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
}

export default { createUser, updateUser, setDiseases, getOwnInfo, setAvatar };
