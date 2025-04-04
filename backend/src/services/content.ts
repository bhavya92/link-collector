import { ContentInput, contentSchema, I_updateContent } from "../utils/input_validation.js";
import { categorizeByDomaint } from "../utils/linkType/categorizeBuUrl.js"
import { categorizeByExtension } from "../utils/linkType/categorizeByExt.js"
import { ContentModel } from "../models/content.js";
import { TagModel } from "../models/tags.js";
import mongoose from "mongoose";
import { DataNotFoundError } from "../utils/dataNotFound.js";
import { appLogger } from "../utils/logger.js";
import { generate_faissId } from "../utils/faissIdGenerator.js";


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
    const faiss_id = generate_faissId();
    return await ContentModel.create({
        link,
        type,
        faiss_id,
        title,
        tags: tagIds,
        userId: new mongoose.Types.ObjectId(userId)
    });
}

export const fetch_content = async(userId : string, type: string) => {

    let content_data;
    switch(type) {
        case "all" : {
            content_data = await ContentModel.find({
                userId : new mongoose.Types.ObjectId(userId)
            }).select("-faiss_id").lean();
            break;
        }
        case "video": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId),
                type:"video"
            }).select("-faiss_id").lean();
            break;
        }
        case "audio": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId),
                type:"audio"
            }).select("-faiss_id").lean();
            break;
        }
        case "article": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId),
                type:"article"
            }).select("-faiss_id").lean();
            break;
        }
        case "social": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId),
                type:"social"
            }).select("-faiss_id").lean();
            break;
        }
        case "image": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId),
                type:"image"
            }).select("-faiss_id").lean();
            break;
        }
        case "other": {
            content_data = await ContentModel.find({
                userId: new mongoose.Types.ObjectId(userId),
                type:"other"
            }).select("-faiss_id").lean();
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
    const deleted_content = await ContentModel.findById(new mongoose.Types.ObjectId(contentId));
    const result = await ContentModel.deleteOne({
        _id: new mongoose.Types.ObjectId(contentId)
    });
    const count = result.deletedCount;
    return {count,deleted_content};
}

export const update_content = async(contentId : string, updateData: I_updateContent) => {
    const id = new mongoose.Types.ObjectId(contentId);
    const old_content_data = await ContentModel.findById(id).lean();
    const old_faiss = old_content_data?.faiss_id;
    const new_faiss_id = generate_faissId();
    updateData.faiss_id = new_faiss_id;
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
    ).select("-faiss_id").lean();
    const data = await ContentModel.findById(id).lean();
    const new_content = {
        ...data,
        "old_faiss_id" : old_faiss
    }
    console.log(new_content)
    if(!updatedData) {
        appLogger.warn(`updating content but content not found : ${contentId}`);
        throw new DataNotFoundError(`Content not found`);
    }
    return {updateData,new_content};
}

export const fetch_tags = async(userId: string) => {
    const content_data =  await ContentModel.find({
                            userId : new mongoose.Types.ObjectId(userId)
                        }).lean();
    const tagIds = [...new Set(content_data.flatMap(content => content.tags))];
    const tagTitles = await TagModel.find({ _id : { $in: tagIds} });
    console.log(tagTitles);
    return tagTitles;
}

export const fetch_tag_content = async(tagId: string, userId: string) => {
    const content = await ContentModel.find({
        userId : new mongoose.Types.ObjectId(userId),
        tags : new mongoose.Types.ObjectId(tagId),
    }).lean();

    if(content.length === 0)
        return [];
 
    const tagIds = [...new Set(content.flatMap(content => content.tags))];
    const tagTitles = await TagModel.find({ _id : { $in: tagIds} });
    const tagMap = Object.fromEntries(tagTitles.map(tag => [tag._id.toString(),tag.title]));
    const finalData = content.map(content => ({
        ...content,
        tags: content.tags.map(tagId => tagMap[tagId.toString()])
    }));
    return finalData;
}

export const fetch_tagNames = async(tagIds : mongoose.Types.ObjectId[]) => {
    const data  = await TagModel.find({_id : {$in : tagIds}});
    const tagNames = data.map(item => item.title)
    console.log(tagNames);
    return tagNames; 
}

export const get_searchresults = async(keyword: string, userId: string) => {
  
    const response = await fetch("http://localhost:8000/search",{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            userId,
            query:keyword,
        })
    });
    const responseJson = await response.json();
    return responseJson;
}

export const fetch_faiss_content = async(faiss_ids : string[],userId: string) => {
    const content_data = await ContentModel.find({
        userId: new mongoose.Types.ObjectId(userId),
        faiss_id : {$in: faiss_ids},
    }).select("-faiss_id").lean();
    const tagIds = [...new Set(content_data.flatMap(content => content.tags))];
    const tagTitles = await TagModel.find({ _id : { $in: tagIds} });
    const tagMap = Object.fromEntries(tagTitles.map(tag => [tag._id.toString(),tag.title]));
    const finalData = content_data.map(content => ({
        ...content,
        tags: content.tags.map(tagId => tagMap[tagId.toString()])
    }));
    return finalData;
}