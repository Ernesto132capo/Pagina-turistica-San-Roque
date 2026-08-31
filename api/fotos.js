import { list } from "@vercel/blob";

const desslug = (texto) => (texto || "").replace(/-/g, " ").trim();

export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: "feria/" });

    const fotos = blobs
      .map((b) => {
        const nombreArchivo = b.pathname.split("/").pop();
        const [timestamp, alumnoSlug, descSlugConExt] = nombreArchivo.split("__");
        const descSlug = descSlugConExt ? descSlugConExt.replace(/\.[^.]+$/, "") : "";

        return {
          url: b.url,
          pathname: b.pathname,
          alumno: desslug(alumnoSlug) || "Anónimo",
          descripcion: desslug(descSlug),
          fecha: Number(timestamp) || 0,
        };
      })
      .sort((a, b) => b.fecha - a.fecha);

    res.status(200).json({ fotos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron cargar las fotos" });
  }
}
