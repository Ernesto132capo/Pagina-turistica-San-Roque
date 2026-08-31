import { del } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { pathname, clave } = req.body;
    const claveCorrecta = process.env.CLAVE_BORRAR || "banano123";

    if (!clave || clave !== claveCorrecta) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    if (!pathname) {
      return res.status(400).json({ error: "Falta indicar qué foto borrar" });
    }

    await del(pathname);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo borrar la foto" });
  }
}
