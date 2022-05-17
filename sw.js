//!Imports
//!Este archivo de utilidades también debes de aumentar en tu app shell para que no te suelte error
//!Cuando tengas fuentes de google o iconso de font awesone como en este caso, internamente estas url hacen otras peticiones a otras urls, es por eso que verás urls medias raras que se guardaron en el cache dinamico pero no hay problema xq siempre el usuario ingresara por primera vez en el navegador cuando tenga internet y se irá guardando dinámicante todas esas urls adicionales que se generan en el caché dinámico

//!Esto del importScript, es una mierda xq no me capta el error cuando esta dentro de un catch, pero si funciona
importScripts("js/sw-utils.js");

const STATIC_CACHE_NAME = "static-v1"
const DYNAMIC_CACHE_NAME = "dynamic-v1"
const INMUTABLE_CACHE_NAME = "inmutable-1"

const APP_SHELL = [
    "/",
    "index.html",
    "css/style.css",
    "img/favicon.ico",
    "img/avatars/hulk.jpg",
    "img/avatars/ironman.jpg",
    "img/avatars/spiderman.jpg",
    "img/avatars/thor.jpg",
    "img/avatars/wolverine.jpg",
    "js/app.js",
    "js/sw-utils.js"
];

const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js"
];

self.addEventListener("install", (e) => {

    const cacheStaticProm = caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(APP_SHELL)
    })

    const cacheInmutableProm = caches.open(INMUTABLE_CACHE_NAME).then(cache  => {
        return cache.addAll(APP_SHELL_INMUTABLE)
    })

    e.waitUntil(Promise.all([cacheStaticProm, cacheInmutableProm]));
})

self.addEventListener("activate", (e) => {
    const prom = caches.keys().then(listKeys => {
        return Promise.all(listKeys.map(key => {
            if(key === STATIC_CACHE_NAME || key === DYNAMIC_CACHE_NAME || key === INMUTABLE_CACHE_NAME){
                return;
            }
            return caches.delete(key);
        }))
    }) 
    e.waitUntil(prom);
})

self.addEventListener("fetch", e => {
    
    const res = caches.match(e.request).then(res => {
        if(res) return res;

        return fetch(e.request).then(res => {
            // actualizarCacheDinamico(DYNAMIC_CACHE_NAME, e.request, res)
            if(res.ok){
                caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                    cache.put(e.request, res);
                })
                return res.clone();
            }else{
                if(/jpg|png|svg|gif/.test(e.request.url)){
                    return caches.match("img/no-img.jpg");
                }
            }
        }).catch(err => {
            console.log(`Error de red: ${e.request.url}`)

            let accept = e.request.headers.get("Accept")
            if(accept.includes("text/html")){
                return caches.match("pages/offline.html");
            }else if(accept.includes("image/")){
                return caches.match("img/no-img.jpg");
            }else {
                return caches.match("pages/offline.html");
            }
        })
    })
    e.respondWith(res);

})