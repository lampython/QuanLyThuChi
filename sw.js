// Sổ Thu Chi - Service Worker v1.7.9 (Network-First Smart Auto-Update Architecture)
const CACHE_NAME = 'sothuchi-offline-v1.7.9';

const OFFLINE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/css/styles.css',
    '/js/utils.js',
    '/js/data.js',
    '/js/supabase-config.js',
    '/js/app.js',
    '/libs/fontawesome.min.css',
    '/libs/chart.min.js',
    '/libs/exceljs.min.js',
    '/libs/supabase.min.js',
    '/webfonts/fa-solid-900.woff2',
    '/webfonts/fa-regular-400.woff2',
    '/webfonts/fa-brands-400.woff2',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon.png'
];

// 1. Cài đặt Service Worker: Nạp trước toàn bộ file nội bộ vào kho duy nhất
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const url of OFFLINE_URLS) {
                try {
                    const res = await fetch(url);
                    if (res && res.status === 200) {
                        await cache.put(url, res);
                    }
                } catch (e) {}
            }
        })
    );
});

// 2. Kích hoạt: Claim clients ngay & XÓA SẠCH MỌI KHO CACHE CŨ (v1.7.5, v1.7.7...)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.map((k) => {
                        if (k !== CACHE_NAME) {
                            console.log('[SW] Đang dọn dẹp kho cache cũ:', k);
                            return caches.delete(k);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 3. Phục vụ yêu cầu mạng (Fetch)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Bỏ qua các API đám mây động (để online tự xử lý)
    if (url.origin.includes('supabase.co') || url.hostname.includes('generativelanguage.googleapis.com')) {
        return;
    }

    // Luôn luôn lấy version.json trực tiếp từ mạng (Network-Only) để phát hiện bản mới tức thì
    if (url.pathname.endsWith('version.json')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // A. MỞ ỨNG DỤNG / ĐIỀU HƯỚNG TRANG (HTML NAVIGATION) - NETWORK-FIRST ĐỂ NHẬN BẢN MỚI NGAY LẬP TỨC
    if (event.request.mode === 'navigate' || event.request.destination === 'document' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);

                // ƯU TIÊN 1: Nếu đang có mạng -> Thử tải trực tiếp bản mới nhất từ Server (timeout nhanh 1500ms)
                if (navigator.onLine) {
                    try {
                        const controller = new AbortController();
                        const timer = setTimeout(() => controller.abort(), 1500);
                        const networkResponse = await fetch(event.request, { signal: controller.signal });
                        clearTimeout(timer);

                        if (networkResponse && networkResponse.status === 200) {
                            cache.put('/index.html', networkResponse.clone());
                            cache.put('/', networkResponse.clone());
                            return networkResponse;
                        }
                    } catch (e) {
                        // Rớt mạng hoặc mạng quá lag -> Fallback sang cache
                    }
                }

                // ƯU TIÊN 2: Lấy từ Cache khi mất mạng hoặc timeout
                const cachedPage = await cache.match(event.request, { ignoreSearch: true }) ||
                                   await cache.match('/index.html', { ignoreSearch: true }) ||
                                   await cache.match('/', { ignoreSearch: true });
                if (cachedPage) {
                    return cachedPage;
                }

                // Fallback nếu rủi ro mạng lỗi
                return new Response('<!DOCTYPE html><html><body style="font-family: sans-serif; text-align: center; padding: 40px;"><h3>📱 Đang tải Sổ Thu Chi...</h3><p>Vui lòng kết nối mạng 1 lần để ứng dụng lưu vào máy.</p></body></html>', {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                });
            })()
        );
        return;
    }

    // B. CÁC TÀI NGUYÊN TĨNH (CSS, JS, FONTS, ICONS, LIBS)
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            
            // Nếu URL có query version (?v=...) -> KHÔNG bỏ qua search string để phân biệt chính xác phiên bản
            const hasVersionQuery = url.search.includes('v=');
            const cachedAsset = await cache.match(event.request, { ignoreSearch: !hasVersionQuery });

            if (cachedAsset) {
                // Tải ngầm cập nhật nếu có mạng
                if (navigator.onLine) {
                    fetch(event.request).then((res) => {
                        if (res && res.status === 200) {
                            cache.put(event.request, res);
                        }
                    }).catch(() => {});
                }
                return cachedAsset;
            }

            try {
                const res = await fetch(event.request);
                if (res && res.status === 200) {
                    cache.put(event.request, res.clone());
                }
                return res;
            } catch (err) {
                return new Response('', { status: 404, statusText: 'Not Found' });
            }
        })()
    );
});
