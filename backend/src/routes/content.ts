import { Router } from "express";
import {
    deleteContent,
  fetchAllContent,
  fetchArticleContent,
  fetchAudioContent,
  fetchDocContent,
  fetchImageContent,
  fetchOtherContent,
  fetchVideoContent,
  findType,
  newContent,
} from "../controllers/content.js";
import { authenticated } from "../middlewares/authenticated.js";

const contentRouter = Router();

contentRouter.post("/newContent", authenticated, newContent);

contentRouter.post("/fetchAllContent", authenticated, fetchAllContent);

contentRouter.post("/fetchVideoContent", authenticated, fetchVideoContent);

contentRouter.post("/fetchAudioContent", authenticated, fetchAudioContent);

contentRouter.post("/fetchImageContent", authenticated, fetchImageContent);

contentRouter.post("/fetchArticleContent", authenticated, fetchArticleContent);

contentRouter.post("/fetchOtherContent", authenticated, fetchOtherContent);

contentRouter.post("/fetchDocContent", authenticated, fetchDocContent);

contentRouter.post("/deleteContent",authenticated,deleteContent);

contentRouter.post("/findType",authenticated,findType);

export default contentRouter;
