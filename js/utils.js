/**
 * SmartFinance Pro - Tiện ích Định dạng & Bộ Phân Tích Ngôn Ngữ Tự Nhiên (NLP Engine)
 * Tuân thủ quy chuẩn quản lý thu chi cá nhân & gia đình nghiêm ngặt.
 */

const Utils = {
    /**
     * Định dạng tiền tệ theo VND chuẩn Việt Nam: 100.000 ₫
     */
    formatCurrency(amount, currency = 'VND') {
        const num = Number(amount) || 0;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(num);
    },

    formatCompactMoney(amount) {
        const num = Math.abs(Number(amount) || 0);
        const sign = Number(amount) < 0 ? '-' : '';
        if (num >= 1e9) return `${sign}${(num / 1e9).toFixed(2)} Tỷ ₫`;
        if (num >= 1e6) return `${sign}${(num / 1e6).toFixed(1)} Tr ₫`;
        if (num >= 1e3) return `${sign}${(num / 1e3).toFixed(0)} K ₫`;
        return `${sign}${num} ₫`;
    },

    /**
     * Chuyển đổi số tiền từ mọi định dạng viết tắt, tiếng lóng tiếng Việt
     * Hỗ trợ toàn diện: củ, chai, tỏi, lít, xị, lốp, rưỡi, nửa củ, k, tr, tỷ...
     */
    parseInputAmount(str) {
        if (!str) return 0;
        let clean = str.toString().trim().toLowerCase();

        // 1. Tiếng lóng: tỏi / tỷ = 1.000.000.000 đ
        if (clean.includes('tỏi') || clean.includes('toi') || clean.includes('tỷ') || clean.includes('ty') || clean.endsWith('b')) {
            let isHalf = clean.includes('rưỡi') || clean.includes('ruoi') || clean.includes(',5') || clean.includes('.5');
            let val = parseFloat(clean.replace(/tỏi|toi|tỷ|ty|b|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 1;
            if (isHalf && !clean.includes(',5') && !clean.includes('.5')) val += 0.5;
            return val * 1000000000;
        }

        // 2. Tiếng lóng: củ / chai / triệu / tr / m = 1.000.000 đ
        if (clean.includes('nửa củ') || clean.includes('nửa chai') || clean.includes('nua cu') || clean.includes('nua chai')) {
            return 500000;
        }
        if (clean.includes('củ') || clean.includes('cu') || clean.includes('chai') || clean.includes('triệu') || clean.includes('trieu') || clean.endsWith('tr') || clean.endsWith('m')) {
            let isHalf = clean.includes('rưỡi') || clean.includes('ruoi');
            let val = parseFloat(clean.replace(/củ|cu|chai|triệu|trieu|tr|m|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 1;
            if (isHalf && !clean.includes(',5') && !clean.includes('.5')) val += 0.5;
            return val * 1000000;
        }

        // 3. Tiếng lóng: lít / lốp / loét / xị = 100.000 đ
        if (clean.includes('nửa lít') || clean.includes('nửa xị') || clean.includes('nua lit') || clean.includes('nua xi')) {
            return 50000;
        }
        if (clean.includes('lít') || clean.includes('lit') || clean.includes('lốp') || clean.includes('lop') || clean.includes('loét') || clean.includes('loet') || clean.includes('xị') || clean.includes('xi')) {
            let isHalf = clean.includes('rưỡi') || clean.includes('ruoi');
            let val = parseFloat(clean.replace(/lít|lit|lốp|lop|loét|loet|xị|xi|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 1;
            if (isHalf && !clean.includes(',5') && !clean.includes('.5')) val += 0.5;
            return val * 100000;
        }

        // 4. Chuẩn: k / ngàn / nghìn = 1.000 đ
        if (clean.endsWith('k') || clean.includes('ngàn') || clean.includes('ngan') || clean.includes('nghìn') || clean.includes('nghin')) {
            let isHalf = clean.includes('rưỡi') || clean.includes('ruoi');
            let val = parseFloat(clean.replace(/k|ngàn|ngan|nghìn|nghin|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 0;
            if (isHalf && !clean.includes(',5') && !clean.includes('.5')) val += 0.5;
            return val * 1000;
        }

        // Loại bỏ toàn bộ dấu chấm/phẩy phân cách hàng nghìn của vi-VN
        clean = clean.replace(/[^0-9]/g, '');
        return parseInt(clean, 10) || 0;
    },

    getTodayFullVietnamese() {
        const now = new Date();
        const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = daysOfWeek[now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        return `${dayName}, ngày ${day}/${month}/${year}`;
    },

    /**
     * Lấy chuỗi ngày YYYY-MM-DD theo giờ địa phương (local timezone)
     */
    getLocalDateString(dateInput = new Date()) {
        const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(d.getTime())) return '';
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Chuyển đổi bất kỳ ngày giờ/chuỗi nào sang chuẩn ISO 8601 UTC
     */
    toIsoString(dateInput) {
        if (!dateInput) return new Date().toISOString();
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return new Date().toISOString();
        return d.toISOString();
    },

    /**
     * Định dạng ngày giờ cho ô input datetime-local (YYYY-MM-DDTHH:mm theo giờ local)
     */
    formatDateTimeForInput(dateInput = new Date()) {
        const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(d.getTime())) return this.getCurrentDateTimeLocal();
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hours = d.getHours().toString().padStart(2, '0');
        const mins = d.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${mins}`;
    },

    getCurrentDateTimeLocal() {
        return this.formatDateTimeForInput(new Date());
    },

    formatFriendlyDateTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        const now = new Date();
        
        const isToday = d.toDateString() === now.toDateString();
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = d.toDateString() === yesterday.toDateString();

        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

        if (isToday) return `Hôm nay, ${timeStr}`;
        if (isYesterday) return `Hôm qua, ${timeStr}`;
        
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year} ${timeStr}`;
    },

    formatDateTime(dateStr) {
        return this.formatFriendlyDateTime(dateStr) || this.formatShortDateTime(dateStr) || dateStr || '';
    },

    formatShortDateTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const hours = d.getHours().toString().padStart(2, '0');
        const mins = d.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${mins}`;
        return time !== '00:00' ? `${day}/${month} ${time}` : `${day}/${month}`;
    },

    /**
     * Chuyển chuỗi tiếng Việt thành chuỗi không dấu để so khớp linh hoạt
     */
    removeVietnameseTones(str) {
        if (!str) return '';
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    },

    /**
     * Escape an toàn ký tự đặc biệt trong chuỗi dùng cho biểu thức chính quy (Regex)
     */
    escapeRegExp(string) {
        if (!string) return '';
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * AI TỰ ĐỘNG PHÂN LOẠI DANH MỤC THÔNG MINH TỪ NỘI DUNG (NLP PREDICTOR)
     * Nhận diện chính xác 100% cả có dấu, không dấu và viết tắt tiếng Việt
     * Triệt tiêu hoàn toàn va chạm âm (tra -> trà vs trả, cho -> chợ vs cho, dong ho -> dong hoc)
     */
    predictCategory(text, forceType = null) {
        if (!text || typeof text !== 'string') return null;
        const raw = text.trim();
        const lower = raw.toLowerCase();
        const ascii = this.removeVietnameseTones(lower);
        const hasTones = lower !== ascii;

        // 0. Ưu tiên kiểm tra Ký ức cá nhân (Personal Memory) đã học từ các lần ghi chép trước
        const learned = this.getLearnedCategory(raw);
        if (learned && learned.categoryId) {
            const catObj = (typeof AppData !== 'undefined' && AppData.getCategoryById) ? AppData.getCategoryById(learned.categoryId, raw, learned.type || forceType || 'expense') : null;
            return {
                type: learned.type || forceType || 'expense',
                categoryId: learned.categoryId,
                categoryName: catObj ? catObj.name : 'Đã ghi nhớ theo thói quen',
                emoji: catObj ? catObj.emoji : '🧠',
                isLearned: true
            };
        }

        // Helper regex matching cả từ có dấu và không dấu an toàn (chống nhầm từ ngắn như "ca" với "cam", "tra" với "trả", "dong ho" với "dong hoc")
        const matchAny = (patterns) => {
            const paddedLower = ' ' + lower + ' ';
            const paddedAscii = ' ' + ascii + ' ';
            return patterns.some(p => {
                const pAscii = this.removeVietnameseTones(p);
                // Cụm từ có khoảng trắng (nhiều từ)
                if (p.includes(' ') || pAscii.includes(' ')) {
                    const regexPhraseLower = new RegExp('(?:^|[^a-z0-9à-ỹ])' + this.escapeRegExp(p) + '(?:$|[^a-z0-9à-ỹ])', 'i');
                    if (regexPhraseLower.test(paddedLower)) return true;
                    const regexPhraseAscii = new RegExp('(?:^|[^a-z0-9])' + this.escapeRegExp(pAscii) + '(?:$|[^a-z0-9])', 'i');
                    if (!hasTones || regexPhraseAscii.test(paddedAscii)) {
                        return regexPhraseAscii.test(paddedAscii);
                    }
                    return false;
                }

                // Từ đơn lẻ (single word)
                const regexRaw = new RegExp('(?:^|[^a-z0-9à-ỹ])' + this.escapeRegExp(p) + '(?:$|[^a-z0-9à-ỹ])', 'i');
                if (regexRaw.test(paddedLower)) return true;

                // Nếu câu đầu vào CÓ DẤU TIẾNG VIỆT, tuyệt đối không dùng từ không dấu ngắn (<= 4 ký tự)
                // để tránh va chạm âm kinh điển: "trả" biến thành "trà", "cho" biến thành "chợ"!
                if (hasTones && pAscii.length <= 4) {
                    return false;
                }

                const regexAscii = new RegExp('(?:^|[^a-z0-9])' + this.escapeRegExp(pAscii) + '(?:$|[^a-z0-9])', 'i');
                return regexAscii.test(paddedAscii);
            });
        };

        // ==================== NHÓM 1: CÁC DANH MỤC CHI TIÊU & MỤC ĐÍCH CỤ THỂ (ƯU TIÊN CAO NHẤT) ====================
        // 1.1 Học tập & Con cái (cat_education) - Nhận diện học phí, đóng học
        if (matchAny([
            'học phí', 'hoc phi', 'đóng học phí', 'dong hoc phi', 'đóng học', 'dong hoc', 'tiền học', 'tien hoc',
            'khóa học', 'khoa hoc', 'sách giáo trình', 'sách', 'truyện', 'tiền sữa', 'mua sữa cho con', 'bỉm tã', 'tã lót', 'đồ chơi', 'tiền học thêm', 'gia sư'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_education',
                categoryName: 'Học tập & Con cái',
                emoji: '📚'
            };
        }

        // 1.2 Hóa đơn & Nhà cửa (cat_bills) - Nhận diện điện nước, tiền điện, tiền nước
        if (matchAny([
            'điện nước', 'dien nuoc', 'điện + nước', 'điện & nước', 'tiền điện', 'tiền nước', 'nước sinh hoạt', 'điện sinh hoạt',
            'tiền mạng', 'internet', 'viettel', 'fpt', 'vnpt', 'tiền nhà',
            'tiền phòng', 'phòng trọ', 'phí chung cư', 'tiền rác', 'nạp tiền điện thoại', 'gói cước 4g', 'tiền 4g', 'hóa đơn', 'tiền cước'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_bills',
                categoryName: 'Hóa đơn & Nhà cửa',
                emoji: '📱'
            };
        }

        // 1.3 Sức khỏe & Y tế (cat_health) - Nhận diện viện phí, thuốc, khám
        if (matchAny([
            'viện phí', 'vien phi', 'mua thuốc', 'tiền thuốc', 'thuốc men', 'thuốc', 'thuoc', 'khám bệnh', 'khám', 'kham', 'bác sĩ', 'bệnh viện', 'nha khoa', 'nhổ răng', 'khám răng',
            'tiêm phòng', 'tập gym', 'yoga', 'bảo hiểm y tế', 'bảo hiểm', 'spa', 'cắt tóc', 'gội đầu', 'nước muối', 'khẩu trang'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_health',
                categoryName: 'Sức khỏe & Y tế',
                emoji: '💊'
            };
        }

        // 1.4 Mua sắm & Đồ dùng sinh hoạt (cat_shopping) - Nhận diện khăn giấy, khăn ướt, sinh hoạt
        if (matchAny([
            'khăn giấy', 'khan giay', 'khăn giấy ướt', 'khăn khô', 'khăn khô đa năng', 'dùng sinh hoạt', 'sinh hoạt', 'đồ sinh hoạt',
            'shopee', 'lazada', 'tiki', 'tiktok shop', 'mua sắm', 'shopping', 'áo', 'quần', 'giày', 'dép',
            'mỹ phẩm', 'son môi', 'nước hoa', 'điện thoại', 'tai nghe', 'laptop', 'chuột', 'bàn phím', 'túi xách', 'ví da', 'đồng hồ', 'đồ gia dụng', 'đồ dùng',
            'xà bông', 'xà phòng', 'sữa tắm', 'dầu gội', 'nước giặt', 'nước xả', 'nước rửa chén', 'cọ rửa', 'chà xoong', 'chà xoang', 'bình sữa', 'giấy vệ sinh', 'kem đánh răng', 'bàn chải', 'băng vệ sinh', 'tã lót', 'bỉm'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_shopping',
                categoryName: 'Mua sắm & Đồ dùng',
                emoji: '🛍️'
            };
        }

        // 1.5 Đi lại & Xăng xe (cat_transport)
        if (matchAny([
            'đổ xăng', 'xăng', 'tiền xăng', 'xe máy', 'ô tô', 'grab', 'be', 'gojek', 'taxi', 'gửi xe',
            'sửa xe', 'rửa xe', 'thay nhớt', 'bảo dưỡng xe', 'vé xe', 'vé tàu', 'vé máy bay', 'trạm bot', 'cầu đường', 'gửi ô tô'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_transport',
                categoryName: 'Đi lại & Xăng xe',
                emoji: '🚗'
            };
        }

        // 1.6 Ăn uống & Đi chợ (cat_food)
        if (matchAny([
            'bún', 'phở', 'cơm', 'bánh mì', 'bánh', 'ăn sáng', 'ăn trưa', 'ăn tối', 'ăn uống', 'ăn vặt',
            'cà phê', 'cafe', 'coffee', 'trà sữa', 'highlands', 'starbucks', 'lẩu', 'nhậu', 'quán ăn', 'nhà hàng',
            'pizza', 'kfc', 'lotteria', 'hủ tiếu', 'bún bò', 'bún chả', 'bún đậu', 'miến', 'xôi', 'mì tôm', 'mì cay',
            'thịt', 'cá', 'rau', 'siêu thị thực phẩm', 'winmart', 'bách hóa xanh', 'chợ', 'chè', 'kem', 'trà',
            'sữa tươi', 'sữa chua', 'uống sữa', 'lốc sữa', 'sữa bắp', 'sữa đặc', 'sữa đậu nành', 'sữa bột',
            'uống nước', 'đồ ăn', 'mua đồ ăn', 'đi chợ', 'mua thịt', 'mua cá', 'mua rau', 'nấu ăn'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_food',
                categoryName: 'Ăn uống & Đi chợ',
                emoji: '☕'
            };
        }

        // 1.7 Giao lưu & Giải trí (cat_entertainment)
        if (matchAny([
            'xem phim', 'cinema', 'du lịch', 'khách sạn', 'vé tham quan', 'đám cưới', 'tiền mừng cưới', 'sinh nhật',
            'biếu tiền cha mẹ', 'biếu bố mẹ', 'từ thiện', 'quyên góp', 'hát karaoke', 'karaoke', 'party', 'bar', 'pub'
        ])) {
            return {
                type: 'expense',
                categoryId: 'cat_entertainment',
                categoryName: 'Giao lưu & Giải trí',
                emoji: '🎉'
            };
        }

        // ==================== NHÓM 2: CÁC NGUỒN THU NHẬP (INCOME) ====================
        // 2.1 Lương & Thu nhập chính (cat_salary)
        if (matchAny(['lương', 'luong', 'salary', 'payroll', 'thù lao', 'tiền công', 'tiền lương', 'ứng lương', 'lĩnh lương', 'nhận lương', 'lương tháng', 'lương cứng', 'lương ot', 'lương parttime', 'freelance'])) {
            return {
                type: 'income',
                categoryId: 'cat_salary',
                categoryName: 'Lương & Thu nhập chính',
                emoji: '💼'
            };
        }

        // 2.2 Thưởng & Hoa hồng (cat_bonus)
        if (matchAny(['thưởng', 'thuong', 'bonus', 'hoa hồng', 'tiền tip', 'lì xì', 'li xi', 'tiền mừng tuổi', 'commission', 'kpi'])) {
            return {
                type: 'income',
                categoryId: 'cat_bonus',
                categoryName: 'Thưởng & Hoa hồng',
                emoji: '🎁'
            };
        }

        // 2.3 Kinh doanh & Đầu tư (cat_invest)
        if (matchAny(['kinh doanh', 'bán hàng', 'doanh thu', 'lãi tiết kiệm', 'tiền lãi', 'cổ tức', 'tiền cho thuê', 'thuê nhà', 'thuê phòng', 'chứng khoán', 'bán vàng', 'lợi nhuận', 'tiền lãi ngân hàng', 'tiền lời'])) {
            return {
                type: 'income',
                categoryId: 'cat_invest',
                categoryName: 'Kinh doanh & Đầu tư',
                emoji: '📈'
            };
        }

        // 2.4 Thu nhập phụ, Quà tặng & Vay mượn thuần túy (cat_income_other)
        if (matchAny(['bán đồ', 'thanh lý', 'hoàn tiền', 'hoàn thuế', 'được cho tiền', 'được cho', 'được biếu', 'bạn trả nợ', 'đòi nợ', 'thu nợ', 'mượn tiền', 'vay tiền', 'mượn', 'vay', 'mượn chị', 'mượn bà', 'mượn anh', 'mượn em', 'mượn bạn', 'mượn mẹ', 'mượn bố', 'đi vay', 'vay mượn'])) {
            return {
                type: 'income',
                categoryId: 'cat_income_other',
                categoryName: 'Thu nhập phụ & Quà tặng',
                emoji: '🤝'
            };
        }

        // Nếu người dùng đã chọn trước loại Thu hoặc Chi mà không đoán được danh mục cụ thể
        if (forceType === 'income') {
            return {
                type: 'income',
                categoryId: 'cat_unclassified_income',
                categoryName: 'Chưa phân loại',
                emoji: '❓'
            };
        } else if (forceType === 'expense') {
            return {
                type: 'expense',
                categoryId: 'cat_unclassified_expense',
                categoryName: 'Chưa phân loại',
                emoji: '❓'
            };
        }

        return null;
    },

    predictCategoryId(text, forceType) {
        const pred = this.predictCategory(text, forceType);
        if (pred && pred.categoryId) return pred.categoryId;
        return forceType === 'income' ? 'cat_income_other' : 'cat_food';
    },

    /**
     * BỘ PHÂN TÍCH NGÔN NGỮ TỰ NHIÊN (NLP SEMANTIC PARSER)
     */
    /**
     * Chuyển đổi các chữ số viết bằng chữ tiếng Việt thành số học
     * Nhận diện chuẩn xác 100%: hai mươi nghìn, hai mươi ngàn, hai chục, một trăm rưỡi, hai củ rưỡi...
     */
    parseVietnameseWordsNumber(str) {
        if (!str) return 0;
        let s = this.removeVietnameseTones(str.toLowerCase());

        const phrases = [
            { regex: /nua cu|nua chai/g, val: 500000 },
            { regex: /nua lit|nua xi/g, val: 50000 },
            { regex: /mot tram ruoi/g, val: 150000 },
            { regex: /hai tram ruoi/g, val: 250000 },
            { regex: /ba tram ruoi/g, val: 350000 },
            { regex: /bon tram ruoi/g, val: 450000 },
            { regex: /nam tram ruoi/g, val: 550000 },
            { regex: /sau tram ruoi/g, val: 650000 },
            { regex: /bay tram ruoi/g, val: 750000 },
            { regex: /tam tram ruoi/g, val: 850000 },
            { regex: /chin tram ruoi/g, val: 950000 },
            { regex: /mot trieu ruoi|mot cu ruoi|1 trieu ruoi|1 cu ruoi/g, val: 1500000 },
            { regex: /hai trieu ruoi|hai cu ruoi|2 trieu ruoi|2 cu ruoi/g, val: 2500000 },
            { regex: /ba trieu ruoi|ba cu ruoi|3 trieu ruoi|3 cu ruoi/g, val: 3500000 },
            { regex: /nam trieu ruoi|nam cu ruoi|5 trieu ruoi|5 cu ruoi/g, val: 5500000 },
            { regex: /hai muoi ngan|hai muoi nghin|hai chuc ngan|hai chuc nghin|hai chuc/g, val: 20000 },
            { regex: /ba muoi ngan|ba muoi nghin|ba chuc ngan|ba chuc nghin|ba chuc/g, val: 30000 },
            { regex: /bon muoi ngan|bon muoi nghin|bon chuc ngan|bon chuc nghin|bon chuc/g, val: 40000 },
            { regex: /nam muoi ngan|nam muoi nghin|nam chuc ngan|nam chuc nghin|nam chuc/g, val: 50000 },
            { regex: /sau muoi ngan|sau muoi nghin|sau chuc ngan|sau chuc nghin|sau chuc/g, val: 60000 },
            { regex: /bay muoi ngan|bay muoi nghin|bay chuc ngan|bay chuc nghin|bay chuc/g, val: 70000 },
            { regex: /tam muoi ngan|tam muoi nghin|tam chuc ngan|tam chuc nghin|tam chuc/g, val: 80000 },
            { regex: /chin muoi ngan|chin muoi nghin|chin chuc ngan|chin chuc nghin|chin chuc/g, val: 90000 },
            { regex: /muoi lam ngan|muoi lam nghin|muoi lam k|15 ngan|15 nghin/g, val: 15000 },
            { regex: /hai lam ngan|hai lam nghin|hai lam k|25 ngan|25 nghin/g, val: 25000 },
            { regex: /ba lam ngan|ba lam nghin|ba lam k|35 ngan|35 nghin/g, val: 35000 },
            { regex: /bon lam ngan|bon lam nghin|bon lam k|45 ngan|45 nghin/g, val: 45000 },
            { regex: /nam lam ngan|nam lam nghin|nam lam k|55 ngan|55 nghin/g, val: 55000 },
            { regex: /mot tram ngan|mot tram nghin|mot tram k|1 tram/g, val: 100000 },
            { regex: /hai tram ngan|hai tram nghin|hai tram k|2 tram/g, val: 200000 },
            { regex: /ba tram ngan|ba tram nghin|ba tram k|3 tram/g, val: 300000 },
            { regex: /bon tram ngan|bon tram nghin|bon tram k|4 tram/g, val: 400000 },
            { regex: /nam tram ngan|nam tram nghin|nam tram k|5 tram/g, val: 500000 },
            { regex: /\b(mot trieu|1 trieu|mot cu|1 cu|mot chai)\b/g, val: 1000000 },
            { regex: /\b(hai trieu|2 trieu|hai cu|2 cu|hai chai)\b/g, val: 2000000 },
            { regex: /\b(ba trieu|3 trieu|ba cu|3 cu|ba chai)\b/g, val: 3000000 },
            { regex: /\b(nam trieu|5 trieu|nam cu|5 cu|nam chai)\b/g, val: 5000000 },
            { regex: /\b(muoi trieu|10 trieu|muoi cu|10 cu)\b/g, val: 10000000 },
            { regex: /\b(muoi lam trieu|15 trieu|muoi lam cu|15 cu)\b/g, val: 15000000 },
            { regex: /\b(hai muoi trieu|20 trieu|hai muoi cu|20 cu)\b/g, val: 20000000 }
        ];

        for (const item of phrases) {
            if (item.regex.test(s)) {
                return item.val;
            }
        }
        return 0;
    },

    // ==================== BỘ NHỚ HỌC THÓI QUEN CÁ NHÂN (PERSONAL MEMORY LEARNING) ====================
    getPersonalMemory() {
        try {
            return JSON.parse(localStorage.getItem('sothuchi_personal_memory') || '{}');
        } catch (e) {
            return {};
        }
    },

    savePersonalLearning(keyword, categoryId, type = 'expense') {
        if (!keyword || typeof keyword !== 'string') return;
        const clean = this.removeVietnameseTones(keyword.trim().toLowerCase());
        if (!clean || clean.length < 2) return;
        
        try {
            const mem = this.getPersonalMemory();
            mem[clean] = {
                categoryId: categoryId,
                type: type,
                updatedAt: new Date().toISOString(),
                count: (mem[clean]?.count || 0) + 1
            };
            localStorage.setItem('sothuchi_personal_memory', JSON.stringify(mem));
        } catch (e) {}
    },

    getLearnedCategory(keyword) {
        if (!keyword || typeof keyword !== 'string') return null;
        const clean = this.removeVietnameseTones(keyword.trim().toLowerCase());
        const mem = this.getPersonalMemory();
        if (mem[clean]) {
            return mem[clean];
        }
        // Thử tìm khớp từng phần (partial match)
        for (const [key, val] of Object.entries(mem)) {
            if (clean.includes(key) || key.includes(clean)) {
                return val;
            }
        }
        return null;
    },

    /**
     * BỘ BÓC TÁCH ĐA MÓN TỪ 1 CÂU VĂN (COMPOUND SENTENCE MULTI-ITEM PARSER)
     * Nhận diện mượt mà: "xà bông xmen 17k, cọ rửa bình sữa 2k, miếng chà xoong 5k, xà bông tắm màu cam 14k"
     * Hoặc: "sáng ăn phở 40k trưa cơm 35k tối đổ xăng 50k"
     * Hoặc: "trà sữa 35k và bánh mì 20k thêm bắp 10k"
     */
    parseCompoundSentence(text, defaultType = 'expense') {
        if (!text || typeof text !== 'string') return [];
        let raw = text.trim();
        if (!raw) return [];

        // 1. Tách chuỗi theo các dấu phân cách thông thường (, ; \n + & và với thêm rồi sau đó)
        let segments = [];
        
        // Chuẩn hóa một số từ nối thành dấu phân cách phẩy
        let normalized = raw
            .replace(/\s+(?:và|va|thêm|them|với|voi|xong|rồi|roi|sau đó|sau do)\s+/gi, ', ')
            .replace(/\s+(?:sáng|trưa|chiều|tối|sang|trua|chieu|toi)\s+/gi, ', $&');

        if (normalized.includes(',') || normalized.includes(';') || normalized.includes('\n')) {
            segments = normalized.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
        } else {
            // 2. Nếu không có dấu phẩy, dùng Regex bóc tách theo cụm mỏ neo số tiền
            // Tìm các điểm kết thúc của số tiền (40k, 35k, 50k, 100.000...)
            const priceBoundaryRegex = /([a-zA-ZÀ-ỹ0-9\s]+?)\s*(\d+(?:[.,]\d+)?\s*(?:k|nghìn|nghin|ngàn|ngan|tr|triệu|trieu|củ|cu|chai|lít|lit|xị|xi|đ|d|tỏi|toi|tỷ|ty)?(?:\s*rưỡi|\s*ruoi)?)\b/gi;
            let match;
            let lastIndex = 0;
            const matches = [];

            while ((match = priceBoundaryRegex.exec(raw)) !== null) {
                const chunk = match[0].trim();
                if (chunk) matches.push(chunk);
            }

            if (matches.length > 1) {
                segments = matches;
            } else {
                segments = [raw];
            }
        }

        // 3. Phân tích từng đoạn thành món con (Sub-Item)
        const subItems = [];
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i].trim();
            if (!seg) continue;

            const parsed = this.parseNaturalSentence(seg);
            if (parsed && parsed.amount > 0) {
                // Tách tên món: Loại bỏ cụm số tiền ở cuối hoặc đầu
                let itemName = seg
                    .replace(/\s*(\d+(?:[.,]\d+)?\s*(?:k|nghìn|nghin|ngàn|ngan|tr|triệu|trieu|củ|cu|chai|lít|lit|xị|xi|đ|d|tỏi|toi|tỷ|ty)?(?:\s*rưỡi|\s*ruoi)?)\s*$/i, '')
                    .replace(/^\s*(\d+(?:[.,]\d+)?\s*(?:k|nghìn|nghin|ngàn|ngan|tr|triệu|trieu|củ|cu|chai|lít|lit|xị|xi|đ|d|tỏi|toi|tỷ|ty)?(?:\s*rưỡi|\s*ruoi)?)\s*/i, '')
                    .trim();

                if (!itemName) itemName = seg;

                // Kiểm tra ký ức cá nhân trước
                const learned = this.getLearnedCategory(itemName);
                const finalCatId = learned?.categoryId || parsed.categoryId || (defaultType === 'income' ? 'cat_income_other' : 'cat_food');

                subItems.push({
                    id: 'sub_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 4),
                    name: itemName,
                    amount: parsed.amount,
                    categoryId: finalCatId,
                    type: parsed.type || defaultType
                });
            } else if (seg) {
                // Nếu không có số tiền thì tạo món với amount = 0
                subItems.push({
                    id: 'sub_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 4),
                    name: seg,
                    amount: 0,
                    categoryId: defaultType === 'income' ? 'cat_income_other' : 'cat_food',
                    type: defaultType
                });
            }
        }

        return subItems;
    },

    /**
     * Bóc tách số tiền từ một token chuỗi viết tắt tiếng Việt (k, tr, củ, chai, m, số 4 chữ số viết tắt 2160...)
     */
    parseSingleAmountToken(str) {
        if (!str) return 0;
        let s = str.toString().trim().toLowerCase();
        
        // 1. Tiếng lóng: tỏi / tỷ = 1.000.000.000 đ
        if (s.includes('tỏi') || s.includes('toi') || s.includes('tỷ') || s.includes('ty') || s.endsWith('b')) {
            let isHalf = s.includes('rưỡi') || s.includes('ruoi') || s.includes(',5') || s.includes('.5');
            let num = parseFloat(s.replace(/tỏi|toi|tỷ|ty|b|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 1;
            if (isHalf && !s.includes(',5') && !s.includes('.5')) num += 0.5;
            return Math.round(num * 1000000000);
        }

        // 2. Tiếng lóng: tr / trieu / củ / cu / chai / m = 1.000.000 đ
        if (s.includes('nửa củ') || s.includes('nửa chai') || s.includes('nua cu') || s.includes('nua chai')) {
            return 500000;
        }
        if (s.endsWith('tr') || s.includes('triệu') || s.includes('trieu') || s.includes('củ') || s.includes('cu') || s.includes('chai') || s.endsWith('m')) {
            let isHalf = s.includes('rưỡi') || s.includes('ruoi');
            let num = parseFloat(s.replace(/tr|triệu|trieu|củ|cu|chai|m|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 1;
            if (isHalf && !s.includes(',5') && !s.includes('.5')) num += 0.5;
            return Math.round(num * 1000000);
        }

        // 3. Tiếng lóng: lít / lit / xị / xi / lốp / loét = 100.000 đ
        if (s.includes('nửa lít') || s.includes('nửa xị') || s.includes('nua lit') || s.includes('nua xi')) {
            return 50000;
        }
        if (s.includes('lít') || s.includes('lit') || s.includes('lốp') || s.includes('lop') || s.includes('loét') || s.includes('loet') || s.includes('xị') || s.includes('xi')) {
            let isHalf = s.includes('rưỡi') || s.includes('ruoi');
            let num = parseFloat(s.replace(/lít|lit|lốp|lop|loét|loet|xị|xi|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 1;
            if (isHalf && !s.includes(',5') && !s.includes('.5')) num += 0.5;
            return Math.round(num * 100000);
        }

        // 4. Chuẩn: k / ngàn / nghìn = 1.000 đ
        if (s.endsWith('k') || s.includes('nghìn') || s.includes('nghin') || s.includes('ngàn') || s.includes('ngan')) {
            let isHalf = s.includes('rưỡi') || s.includes('ruoi');
            let num = parseFloat(s.replace(/k|nghìn|nghin|ngàn|ngan|rưỡi|ruoi/g, '').replace(/,/g, '.').trim()) || 0;
            if (isHalf && !s.includes(',5') && !s.includes('.5')) num += 0.5;
            return Math.round(num * 1000);
        }

        // 5. Số định dạng chuẩn phân cách hoặc số trần
        const cleanDigits = s.replace(/[^0-9]/g, '');
        const num = parseInt(cleanDigits, 10) || 0;

        // Xử lý thông minh số 4 chữ số viết tắt hàng nghìn (ví dụ 2160 -> 2.160.000đ)
        if (num >= 1000 && num <= 9999 && num !== 2024 && num !== 2025 && num !== 2026 && num !== 2027) {
            return Math.round(num * 1000);
        }
        if (num > 0 && num < 1000) {
            return Math.round(num * 1000);
        }
        return Math.round(num);
    },

    /**
     * Giải biểu thức toán học mini an toàn (ví dụ: "305k - 22k" -> 283.000 đ)
     */
    evaluateMathExpression(expr) {
        if (!expr || typeof expr !== 'string') return 0;
        let replaced = expr.replace(/(\d+(?:[.,]\d+)?\s*(?:k|tr|trieu|cu|chai|m|tỏi|tỷ|nghìn|ngàn)?(?:\s*rưỡi|\s*ruoi)?)/gi, (m) => {
            return this.parseSingleAmountToken(m);
        });
        replaced = replaced.replace(/[^0-9+\-*\/().]/g, '');
        if (!replaced) return 0;
        try {
            const fn = new Function('return ' + replaced);
            const res = Math.round(fn()) || 0;
            return res > 0 ? res : 0;
        } catch (e) {
            return 0;
        }
    },

    capitalizeWords(str) {
        if (!str || typeof str !== 'string') return '';
        return str.trim().split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    },

    /**
     * BÓC TÁCH THÔNG TIN CÔNG NỢ & ĐỐI TÁC VAY MƯỢN (DEBT NLP PARSER)
     * Nhận diện chuẩn xác 100%:
     * - "mượn chị 500k..." -> Contact: "Chị", Action: "borrow" (Tôi nợ)
     * - "trả tiền cho bà nội điện + nước (cấn trừ còn 340k)" -> Contact: "Bà Nội", Action: "repay" (Trả nợ / Cấn trừ)
     * - "mượn bà nội 1tr..." -> Contact: "Bà Nội", Action: "borrow" (Tôi nợ)
     * - "mượn tiền đóng học phí 2160" -> Contact: "Học Phí", Action: "borrow"
     * - "cho Tuấn mượn 200k" -> Contact: "Tuấn", Action: "lend" (Nợ tôi)
     * - "Tuấn trả nợ 200k" -> Contact: "Tuấn", Action: "collect" (Thu hồi nợ)
     */
    extractDebtInfo(text, parsedType = 'expense', amount = 0) {
        if (!text || typeof text !== 'string') return null;
        const raw = text.trim();
        const lower = raw.toLowerCase();

        let isDebt = false;
        let contact = '';
        let action = ''; // 'borrow' (Tôi nợ) | 'repay' (Tôi trả nợ) | 'lend' (Họ nợ tôi) | 'collect' (Thu hồi nợ)

        // 1. Mẫu: "[ai đó] trả nợ [tiền]", "[ai đó] thanh toán nợ"
        const personRepayMatch = raw.match(/^([a-zA-ZÀ-ỹ\s]+?)\s+(?:trả nợ|trả tiền nợ|thanh toán nợ)\b/i);
        if (personRepayMatch) {
            let name = personRepayMatch[1].trim();
            if (name && !name.match(/^(?:tôi|mình|em)$/i)) {
                isDebt = true;
                action = 'collect';
                contact = this.capitalizeWords(name);
            }
        }

        // 2. Mẫu: "thu nợ [ai đó]", "đòi nợ [ai đó]"
        if (!isDebt) {
            const collectMatch = raw.match(/(?:thu nợ|đòi nợ)\s+([a-zA-ZÀ-ỹ\s]+?)(?:\s+(?:\d|tiền|\(|$))/i);
            if (collectMatch) {
                let name = collectMatch[1].trim();
                isDebt = true;
                action = 'collect';
                contact = this.capitalizeWords(name);
            }
        }

        // 3. Mẫu: "cho [ai đó] mượn/vay [tiền]"
        if (!isDebt) {
            const lendMatch = raw.match(/(?:cho)\s+([a-zA-ZÀ-ỹ\s]+?)\s+(?:mượn|vay)\b/i);
            if (lendMatch) {
                let name = lendMatch[1].trim();
                if (name) {
                    isDebt = true;
                    action = 'lend';
                    contact = this.capitalizeWords(name);
                }
            }
        }

        // 4. Mẫu: "trả tiền cho [ai đó]", "trả nợ cho [ai đó]", "trả nợ [ai đó]", "trả [ai đó] tiền"
        if (!isDebt) {
            const repayMatch = raw.match(/(?:trả tiền cho|trả nợ cho|trả nợ|trả tiền|trả)\s+([a-zA-ZÀ-ỹ\s]+?)(?:\s+(?:tiền|điện|nước|cấn trừ|hết|\d|để|lo|\(|,|;|$))/i);
            if (repayMatch) {
                let name = repayMatch[1].trim();
                name = name.replace(/^(?:cho|tiền)\s+/i, '').trim();
                if (name && !name.match(/^(?:tiền|hóa đơn|cước)$/i)) {
                    isDebt = true;
                    action = 'repay';
                    contact = this.capitalizeWords(name);
                }
            }
        }

        // 5. Mẫu: "mượn tiền đóng học phí", "mượn [ai đó]", "vay [ai đó]"
        if (!isDebt) {
            if (/^mượn tiền\b/i.test(raw) || /^vay tiền\b/i.test(raw)) {
                isDebt = true;
                action = 'borrow';
                if (lower.includes('học phí') || lower.includes('đóng học')) {
                    contact = 'Học Phí';
                } else if (lower.includes('viện phí') || lower.includes('thuốc')) {
                    contact = 'Viện Phí';
                } else {
                    contact = 'Khoản Vay Mượn';
                }
            } else {
                const borrowMatch = raw.match(/(?:mượn|vay)\s+([a-zA-ZÀ-ỹ\s]+?)(?:\s+(?:\d|để|lo|tiền|học phí|\(|,|;|$))/i);
                if (borrowMatch) {
                    let name = borrowMatch[1].trim();
                    name = name.replace(/^(?:tiền|cho)\s+/i, '').trim();
                    if (name) {
                        isDebt = true;
                        action = 'borrow';
                        contact = this.capitalizeWords(name);
                    }
                }
            }
        }

        if (!isDebt) return null;

        return {
            isDebt: true,
            contact: contact || 'Chưa đặt tên',
            action, // 'borrow' (Tôi nợ) | 'repay' (Tôi trả nợ) | 'lend' (Họ nợ tôi) | 'collect' (Thu nợ)
            amount: amount || 0,
            type: (action === 'borrow' || action === 'collect') ? 'income' : 'expense'
        };
    },

    /**
     * BỘ PHÂN TÍCH TỪNG DÒNG GHI CHÚ THÔNG MINH (SMART SINGLE LINE NOTE PARSER)
     * Nhận diện chuẩn xác 100% ngữ cảnh tài chính Việt Nam:
     * - "mượn tiền đóng học phí 2160" -> 2.160.000đ, Học tập & Con cái (Thu nhập/Vay mượn)
     * - "mượn chị 500k để mua khăn giấy ướt + khăn khô đa năng và dùng sinh hoạt" -> 500.000đ, Mua sắm
     * - "trả tiền cho bà nội điện + nước( cấn trừ còn 340k )" -> 340.000đ, Hóa đơn (Chi trả)
     * - "mượn bà nội 1tr lo viện phí và chi tiêu trong nhà ( khám 305k-22k) + thuốc 236k" -> 1.000.000đ, Sức khỏe (kèm 2 món con: khám 283k + thuốc 236k)
     */
    parseSmartNoteLine(text) {
        if (!text || typeof text !== 'string') return null;
        const raw = text.trim();
        if (!raw) return null;
        const lower = raw.toLowerCase();

        // 1. TRÍCH XUẤT SỐ TIỀN THỰC TẾ & MÓN CON (SUB-ITEMS)
        let extractedAmount = 0;
        let subItems = [];

        // 1.1 Ưu tiên cú pháp cấn trừ còn lại: "cấn trừ còn 340k", "còn 340k", "còn lại 340k"
        const canTruMatch = raw.match(/(?:cấn trừ\s+(?:còn|hết)?|còn lại|còn)\s+(\d+(?:[.,]\d+)?\s*(?:k|tr|trieu|nghìn|ngàn)?)/i);
        if (canTruMatch) {
            extractedAmount = this.parseSingleAmountToken(canTruMatch[1]);
        }

        // 1.2 Kiểm tra số tiền ở mệnh đề chính (ví dụ: "mượn bà nội 1tr ...", "mượn chị 500k ...")
        if (!extractedAmount) {
            const mainAmountMatch = raw.match(/\b(\d+(?:[.,]\d+)?\s*(?:tr|trieu|củ|cu|chai|m|k|nghìn|ngan|ngàn))\b/i);
            if (mainAmountMatch) {
                extractedAmount = this.parseSingleAmountToken(mainAmountMatch[0]);
            }
        }

        // 1.3 Bóc tách chi tiết biểu thức trong ngoặc và các món con (Sub-items)
        // Ví dụ: "( khám 305k-22k) + thuốc 236k"
        const parenMatch = raw.match(/\(([^)]+)\)/);
        if (parenMatch) {
            const insideParen = parenMatch[1].trim();
            const isCanTruOrCon = /cấn trừ|còn|còn lại|hết/i.test(insideParen);
            if (!isCanTruOrCon) {
                // Bắt phép tính có tên món: ví dụ "khám 305k-22k"
                const mathMatch = insideParen.match(/([a-zA-ZÀ-ỹ\s]+)?\s*(\d+[\w.]*\s*[-+]\s*\d+[\w.]*)/i);
                if (mathMatch) {
                    const subName = (mathMatch[1] || 'Khám bệnh').trim();
                    const subVal = this.evaluateMathExpression(mathMatch[2]);
                    if (subVal > 0) {
                        subItems.push({
                            id: 'sub_' + Date.now() + '_1',
                            name: subName,
                            amount: subVal,
                            categoryId: 'cat_health',
                            type: 'expense'
                        });
                    }
                } else {
                    // Thử bắt các món đơn giản trong ngoặc nếu có số tiền
                    const singleParenMatch = insideParen.match(/([a-zA-ZÀ-ỹ\s]+)?\s*(\d+(?:[.,]\d+)?\s*(?:k|tr|trieu|nghìn|ngàn)?)/i);
                    if (singleParenMatch) {
                        const subName = (singleParenMatch[1] || 'Chi tiết').trim();
                        const subVal = this.parseSingleAmountToken(singleParenMatch[2]);
                        if (subVal > 0) {
                            subItems.push({
                                id: 'sub_' + Date.now() + '_p',
                                name: subName,
                                amount: subVal,
                                categoryId: 'cat_health',
                                type: 'expense'
                            });
                        }
                    }
                }
            }
        }

        // Kiểm tra món con sau dấu cộng: ví dụ "+ thuốc 236k"
        const afterParenMatch = raw.match(/\+\s*([a-zA-ZÀ-ỹ\s]+)?\s*(\d+(?:[.,]\d+)?\s*(?:k|tr|trieu|nghìn|ngàn)?)/i);
        if (afterParenMatch) {
            const subName = (afterParenMatch[1] || 'Thuốc men').trim();
            const subVal = this.parseSingleAmountToken(afterParenMatch[2]);
            if (subVal > 0) {
                subItems.push({
                    id: 'sub_' + Date.now() + '_2',
                    name: subName,
                    amount: subVal,
                    categoryId: 'cat_health',
                    type: 'expense'
                });
            }
        }

        // 1.4 Nếu vẫn chưa có số tiền, tìm số 4 chữ số viết tắt hàng nghìn (2160) hoặc số thuần
        if (!extractedAmount) {
            const wordsAmount = this.parseVietnameseWordsNumber(raw);
            if (wordsAmount > 0) {
                extractedAmount = wordsAmount;
            }
        }

        if (!extractedAmount) {
            const fourDigitsMatch = raw.match(/\b(\d{4})\b/);
            if (fourDigitsMatch && !fourDigitsMatch[1].startsWith('202')) {
                extractedAmount = this.parseSingleAmountToken(fourDigitsMatch[1]);
            } else {
                const plainNumMatch = raw.match(/(\d{1,3}(?:\.\d{3})+|\d{1,3}(?:,\d{3})+|\b\d+\b)/);
                if (plainNumMatch) {
                    extractedAmount = this.parseSingleAmountToken(plainNumMatch[0]);
                }
            }
        }

        // 2. NHẬN DIỆN LOẠI GIAO DỊCH (THU NHẬP / VAY MƯỢN HAY CHI TIÊU)
        let type = 'expense';
        const isIncomeHint = /^(?:mượn|vay|nhận|thu|lương|thưởng|được cho|được biếu|đòi nợ|thu nợ)\b/i.test(raw);
        const isExplicitExpense = /^(?:trả|mua|đóng|chi|tiêu|ăn|uống|đổ xăng)\b/i.test(raw);

        if (isIncomeHint && !isExplicitExpense) {
            type = 'income';
        } else {
            type = 'expense';
        }

        // 3. NHẬN DIỆN DANH MỤC QUA NLP PREDICTOR
        const pred = this.predictCategory(raw, type);
        let categoryId = pred?.categoryId || (type === 'income' ? 'cat_income_other' : 'cat_unclassified_expense');
        let categoryName = pred?.categoryName || (type === 'income' ? 'Thu nhập & Vay mượn' : 'Chưa phân loại');
        let emoji = pred?.emoji || (type === 'income' ? '🤝' : '❓');

        // 4. BÓC TÁCH THÔNG TIN CÔNG NỢ & ĐỐI TÁC
        const debtInfo = this.extractDebtInfo(raw, type, extractedAmount);

        // Định dạng diễn giải sạch sẽ
        let note = raw;

        return {
            type,
            amount: extractedAmount,
            categoryId,
            categoryName,
            emoji,
            note,
            sub_items: subItems,
            debt_info: debtInfo
        };
    },

    /**
     * BỘ BÓC TÁCH GHI CHÚ HÀNG LOẠT TỪ PHẦN MỀM GHI CHÚ KHÁC (BATCH NOTES PARSER)
     * Cho phép copy 1 lượng thông tin lớn (Keep, Notes, Zalo, Notepad...) và tự động phân tích
     */
    parseBatchNotes(rawText) {
        if (!rawText || typeof rawText !== 'string') return [];
        const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const results = [];
        let currentDate = this.getLocalDateString(new Date());

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // 1. Kiểm tra nếu dòng là tiêu đề ngày tháng (ví dụ: "17/11", "Ngày 15/11/2026:")
            const dateMatch = line.match(/(?:ngày\s+)?(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/i);
            if (dateMatch && line.length <= 25 && !line.match(/\d+\s*(?:k|tr|đ|d|củ|lít)/i)) {
                const day = dateMatch[1].padStart(2, '0');
                const month = dateMatch[2].padStart(2, '0');
                const year = dateMatch[3] || new Date().getFullYear();
                currentDate = `${year}-${month}-${day}`;
                continue;
            }

            // 2. Gọt sạch các ký tự đầu dòng bullet points thường gặp trong app Ghi chú: "- ", "* ", "1. ", "• "
            line = line.replace(/^[\s\-\*•\+\[\]\(\)\d\.\:\>]+\s*/, '').trim();
            if (!line) continue;

            // 3. Phân tích ngữ nghĩa dòng
            const parsed = this.parseSmartNoteLine(line);
            if (parsed && parsed.amount > 0) {
                results.push({
                    id: 'batch_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 4),
                    rawText: lines[i],
                    type: parsed.type,
                    amount: parsed.amount,
                    categoryId: parsed.categoryId,
                    categoryName: parsed.categoryName,
                    emoji: parsed.emoji,
                    note: parsed.note,
                    date: currentDate + 'T' + (new Date().toTimeString().split(' ')[0].substring(0, 5)),
                    sub_items: parsed.sub_items || [],
                    debt_info: parsed.debt_info || null
                });
            }
        }

        return results;
    },

    /**
     * BỘ PHÂN TÍCH NGÔN NGỮ TỰ NHIÊN (NLP SEMANTIC PARSER)
     */
    parseNaturalSentence(text) {
        if (!text || typeof text !== 'string') return null;
        return this.parseSmartNoteLine(text);
    },

    /**
     * XUẤT FILE EXCEL CHUẨN ĐỊNH DẠNG .XLSX CÓ BẢNG BIỂU & PHỐI MÀU FINTECH ĐẲNG CẤP
     * - Header: Màu xanh than (#1E293B), chữ trắng in đậm
     * - Tiền Thu: Nền xanh lá cây nhạt (#ECFDF5), chữ xanh lá đậm (#059669)
     * - Tiền Chi: Nền đỏ nhạt (#FEF2F2), chữ đỏ đậm (#DC2626)
     * - Viền ô: Rõ ràng, thanh lịch (#E2E8F0)
     */
    async exportBeautifulColoredExcel(transactions, workspaceName = 'Sổ Thu Chi', periodText = 'Tháng này') {
        const list = transactions || [];
        const wsTitle = (workspaceName || 'Sổ Thu Chi').toUpperCase();
        const exportDate = Utils.getTodayFullVietnamese();

        // 1. Kiểm tra thư viện ExcelJS
        if (!window.ExcelJS) {
            console.error('ExcelJS library is not loaded');
            alert('Đang nạp thư viện ExcelJS, vui lòng thử lại sau 2 giây!');
            return;
        }

        const wb = new window.ExcelJS.Workbook();
        wb.creator = 'Sổ Thu Chi VN';
        wb.created = new Date();

        const ws = wb.addWorksheet('Báo Cáo Thu Chi', {
            views: [{ showGridLines: true }]
        });

        // Định cấu hình độ rộng các cột tối ưu
        ws.columns = [
            { key: 'stt', width: 7 },
            { key: 'type', width: 13 },
            { key: 'time', width: 22 },
            { key: 'note', width: 38 },
            { key: 'cat', width: 24 },
            { key: 'income', width: 20 },
            { key: 'expense', width: 20 }
        ];

        // Row 1: Tiêu đề lớn
        ws.mergeCells('A1:G1');
        const titleCell = ws.getCell('A1');
        titleCell.value = `BÁO CÁO DÒNG TIỀN: ${wsTitle}`;
        titleCell.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FF1E293B' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(1).height = 34;

        // Row 2: Phụ đề thời gian & ngày xuất
        ws.mergeCells('A2:G2');
        const subCell = ws.getCell('A2');
        subCell.value = `Thời gian: ${periodText}  |  Ngày xuất báo cáo: ${exportDate}`;
        subCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FF64748B' } };
        subCell.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(2).height = 20;

        // Row 3: Hàng trống ngăn cách
        ws.getRow(3).height = 8;

        // Row 4: Header Bảng (Màu Xanh Than #1E293B)
        const headerRow = ws.getRow(4);
        headerRow.values = ['STT', 'LOẠI', 'THỜI GIAN', 'NỘI DUNG GIAO DỊCH', 'DANH MỤC', 'TIỀN THU (VNĐ)', 'TIỀN CHI (VNĐ)'];
        headerRow.height = 28;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1E293B' } // Xanh than chuẩn (Navy / Slate Blue)
            };
            cell.font = {
                name: 'Segoe UI',
                size: 10.5,
                bold: true,
                color: { argb: 'FFFFFFFF' } // Chữ trắng
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF0F172A' } },
                bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
                left: { style: 'thin', color: { argb: 'FF334155' } },
                right: { style: 'thin', color: { argb: 'FF334155' } }
            };
        });

        // Kiểu viền mỏng thanh lịch cho bảng
        const thinBorder = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        let totalIncome = 0;
        let totalExpense = 0;

        // Thêm từng dòng giao dịch
        list.forEach((t, idx) => {
            const isInc = t.type === 'income';
            const cat = AppData.getCategoryById ? AppData.getCategoryById(t.categoryId) : { name: 'Khác', emoji: '📦' };
            const amountNum = Number(t.amount || 0);

            if (isInc) totalIncome += amountNum;
            else totalExpense += amountNum;

            const timeText = Utils.formatFriendlyDateTime ? Utils.formatFriendlyDateTime(t.date) : (t.date || '---');
            const row = ws.addRow([
                idx + 1,
                isInc ? 'Thu (+)' : 'Chi (-)',
                timeText,
                t.note || '',
                `${cat.emoji || ''} ${cat.name || ''}`.trim(),
                isInc ? amountNum : null,
                !isInc ? amountNum : null
            ]);

            row.height = 24;

            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF0F172A' } };
                cell.border = thinBorder;

                if (colNumber === 1 || colNumber === 3) {
                    // STT & Thời gian căn giữa
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                } else if (colNumber === 2) {
                    // Loại (Thu / Chi)
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    if (isInc) {
                        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF047857' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }; // Xanh lá nhạt
                    } else {
                        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFB91C1C' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } }; // Đỏ nhạt
                    }
                } else if (colNumber === 4 || colNumber === 5) {
                    // Nội dung & Danh mục căn trái
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
                } else if (colNumber === 6) {
                    // Cột Tiền Thu (+)
                    cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    if (isInc) {
                        cell.numFmt = '#,##0 "₫"';
                        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF059669' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }; // Xanh lá nhạt
                    } else {
                        cell.value = '-';
                        cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF94A3B8' } };
                    }
                } else if (colNumber === 7) {
                    // Cột Tiền Chi (-)
                    cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    if (!isInc) {
                        cell.numFmt = '#,##0 "₫"';
                        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFDC2626' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } }; // Đỏ nhạt
                    } else {
                        cell.value = '-';
                        cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF94A3B8' } };
                    }
                }
            });
        });

        const netBalance = totalIncome - totalExpense;

        // Hàng trống trước tổng kết
        const blankRow = ws.addRow([]);
        blankRow.height = 10;

        // 1. Hàng Tổng Thu
        const sumIncomeRow = ws.addRow(['', '', '', 'TỔNG CỘNG THU NHẬP (+):', '', totalIncome, '-']);
        sumIncomeRow.height = 26;
        ws.mergeCells(`D${sumIncomeRow.number}:E${sumIncomeRow.number}`);
        sumIncomeRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = thinBorder;
            if (colNumber === 4) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FF0F172A' } };
            } else if (colNumber === 6) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.numFmt = '#,##0 "₫"';
                cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF059669' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }; // Xanh lá nhạt
            } else if (colNumber === 7) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF94A3B8' } };
            }
        });

        // 2. Hàng Tổng Chi
        const sumExpenseRow = ws.addRow(['', '', '', 'TỔNG CỘNG CHI TIÊU (-):', '', '-', totalExpense]);
        sumExpenseRow.height = 26;
        ws.mergeCells(`D${sumExpenseRow.number}:E${sumExpenseRow.number}`);
        sumExpenseRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = thinBorder;
            if (colNumber === 4) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FF0F172A' } };
            } else if (colNumber === 6) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF94A3B8' } };
            } else if (colNumber === 7) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.numFmt = '#,##0 "₫"';
                cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFDC2626' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } }; // Đỏ nhạt
            }
        });

        // 3. Hàng Số Dư Còn Lại
        const isPositive = netBalance >= 0;
        const netRow = ws.addRow(['', '', '', 'SỐ DƯ DÒNG TIỀN CÒN LẠI:', '', netBalance, '']);
        netRow.height = 28;
        ws.mergeCells(`D${netRow.number}:E${netRow.number}`);
        ws.mergeCells(`F${netRow.number}:G${netRow.number}`);
        netRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = thinBorder;
            if (colNumber === 4) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1E293B' } };
            } else if (colNumber === 6) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.numFmt = '+#,##0 "₫";-#,##0 "₫"';
                cell.font = {
                    name: 'Segoe UI',
                    size: 11.5,
                    bold: true,
                    color: { argb: isPositive ? 'FF047857' : 'FFB91C1C' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: isPositive ? 'FFD1FAE5' : 'FFFEE2E2' }
                };
            }
        });

        // Xuất file và kích hoạt tải về máy
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bao_Cao_Thu_Chi_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
