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

export function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());

  return next();
}

export async function listAll(req, res) {
  const skip = parseInt(req.query.skip, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const promise = await Promise.all([
      User.find({}),
      User.list({ limit, skip })
    ]);

    const users = promise[1].reduce((arr, user) => {

      arr.push({
        ...user.toJSON(),
      });

      return arr;
    }, []);

    return res.status(HTTPStatus.OK).send(users);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await user.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
   
    await user.remove();
    return res.sendStatus(HTTPStatus.OK);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}