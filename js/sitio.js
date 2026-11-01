/* PHD Consultores · funciones comunes de todas las páginas */
(function(){
  "use strict";
  var WA = "51943864787";
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbyX_flloFxOlTQdF_nGgXb5GxShjPBbkPWU_z3XPwpqZJbcjWqN2OOwdcDet0SHn6Sa/exec";
  // Píxel de Meta: pega aquí el ID cuando crees tu cuenta publicitaria (vacío = desactivado)
  var PIXEL_ID = "";
  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var qs = location.search.slice(1);
  var origen = (qs.match(/utm_[^&]+/g) || []).join("&");
  try {
    if (origen) sessionStorage.setItem("phd_origen", origen);
    else origen = sessionStorage.getItem("phd_origen") || "";
  } catch (e) {}
  if (!origen) origen = document.referrer && document.referrer.indexOf(location.host) < 0 ? "ref=" + document.referrer.replace(/^https?:\/\//, "").split("/")[0] : "directo";

  /* Medición propia, sin cookies: cada evento va a la hoja "PHD Web · Analítica" */
  function medir(e, dato){
    if (location.protocol === "file:") return;
    var cuerpo = JSON.stringify({ tipo: "evento", e: e, ruta: location.pathname, dato: dato || "", origen: origen, movil: innerWidth < 760 });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([cuerpo], { type: "text/plain" }))) return;
    } catch (err) {}
    try { fetch(ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, body: cuerpo }); } catch (err) {}
  }

  /* Píxel de Meta (solo si hay ID) */
  if (PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID); window.fbq("track", "PageView");
  }
  function conversion(nombre){ if (window.fbq) window.fbq("track", nombre); }

  function wa(msg){ return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  function enlazarWhatsapp(raiz){
    (raiz || document).querySelectorAll(".wa").forEach(function(a){
      a.href = wa(a.getAttribute("data-msg") || "Hola PHD");
      a.target = "_blank"; a.rel = "noopener";
    });
  }
  enlazarWhatsapp();
  document.addEventListener("click", function(ev){
    var a = ev.target.closest && ev.target.closest('a[href*="wa.me"]');
    if (a) { medir("whatsapp", (a.textContent || "").trim().slice(0, 60)); conversion("Contact"); }
  });

  /* cabecera sólida, botón flotante y apariciones */
  var cab = document.getElementById("cab"), flota = document.getElementById("flota");
  function alDesplazar(){
    var y = window.scrollY;
    if (cab) cab.classList.toggle("solid", y > 20 || document.body.classList.contains("interior"));
    if (flota) flota.classList.toggle("on", y > 400);
  }
  window.addEventListener("scroll", alDesplazar, { passive: true }); alDesplazar();
  var obs = "IntersectionObserver" in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;
  document.querySelectorAll(".rv, [data-observar]").forEach(function(el){ obs ? obs.observe(el) : el.classList.add("in"); });
  var dets = document.querySelectorAll("details");
  dets.forEach(function(d){ d.addEventListener("toggle", function(){ if (d.open) dets.forEach(function(o){ if (o !== d && o.parentNode === d.parentNode) o.open = false; }); }); });
  var anio = document.getElementById("anio"); if (anio) anio.textContent = new Date().getFullYear();

  medir("vista");

  window.PHD = { WA: WA, ENDPOINT: ENDPOINT, origen: origen, reducir: reducir, wa: wa, medir: medir, conversion: conversion, enlazarWhatsapp: enlazarWhatsapp };
})();
