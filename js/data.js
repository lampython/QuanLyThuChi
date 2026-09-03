/**
 * SmartFinance Pro - Quản lý Danh Mục Thu/Chi & Bộ Nhớ Phiên
 * Tuân thủ nghiêm ngặt nguyên tắc tách bạch: Danh mục Thu KHÔNG BAO GIỜ lẫn lộn với Danh mục Chi.
 * Hỗ trợ người dùng tự do thêm mới, chỉnh sửa, xóa danh mục theo nhu cầu riêng.
 */

const AppData = {
    // 1. DANH MỤC THU MẶC ĐỊNH (INCOME ONLY)
    DEFAULT_INCOME_CATEGORIES: [
        { id: 'cat_salary', name: 'Lương & Thu nhập chính', icon: 'fa-briefcase', color: '#10b981', emoji: '💼', type: 'income', isDefault: true },
        { id: 'cat_bonus', name: 'Thưởng & Hoa hồng', icon: 'fa-gift', color: '#8b5cf6', emoji: '🎁', type: 'income', isDefault: true },
        { id: 'cat_invest', name: 'Kinh doanh & Đầu tư', icon: 'fa-chart-line', color: '#06b6d4', emoji: '📈', type: 'income', isDefault: true },
        { id: 'cat_income_other', name: 'Thu nhập phụ & Quà tặng', icon: 'fa-handshake', color: '#3b82f6', emoji: '🤝', type: 'income', isDefault: true },
        { id: 'cat_unclassified_income', name: 'Chưa phân loại', icon: 'fa-circle-question', color: '#64748b', emoji: '❓', type: 'income', isDefault: true }
    ],

    // 2. DANH MỤC CHI MẶC ĐỊNH (EXPENSE ONLY)
    DEFAULT_EXPENSE_CATEGORIES: [
        { id: 'cat_food', name: 'Ăn uống & Đi chợ', icon: 'fa-utensils', color: '#f59e0b', emoji: '☕', type: 'expense', isDefault: true },
        { id: 'cat_transport', name: 'Đi lại & Xăng xe', icon: 'fa-car', color: '#3b82f6', emoji: '🚗', type: 'expense', isDefault: true },
        { id: 'cat_shopping', name: 'Mua sắm & Đồ dùng', icon: 'fa-bag-shopping', color: '#ec4899', emoji: '🛍️', type: 'expense', isDefault: true },
        { id: 'cat_bills', name: 'Hóa đơn & Nhà cửa', icon: 'fa-house-signal', color: '#6366f1', emoji: '📱', type: 'expense', isDefault: true },
        { id: 'cat_health', name: 'Sức khỏe & Y tế', icon: 'fa-heart-pulse', color: '#14b8a6', emoji: '💊', type: 'expense', isDefault: true },
        { id: 'cat_education', name: 'Học tập & Con cái', icon: 'fa-graduation-cap', color: '#8b5cf6', emoji: '📚', type: 'expense', isDefault: true },
        { id: 'cat_entertainment', name: 'Giao lưu & Giải trí', icon: 'fa-champagne-glasses', color: '#f43f5e', emoji: '🎉', type: 'expense', isDefault: true },
        { id: 'cat_unclassified_expense', name: 'Chưa phân loại', icon: 'fa-circle-question', color: '#64748b', emoji: '❓', type: 'expense', isDefault: true }
    ],

    getCustomCategories() {
        try {
            const raw = localStorage.getItem('smartfinance_custom_categories_v2');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    saveCustomCategories(cats) {
        localStorage.setItem('smartfinance_custom_categories_v2', JSON.stringify(cats));
    },

    get INCOME_CATEGORIES() {
        const custom = this.getCustomCategories().filter(c => c.type === 'income');
        return [...this.DEFAULT_INCOME_CATEGORIES, ...custom];
    },

    get EXPENSE_CATEGORIES() {
        const custom = this.getCustomCategories().filter(c => c.type === 'expense');
        return [...this.DEFAULT_EXPENSE_CATEGORIES, ...custom];
    },

    get CATEGORIES() {
        return [...this.INCOME_CATEGORIES, ...this.EXPENSE_CATEGORIES];
    },

    addCategory(cat) {
        const custom = this.getCustomCategories();
        const newCat = {
            id: 'cat_custom_' + Date.now(),
            name: cat.name.trim(),
            emoji: cat.emoji || (cat.type === 'income' ? '💰' : '🏷️'),
            icon: 'fa-tag',
            color: cat.color || '#3b82f6',
            type: cat.type || 'expense',
            isCustom: true
        };
        custom.push(newCat);
        this.saveCustomCategories(custom);
        return newCat;
    },

    updateCategory(id, updatedFields) {
        let custom = this.getCustomCategories();
        const index = custom.findIndex(c => c.id === id);
        if (index !== -1) {
            custom[index] = { ...custom[index], ...updatedFields };
            this.saveCustomCategories(custom);
            return custom[index];
        }
        return null;
    },

    deleteCategory(id) {
        let custom = this.getCustomCategories();
        custom = custom.filter(c => c.id !== id);
        this.saveCustomCategories(custom);
    },

    // Bắt đầu bằng mảng trống (không dùng dữ liệu mẫu)
    INITIAL_TRANSACTIONS: [],

    init() {
        localStorage.removeItem('draft_transactions_v2');
        localStorage.removeItem('smart_finance_txs');
        localStorage.removeItem('smart_finance_wallets');
        localStorage.removeItem('smart_finance_budgets');
    },

    getTransactions() {
        const data = sessionStorage.getItem('temp_guest_transactions');
        return data ? JSON.parse(data) : [];
    },

    saveTransactions(txs) {
        sessionStorage.setItem('temp_guest_transactions', JSON.stringify(txs));
    },

    addTransaction(tx) {
        const txs = this.getTransactions();
        const newTx = {
            id: 'tx_' + Date.now(),
            ...tx,
            sub_items: Array.isArray(tx.sub_items) ? tx.sub_items : (Array.isArray(tx.subItems) ? tx.subItems : [])
        };
        txs.unshift(newTx);
        this.saveTransactions(txs);
        return newTx;
    },

    updateTransaction(id, updatedFields) {
        let txs = this.getTransactions();
        txs = txs.map(t => t.id === id ? { 
            ...t, 
            ...updatedFields,
            sub_items: Array.isArray(updatedFields.sub_items) ? updatedFields.sub_items : (t.sub_items || [])
        } : t);
        this.saveTransactions(txs);
    },

    deleteTransaction(id) {
        let txs = this.getTransactions();
        txs = txs.filter(t => t.id !== id);
        this.saveTransactions(txs);
    },

    getCategoryById(id, fallbackNote = '', fallbackType = null) {
        const found = this.CATEGORIES.find(c => c.id === id);
        if (found) return found;

        if (fallbackNote && typeof Utils !== 'undefined' && Utils.predictCategory) {
            const pred = Utils.predictCategory(fallbackNote, fallbackType);
            if (pred) {
                const predCat = this.CATEGORIES.find(c => c.id === pred.categoryId);
                if (predCat) return predCat;
            }
        }

        return fallbackType === 'income'
            ? { id: 'cat_income_other', name: 'Thu nhập khác', emoji: '🤝', color: '#3b82f6', type: 'income' }
            : { id: 'cat_expense_other', name: 'Chi tiêu khác', emoji: '📦', color: '#64748b', type: 'expense' };
    },

    getCategoriesByType(type) {
        return type === 'income' ? this.INCOME_CATEGORIES : this.EXPENSE_CATEGORIES;
    }
};

/**
 * SmartFinance Pro - Offline Voice Storage (IndexedDB)
 * Quản lý file ghi âm ngoại tuyến và hàng đợi Sổ Tạm chờ có mạng để xử lý
 */
const OfflineVoiceStorage = {
    DB_NAME: 'SmartFinance_OfflineVoiceDB',
    DB_VERSION: 1,
    STORE_NAME: 'voice_memos',
    _db: null,

    async getDB() {
        if (this._db) return this._db;
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                resolve(null);
                return;
            }
            const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                }
            };
            request.onsuccess = (e) => {
                this._db = e.target.result;
                resolve(this._db);
            };
            request.onerror = (e) => {
                console.warn('IndexedDB open error, using localStorage fallback:', e);
                resolve(null);
            };
        });
    },

    async saveMemo(memo) {
        const id = memo.id || ('memo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));
        const item = {
            id,
            audioBlob: memo.audioBlob || null,
            audioBase64: memo.audioBase64 || '',
            mimeType: memo.mimeType || 'audio/webm',
            duration: memo.duration || 0,
            text: memo.text || '',
            createdAt: memo.createdAt || new Date().toISOString(),
            status: memo.status || 'pending',
            workspaceId: memo.workspaceId || 'default',
            workspaceName: memo.workspaceName || 'Sổ chính',
            targetType: memo.targetType || 'expense'
        };

        const db = await this.getDB();
        if (db) {
            return new Promise((resolve, reject) => {
                try {
                    const tx = db.transaction(this.STORE_NAME, 'readwrite');
                    const store = tx.objectStore(this.STORE_NAME);
                    store.put(item);
                    tx.oncomplete = () => resolve(item);
                    tx.onerror = (e) => reject(e);
                } catch (e) {
                    reject(e);
                }
            });
        } else {
            // Fallback LocalStorage (metadata only or small audio)
            const list = this.getFallbackList();
            list.unshift({ ...item, audioBlob: null });
            localStorage.setItem('sothuchi_offline_memos_fallback', JSON.stringify(list));
            return item;
        }
    },

    async updateMemoText(id, text) {
        const db = await this.getDB();
        if (db) {
            return new Promise((resolve) => {
                try {
                    const tx = db.transaction(this.STORE_NAME, 'readwrite');
                    const store = tx.objectStore(this.STORE_NAME);
                    const getReq = store.get(id);
                    getReq.onsuccess = () => {
                        const item = getReq.result;
                        if (item) {
                            item.text = text;
                            store.put(item);
                        }
                        resolve(true);
                    };
                    getReq.onerror = () => resolve(false);
                } catch (e) {
                    resolve(false);
                }
            });
        } else {
            let list = this.getFallbackList();
            const it = list.find(m => m.id === id);
            if (it) it.text = text;
            localStorage.setItem('sothuchi_offline_memos_fallback', JSON.stringify(list));
            return true;
        }
    },

    async getAllMemos() {
        const db = await this.getDB();
        if (db) {
            return new Promise((resolve) => {
                try {
                    const tx = db.transaction(this.STORE_NAME, 'readonly');
                    const store = tx.objectStore(this.STORE_NAME);
                    const request = store.getAll();
                    request.onsuccess = () => {
                        const res = request.result || [];
                        res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        resolve(res);
                    };
                    request.onerror = () => resolve([]);
                } catch (e) {
                    resolve([]);
                }
            });
        } else {
            return this.getFallbackList();
        }
    },

    async deleteMemo(id) {
        const db = await this.getDB();
        if (db) {
            return new Promise((resolve) => {
                try {
                    const tx = db.transaction(this.STORE_NAME, 'readwrite');
                    const store = tx.objectStore(this.STORE_NAME);
                    store.delete(id);
                    tx.oncomplete = () => resolve(true);
                    tx.onerror = () => resolve(false);
                } catch (e) {
                    resolve(false);
                }
            });
        } else {
            let list = this.getFallbackList();
            list = list.filter(m => m.id !== id);
            localStorage.setItem('sothuchi_offline_memos_fallback', JSON.stringify(list));
            return true;
        }
    },

    async getPendingCount() {
        const list = await this.getAllMemos();
        return list.filter(m => m.status === 'pending').length;
    },

    getFallbackList() {
        try {
            const raw = localStorage.getItem('sothuchi_offline_memos_fallback');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }
};
