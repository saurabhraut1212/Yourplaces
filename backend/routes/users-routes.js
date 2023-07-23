import express from 'express'

import { check } from 'express-validator';

const router = express.Router()
import {getAllUsers,signup,login} from "../controllers/users-controller.js";
import fileUpload from '../middleware/file-upload.js';

router.get('/',getAllUsers )

router.post('/signup',
fileUpload.single('image'),
[check('name').not().isEmpty(),
check('email').normalizeEmail().isEmail(),
check('password').isLength({min:6})],
signup)

router.post('/login',login)

export default router;