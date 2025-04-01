import { Request, Response } from "express";
import { create_content, delete_content, fetch_content, fetch_tag_content, fetch_tagNames, fetch_tags, find_category, update_content } from "../services/content.js";
import { appLogger } from "../utils/logger.js";
import { CustomRequest } from "../middlewares/authenticated.js";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { DataNotFoundError } from "../utils/dataNotFound.js";
import fetch from "node-fetch";

export const findType = async (req: Request, res: Response) => {
    const link = req.body.link;
    const userId = (req as CustomRequest).userId;
    appLogger.info(`${userId} hitted /findType for ${link}`);
    //TODO: check if URL valid else return error
    try {
        new URL(link);
      } catch (err) {
        appLogger.warn(err);
        res.status(400).json({
            message:"Invalid URL",
            type:"other"
        });
        return;
      }
    const category = find_category(link);
    appLogger.info(`Category of ${link} is ${category} for ${userId}`);
    res.status(200).json({
        message:"Category sent",
        type:category,
    });
}

export const newContent = async (req: Request, res: Response) => {
    appLogger.info(`${req.body.email} hitted /newContent`);
    const userId = ((req as CustomRequest).userId).toString();
    try {
        const content = await create_content(req.body, userId);
        res.status(200).json({
            message:"content created",
            data: content,
        });
       
        const objectIdTags = content.tags.map((tag) => tag._id as mongoose.Types.ObjectId);
        const tags = await fetch_tagNames(objectIdTags)
        
        fetch(" http://0.0.0.0:8000/update-search",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                userId: userId,
                contentId: content._id,
                faiss_Id: content.faiss_id,
                title: content.title,
                link: content.link,
                type: content.type,
                tags: tags,
            }),
        }).then(response => {
            {appLogger.info({response})
                console.log({response})
            }})
        .catch(error => appLogger.error("Error sending data to Python server:", error));
    } catch(err) {
        appLogger.error(err);
        if(err instanceof ZodError) {
            res.status(400).json({
                message:err.format(),
                data: null,
            })
            return;
        }
        if(err instanceof mongoose.Error.ValidationError){
            res.status(400).json({
                message:err.message,
                data:null,
            });
            return;
        }
        res.status(500).json({
            message:"Internal Server Error",
            data:null,
        });
    }
};

export const updateContent = async (req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    appLogger.info(`${userId} hitted /updateContent`);
    const contentId = req.body.contentId;
    const updateData = req.body.data;
    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: "No update data provided" });
        return;
    }
    try{
        const data = await update_content(contentId, updateData);
        res.status(200).json({
            message:'content update sucess',
            data: data.updateData
        });
      
        const objectIdTags = (data.new_content.tags ?? []).map((tag) => tag._id as mongoose.Types.ObjectId);
        const tags = await fetch_tagNames(objectIdTags)
       
        fetch(" http://0.0.0.0:8000/update-search",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                userId: userId,
                contentId: data.new_content._id,
                faiss_Id: data.new_content.faiss_id,
                title: data.new_content.title,
                link: data.new_content.link,
                type: data.new_content.type,
                tags: tags,
                old_faiss_id: data.new_content.old_faiss_id,
            }),
        }).then(response => {
            {appLogger.info({response})
                console.log({response})
            }})
        .catch(error => appLogger.error("Error sending data to Python server:", error));
    } catch(err) {
        if(err instanceof DataNotFoundError) {
            res.status(404).json({
                message:'Content not found, could not update'
            });
            return;
        }
        res.status(500).json({
            message:'Internal Server Error'
        });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    const contentId = req.body.contentId;
    const userId = ((req as CustomRequest).userId).toString();
    appLogger.info(`${userId} hitted /deleteContent`)
    try {
        const {count,deleted_content} = await delete_content(contentId);
        if(count !== 1){
            res.status(404).json({
                message:"Content not found"
            });
            return;
        }
        res.status(200).json({
            message:"Content Deleted Succesfully"
        });
        fetch(" http://0.0.0.0:8000/delete-content",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                faiss_Id: deleted_content!.faiss_id,
            }),
        }).then(response => {
            {appLogger.info({response})
                console.log({response})
            }})
        .catch(error => appLogger.error("Error sending data to Python server:", error));
    } catch(err) {
        appLogger.error(`userId : ${userId}, err: ${err}`);
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
};

export const fetchAllContent = async (req: Request, res: Response) => {
    console.log("fetchAllHitted");
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"all");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    }
};

export const fetchVideoContent = async(req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"video");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    }

};

export const fetchAudioContent = async(req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"audio");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    }
};

export const fetchImageContent = async(req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"image");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    }
};

export const fetchArticleContent = async(req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"article");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    } 
};

export const fetchOtherContent = async(req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"other");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    } 
};

export const fetchSocialContent = async(req: Request, res: Response) => {
    console.log("fetchSocialContent hitted")
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"social");
        res.status(200).json({
            message:'Contents Fetched',
            content:content,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    } 
};

export const fetchTags = async(req: Request, res: Response) => {
    console.log("Inside fetchTags");
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const data = await fetch_tags(userId);
        res.status(200).json({
            message:"Tags fetched",
            data: data,
        });
    } catch(err){
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    }
}

export const fetchTagContent = async(req: Request, res: Response) => {
    const tagId = req.body.tagId;
    const userId = ((req as CustomRequest).userId).toString();
    try {
        const data = await fetch_tag_content(tagId, userId);
        res.status(200).json({
            message:"Contents fetched",
            content: data,
        });
    } catch(err) {
        appLogger.error(`Error ${err} for ${userId}`);
        res.status(500).json({
            message:"Internal Server Error",
        });
    }
}