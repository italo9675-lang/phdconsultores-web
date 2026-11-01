"""Genera las páginas interiores y el sitemap. Ejecutar desde la raíz del repo:
    python3 _fuentes/construir.py
"""
import glob
import os
import re
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
from plantilla import pagina, cabecera, CTA_ART  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rutas = ["/"]

for fuente in sorted(glob.glob(os.path.join(RAIZ, "_fuentes", "paginas", "*.html"))):
    texto = open(fuente, encoding="utf-8").read()
    m = re.match(r"\s*<!--(.*?)-->\s*", texto, re.S)
    meta = {}
    for linea in m.group(1).strip().splitlines():
        k, _, v = linea.partition(":")
        meta[k.strip()] = v.strip()
    cuerpo = texto[m.end():]
    cuerpo = cuerpo.replace("{{CTA}}", CTA_ART)
    if meta.get("cabecera", "si") != "no":
        cuerpo = cabecera(meta, meta.get("lead", ""), meta.get("ctas", "si") == "si") + "\n" + cuerpo
    js = ""
    jsf = fuente[:-5] + ".js"
    if os.path.exists(jsf):
        js = "<script>\n" + open(jsf, encoding="utf-8").read() + "\n</script>"
    head = ""
    if meta.get("tipo") == "article":
        head = ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"%s",'
                '"description":"%s","inLanguage":"es-PE","author":{"@type":"Person","name":"Italo Michell Bambarén Chacón","jobTitle":"Contador Público Colegiado"},'
                '"publisher":{"@type":"Organization","name":"PHD Consultores","logo":{"@type":"ImageObject","url":"https://phdconsultores.pe/img/isotipo-512.png"}},'
                '"dateModified":"%s","mainEntityOfPage":"https://phdconsultores.pe%s"}</script>') % (
            meta["titulo"].replace('"', "'"), meta["descripcion"].replace('"', "'"), meta.get("fecha", date.today().isoformat()), meta["ruta"])
    html = pagina(meta, cuerpo, head, js)
    ruta = meta["ruta"]
    destino = os.path.join(RAIZ, ruta.lstrip("/"))
    if ruta.endswith("/"):
        destino = os.path.join(destino, "index.html")
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    open(destino, "w", encoding="utf-8").write(html)
    if meta.get("indexar", "si") == "si":
        rutas.append(ruta)
    print("ok", ruta)

hoy = date.today().isoformat()
items = "".join(f"<url><loc>https://phdconsultores.pe{r}</loc><lastmod>{hoy}</lastmod></url>\n" for r in rutas)
open(os.path.join(RAIZ, "sitemap.xml"), "w").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + items + "</urlset>\n")
print("sitemap", len(rutas), "urls")
