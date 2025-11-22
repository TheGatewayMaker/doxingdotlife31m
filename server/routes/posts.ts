import { RequestHandler } from "express";
import {
  listPostFolders,
  getPostWithThumbnail,
  listPostFiles,
  getMediaUrl,
} from "../utils/r2-storage";
import { Post } from "@shared/api";

export const handleGetPosts: RequestHandler = async (req, res) => {
  try {
    const postIds = await listPostFolders();
    const posts: Post[] = [];

    for (const postId of postIds) {
      const postData = await getPostWithThumbnail(postId);
      if (postData) {
        const mediaFiles = await listPostFiles(postId);
        const mediaFileObjects = mediaFiles
          .map((fileName) => ({
            name: fileName,
            url: getMediaUrl(`posts/${postId}/${fileName}`),
            type: fileName.endsWith(".json") ? "application/json" : "media",
          }))
          .filter((f) => f.name !== "metadata.json");

        const post: Post = {
          id: postData.id,
          title: postData.title,
          description: postData.description,
          country: postData.country,
          city: postData.city,
          server: postData.server,
          thumbnail: postData.thumbnail,
          mediaFiles: mediaFileObjects,
          createdAt: postData.createdAt,
        };

        posts.push(post);
      }
    }

    posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json({
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(200).json({ posts: [], total: 0 });
  }
};
