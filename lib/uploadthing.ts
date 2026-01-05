import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * UploadThing File Router
 * Defines upload endpoints and their configurations
 */
export const ourFileRouter = {
  // Hero and managed images uploader
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // In production, add authentication check here
      // const user = await auth();
      // if (!user) throw new UploadThingError("Unauthorized");
      
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Gallery images uploader (allows multiple files)
  galleryUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Gallery upload complete:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Blog post images
  blogImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
