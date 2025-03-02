import { extensionCategoryMap } from "./categoryMaps.js";

export const categorizeByExtension = (url: string) => {

    const extension = url.split(".").pop()?.toLowerCase() || "";
    return extensionCategoryMap["." + extension] || null;
}