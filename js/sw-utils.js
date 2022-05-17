//! Guardar en el cache dinámico
function actualizarCacheDinamico (dynamicCache, req, res){
    if(res.ok){
        caches.open(dynamicCache).then(cache => {
            cache.put(req, res);
        })
        return res.clone();
    }else{
        if(/jpg|png|svg|gif/.test(e.request.url)){
            return caches.match("img/no-img.jpg");
        }
    }
}