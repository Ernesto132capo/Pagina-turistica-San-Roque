import { handleUpload } from "@vercel/blob/client";

// handleUpload necesita un objeto Request/Response estándar de la web
// (con request.json(), request.headers.get(), etc.), que solo entrega
// el Edge Runtime — no el runtime Node.js clásico de Vercel.
export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,
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

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "No se pudo generar el permiso de subida" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}