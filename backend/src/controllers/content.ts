import { Request, Response } from "express";
import { create_content, delete_content, fetch_content, find_category, update_content } from "../services/content.js";
import { appLogger } from "../utils/logger.js";
import { CustomRequest } from "../middlewares/authenticated.js";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { DataNotFoundError } from "../utils/dataNotFound.js";


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
        const updated_data = await update_content(contentId, updateData);
        res.status(200).json({
            message:'content update sucess',
            data: updated_data
        });
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
        const deleted = await delete_content(contentId);
        if(deleted !== 1){
            res.status(404).json({
                message:"Content not found"
            });
            return;
        }
        res.status(200).json({
            message:"Content Deleted Succesfully"
        });
    } catch(err) {
        appLogger.error(`userId : ${userId}, err: ${err}`);
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
};

export const fetchAllContent = async (req: Request, res: Response) => {
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

export const fetchDocContent = async(req: Request, res: Response) => {
    const userId = ((req as CustomRequest).userId).toString();
    try{
        const content = await fetch_content(userId,"document");
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