import { domainCategoryMap } from "./categoryMaps.js";

export const categorizeByDomaint = (url: string) => {
    const domain = new URL(url).hostname.replace("www.","");
    return domainCategoryMap[domain] || null;
}