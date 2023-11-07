import responseHandler from '../configs/response.config';
import db from '../models';

async function createUser(req, res, next) {
  try {
    // Test
    const data = { email: 'quyendv@example.com', uid: '123', name: 'quyen' }; // req.body

    const [user, isNew] = await db.User.findOrCreate({
      where: { email: data.email, uid: data.uid },
      default: { name: data.name },
    });
    // if (!isNew) console.log('Already created');

    return responseHandler.created(res, 'Create user successfully', { user });
  } catch (error) {
    return responseHandler.internalServerError(res);
  }
}

async function updateUser(req, res, next) {
  try {
    // Test
    const data = { email: 'quyendv@example.com', uid: '123', name: 'quyen' }; // req.body

    const [updatedCount] = await db.User.update({ name: data.name }, { where: { uid: data.uid } });

    if (!updatedCount) return responseHandler.badRequest(res, `Cannot find user "${data.uid}"`);

    return responseHandler.created(res, 'Update user successfully');
  } catch (error) {
    return responseHandler.internalServerError(res);
  }
}

export default { createUser, updateUser };
