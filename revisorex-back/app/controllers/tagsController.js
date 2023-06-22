import Tag from "../models/tag.js";

export class Tags {
    static async createTag(req, res) {
        try {
            const enteredTitle = {
                title: req.body.title
            };
            const existedTag = await Tag.findOne(enteredTitle);
            if (existedTag) {
                return res.status(400).json({
                    message: 'Tag is already added'
                });
            }
            const tag = new Tag(enteredTitle);
            const addedTag = await tag.save();
            res.json(addedTag);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to add tag');
        }
    };

    static async getTags(req, res) {
        try {
            const tags = await Tag.find();
            res.json(tags);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get tags');
        }
    };

    static async deleteTag(req, res) {
        try {
            const tagId = {
                _id: req.body.id
            };
            await Tag.deleteOne(tagId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete tag');
        }
    };
}
