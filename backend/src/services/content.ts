import { ContentInput, contentSchema, I_updateContent } from "../utils/input_validation.js";
import { categorizeByDomaint } from "../utils/linkType/categorizeBuUrl.js"
import { categorizeByExtension } from "../utils/linkType/categorizeByExt.js"
import { ContentModel } from "../models/content.js";
import { TagModel } from "../models/tags.js";
import mongoose from "mongoose";
import { DataNotFoundError } from "../utils/dataNotFound.js";
import { appLogger } from "../utils/logger.js";


export const find_category = (link: string) => {
    return  categorizeByExtension(link) || 
            categorizeByDomaint(link) ||
            "other";
}

export const create_content = async(data: ContentInput, userId: string) => {
    const parsedData = await contentSchema.spa(data);
    if(!parsedData.success)
        throw new Error(JSON.stringify(parsedData.error.format()));
    const { link, type, title, tags } = parsedData.data;
  
    const tagIds = tags
    ? await Promise.all(
          tags.map(async (tagTitle) => {
              let tag = await TagModel.findOne({ title: tagTitle });

              if (!tag) {
                  tag = await new TagModel({ title: tagTitle }).save();
              }

              return tag._id;
          })
      )
    : [];
    return await ContentModel.create({
        link,
        type,
        title,
        tags: tagIds,
        userId: new mongoose.Types.ObjectId(userId)
    });
}

export const fetch_content = async(userId : string, type: string) => {
    // fetch all content of userId,
    // then when got the tagIds, fetch all names of tags 
    let content_data;
    switch(type) {
        case "all" : {
            content_data = await ContentModel.find({
                userId : new mongoose.Types.ObjectId(userId)
            }).lean();
            break;
        }
        case "video": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId)
            },{
                type:"video"
            }).lean();
            break;
        }
        case "audio": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId)
            },{
                type:"audio"
            }).lean();
            break;
        }
        case "article": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId)
            },{
                type:"article"
            }).lean();
            break;
        }
        case "document": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId)
            },{
                type:"document"
            }).lean();
            break;
        }
        case "image": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId)
            },{
                type:"image"
            }).lean();
            break;
        }
        case "other": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId)
            },{
                type:"other"
            }).lean();
            break;
        }
    }
   
    
    if(content_data.length === 0)
        return [];

    const tagIds = [...new Set(content_data.flatMap(content => content.tags))];
    const tagTitles = await TagModel.find({ _id : { $in: tagIds} });
    const tagMap = Object.fromEntries(tagTitles.map(tag => [tag._id.toString(),tag.title]));

    const finalData = content_data.map(content => ({
        ...content,
        tags: content.tags.map(tagId => tagMap[tagId.toString()])
    }));
    return finalData;
}

export const delete_content = async(contentId: string) => {
    const result = await ContentModel.deleteOne({
        _id: new mongoose.Types.ObjectId(contentId)
    });
    return result.deletedCount;
}

export const update_content = async(contentId : string, updateData: I_updateContent) => {
    const id = new mongoose.Types.ObjectId(contentId);
    if(updateData.tags && updateData.tags.length > 0) {
        const tagIds = await Promise.all(
          updateData.tags!.map(async (tagTitle) => {
              let tag = await TagModel.findOne({ title: tagTitle });

              if (!tag) {
                  tag = await new TagModel({ title: tagTitle }).save();
              }

              return tag._id;
          })
      )
      updateData.tags = tagIds;
    };
    const updatedData = await ContentModel.findByIdAndUpdate(
        id,
        { $set: updateData},
        { new: true, runValidators: true }
    ).lean();
    if(!updatedData) {
        appLogger.warn(`updating content but content not found : ${contentId}`);
        throw new DataNotFoundError(`Content not found`);
    }
    return updateData;
}