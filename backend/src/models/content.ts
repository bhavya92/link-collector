import { Schema, Types, model } from "mongoose";

const contentTypes = ['image', 'video','article', 'audio']
const schema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags : [{ type: Types.ObjectId, ref: 'Tag' }],
    userId : { type : Types.ObjectId, ref: 'Users', required: true },
});

export const ContentModel = model('Content', schema);
