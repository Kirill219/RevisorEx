import AuditorsGroup from "../models/revisorsGroup.js";
import Comment from "../models/comment.js";

export class Comments {
    static async createComment(req, res) {
        try {
            const comment = new Comment({
                title: req.body.title,
                createdBy: req.userId
            });
            const savedComment = await comment.save();
            const revisorsGroup = await AuditorsGroup.findById(req.params.id);
            revisorsGroup.comments.push(savedComment._id);
            await revisorsGroup.save();
            res.json(savedComment);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to add comment');
        }
    };

    static async getComments(req, res) {
        try {
            const revisorsGroup = await AuditorsGroup.findById(req.params.id)
                .populate({path: 'comments', populate: {path: 'createdBy'},
            })
                .exec();
            const comments = revisorsGroup.comments;
            res.json(comments);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get comments');
        }
    };

    static async deleteComment(req, res) {
        try {
            const commentId = {
                _id: req.params.id
            };
            await Comment.deleteOne(commentId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete tag');
        }
    };
}
