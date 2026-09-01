import { handleUpload } from "@vercel/blob/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Falta BLOB_READ_WRITE_TOKEN en las variables de entorno");
      return res.status(500).json({
        error: "El servidor no tiene configurado el almacenamiento (Blob Store). Conéctalo en Vercel → Storage.",
      });
    }

    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        // Solo se permiten imágenes, y hasta 8MB. La subida real va directo
        // del navegador al Blob (por eso no pasa por el límite de la función).
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

    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error("Error en /api/upload:", err);
    return res.status(400).json({ error: err.message || "No se pudo generar el permiso de subida" });
  }
}