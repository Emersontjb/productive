/*
 =====================================================================
 SERVICE WORKER (SW.JS)
 =====================================================================
 
 Este arquivo é o "service worker" do app. Service workers são
 scripts que o navegador executa em segundo plano, separados
 da página web.
 
 O QUE ESTE ARQUIVO FAZ:
 1. CACHE (armazenamento): Salva cópias dos arquivos do app
 2. OFFLINE: Permite usar o app sem internet
 3. PERFORMANCE: Carrega arquivos mais rápido
 
 COMO FUNCIONA:
 - Quando o app é aberto pela primeira vez, o service worker
   instala e salva todos os arquivos no cache.
 - Nas próximas vezes, o app carrega do cache (muito mais rápido)
 - Se não tiver internet, ainda assim funciona!
 
 EVENTOS DO SERVICE WORKER:
 1. install: Ocorre quando o service worker começa a instalar
 2. fetch: Ocorre quando o app tenta carregar um arquivo
 3. activate: Ocorre quando o service worker termina de instalar
 
 =====================================================================
 */

// Nome do cache (mude a versão quando atualizar o app)
const CACHE_NAME = 'produtive-v1';

// Lista de arquivos para salvar no cache
const urls = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

/**
 * EVENTO INSTALL
 * Ocorre quando o service worker começa a instalar.
 * Aqui salvamos os arquivos no cache.
 */
self.addEventListener('install', event => {
    // Espera até que o cache seja aberto e os arquivos salvos
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Adiciona todos os arquivos à lista de cache
            return cache.addAll(urls);
        })
    );
});

/**
 * EVENTO FETCH
 * Ocorre toda vez que o app tenta carregar um arquivo.
 * Aqui decidimo se usamos o cache ou a internet.
 */
self.addEventListener('fetch', event => {
    // Responde à requisição
    event.respondWith(
        // Procura o arquivo no cache primeiro
        caches.match(event.request).then(response => {
            // Se encontrou no cache, retorna
            // Se não encontrou, tenta buscar na internet
            return response || fetch(event.request);
        })
    );
});

/**
 * EVENTO ACTIVATE
 * Ocorre quando o service worker termina de instalar.
 * Aqui limpamos caches antigos.
 */
self.addEventListener('activate', event => {
    // Espera até terminar
    event.waitUntil(
        // Lista todas as chaves de cache existentes
        caches.keys().then(keys => {
            // Para cada chave antiga, verifica se deve ser deletada
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => {
                    // Deleta caches antigos (só mantem o atual)
                    return caches.delete(key);
                })
            );
        })
    );
});
