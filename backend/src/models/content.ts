import { Schema, Types, model } from "mongoose";

const contentTypes = ['image', 'video','article', 'audio', 'document','other','social']
const schema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    faiss_id: {type:String, required:true},
    title: { type: String, required: true },
    tags : [{ type: Types.ObjectId, ref: 'tags' }],
    userId : { type : Types.ObjectId, ref: 'users', required: true },
},{ timestamps: true });

export const ContentModel = model('content', schema);
