"""Plantilla común de las páginas interiores de phdconsultores.pe.

Uso: python3 _fuentes/construir.py  (genera los .html a partir de _fuentes/paginas/*.html)
Cada fuente empieza con un bloque de metadatos:
<!--
titulo: ...
descripcion: ...
ruta: /guias/como-sacar-ruc.html
miga: Guías|/guias/
-->
"""

WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>'

NAV = [("/#planes", "Planes"), ("/rubros/", "Tu rubro"), ("/herramientas.html", "Herramientas"), ("/guias/", "Guías"), ("/servicios/", "Servicios")]


def pagina(meta, cuerpo, extra_head="", extra_js=""):
    ruta = meta["ruta"]
    url = "https://phdconsultores.pe" + ruta
    nav = "".join(
        f'<a href="{h}"{" aria-current=\"page\"" if ruta.startswith(h.rstrip("/") ) and h != "/#planes" else ""}>{t}</a>'
        for h, t in NAV
    )
    tipo = meta.get("tipo", "website")
    return f"""<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{meta['titulo']} · PHD Consultores</title>
<meta name="description" content="{meta['descripcion']}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="{tipo}">
<meta property="og:locale" content="es_PE">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{meta['titulo']}">
<meta property="og:description" content="{meta['descripcion']}">
<meta property="og:image" content="https://phdconsultores.pe/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#405e56">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/sitio.css">
{extra_head}
</head>
<body class="interior">
<a class="saltar" href="#contenido">Saltar al contenido</a>
<header id="cab" class="solid">
  <div class="wrap bar">
    <a class="logo" href="/"><img src="/img/marca/logo-horizontal.png" alt="PHD Estudio Contable" width="152" height="44"></a>
    <nav aria-label="Principal">{nav}<a class="btn btn-wa wa" href="#" data-msg="Hola PHD, quiero mi diagnóstico gratuito.">Escríbenos</a></nav>
  </div>
</header>
<main id="contenido" tabindex="-1">
{cuerpo}
</main>
<footer>
  <div class="wrap grid">
    <div>
      <a class="logo" href="/"><img src="/img/marca/logo-horizontal-blanco.png" alt="PHD Estudio Contable" width="152" height="44"></a>
      <p style="margin:12px 0 0">Contabilidad y tributación para emprendedores y mypes · Lima, Perú</p>
      <nav aria-label="Pie"><a href="/#planes">Planes</a><a href="/herramientas.html">Herramientas</a><a href="/guias/">Guías</a><a href="/servicios/">Servicios</a><a href="/rubros/">Por rubro</a><a href="/#diagnostico">Diagnóstico gratis</a></nav>
    </div>
    <div>
      <p style="margin:0">WhatsApp: <a class="wa" href="#" data-msg="Hola PHD, quiero información.">943 864 787</a> · <a href="mailto:info@phdconsultores.pe">info@phdconsultores.pe</a> · <a href="https://www.instagram.com/phdconsultores/" target="_blank" rel="noopener">Instagram</a></p>
      <p style="margin:6px 0 0">PHD CONSULTORES S.A.C. · RUC 20612286575</p>
      <p style="margin:6px 0 0"><a href="/privacidad.html">Privacidad</a> · <a href="/terminos.html">Términos</a> · © <span id="anio">2026</span> PHD Consultores</p>
    </div>
  </div>
</footer>
<a class="flota wa" id="flota" href="#" data-msg="Hola PHD, quiero mi diagnóstico gratuito." aria-label="Escríbenos por WhatsApp">{WA_SVG}</a>
<script src="/js/sitio.js"></script>
{extra_js}
</body>
</html>
"""


def cabecera(meta, lead, ctas=True):
    miga = ""
    if meta.get("miga"):
        t, h = meta["miga"].split("|")
        miga = f'<p class="miga"><a href="/">Inicio</a> › <a href="{h}">{t}</a></p>'
    else:
        miga = '<p class="miga"><a href="/">Inicio</a></p>'
    botones = (
        '<div class="ctas"><a class="btn btn-wa wa" href="#" data-msg="Hola PHD, quiero mi diagnóstico gratuito.">Diagnóstico gratis por WhatsApp</a>'
        '<a class="btn btn-line" href="/#diagnostico">Agendar una llamada</a></div>'
        if ctas else ""
    )
    return f"""<section class="cabecera"><div class="wrap">{miga}<h1>{meta['h1'] if 'h1' in meta else meta['titulo']}</h1><p class="lead">{lead}</p>{botones}</div></section>"""


CTA_ART = """<div class="cta-art"><div><b>¿Prefieres que lo hagamos por ti?</b><p>Diagnóstico gratuito de 20 minutos. Te decimos qué te falta y cuánto cuesta.</p></div><a class="btn btn-light wa" href="#" data-msg="Hola PHD, leí una guía en su web y quiero mi diagnóstico gratuito.">Escríbenos por WhatsApp</a></div>"""
