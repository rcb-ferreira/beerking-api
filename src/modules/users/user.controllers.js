import HTTPStatus from 'http-status';
import User from './user.model';

export async function signUp(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function listAll(req, res) {
  // const skip = parseInt(req.query.skip, 10) || 0;
  // const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const promise = await Promise.all([
      User.find({}),
    ]);
    const users = promise;

    return res.status(HTTPStatus.OK).send(users);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());

  return next();
}
