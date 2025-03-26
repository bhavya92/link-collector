import { Schema, Types, model } from "mongoose";

const contentTypes = ['image', 'video','article', 'audio', 'document','other']
const schema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags : [{ type: Types.ObjectId, ref: 'tags' }],
    userId : { type : Types.ObjectId, ref: 'users', required: true },
},{ timestamps: true });

export const ContentModel = model('content', schema);
