import * as admin from 'firebase-admin';
import responseHandler from '../configs/response.config.js';

export async function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) return responseHandler.badRequest(res, 'Missing Auth Token');

  const match = authToken.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    return responseHandler.unauthorized(res, 'Invalid Bearer Token');
  }

  try {
    const tokenString = match[1];
    const decodedToken = await admin.auth().verifyIdToken(tokenString);

    const { email, /*  uid, */ picture, name } = decodedToken;

    // Link user from firebase to database
    // const [user] = await db.User.findOrCreate({
    //   where: { email },
    //   defaults: { name: name ?? email.split('@')[0], uid },
    // });

    // req.user = user;

    req.user = { email, picture, name };

    next();
  } catch (error) {
    return responseHandler.unauthorized(res, error.message);
  }
}
