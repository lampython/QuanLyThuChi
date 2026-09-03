// Sổ Thu Chi - Service Worker v1.7.5 (Hợp Nhất 1 Kho Duy Nhất - Kiến Trúc v7.5 Chuẩn Mực)
const CACHE_NAME = 'sothuchi-offline-v1.7.5';

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

// 2. Kích hoạt: Claim clients ngay & dọn dẹp các kho cũ khác
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.map((k) => {
                        if (k !== CACHE_NAME) {
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

// 3. Phục vụ yêu cầu mạng (Fetch) - NGUYÊN BẢN LOGIC V7.5 SIÊU MƯỢT
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Bỏ qua các API đám mây động (để online tự xử lý)
    if (url.origin.includes('supabase.co') || url.hostname.includes('generativelanguage.googleapis.com')) {
        return;
    }

    // A. MỞ ỨNG DỤNG / ĐIỀU HƯỚNG TRANG (HTML NAVIGATION)
    if (event.request.mode === 'navigate' || event.request.destination === 'document' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);

                // ƯU TIÊN 1: Lấy ngay từ Cache nếu có (Mở app trong 0.005s, không bao giờ chờ mạng)
                const cachedPage = await cache.match(event.request, { ignoreSearch: true }) ||
                                   await cache.match('/index.html', { ignoreSearch: true }) ||
                                   await cache.match('/', { ignoreSearch: true });

                if (cachedPage) {
                    // Nếu đang có mạng -> Tải ngầm bản mới nhất để cập nhật cho lần sau
                    if (navigator.onLine) {
                        fetch(event.request).then((networkRes) => {
                            if (networkRes && networkRes.status === 200) {
                                cache.put('/index.html', networkRes.clone());
                                cache.put('/', networkRes.clone());
                            }
                        }).catch(() => {});
                    }
                    return cachedPage;
                }

                // ƯU TIÊN 2: Nếu chưa có cache -> Thử tải mạng
                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put('/index.html', networkResponse.clone());
                        cache.put('/', networkResponse.clone());
                        return networkResponse;
                    }
                } catch (e) {}

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
            const cachedAsset = await cache.match(event.request, { ignoreSearch: true });

            if (cachedAsset) {
                // Nếu có mạng -> Tải ngầm cập nhật
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
