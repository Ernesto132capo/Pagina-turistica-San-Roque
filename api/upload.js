import { handleUpload } from "@vercel/blob/client";

export default async function handler(request, response) {
  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Solo se permiten imágenes, y hasta 8MB. La subida real va directo
        // del navegador al Blob (por eso ya no pasa por el límite de la función).
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          addRandomSuffix: false,
          maximumSizeInBytes: 8 * 1024 * 1024,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Foto subida a la Feria UPDS:", blob.pathname);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message || "No se pudo generar el permiso de subida" });
  }
}