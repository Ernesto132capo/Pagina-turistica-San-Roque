import { handleUpload } from "@vercel/blob/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        // Solo se permiten imágenes, y hasta 8MB.
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

    res.status(200).json(jsonResponse);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "No se pudo generar el permiso de subida" });
  }
}