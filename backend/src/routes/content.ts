import { Router } from "express";
import {
    deleteContent,
  fetchAllContent,
  fetchArticleContent,
  fetchAudioContent,
  fetchImageContent,
  fetchOtherContent,
  fetchSocialContent,
  fetchTagContent,
  fetchTags,
  fetchVideoContent,
  findType,
  getSearch,
  newContent,
  updateContent,
} from "../controllers/content.js";
import { authenticated } from "../middlewares/authenticated.js";

const contentRouter = Router();

contentRouter.post("/newContent", authenticated, newContent);

contentRouter.get("/fetchAllContent", authenticated, fetchAllContent);

contentRouter.get("/fetchVideoContent", authenticated, fetchVideoContent);

contentRouter.get("/fetchAudioContent", authenticated, fetchAudioContent);

contentRouter.get("/fetchImageContent", authenticated, fetchImageContent);

contentRouter.get("/fetchArticleContent", authenticated, fetchArticleContent);

contentRouter.get("/fetchOtherContent", authenticated, fetchOtherContent);

contentRouter.get("/fetchSocialContent", authenticated, fetchSocialContent);

contentRouter.post("/deleteContent",authenticated,deleteContent);

contentRouter.post("/findType",authenticated,findType);

contentRouter.get("/getAllTags",authenticated,fetchTags);

contentRouter.post("/getTagContent",authenticated, fetchTagContent);

contentRouter.post("/updateContent", authenticated, updateContent);

contentRouter.get("/search",authenticated,getSearch)
export default contentRouter;
