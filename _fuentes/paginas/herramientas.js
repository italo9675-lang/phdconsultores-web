(function(){
  "use strict";
  var P = window.PHD, UIT = 5500;
  function n(id){ var v = parseFloat(document.getElementById(id).value); return isFinite(v) && v > 0 ? v : 0; }
  function s(x){ return "S/ " + Math.round(x).toLocaleString("es-PE"); }
  var medido = {};
  function medir(h){ if (!medido[h]){ medido[h] = 1; P.medir("herramienta", h); } }

  /* Régimen */
  function regimen(){
    var tipo = document.getElementById("r-tipo").value, v = n("r-ventas"), c = n("r-compras"),
        fact = document.getElementById("r-clientes").value === "empresas", act = document.getElementById("r-act").value, out = document.getElementById("r-res");
    if (!v){ out.innerHTML = '<p class="vacio">Completa tus ventas y compras para ver el resultado.</p>'; return; }
    medir("regimen");
    var anual = v * 12, igv = Math.max(0, (v - c) * 0.18), ops = [];
    var nrusOk = tipo === "pn" && v <= 8000 && c <= 8000 && !fact && act !== "excluida";
    if (nrusOk) ops.push({ n: "Nuevo RUS", m: v <= 5000 && c <= 5000 ? 20 : 50, d: "Cuota fija que reemplaza al IGV y a la Renta. Solo emites boletas y no llevas libros." });
    var rerOk = anual <= 525000 && c * 12 <= 525000 && act !== "profesional" && act !== "excluida";
    if (rerOk) ops.push({ n: "Régimen Especial (RER)", m: v * 0.015 + igv, d: "Renta 1.5% de tus ventas + IGV. No presentas declaración anual. Máximo 10 trabajadores por turno." });
    if (anual <= 1700 * UIT) ops.push({ n: "Régimen MYPE Tributario", m: v * (anual <= 300 * UIT ? 0.01 : 0.015) + igv, d: "Pago a cuenta de " + (anual <= 300 * UIT ? "1%" : "1.5%") + " + IGV. En la declaración anual pagas 10% sobre las primeras 15 UIT de utilidad y 29.5% sobre el resto." });
    ops.push({ n: "Régimen General", m: v * 0.015 + igv, d: "Pago a cuenta de 1.5% (o según coeficiente) + IGV. En la declaración anual pagas 29.5% de tu utilidad." });
    var min = Math.min.apply(null, ops.map(function(o){ return o.m; }));
    var h = '<small>Pagos mensuales estimados con ventas de ' + s(v) + ' y compras de ' + s(c) + '</small>';
    ops.forEach(function(o){
      h += '<div class="linea"><span><b>' + o.n + (o.m === min ? ' · el que menos pagas al mes' : '') + '</b><br><small>' + o.d + '</small></span><span>' + s(o.m) + '</span></div>';
    });
    if (!nrusOk && tipo === "pn" && v <= 8000 && fact) h += '<p><small>Con tus ventas podrías estar en el NRUS, pero ese régimen no permite emitir facturas.</small></p>';
    h += '<p><small>El IGV estimado es ' + s(igv) + ' (18% de tus ventas menos tus compras con factura). Pagar menos al mes no siempre es lo más conveniente en el año: depende de tu utilidad.</small></p>';
    h += '<a target="_blank" rel="noopener" href="' + P.wa("Hola PHD, usé el comparador de regímenes: vendo unos " + s(v) + " al mes. ¿Me ayudan a elegir?") + '">Ayúdame a elegir el mejor para mí</a>';
    out.innerHTML = h;
  }
  ["r-tipo", "r-ventas", "r-compras", "r-clientes", "r-act"].forEach(function(id){ document.getElementById(id).addEventListener("input", regimen); });

  /* IGV */
  function igv(){
    var out = document.getElementById("i-res"), t = parseFloat(document.getElementById("i-tasa").value), con = document.getElementById("i-modo").value === "con";
    var v = n("i-ventas"), c = n("i-compras"), sal = n("i-saldo");
    if (!v && !c){ out.innerHTML = '<p class="vacio">Escribe tus ventas del mes para calcular.</p>'; return; }
    medir("igv");
    var iv = con ? v - v / (1 + t) : v * t, ic = con ? c - c / (1 + t) : c * t, neto = iv - ic - sal;
    var h = '<div class="linea"><span>IGV de tus ventas</span><span>' + s(iv) + '</span></div>' +
      '<div class="linea"><span>Crédito fiscal de tus compras</span><span>− ' + s(ic) + '</span></div>' +
      (sal ? '<div class="linea"><span>Saldo a favor del mes anterior</span><span>− ' + s(sal) + '</span></div>' : "");
    h += neto > 0 ? '<small>IGV a pagar este mes</small><div class="grande">' + s(neto) + '</div>'
      : '<small>Este mes no pagas IGV. Tu saldo a favor para el próximo mes es</small><div class="grande">' + s(-neto) + '</div>';
    out.innerHTML = h;
  }
  ["i-ventas", "i-compras", "i-saldo", "i-modo", "i-tasa"].forEach(function(id){ document.getElementById(id).addEventListener("input", igv); });

  /* Multa */
  function multa(){
    var reg = document.getElementById("m-reg").value, ing = +document.getElementById("m-ing").value, out = document.getElementById("m-res");
    if (reg === "nrus"){
      out.innerHTML = '<p>En el Nuevo RUS la multa se calcula según tu categoría y es mucho menor que en los otros regímenes. Si regularizas antes de que SUNAT te notifique, la rebaja también puede ser total.</p><a target="_blank" rel="noopener" href="' + P.wa("Hola PHD, estoy en el NRUS y no declaré a tiempo. ¿Me ayudan a regularizar?") + '">Te ayudamos a regularizar</a>';
      return;
    }
    var base = reg === "rer" ? UIT * 0.5 : UIT;
    var vol = ing <= 2 ? [1, 1] : [0.8, 0.9], ind = ing === 1 ? [0.96, 0.99] : ing === 2 ? [0.9, 0.95] : [0.5, 0.6];
    function rango(r){ var a = base * (1 - r[1]), b = base * (1 - r[0]); return Math.round(a) === Math.round(b) ? s(a) : s(a) + " a " + s(b); }
    var h = '<small>Multa sin rebaja (' + (reg === "rer" ? "50% de la UIT" : "1 UIT") + ')</small><div class="grande">' + s(base) + '</div>' +
      '<div class="linea"><span><b>Si regularizas antes de que SUNAT te notifique</b><br><small>Rebaja de ' + (vol[0] === 1 ? "100%" : "80% a 90% (90% si pagas la multa)") + '</small></span><span>' + rango(vol) + '</span></div>' +
      '<div class="linea"><span><b>Si SUNAT ya te notificó</b><br><small>Rebaja de ' + Math.round(ind[0] * 100) + '% a ' + Math.round(ind[1] * 100) + '%, según el plazo y si pagas la multa</small></span><span>' + rango(ind) + '</span></div>' +
      '<p><small>Mientras más rápido regularices, más ahorras. A esto se suman los intereses del impuesto que no pagaste a tiempo.</small></p>' +
      '<a target="_blank" rel="noopener" href="' + P.wa("Hola PHD, no presenté mi declaración a tiempo. ¿Me ayudan a regularizar con la rebaja?") + '">Regularizar con la máxima rebaja</a>';
    out.innerHTML = h;
  }
  ["m-reg", "m-ing"].forEach(function(id){ document.getElementById(id).addEventListener("input", function(){ multa(); medir("multa"); }); });
  multa();
})();
