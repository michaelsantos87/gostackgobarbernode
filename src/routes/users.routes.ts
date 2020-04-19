import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUsersServices from '../services/CreateUserService';

import ensureAuthenticaded from '../middlewares/ensureAuthenticated';

import UpdateUserAvatarService from '../services/UpdateUserAvatarServices';

const users = Router();
const upload = multer(uploadConfig);

users.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUsersServices();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

users.patch(
  '/avatar',
  ensureAuthenticaded,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default users;
