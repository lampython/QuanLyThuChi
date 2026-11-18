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

    // ==================== QUẢN LÝ CHẾ ĐỘ TÀI KHOẢN DEMO ====================
    isDemoMode() {
        return localStorage.getItem('smartfinance_is_demo_mode') === 'true';
    },

    setDemoMode(enabled) {
        localStorage.setItem('smartfinance_is_demo_mode', enabled ? 'true' : 'false');
    },

    DEMO_USER: {
        id: 'user_demo_boss',
        email: 'demo@sothuchi.vn',
        name: 'Sếp Demo 🌟',
        role: 'owner'
    },

    DEMO_WORKSPACE: {
        id: 'ws_demo_sothuchi',
        name: 'Sổ Demo Thu Chi 📁',
        icon: '📁',
        role: 'owner',
        is_default: true
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
        if (this.isDemoMode()) {
            const demoData = localStorage.getItem('smartfinance_demo_transactions');
            return demoData ? JSON.parse(demoData) : [];
        }
        const data = sessionStorage.getItem('temp_guest_transactions');
        return data ? JSON.parse(data) : [];
    },

    saveTransactions(txs) {
        if (this.isDemoMode()) {
            localStorage.setItem('smartfinance_demo_transactions', JSON.stringify(txs));
            return;
        }
        sessionStorage.setItem('temp_guest_transactions', JSON.stringify(txs));
    },

    addTransaction(tx) {
        const txs = this.getTransactions();
        const newTx = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            ...tx,
            sub_items: Array.isArray(tx.sub_items) ? tx.sub_items : (Array.isArray(tx.subItems) ? tx.subItems : [])
        };
        txs.unshift(newTx);
        this.saveTransactions(txs);
        return newTx;
    },

    addBatchTransactions(batchList) {
        if (!Array.isArray(batchList) || batchList.length === 0) return [];
        const txs = this.getTransactions();
        const added = [];

        batchList.forEach((it, idx) => {
            const newTx = {
                id: 'tx_' + (Date.now() + idx) + '_' + Math.random().toString(36).substr(2, 4),
                type: it.type || 'expense',
                amount: Number(it.amount) || 0,
                categoryId: it.categoryId || 'cat_unclassified_expense',
                note: it.note || '',
                date: it.date || new Date().toISOString(),
                sub_items: Array.isArray(it.sub_items) ? it.sub_items : []
            };
            txs.unshift(newTx);
            added.push(newTx);
        });

        // Sắp xếp theo ngày giảm dần
        txs.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.saveTransactions(txs);

        // Tự động đồng bộ sang Sổ Công Nợ nếu giao dịch có phát hiện nợ nần
        try {
            this.syncBatchDebts(batchList);
        } catch (e) {
            console.warn('Lỗi syncBatchDebts:', e);
        }

        return added;
    },

    // ==================== 🤝 PHÂN HỆ QUẢN LÝ CÔNG NỢ & VAY MƯỢN ====================
    getDebts() {
        try {
            if (this.isDemoMode()) {
                const raw = localStorage.getItem('smartfinance_demo_debts');
                return raw ? JSON.parse(raw) : [];
            }
            const raw = localStorage.getItem('smartfinance_debts');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    saveDebts(debts) {
        const data = Array.isArray(debts) ? debts : [];
        if (this.isDemoMode()) {
            localStorage.setItem('smartfinance_demo_debts', JSON.stringify(data));
            return;
        }
        localStorage.setItem('smartfinance_debts', JSON.stringify(data));
    },

    getDebtsSummary() {
        const debts = this.getDebts();
        let totalBorrow = 0; // Tôi nợ (Phải trả)
        let totalLend = 0;   // Nợ tôi (Phải thu)
        let activeBorrowCount = 0;
        let activeLendCount = 0;

        debts.forEach(d => {
            if (d.status === 'active') {
                const rem = Number(d.remainingAmount) || 0;
                if (d.type === 'borrow') {
                    totalBorrow += rem;
                    activeBorrowCount++;
                } else if (d.type === 'lend') {
                    totalLend += rem;
                    activeLendCount++;
                }
            }
        });

        return {
            totalBorrow,
            totalLend,
            netDebt: totalLend - totalBorrow,
            activeBorrowCount,
            activeLendCount,
            totalActiveCount: activeBorrowCount + activeLendCount
        };
    },

    addDebt(debt) {
        const debts = this.getDebts();
        const contactName = (debt.contact || 'Chưa đặt tên').trim();
        const amt = Number(debt.amount || debt.originalAmount) || 0;
        const type = debt.type || 'borrow'; // 'borrow' (Tôi nợ) | 'lend' (Nợ tôi)

        const newDebt = {
            id: 'debt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            contact: contactName,
            type: type,
            originalAmount: amt,
            paidAmount: 0,
            remainingAmount: amt,
            note: debt.note || '',
            date: debt.date || new Date().toISOString(),
            dueDate: debt.dueDate || '',
            status: 'active',
            history: [{
                id: 'dh_' + Date.now(),
                date: debt.date || new Date().toISOString(),
                action: type,
                amount: amt,
                note: debt.note || 'Tạo khoản nợ mới'
            }]
        };

        debts.unshift(newDebt);
        this.saveDebts(debts);
        return newDebt;
    },

    recordDebtRepayment(debtId, amount, note = '', date = null) {
        let debts = this.getDebts();
        const target = debts.find(d => d.id === debtId);
        if (!target) return null;

        const amt = Number(amount) || 0;
        target.paidAmount = (Number(target.paidAmount) || 0) + amt;
        target.remainingAmount = Math.max(0, target.originalAmount - target.paidAmount);
        if (target.remainingAmount === 0) {
            target.status = 'settled';
        }

        if (!Array.isArray(target.history)) target.history = [];
        target.history.push({
            id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            date: date || new Date().toISOString(),
            action: target.type === 'borrow' ? 'repay' : 'collect',
            amount: amt,
            note: note || (target.type === 'borrow' ? 'Trả bớt nợ / Cấn trừ' : 'Thu hồi bớt nợ')
        });

        this.saveDebts(debts);
        return target;
    },

    recordDebtBorrowMore(debtId, amount, note = '', date = null) {
        let debts = this.getDebts();
        const target = debts.find(d => d.id === debtId);
        if (!target) return null;

        const amt = Number(amount) || 0;
        target.originalAmount = (Number(target.originalAmount) || 0) + amt;
        target.remainingAmount = (Number(target.remainingAmount) || 0) + amt;
        target.status = 'active';

        if (!Array.isArray(target.history)) target.history = [];
        target.history.push({
            id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            date: date || new Date().toISOString(),
            action: target.type,
            amount: amt,
            note: note || 'Mượn thêm / Cho vay thêm'
        });

        this.saveDebts(debts);
        return target;
    },

    settleDebt(debtId) {
        let debts = this.getDebts();
        const target = debts.find(d => d.id === debtId);
        if (!target) return null;

        const remain = target.remainingAmount;
        target.paidAmount = target.originalAmount;
        target.remainingAmount = 0;
        target.status = 'settled';

        if (!Array.isArray(target.history)) target.history = [];
        target.history.push({
            id: 'dh_' + Date.now(),
            date: new Date().toISOString(),
            action: 'settle',
            amount: remain,
            note: 'Chốt tất toán toàn bộ công nợ'
        });

        this.saveDebts(debts);
        return target;
    },

    deleteDebt(debtId) {
        let debts = this.getDebts();
        debts = debts.filter(d => d.id !== debtId);
        this.saveDebts(debts);
        return true;
    },

    syncBatchDebts(batchList) {
        if (!Array.isArray(batchList)) return;
        const debts = this.getDebts();

        // Ưu tiên xử lý các khoản vay/mượn trước ('borrow', 'lend') để thiết lập số nợ ban đầu,
        // sau đó mới xử lý các khoản trả nợ/cấn trừ/thu hồi ('repay', 'collect')
        const sorted = [...batchList].sort((a, b) => {
            const actA = a.debt_info?.action || '';
            const actB = b.debt_info?.action || '';
            const priority = { borrow: 1, lend: 1, repay: 2, collect: 2 };
            return (priority[actA] || 3) - (priority[actB] || 3);
        });

        sorted.forEach(it => {
            const di = it.debt_info;
            if (!di || !di.isDebt || !di.contact) return;

            const contact = di.contact.trim();
            const action = di.action; // 'borrow' (Tôi nợ) | 'repay' (Tôi trả nợ) | 'lend' (Họ nợ tôi) | 'collect' (Thu nợ)
            const amt = Number(it.amount) || 0;
            const dateStr = it.date || new Date().toISOString();
            const noteStr = it.note || '';

            if (action === 'borrow') {
                // Tôi nợ thêm (Đi vay)
                let existing = debts.find(d => d.contact.toLowerCase() === contact.toLowerCase() && d.type === 'borrow' && d.status === 'active');
                if (existing) {
                    existing.originalAmount += amt;
                    existing.remainingAmount += amt;
                    if (!Array.isArray(existing.history)) existing.history = [];
                    existing.history.push({
                        id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        date: dateStr,
                        action: 'borrow',
                        amount: amt,
                        note: noteStr
                    });
                } else {
                    debts.push({
                        id: 'debt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        contact: contact,
                        type: 'borrow',
                        originalAmount: amt,
                        paidAmount: 0,
                        remainingAmount: amt,
                        note: noteStr,
                        date: dateStr,
                        dueDate: '',
                        status: 'active',
                        history: [{
                            id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                            date: dateStr,
                            action: 'borrow',
                            amount: amt,
                            note: noteStr
                        }]
                    });
                }
            } else if (action === 'repay') {
                // Tôi trả nợ / Cấn trừ vào khoản nợ
                let existing = debts.find(d => d.contact.toLowerCase() === contact.toLowerCase() && d.type === 'borrow' && d.status === 'active');
                if (existing) {
                    existing.paidAmount += amt;
                    existing.remainingAmount = Math.max(0, existing.originalAmount - existing.paidAmount);
                    if (existing.remainingAmount === 0) {
                        existing.status = 'settled';
                    }
                    if (!Array.isArray(existing.history)) existing.history = [];
                    existing.history.push({
                        id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        date: dateStr,
                        action: 'repay',
                        amount: amt,
                        note: noteStr
                    });
                } else {
                    // Nếu chưa có khoản nợ trước đó, tạo bản ghi trả nợ/cấn trừ
                    debts.push({
                        id: 'debt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        contact: contact,
                        type: 'borrow',
                        originalAmount: amt,
                        paidAmount: amt,
                        remainingAmount: 0,
                        note: noteStr,
                        date: dateStr,
                        dueDate: '',
                        status: 'settled',
                        history: [{
                            id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                            date: dateStr,
                            action: 'repay',
                            amount: amt,
                            note: noteStr
                        }]
                    });
                }
            } else if (action === 'lend') {
                // Cho mượn (Họ nợ tôi)
                let existing = debts.find(d => d.contact.toLowerCase() === contact.toLowerCase() && d.type === 'lend' && d.status === 'active');
                if (existing) {
                    existing.originalAmount += amt;
                    existing.remainingAmount += amt;
                    if (!Array.isArray(existing.history)) existing.history = [];
                    existing.history.push({
                        id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        date: dateStr,
                        action: 'lend',
                        amount: amt,
                        note: noteStr
                    });
                } else {
                    debts.push({
                        id: 'debt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        contact: contact,
                        type: 'lend',
                        originalAmount: amt,
                        paidAmount: 0,
                        remainingAmount: amt,
                        note: noteStr,
                        date: dateStr,
                        dueDate: '',
                        status: 'active',
                        history: [{
                            id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                            date: dateStr,
                            action: 'lend',
                            amount: amt,
                            note: noteStr
                        }]
                    });
                }
            } else if (action === 'collect') {
                // Thu hồi nợ
                let existing = debts.find(d => d.contact.toLowerCase() === contact.toLowerCase() && d.type === 'lend' && d.status === 'active');
                if (existing) {
                    existing.paidAmount += amt;
                    existing.remainingAmount = Math.max(0, existing.originalAmount - existing.paidAmount);
                    if (existing.remainingAmount === 0) {
                        existing.status = 'settled';
                    }
                    if (!Array.isArray(existing.history)) existing.history = [];
                    existing.history.push({
                        id: 'dh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        date: dateStr,
                        action: 'collect',
                        amount: amt,
                        note: noteStr
                    });
                }
            }
        });

        this.saveDebts(debts);
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
