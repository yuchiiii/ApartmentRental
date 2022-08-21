const Housing = require('../models/housing');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const housing = await Housing.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    housing.comments.push(comment);
    await comment.save();
    await housing.save();
    req.flash('success', 'Created a new comment!')
    res.redirect(`/housings/${housing._id}`)
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Housing.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted a comment!')
    res.redirect(`/housings/${id}`);
}

