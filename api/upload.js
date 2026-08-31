import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { alumno, descripcion, archivoBase64, nombreArchivo, tipo } = req.body;

    if (!alumno || !archivoBase64) {
      return res.status(400).json({ error: "Falta el nombre del alumno o la foto" });
    }

    const buffer = Buffer.from(archivoBase64, "base64");

    // Límite de 8MB por foto para no gastar de más el plan gratis
    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: "La foto es muy pesada (máx. 8MB)" });
    }

    const extension = (nombreArchivo || "foto.jpg").split(".").pop().toLowerCase();
    const slug = (texto) =>
      (texto || "").trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const alumnoSlug = slug(alumno) || "alumno";
    const descSlug = slug(descripcion);
    const path = `feria/${Date.now()}__${alumnoSlug}__${descSlug}.${extension}`;

    const { url, pathname } = await put(path, buffer, {
      access: "public",
      contentType: tipo || "image/jpeg",
    });

    res.status(200).json({ url, pathname, alumno, descripcion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo subir la foto" });
  }
}
