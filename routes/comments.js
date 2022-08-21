const express = require('express');
// need to have 'mergeParams' when accessing the params in app.js (Ex: :id)
const router = express.Router({ mergeParams: true });
const comments = require('../controllers/comments');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware')
const Housing = require('../models/housing');
const Comment = require('../models/comment');

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;