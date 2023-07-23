import express from 'express'
import { check } from 'express-validator';



import { getPlaceById ,getPlacesByUserId ,createPlace,updatePlace,deletePlace} from '../controllers/places-controller.js';

import fileUpload from '../middleware/file-upload.js';
import checkAuth from '../middleware/check-auth.js';


const router = express.Router()

 router.get('/:pid',getPlaceById)

 router.get('/user/:uid',getPlacesByUserId);
 router.use(checkAuth)


 router.post('/',
 fileUpload.single('image'),
 [check('title').not().isEmpty(),
  check('description').isLength({min:5}),
  check('address').not().isEmpty()
],createPlace)

 router.patch('/:pid',
 [check('title').not().isEmpty(),
 check('description').isLength({min:5})

 ],
 updatePlace);

 router.delete('/:pid',deletePlace)

 export default router;
