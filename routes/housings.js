const express = require('express');
const router = express.Router();
const housings = require('../controllers/housings');
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateHousing } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Housing = require('../models/housing');

router.route('/')
    .get(catchAsync(housings.index))
    .post(isLoggedIn, upload.array('image'), validateHousing, catchAsync(housings.createHousing))

// has to set before /:id, or would be overrode
router.get('/new', isLoggedIn, housings.renderNewForm);

router.route('/:id')
    .get(catchAsync(housings.showHousing))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHousing, catchAsync(housings.updateHousing))
    .delete(isLoggedIn, isAuthor, catchAsync(housings.deleteHousing));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(housings.renderEditForm));


module.exports = router;
