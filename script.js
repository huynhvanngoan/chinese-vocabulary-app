// Dữ liệu từ vựng được khởi tạo an toàn
let vocabularyData = [];

// Chuyển giản thể -> phồn thể cho bộ từ vựng có sẵn
function toTraditional(input) {
    if (!input) return input;
    const map = {
        '陈': '陳', '华': '華', '开': '開', '来': '來', '这': '這', '问': '問', '进': '進', '欢': '歡', '谢': '謝', '对': '對',
        '书': '書', '师': '師', '们': '們', '国': '國', '乌': '烏', '龙': '龍', '张': '張', '马': '馬', '诚': '誠', '东': '東',
        '湾': '灣', '妈': '媽', '谁': '誰', '见': '見', '气': '氣', '请': '請', '帮': '幫', '几': '幾', '个': '個', '还': '還',
        '温': '溫', '后': '後', '发': '發', '电': '電', '门': '門', '爱': '愛', '广': '廣', '长': '長', '实': '實', '体': '體'
    };
    let out = '';
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        out += map[ch] || ch;
    }
    return out;
}

// ===== Display: Simplified/Traditional toggle =====
let chineseDisplayMode = localStorage.getItem('cnDisplay') || 'traditional';

function setChineseDisplay(mode) {
    chineseDisplayMode = (mode === 'simplified') ? 'simplified' : 'traditional';
    localStorage.setItem('cnDisplay', chineseDisplayMode);
    displayVocabulary();
    // Update exercise/flashcards if visible
    if (document.getElementById('exercise')?.classList.contains('active')) generateQuestion();
    if (document.getElementById('flashcards')?.classList.contains('active')) renderFlashcard();
}

document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('cnDisplay');
    if (sel) sel.value = chineseDisplayMode;
});

function toSimplified(input) {
    if (!input) return input;
    // reverse of toTraditional map
    const rev = {
        '陳': '陈', '華': '华', '開': '开', '來': '来', '這': '这', '問': '问', '進': '进', '歡': '欢', '謝': '谢', '對': '对',
        '書': '书', '師': '师', '們': '们', '國': '国', '烏': '乌', '龍': '龙', '張': '张', '馬': '马', '誠': '诚', '東': '东',
        '灣': '湾', '媽': '妈', '誰': '谁', '見': '见', '氣': '气', '請': '请', '幫': '帮', '幾': '几', '個': '个', '還': '还',
        '溫': '温', '後': '后', '發': '发', '電': '电', '門': '门', '愛': '爱', '廣': '广', '長': '长', '實': '实', '體': '体'
    };
    let out = '';
    for (let i = 0; i < input.length; i++) out += rev[input[i]] || input[i];
    return out;
}

function getDisplayChinese(text) {
    if (chineseDisplayMode === 'simplified') return toSimplified(text);
    return text;
}

// ========= SRS & Pagination & Timing =========
let exerciseStartMs = 0;
let pageSize = 50;
let currentPage = 1;

function ensureSRSDefaults() {
    const nowIso = new Date().toISOString();
    vocabularyData.forEach(item => {
        if (!item.srs) {
            item.srs = { ease: 2.5, interval: 0, due: nowIso, streak: 0, lastReviewed: null };
        } else {
            if (typeof item.srs.ease !== 'number') item.srs.ease = 2.5;
            if (typeof item.srs.interval !== 'number') item.srs.interval = 0;
            if (!item.srs.due) item.srs.due = nowIso;
            if (typeof item.srs.streak !== 'number') item.srs.streak = 0;
            if (!('lastReviewed' in item.srs)) item.srs.lastReviewed = null;
        }
    });
}

function getDueItemsReference() {
    const now = new Date();
    return new Set(
        vocabularyData
            .filter(it => new Date(it.srs?.due || now) <= now)
            .map(it => it.chinese)
    );
}

function updateSRSForWord(wordChinese, isCorrect) {
    const idx = vocabularyData.findIndex(w => w.chinese === wordChinese);
    if (idx === -1) return;
    const now = new Date();
    const srs = vocabularyData[idx].srs || { ease: 2.5, interval: 0, due: now.toISOString(), streak: 0, lastReviewed: null };
    if (isCorrect) {
        srs.streak = (srs.streak || 0) + 1;
        // SM-2 simplified
        if (srs.streak === 1) srs.interval = 1;
        else if (srs.streak === 2) srs.interval = 3;
        else srs.interval = Math.round((srs.interval || 1) * (srs.ease || 2.5));
        srs.ease = Math.max(1.3, (srs.ease || 2.5));
    } else {
        srs.streak = 0;
        srs.interval = 1;
        srs.ease = Math.max(1.3, (srs.ease || 2.5) - 0.2);
    }
    const dueDate = new Date(now.getTime() + srs.interval * 24 * 60 * 60 * 1000);
    srs.due = dueDate.toISOString();
    srs.lastReviewed = now.toISOString();
    vocabularyData[idx].srs = srs;
}

function saveSRSMap() {
    const map = {};
    vocabularyData.forEach(it => { if (it.srs) map[it.chinese] = it.srs; });
    localStorage.setItem('chineseVocab_srs', JSON.stringify(map));
}

function loadSRSMap() {
    const raw = localStorage.getItem('chineseVocab_srs');
    if (!raw) return;
    try {
        const map = JSON.parse(raw);
        vocabularyData.forEach(it => {
            if (map[it.chinese]) it.srs = { ...it.srs, ...map[it.chinese] };
        });
    } catch (e) { console.log('Load SRS failed', e); }
}

function getRecentMistakeSet(limitDays = 7) {
    try {
        const hist = JSON.parse(localStorage.getItem('chineseVocab_history') || '[]');
        const cutoff = Date.now() - limitDays * 24 * 60 * 60 * 1000;
        const set = new Set();
        hist.forEach(h => {
            if (!h.timestamp || new Date(h.timestamp).getTime() < cutoff) return;
            (h.mistakes || []).forEach(m => set.add(m.question?.chinese));
        });
        return set;
    } catch { return new Set(); }
}

function getPagedData(data) {
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(total, start + pageSize);
    return { slice: data.slice(start, end), total, totalPages, start };
}

function changePage(delta) {
    currentPage = Math.max(1, currentPage + delta);
    displayVocabulary();
}
function setPageSize(val) {
    pageSize = parseInt(val) || 50;
    currentPage = 1;
    displayVocabulary();
}

// ========= Existing code continues =========

function initializeVocabularyData() {
    vocabularyData = [
        // Bài 1 - Chào mừng bạn đến Đài Loan - Từ mới 1
        { lesson: "Bài 1", topic: "Giới thiệu", chinese: "陈月美", pinyin: "Chén Yuèměi", grammar: "N", vietnamese: "Trần Nguyệt Mỹ", example: "我是陈月美。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Giới thiệu", chinese: "李明华", pinyin: "Lǐ Mínghuá", grammar: "N", vietnamese: "Lý Minh Hoa", example: "他叫李明华。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Giới thiệu", chinese: "王开文", pinyin: "Wáng Kāiwén", grammar: "N", vietnamese: "Vương Khai Văn", example: "王开文是老师。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đại từ", chinese: "你", pinyin: "nǐ", grammar: "N", vietnamese: "Bạn", example: "你好！", isUserAdded: false },
        { lesson: "Bài 1", topic: "Động từ", chinese: "来", pinyin: "lái", grammar: "V", vietnamese: "Đến", example: "我来台湾。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Động từ", chinese: "是", pinyin: "shì", grammar: "Vst", vietnamese: "Là", example: "我是学生。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Danh từ", chinese: "小姐", pinyin: "xiǎojiě", grammar: "N", vietnamese: "Cô", example: "王小姐好。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Nghi vấn", chinese: "吗", pinyin: "ma", grammar: "Ptc", vietnamese: "Không", example: "你好吗？", isUserAdded: false },
        { lesson: "Bài 1", topic: "Động từ", chinese: "接", pinyin: "jiē", grammar: "V", vietnamese: "Đón", example: "我来接你。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đại từ", chinese: "我们", pinyin: "wǒmen", grammar: "N", vietnamese: "Chúng tôi", example: "我们是朋友。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đại từ", chinese: "我", pinyin: "wǒ", grammar: "N", vietnamese: "Tôi", example: "我很好。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Chỉ định", chinese: "这", pinyin: "zhè", grammar: "Det", vietnamese: "Đây", example: "这是书。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Xưng hô", chinese: "先生", pinyin: "xiānshēng", grammar: "N", vietnamese: "Ông, ngài", example: "王先生好。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Tính từ", chinese: "好", pinyin: "hǎo", grammar: "Vs", vietnamese: "Tốt", example: "今天天气很好。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Động từ", chinese: "姓", pinyin: "xìng", grammar: "Vst", vietnamese: "Họ", example: "我姓王。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Gọi tên", chinese: "叫", pinyin: "jiào", grammar: "Vst", vietnamese: "Gọi, gọi tên", example: "我叫明华。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đại từ", chinese: "你们", pinyin: "nǐmen", grammar: "N", vietnamese: "Các bạn", example: "你们好！", isUserAdded: false },
        { lesson: "Bài 1", topic: "Địa danh", chinese: "台湾", pinyin: "Táiwān", grammar: "N", vietnamese: "Đài Loan", example: "我来台湾学习。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Chào hỏi", chinese: "欢迎", pinyin: "huānyíng", grammar: "", vietnamese: "Chào mừng", example: "欢迎你来台湾！", isUserAdded: false },
        { lesson: "Bài 1", topic: "Hỏi thăm", chinese: "请问", pinyin: "qǐngwèn", grammar: "", vietnamese: "Xin hỏi", example: "请问，你是王先生吗？", isUserAdded: false },
        { lesson: "Bài 1", topic: "Khẳng định", chinese: "是的", pinyin: "shì de", grammar: "", vietnamese: "Vâng, đúng vậy", example: "是的，我是王先生。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Cảm ơn", chinese: "谢谢", pinyin: "xièxie", grammar: "", vietnamese: "Cảm ơn", example: "谢谢你的帮助。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Lịch sự", chinese: "不客气", pinyin: "bùkèqì", grammar: "", vietnamese: "Đừng khách khí", example: "不客气，应该的。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Chào hỏi", chinese: "你好", pinyin: "nǐ hǎo", grammar: "", vietnamese: "Xin chào", example: "你好！很高兴见到你。", isUserAdded: false },

        // Bài 1 - Từ mới 2
        { lesson: "Bài 1", topic: "Xin mời", chinese: "请", pinyin: "qǐng", grammar: "V", vietnamese: "Xin mời", example: "请进！", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đồ uống", chinese: "喝", pinyin: "hē", grammar: "V", vietnamese: "Uống", example: "你喝茶吗？", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đồ uống", chinese: "茶", pinyin: "chá", grammar: "N", vietnamese: "Trà", example: "我喜欢喝茶。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Trạng từ", chinese: "很", pinyin: "hěn", grammar: "Adv", vietnamese: "Rất", example: "我很好。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Tính từ", chinese: "好喝", pinyin: "hǎohē", grammar: "Vs", vietnamese: "Ngon", example: "这茶很好喝。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Nghi vấn", chinese: "什么", pinyin: "shénme", grammar: "N", vietnamese: "Cái gì?", example: "这是什么？", isUserAdded: false },
        { lesson: "Bài 1", topic: "Danh từ", chinese: "人", pinyin: "rén", grammar: "N", vietnamese: "Người", example: "他是好人。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Tính từ", chinese: "喜欢", pinyin: "xǐhuān", grammar: "Vst", vietnamese: "Thích", example: "我喜欢中文。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Nghi vấn", chinese: "呢", pinyin: "ne", grammar: "Ptc", vietnamese: "Trợ từ để hỏi cuối câu", example: "你呢？", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đại từ", chinese: "他", pinyin: "tā", grammar: "N", vietnamese: "Anh ấy", example: "他是我朋友。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Phủ định", chinese: "不", pinyin: "bù", grammar: "Adv", vietnamese: "Không", example: "我不喝咖啡。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Nghi vấn", chinese: "哪", pinyin: "nǎ/něi", grammar: "Det", vietnamese: "Đâu?", example: "你是哪国人？", isUserAdded: false },
        { lesson: "Bài 1", topic: "Tính từ", chinese: "要", pinyin: "yào", grammar: "Vaux", vietnamese: "Muốn", example: "我要喝茶。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đồ uống", chinese: "咖啡", pinyin: "kāfēi", grammar: "N", vietnamese: "Cà phê", example: "我喜欢喝咖啡。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Đồ uống", chinese: "乌龙茶", pinyin: "wūlóng chá", grammar: "N", vietnamese: "Trà ô long", example: "台湾的乌龙茶很有名。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Quốc gia", chinese: "日本", pinyin: "Rìběn", grammar: "N", vietnamese: "Nhật Bản", example: "他来自日本。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Quốc gia", chinese: "美国", pinyin: "Měiguó", grammar: "N", vietnamese: "Nước Mỹ", example: "我来自美国。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Lời xin lỗi", chinese: "对不起", pinyin: "duìbùqǐ", grammar: "", vietnamese: "Xin lỗi", example: "对不起，我来晚了。", isUserAdded: false },
        { lesson: "Bài 1", topic: "Nghi vấn", chinese: "哪国", pinyin: "nǎ guó/něi guó", grammar: "", vietnamese: "Nước nào?", example: "你是哪国人？", isUserAdded: false },

        // Bài 2 - Từ mới 1
        { lesson: "Bài 2", topic: "Gia đình", chinese: "田中诚一", pinyin: "Tiánzhōng Chéngyī", grammar: "N", vietnamese: "Tanaka Seiichi", example: "我叫田中诚一。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "伯母", pinyin: "bómǔ", grammar: "N", vietnamese: "Bác gái", example: "这是我伯母。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "伯父", pinyin: "bófù", grammar: "N", vietnamese: "Bác trai", example: "伯父很好。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Đại từ", chinese: "您", pinyin: "nín", grammar: "N", vietnamese: "Ông, ngài", example: "您好！", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "名字", pinyin: "míngzì", grammar: "N", vietnamese: "Tên", example: "你的名字是什么？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "书", pinyin: "shū", grammar: "N", vietnamese: "Sách", example: "这是中文书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "哥哥", pinyin: "gēge", grammar: "N", vietnamese: "Anh trai", example: "我哥哥很高。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Nghề nghiệp", chinese: "老师", pinyin: "lǎoshī", grammar: "N", vietnamese: "Giáo viên", example: "他是我的老师。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "看书", pinyin: "kànshū", grammar: "V-sep", vietnamese: "Đọc sách", example: "我喜欢看书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "几", pinyin: "jǐ", grammar: "N", vietnamese: "Mấy", example: "你有几个孩子？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Lượng từ", chinese: "个", pinyin: "ge", grammar: "M", vietnamese: "Cái, chiếc", example: "三个人。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Phủ định", chinese: "没", pinyin: "méi", grammar: "Adv", vietnamese: "Không", example: "我没有书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "兄弟", pinyin: "xiōngdì", grammar: "N", vietnamese: "Anh em", example: "我有两个兄弟。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "姐妹", pinyin: "jiěmèi", grammar: "N", vietnamese: "Chị em", example: "她有三个姐妹。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Số từ", chinese: "五", pinyin: "wǔ", grammar: "N", vietnamese: "Năm", example: "我五岁。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Số từ", chinese: "两", pinyin: "liǎng", grammar: "N", vietnamese: "Hai", example: "我有两个孩子。", isUserAdded: false },

        // Bài 2 - Từ mới 2
        { lesson: "Bài 2", topic: "Giới thiệu", chinese: "张怡君", pinyin: "Zhāng Yíjūn", grammar: "", vietnamese: "Trương Di Quân", example: "她是张怡君。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Địa điểm", chinese: "马安同", pinyin: "Mǎ Āntóng", grammar: "", vietnamese: "Mã An Đồng", example: "马安同是我朋友。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Chỉ định", chinese: "的", pinyin: "de", grammar: "Ptc", vietnamese: "Chỉ sở hữu", example: "这是我的书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "家人", pinyin: "jiārén", grammar: "N", vietnamese: "Người nhà", example: "我的家人都很好。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "家", pinyin: "jiā", grammar: "N", vietnamese: "Nhà", example: "我的家在台北。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Tính từ", chinese: "漂亮", pinyin: "piàoliang", grammar: "Vs", vietnamese: "Xinh, đẹp", example: "她很漂亮。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "房子", pinyin: "fángzi", grammar: "N", vietnamese: "Căn/ngôi nhà", example: "这房子很大。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "坐", pinyin: "zuò", grammar: "Vi", vietnamese: "Ngồi", example: "请坐！", isUserAdded: false },
        { lesson: "Bài 2", topic: "Tính từ", chinese: "好", pinyin: "hǎo", grammar: "Ptc", vietnamese: "Tốt", example: "好，我坐下。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "有", pinyin: "yǒu", grammar: "Vst", vietnamese: "Có", example: "我有一本书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Số lượng", chinese: "多", pinyin: "duō", grammar: "Vs-pred", vietnamese: "Nhiều", example: "人很多。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "照片", pinyin: "zhàopiàn", grammar: "N", vietnamese: "Bức ảnh", example: "这是我的照片。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Trạng từ", chinese: "都", pinyin: "dōu", grammar: "Adv", vietnamese: "Đều", example: "我们都是学生。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "照相", pinyin: "zhàoxiāng", grammar: "V-sep", vietnamese: "Chụp ảnh", example: "我们一起照相。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Lượng từ", chinese: "张", pinyin: "zhāng", grammar: "M", vietnamese: "Tờ, bức, tấm", example: "一张照片。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Tính từ", chinese: "好看", pinyin: "hǎokàn", grammar: "Vs", vietnamese: "Đẹp", example: "这照片很好看。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Đại từ", chinese: "谁", pinyin: "shuí", grammar: "N", vietnamese: "Ai", example: "这是谁？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "姐姐", pinyin: "jiějie", grammar: "N", vietnamese: "Chị gái", example: "我姐姐很聪明。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "妹妹", pinyin: "mèimei", grammar: "N", vietnamese: "Em gái", example: "我妹妹还小。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "爸爸", pinyin: "bàba", grammar: "N", vietnamese: "Bố", example: "我爸爸是医生。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "妈妈", pinyin: "māma", grammar: "N", vietnamese: "Mẹ", example: "我妈妈很温柔。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Lời mời", chinese: "请进", pinyin: "qǐng jìn", grammar: "", vietnamese: "Mời vào!", example: "请进！欢迎来我家。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Nghề nghiệp", chinese: "老师", pinyin: "lǎoshī", grammar: "N", vietnamese: "Giáo viên", example: "他是我的老师。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "看书", pinyin: "kànshū", grammar: "V-sep", vietnamese: "Đọc sách", example: "我喜欢看书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "几", pinyin: "jǐ", grammar: "N", vietnamese: "Mấy", example: "你有几个孩子？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Lượng từ", chinese: "个", pinyin: "ge", grammar: "M", vietnamese: "Cái", example: "三个人。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Phủ định", chinese: "没", pinyin: "méi", grammar: "Adv", vietnamese: "Không", example: "我没有书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "兄弟", pinyin: "xiōngdì", grammar: "N", vietnamese: "Anh em", example: "我有两个兄弟。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Chỉ định", chinese: "的", pinyin: "de", grammar: "Ptc", vietnamese: "Chỉ sở hữu", example: "这是我的书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "家人", pinyin: "jiārén", grammar: "N", vietnamese: "Người nhà", example: "我的家人都很好。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "家", pinyin: "jiā", grammar: "N", vietnamese: "Nhà", example: "我的家在台北。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Tính từ", chinese: "漂亮", pinyin: "piàoliang", grammar: "Vs", vietnamese: "Xinh đẹp", example: "她很漂亮。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "坐", pinyin: "zuò", grammar: "Vi", vietnamese: "Ngồi", example: "请坐！", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "有", pinyin: "yǒu", grammar: "Vst", vietnamese: "Có", example: "我有一本书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Số lượng", chinese: "多", pinyin: "duō", grammar: "Vs-pred", vietnamese: "Nhiều", example: "人很多。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "照片", pinyin: "zhàopiàn", grammar: "N", vietnamese: "Bức ảnh", example: "这是我的照片。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Trạng từ", chinese: "都", pinyin: "dōu", grammar: "Adv", vietnamese: "Đều", example: "我们都是学生。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Đại từ", chinese: "谁", pinyin: "shuí", grammar: "N", vietnamese: "Ai", example: "这是谁？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "姐姐", pinyin: "jiějie", grammar: "N", vietnamese: "Chị gái", example: "我姐姐很聪明。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "妹妹", pinyin: "mèimei", grammar: "N", vietnamese: "Em gái", example: "我妹妹还小。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "爸爸", pinyin: "bàba", grammar: "N", vietnamese: "Bố", example: "我爸爸是医生。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "妈妈", pinyin: "māma", grammar: "N", vietnamese: "Mẹ", example: "我妈妈很温柔。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Lời mời", chinese: "请进", pinyin: "qǐng jìn", grammar: "", vietnamese: "Mời vào!", example: "请进！欢迎来我家。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Nghề nghiệp", chinese: "老师", pinyin: "lǎoshī", grammar: "N", vietnamese: "Giáo viên", example: "他是我的老师。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "看书", pinyin: "kànshū", grammar: "V-sep", vietnamese: "Đọc sách", example: "我喜欢看书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "几", pinyin: "jǐ", grammar: "N", vietnamese: "Mấy", example: "你有几个孩子？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Lượng từ", chinese: "个", pinyin: "ge", grammar: "M", vietnamese: "Cái", example: "三个人。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Phủ định", chinese: "没", pinyin: "méi", grammar: "Adv", vietnamese: "Không", example: "我没有书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "兄弟", pinyin: "xiōngdì", grammar: "N", vietnamese: "Anh em", example: "我有两个兄弟。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Chỉ định", chinese: "的", pinyin: "de", grammar: "Ptc", vietnamese: "Chỉ sở hữu", example: "这是我的书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "家人", pinyin: "jiārén", grammar: "N", vietnamese: "Người nhà", example: "我的家人都很好。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "家", pinyin: "jiā", grammar: "N", vietnamese: "Nhà", example: "我的家在台北。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Tính từ", chinese: "漂亮", pinyin: "piàoliang", grammar: "Vs", vietnamese: "Xinh đẹp", example: "她很漂亮。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "坐", pinyin: "zuò", grammar: "Vi", vietnamese: "Ngồi", example: "请坐！", isUserAdded: false },
        { lesson: "Bài 2", topic: "Động từ", chinese: "有", pinyin: "yǒu", grammar: "Vst", vietnamese: "Có", example: "我有一本书。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Số lượng", chinese: "多", pinyin: "duō", grammar: "Vs-pred", vietnamese: "Nhiều", example: "人很多。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Danh từ", chinese: "照片", pinyin: "zhàopiàn", grammar: "N", vietnamese: "Bức ảnh", example: "这是我的照片。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Trạng từ", chinese: "都", pinyin: "dōu", grammar: "Adv", vietnamese: "Đều", example: "我们都是学生。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Đại từ", chinese: "谁", pinyin: "shuí", grammar: "N", vietnamese: "Ai", example: "这是谁？", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "姐姐", pinyin: "jiějie", grammar: "N", vietnamese: "Chị gái", example: "我姐姐很聪明。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "妹妹", pinyin: "mèimei", grammar: "N", vietnamese: "Em gái", example: "我妹妹还小。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "爸爸", pinyin: "bàba", grammar: "N", vietnamese: "Bố", example: "我爸爸是医生。", isUserAdded: false },
        { lesson: "Bài 2", topic: "Gia đình", chinese: "妈妈", pinyin: "māma", grammar: "N", vietnamese: "Mẹ", example: "我妈妈很温柔。", isUserAdded: false }
    ];

    // Áp dụng chuyển đổi phồn thể cho dữ liệu gốc (không ảnh hưởng pinyin)
    vocabularyData = vocabularyData.map(item => ({
        ...item,
        chinese: toTraditional(item.chinese),
        example: item.example ? toTraditional(item.example) : ''
    }));
}

// Biến toàn cục cho bài tập
let currentExerciseData = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let questionResults = [];
let incorrectQuestions = [];

// LocalStorage functions
function saveToLocalStorage() {
    const userWords = vocabularyData.filter(item => item.isUserAdded);
    const editedOriginalWords = vocabularyData.filter(item => item.isEditedOriginal);
    const favoriteChineseList = vocabularyData.filter(item => item.isFavorite).map(item => item.chinese);

    localStorage.setItem('chineseVocab_userWords', JSON.stringify(userWords));
    localStorage.setItem('chineseVocab_editedOriginals', JSON.stringify(editedOriginalWords));
    localStorage.setItem('chineseVocab_favorites', JSON.stringify(favoriteChineseList));
}

function loadFromLocalStorage() {
    // Load từ người dùng thêm
    const savedUserWords = localStorage.getItem('chineseVocab_userWords');
    if (savedUserWords) {
        try {
            const userWords = JSON.parse(savedUserWords);
            userWords.forEach(word => {
                if (!vocabularyData.some(item => item.chinese === word.chinese)) {
                    vocabularyData.push(word);
                }
            });
        } catch (error) {
            console.log('Lỗi khi load dữ liệu user từ localStorage:', error);
        }
    }

    // Load từ gốc đã chỉnh sửa
    const savedEditedOriginals = localStorage.getItem('chineseVocab_editedOriginals');
    if (savedEditedOriginals) {
        try {
            const editedWords = JSON.parse(savedEditedOriginals);
            editedWords.forEach(editedWord => {
                const index = vocabularyData.findIndex(item =>
                    item.originalChinese === editedWord.originalChinese
                );
                if (index !== -1) {
                    vocabularyData[index] = editedWord;
                } else {
                    vocabularyData.push(editedWord);
                }
            });
        } catch (error) {
            console.log('Lỗi khi load dữ liệu edited từ localStorage:', error);
        }
    }

    // Load danh sách yêu thích và gắn cờ
    const savedFavorites = localStorage.getItem('chineseVocab_favorites');
    if (savedFavorites) {
        try {
            const favList = JSON.parse(savedFavorites);
            if (Array.isArray(favList)) {
                const favSet = new Set(favList);
                vocabularyData.forEach(item => {
                    item.isFavorite = favSet.has(item.chinese);
                });
            }
        } catch (error) {
            console.log('Lỗi khi load danh sách yêu thích từ localStorage:', error);
        }
    }
}

function clearLocalStorage() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả từ vựng đã thêm và chỉnh sửa? Hành động này không thể hoàn tác.')) {
        localStorage.removeItem('chineseVocab_userWords');
        localStorage.removeItem('chineseVocab_editedOriginals');

        // Khôi phục dữ liệu gốc
        vocabularyData = vocabularyData.filter(item => !item.isUserAdded && !item.isEditedOriginal);

        // Khôi phục từ gốc đã bị chỉnh sửa
        initializeVocabularyData();

        displayVocabulary();
        updateStats();
        alert('Đã xóa tất cả từ vựng người dùng thêm và khôi phục từ gốc!');
    }
}

function exportUserData() {
    const userWords = vocabularyData.filter(item => item.isUserAdded);
    const dataStr = JSON.stringify(userWords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tu_vung_ca_nhan_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importUserData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const importedWords = JSON.parse(e.target.result);
                    if (Array.isArray(importedWords)) {
                        let addedCount = 0;
                        importedWords.forEach(word => {
                            if (word.chinese && word.pinyin && word.vietnamese) {
                                if (!vocabularyData.some(item => item.chinese === word.chinese)) {
                                    vocabularyData.push(word);
                                    addedCount++;
                                }
                            }
                        });
                        dedupeVocabulary();
                        saveToLocalStorage();
                        displayVocabulary();
                        updateStats();
                        alert(`✅ Đã nhập ${addedCount} từ mới!`);
                    } else {
                        alert('File JSON không hợp lệ!');
                    }
                } catch (error) {
                    alert('Lỗi khi đọc file JSON: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function exportUserDataExcel() {
    const userWords = vocabularyData.filter(item => item.isUserAdded);

    if (userWords.length === 0) {
        alert('Chưa có từ vựng nào do bạn thêm để export!');
        return;
    }

    const workbook = XLSX.utils.book_new();

    // Tạo dữ liệu Excel
    const excelData = userWords.map((item, index) => ({
        'STT': index + 1,
        'Bài học': item.lesson,
        'Chủ đề': item.topic,
        'Chữ Hán': item.chinese,
        'Pinyin': item.pinyin,
        'Từ loại': item.grammar,
        'Nghĩa tiếng Việt': item.vietnamese,
        'Ví dụ': item.example || '',
        'Ngày thêm': new Date().toLocaleDateString('vi-VN')
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, ws, "Từ vựng cá nhân");

    // Tạo sheet hướng dẫn import
    const instructionData = [
        { 'Hướng dẫn Import từ vựng': 'Cách nhập từ vựng từ file Excel' },
        { 'Hướng dẫn Import từ vựng': '' },
        { 'Hướng dẫn Import từ vựng': '1. Giữ nguyên cấu trúc bảng này' },
        { 'Hướng dẫn Import từ vựng': '2. Thêm từ mới vào các dòng tiếp theo' },
        { 'Hướng dẫn Import từ vựng': '3. Các cột bắt buộc: Chữ Hán, Pinyin, Nghĩa tiếng Việt' },
        { 'Hướng dẫn Import từ vựng': '4. Lưu file Excel và dùng chức năng Import Excel trong ứng dụng' },
        { 'Hướng dẫn Import từ vựng': '' },
        { 'Hướng dẫn Import từ vựng': 'Lưu ý: STT và Ngày thêm sẽ được tự động tạo khi import' }
    ];

    const instructionWs = XLSX.utils.json_to_sheet(instructionData);
    XLSX.utils.book_append_sheet(workbook, instructionWs, "Hướng dẫn Import");

    XLSX.writeFile(workbook, `tu_vung_ca_nhan_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function importUserDataExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Đọc sheet đầu tiên
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    let addedCount = 0;
                    jsonData.forEach(row => {
                        const chinese = row['Chữ Hán'];
                        const pinyin = row['Pinyin'];
                        const vietnamese = row['Nghĩa tiếng Việt'];

                        if (chinese && pinyin && vietnamese) {
                            if (!vocabularyData.some(item => item.chinese === chinese)) {
                                const newWord = {
                                    lesson: row['Bài học'] || 'Từ mới',
                                    topic: row['Chủ đề'] || 'Chung',
                                    chinese: chinese,
                                    pinyin: pinyin,
                                    grammar: row['Từ loại'] || 'N',
                                    vietnamese: vietnamese,
                                    example: row['Ví dụ'] || '',
                                    isUserAdded: true
                                };
                                vocabularyData.push(newWord);
                                addedCount++;
                            }
                        }
                    });

                    if (addedCount > 0) {
                        saveToLocalStorage();
                        displayVocabulary();
                        updateStats();
                        alert(`Đã import thành công ${addedCount} từ vựng từ file Excel!`);
                    } else {
                        alert('Không tìm thấy từ vựng hợp lệ nào trong file Excel!');
                    }

                } catch (error) {
                    alert('Lỗi khi đọc file Excel: ' + error.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };
    input.click();
}

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function () {
    initializeVocabularyData();
    loadFromLocalStorage(); // Load dữ liệu từ LocalStorage
    dedupeVocabulary();
    ensureSRSDefaults();
    loadSRSMap();
    displayVocabulary();
    updateStats();
    updateLessonOptions(); // Cập nhật dropdown bài học
    setupFilters();
    renderHistory();
    renderProgress();

    // Event listener cho select bài học
    const lessonSelect = document.getElementById('newLesson');
    if (lessonSelect) {
        lessonSelect.addEventListener('change', function () {
            const customBtn = document.getElementById('customLessonBtn');
            const customInput = document.getElementById('customLessonInput');

            if (this.value === 'custom') {
                customBtn.style.display = 'inline-block';
                showCustomLessonInput();
            } else {
                customBtn.style.display = 'none';
                customInput.style.display = 'none';
                customInput.value = '';
            }
        });
    }
});

// Hiển thị tab
function showTab(tabName) {
    // Ẩn tất cả tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Ẩn tất cả tab
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Hiển thị tab được chọn
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Hiển thị dữ liệu từ vựng
function displayVocabulary() {
    const tbody = document.getElementById('vocabularyBody');
    tbody.innerHTML = '';

    const data = getFilteredSortedData();

    if (data.length >= VIRT_THRESHOLD) {
        virtualCache.enabled = false; // force re-measure
        renderVirtualTable(data);
        return;
    } else {
        // Show pagination controls when not virtualized
        const pag = document.querySelector('.pagination-controls');
        if (pag) pag.style.display = '';
    }

    const paged = getPagedData(data);

    paged.slice.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = buildRowHTML(item, paged.start + index);
    });
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) pageInfo.textContent = `Trang ${currentPage}/${Math.max(1, Math.ceil(data.length / pageSize))} • ${data.length} từ`;
}

// Cập nhật thống kê
function updateStats() {
    document.getElementById('totalWords').textContent = vocabularyData.length;

    const userAddedCount = vocabularyData.filter(item => item.isUserAdded).length;
    const editedOriginalCount = vocabularyData.filter(item => item.isEditedOriginal).length;
    const customWordsCount = userAddedCount + editedOriginalCount;

    document.getElementById('userWords').textContent = customWordsCount;

    // Cập nhật số bài học
    const uniqueLessons = [...new Set(vocabularyData.map(item => item.lesson))];
    document.getElementById('lessons').textContent = uniqueLessons.length;

    // Cập nhật số chủ đề
    const uniqueTopics = [...new Set(vocabularyData.map(item => item.topic))];
    document.getElementById('categories').textContent = uniqueTopics.length;
}

// Thêm từ vựng mới
function addNewWord() {
    let lesson = document.getElementById('newLesson').value;
    const customLessonInput = document.getElementById('customLessonInput');

    // Xử lý bài học tùy chỉnh
    if (lesson === 'custom') {
        const customLesson = customLessonInput.value.trim();
        if (!customLesson) {
            alert('❌ Vui lòng nhập tên bài học mới!');
            customLessonInput.focus();
            return;
        }
        lesson = customLesson;
    }

    const topic = document.getElementById('newTopic').value.trim();
    const chinese = document.getElementById('newChinese').value.trim();
    const pinyin = document.getElementById('newPinyin').value.trim();
    const grammar = document.getElementById('newGrammar').value;
    const vietnamese = document.getElementById('newVietnamese').value.trim();
    const example = document.getElementById('newExample').value.trim();

    // Kiểm tra các trường bắt buộc
    if (!chinese || !pinyin || !vietnamese) {
        alert('❌ Vui lòng điền đầy đủ các trường bắt buộc: Chữ Hán, Pinyin, Nghĩa tiếng Việt');
        return;
    }

    // Kiểm tra từ đã tồn tại
    if (vocabularyData.some(item => item.chinese === chinese)) {
        alert('⚠️ Từ này đã tồn tại trong danh sách!');
        return;
    }

    // Thêm từ mới
    const newWord = {
        lesson: lesson,
        topic: topic || 'Chung',
        chinese: chinese,
        pinyin: pinyin,
        grammar: grammar,
        vietnamese: vietnamese,
        example: example || '',
        isUserAdded: true
    };

    vocabularyData.push(newWord);
    saveToLocalStorage(); // Lưu vào LocalStorage
    displayVocabulary();
    updateStats();
    updateLessonOptions(); // Cập nhật dropdown bài học
    clearForm();

    alert('✅ Đã thêm từ vựng mới thành công!');
}

// Biến lưu index từ đang được chỉnh sửa
let editingWordIndex = -1;

// Chỉnh sửa từ vựng
function editWord(index) {
    editingWordIndex = index;
    const word = vocabularyData[index];

    // Cập nhật dropdown bài học trong modal edit
    updateEditLessonOptions();

    // Điền dữ liệu vào form
    document.getElementById('editLesson').value = word.lesson;
    document.getElementById('editTopic').value = word.topic;
    document.getElementById('editChinese').value = word.chinese;
    document.getElementById('editPinyin').value = word.pinyin;
    document.getElementById('editGrammar').value = word.grammar;
    document.getElementById('editVietnamese').value = word.vietnamese;
    document.getElementById('editExample').value = word.example || '';

    // Hiển thị modal với thông báo nếu là từ gốc
    const modal = document.getElementById('editModal');
    const modalTitle = modal.querySelector('h3');

    if (word.isUserAdded) {
        modalTitle.innerHTML = '✏️ Chỉnh sửa từ vựng';
        modalTitle.style.color = '#2c3e50';
    } else {
        modalTitle.innerHTML = '✏️ Chỉnh sửa từ gốc <span style="font-size: 14px; color: #e67e22;">(Sẽ lưu thành từ tùy chỉnh)</span>';
        modalTitle.style.color = '#e67e22';
    }

    modal.style.display = 'block';
}

// Cập nhật dropdown bài học trong modal edit
function updateEditLessonOptions() {
    const select = document.getElementById('editLesson');
    if (!select) return;

    // Xóa các option cũ (trừ các option mặc định)
    const defaultOptions = ['Bài 1', 'Bài 2', 'Bài 3', 'Từ mới'];
    const currentOptions = Array.from(select.options).map(opt => opt.value);

    // Lấy danh sách bài học hiện có
    const existingLessons = [...new Set(vocabularyData.map(item => item.lesson))];

    // Thêm các bài học mới vào dropdown
    existingLessons.forEach(lesson => {
        if (!currentOptions.includes(lesson)) {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            select.appendChild(option);
        }
    });
}

// Lưu từ vựng đã chỉnh sửa
function saveEditedWord() {
    if (editingWordIndex === -1) return;

    const lesson = document.getElementById('editLesson').value;
    const topic = document.getElementById('editTopic').value.trim();
    const chinese = document.getElementById('editChinese').value.trim();
    const pinyin = document.getElementById('editPinyin').value.trim();
    const grammar = document.getElementById('editGrammar').value;
    const vietnamese = document.getElementById('editVietnamese').value.trim();
    const example = document.getElementById('editExample').value.trim();

    // Kiểm tra các trường bắt buộc
    if (!chinese || !pinyin || !vietnamese) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc: Chữ Hán, Pinyin, Nghĩa tiếng Việt');
        return;
    }

    const originalWord = vocabularyData[editingWordIndex];
    const isOriginalWord = !originalWord.isUserAdded && !originalWord.isEditedOriginal;

    // Kiểm tra trùng lặp (trừ từ đang chỉnh sửa)
    const duplicateIndex = vocabularyData.findIndex((item, index) =>
        item.chinese === chinese && index !== editingWordIndex
    );

    if (duplicateIndex !== -1) {
        alert('Từ này đã tồn tại trong danh sách!');
        return;
    }

    // Tạo từ mới với thông tin chỉnh sửa
    const updatedWord = {
        lesson: lesson,
        topic: topic || 'Chung',
        chinese: chinese,
        pinyin: pinyin,
        grammar: grammar,
        vietnamese: vietnamese,
        example: example || ''
    };

    if (isOriginalWord) {
        // Nếu chỉnh sửa từ gốc, đánh dấu là đã chỉnh sửa
        updatedWord.isEditedOriginal = true;
        updatedWord.originalChinese = originalWord.chinese; // Lưu chữ Hán gốc để tham chiếu
        updatedWord.isUserAdded = false;
    } else {
        // Nếu chỉnh sửa từ đã thêm hoặc đã chỉnh sửa trước đó
        updatedWord.isUserAdded = originalWord.isUserAdded;
        updatedWord.isEditedOriginal = originalWord.isEditedOriginal;
        if (originalWord.originalChinese) {
            updatedWord.originalChinese = originalWord.originalChinese;
        }
    }

    // Cập nhật từ vựng
    vocabularyData[editingWordIndex] = updatedWord;

    // Lưu và cập nhật giao diện
    saveToLocalStorage();
    displayVocabulary();
    updateStats();
    updateLessonOptions();
    closeEditModal();

    if (isOriginalWord) {
        alert('Đã lưu thay đổi! Từ gốc đã được chỉnh sửa và lưu thành từ tùy chỉnh.');
    } else {
        alert('Đã lưu thay đổi thành công!');
    }
}

// Đóng modal chỉnh sửa
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingWordIndex = -1;
}
function deleteWord(index) {
    if (vocabularyData[index].isUserAdded) {
        if (confirm('🗑️ Bạn có chắc chắn muốn xóa từ này?')) {
            vocabularyData.splice(index, 1);
            saveToLocalStorage(); // Lưu thay đổi vào LocalStorage
            displayVocabulary();
            updateStats();
            alert('✅ Đã xóa từ vựng thành công!');
        }
    }
}

// Xử lý thêm bài học mới
function showCustomLessonInput() {
    const select = document.getElementById('newLesson');
    const customInput = document.getElementById('customLessonInput');

    if (select.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
    }
}

// Event listener cho select bài học
document.addEventListener('DOMContentLoaded', function () {
    const lessonSelect = document.getElementById('newLesson');
    if (lessonSelect) {
        lessonSelect.addEventListener('change', function () {
            const customBtn = document.getElementById('customLessonBtn');
            const customInput = document.getElementById('customLessonInput');

            if (this.value === 'custom') {
                customBtn.style.display = 'inline-block';
                showCustomLessonInput();
            } else {
                customBtn.style.display = 'none';
                customInput.style.display = 'none';
                customInput.value = '';
            }
        });
    }
});

// Cập nhật dropdown bài học từ dữ liệu hiện có
function updateLessonOptions() {
    const select = document.getElementById('newLesson');
    if (!select) return;

    // Lấy danh sách bài học hiện có
    const existingLessons = [...new Set(vocabularyData.map(item => item.lesson))];
    const currentOptions = Array.from(select.options).map(opt => opt.value);

    // Thêm các bài học mới vào dropdown
    existingLessons.forEach(lesson => {
        if (!currentOptions.includes(lesson) && lesson !== 'custom') {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            select.insertBefore(option, select.querySelector('option[value="custom"]'));
        }
    });
}
function clearForm() {
    document.getElementById('newTopic').value = '';
    document.getElementById('newChinese').value = '';
    document.getElementById('newPinyin').value = '';
    document.getElementById('newVietnamese').value = '';
    document.getElementById('newExample').value = '';
}

// Bắt đầu làm bài tập
function startExercise() {
    const exerciseType = document.getElementById('exerciseType').value;
    const lessonFilter = document.getElementById('lessonFilter').value;
    const questionCount = parseInt(document.getElementById('questionCount').value);
    const dueOnly = document.getElementById('dueOnly')?.checked;
    const reviewMistakes = document.getElementById('recentMistakes')?.checked;

    // Lọc dữ liệu theo bài học
    let filteredData = vocabularyData;
    if (lessonFilter !== 'all') {
        filteredData = vocabularyData.filter(item => item.lesson === lessonFilter);
    }

    // Lọc SRS đến hạn
    if (dueOnly) {
        const dueSet = getDueItemsReference();
        filteredData = filteredData.filter(i => dueSet.has(i.chinese));
    }

    // Lọc theo câu sai gần đây
    if (reviewMistakes) {
        const mistakeSet = getRecentMistakeSet(14);
        filteredData = filteredData.filter(i => mistakeSet.has(i.chinese));
    }

    // Ưu tiên dữ liệu nếu bật
    const preferFavorites = document.getElementById('preferFavorites')?.checked;
    const preferLowSRS = document.getElementById('preferLowSRS')?.checked;
    if (preferFavorites || preferLowSRS) {
        const scored = filteredData.map(it => {
            let score = 0;
            if (preferFavorites && it.isFavorite) score += 2;
            if (preferLowSRS) {
                const iv = it.srs?.interval || 0;
                score += Math.max(0, 3 - Math.min(3, iv));
            }
            return { it, score };
        });
        scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);
        filteredData = scored.map(s => s.it);
    }

    // Đề hỗn hợp theo tỉ lệ
    const mixMode = document.getElementById('mixMode')?.checked;
    if (mixMode && filteredData.length > 0) {
        const weights = {
            fillVietnamese: parseInt(document.getElementById('wFillVietnamese')?.value || '0') || 0,
            fillBlank: parseInt(document.getElementById('wFillBlank')?.value || '0') || 0,
            fillPinyin: parseInt(document.getElementById('wFillPinyin')?.value || '0') || 0,
            multipleChoice: parseInt(document.getElementById('wMC')?.value || '0') || 0
        };
        const totalW = Math.max(1, weights.fillVietnamese + weights.fillBlank + weights.fillPinyin + weights.multipleChoice);
        const counts = {
            fillVietnamese: Math.round(questionCount * (weights.fillVietnamese / totalW)),
            fillBlank: Math.round(questionCount * (weights.fillBlank / totalW)),
            fillPinyin: Math.round(questionCount * (weights.fillPinyin / totalW)),
            multipleChoice: Math.round(questionCount * (weights.multipleChoice / totalW))
        };
        let allocated = counts.fillVietnamese + counts.fillBlank + counts.fillPinyin + counts.multipleChoice;
        while (allocated < questionCount) { counts.multipleChoice++; allocated++; }
        while (allocated > questionCount) { if (counts.multipleChoice > 0) { counts.multipleChoice--; allocated--; } else break; }

        const pool = [...filteredData];
        const sample = (n) => {
            const a = [];
            for (let i = 0; i < n && pool.length; i++) {
                a.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
            }
            return a;
        };
        const parts = [];
        parts.push(...sample(counts.fillVietnamese).map(x => ({ ...x, _mode: 'fillVietnamese' })));
        parts.push(...sample(counts.fillBlank).map(x => ({ ...x, _mode: 'fillBlank' })));
        parts.push(...sample(counts.fillPinyin).map(x => ({ ...x, _mode: 'fillPinyin' })));
        parts.push(...sample(counts.multipleChoice).map(x => ({ ...x, _mode: 'multipleChoice' })));
        currentExerciseData = parts;
    } else {
        if (filteredData.length === 0) {
            alert('❌ Không tìm thấy từ vựng nào cho bài học đã chọn!');
            return;
        }
        // Trộn ngẫu nhiên và lấy số câu theo yêu cầu
        const shuffled = filteredData.sort(() => 0.5 - Math.random());
        currentExerciseData = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    }

    // Reset các biến
    currentQuestionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    questionResults = [];
    incorrectQuestions = [];

    // Hiển thị phần làm bài
    document.getElementById('exerciseContainer').style.display = 'block';
    document.getElementById('exerciseResults').style.display = 'none';
    document.getElementById('totalQuestions').textContent = currentExerciseData.length;

    // Ẩn lịch sử khi đang làm bài
    const historySection = document.querySelector('.history-section');
    if (historySection) historySection.style.display = 'none';

    // Ghi thời điểm bắt đầu
    exerciseStartMs = Date.now();

    generateQuestion();
}

// Preset ratio helper for mix mode
function setPresetWeights(vHV, vVH, vPY, vMC) {
    const ids = [
        ['wFillVietnamese', vHV],
        ['wFillBlank', vVH],
        ['wFillPinyin', vPY],
        ['wMC', vMC]
    ];
    ids.forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
    const mix = document.getElementById('mixMode');
    if (mix) mix.checked = true;
}

// Tạo câu hỏi
function generateQuestion() {
    let exerciseType = document.getElementById('exerciseType').value;
    const currentItem = currentExerciseData[currentQuestionIndex];
    if (currentItem && currentItem._mode) exerciseType = currentItem._mode;
    const questionCard = document.getElementById('questionCard');

    updateProgress();
    updateScore();

    let questionHTML = '';

    switch (exerciseType) {
        case 'fillBlank':
            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Điền chữ Hán phù hợp:</h4>
                        <p style="font-size: 18px; margin: 15px 0;">
                            <strong>Nghĩa:</strong> ${currentItem.vietnamese}
                        </p>
                        <input type="text" id="answerInput" class="answer-input"
                               placeholder="Nhập chữ Hán..." 
                               onkeypress="checkAnswer(event, '${currentItem.chinese.replace(/'/g, "\\'")}')">
                        <div id="feedback" class="feedback" style="display: none;"></div>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">
                            💡 Nhấn Enter để kiểm tra đáp án
                        </p>
                    </div>
                `;
            break;

        case 'multipleChoice':
            const wrongAnswers = vocabularyData
                .filter(v => v.chinese !== currentItem.chinese && v.lesson === currentItem.lesson)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(v => v.chinese);

            // Đảm bảo có đủ 3 đáp án sai
            while (wrongAnswers.length < 3) {
                const randomWrong = vocabularyData[Math.floor(Math.random() * vocabularyData.length)].chinese;
                if (randomWrong !== currentItem.chinese && !wrongAnswers.includes(randomWrong)) {
                    wrongAnswers.push(randomWrong);
                }
            }

            const options = [currentItem.chinese, ...wrongAnswers].sort(() => 0.5 - Math.random());

            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Chọn chữ Hán đúng:</h4>
                        <p style="font-size: 18px; margin: 15px 0;">
                            <strong>Nghĩa:</strong> ${currentItem.vietnamese}
                        </p>
                        <p style="font-size: 16px; color: #e74c3c; margin: 15px 0;">
                            <strong>Pinyin:</strong> ${currentItem.pinyin}
                        </p>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, auto); gap: 12px; max-width: 520px; margin: 20px auto;">
                            ${options.map((option, i) => `
                                <button class="option-btn" onclick="selectMultipleChoice('${option.replace(/'/g, "\\'")}', '${currentItem.chinese.replace(/'/g, "\\'")}', this)" 
                                        style="padding: 15px; border: 2px solid #ddd; border-radius: 10px; background: white; cursor: pointer; font-size: 18px; font-weight: bold; transition: all 0.3s ease;">
                                    ${option}
                                </button>
                            `).join('')}
                        </div>
                        <div id="feedback" class="feedback" style="display: none;"></div>
                    </div>
                `;
            break;

        case 'multipleChoiceVietnamese':
            const wrongVietnamese = vocabularyData
                .filter(v => v.vietnamese !== currentItem.vietnamese && v.lesson === currentItem.lesson)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(v => v.vietnamese);

            while (wrongVietnamese.length < 3) {
                const randomWrong = vocabularyData[Math.floor(Math.random() * vocabularyData.length)].vietnamese;
                if (randomWrong !== currentItem.vietnamese && !wrongVietnamese.includes(randomWrong)) {
                    wrongVietnamese.push(randomWrong);
                }
            }

            const vietnameseOptions = [currentItem.vietnamese, ...wrongVietnamese].sort(() => 0.5 - Math.random());

            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Chọn nghĩa đúng:</h4>
                        <p style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 20px 0;">
                            ${getDisplayChinese(currentItem.chinese)}
                        </p>
                        <p style="font-size: 16px; color: #e74c3c; margin: 15px 0;">
                            <strong>Pinyin:</strong> ${currentItem.pinyin}
                        </p>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 10px; max-width: 400px; margin: 20px auto;">
                            ${vietnameseOptions.map((option, i) => `
                                <button class="option-btn" onclick="selectMultipleChoice('${option.replace(/'/g, "\\'")}', '${currentItem.vietnamese.replace(/'/g, "\\'")}', this)" 
                                        style="padding: 12px 20px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; font-size: 16px; text-align: left; transition: all 0.3s ease;">
                                    ${String.fromCharCode(65 + i)}. ${option}
                                </button>
                            `).join('')}
                        </div>
                        <div id="feedback" class="feedback" style="display: none;"></div>
                    </div>
                `;
            break;

        case 'trueFalse':
            const isCorrectPair = Math.random() > 0.5;
            let displayVietnamese = currentItem.vietnamese;

            if (!isCorrectPair) {
                // Tạo nghĩa sai
                const wrongMeanings = vocabularyData.filter(v => v.vietnamese !== currentItem.vietnamese);
                displayVietnamese = wrongMeanings[Math.floor(Math.random() * wrongMeanings.length)].vietnamese;
            }

            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Đây có phải là nghĩa đúng không?</h4>
                        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                            <p style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 10px 0;">
                                ${getDisplayChinese(currentItem.chinese)}
                            </p>
                            <p style="font-size: 16px; color: #e74c3c; margin: 10px 0;">
                                ${currentItem.pinyin}
                            </p>
                            <p style="font-size: 18px; color: #27ae60; margin: 10px 0;">
                                <strong>Nghĩa:</strong> ${displayVietnamese}
                            </p>
                        </div>
                        <div style="display: flex; gap: 20px; justify-content: center;">
                            <button class="option-btn" onclick="selectTrueFalse(true, ${isCorrectPair}, this)" 
                                    style="padding: 15px 30px; border: 2px solid #4caf50; border-radius: 10px; background: #e8f5e8; color: #2e7d32; cursor: pointer; font-size: 18px; font-weight: bold;">
                                ✓ Đúng
                            </button>
                            <button class="option-btn" onclick="selectTrueFalse(false, ${isCorrectPair}, this)" 
                                    style="padding: 15px 30px; border: 2px solid #f44336; border-radius: 10px; background: #ffeaea; color: #c62828; cursor: pointer; font-size: 18px; font-weight: bold;">
                                ✗ Sai
                            </button>
                        </div>
                        <div id="feedback" class="feedback" style="display: none;"></div>
                    </div>
                `;
            break;

        case 'listening':
            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Nghe và điền Pinyin:</h4>
                        <p style="font-size: 18px; margin: 15px 0;">
                            <strong>Nghĩa:</strong> ${currentItem.vietnamese}
                        </p>
                        <div style="margin: 20px 0;">
                            <button class="btn" onclick="playPinyin('${currentItem.pinyin}')" style="padding: 15px 30px; font-size: 16px;">
                                🔊 Nghe phát âm
                            </button>
                        </div>
                        <input type="text" id="answerInput" class="answer-input"
                               placeholder="Nhập Pinyin đã nghe..." 
                               onkeypress="checkAnswer(event, '${currentItem.pinyin.replace(/'/g, "\\'")}')">
                        <div id="feedback" class="feedback" style="display: none;"></div>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">
                            💡 Nhấn Enter để kiểm tra đáp án
                        </p>
                    </div>
                `;
            break;

        case 'fillVietnamese':
            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Điền nghĩa tiếng Việt:</h4>
                        <p style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 20px 0;">
                            ${currentItem.chinese}
                        </p>
                        <input type="text" id="answerInput" class="answer-input"
                               placeholder="Nhập nghĩa tiếng Việt..." 
                               onkeypress="checkAnswer(event, '${currentItem.vietnamese.replace(/'/g, "\\'")}')">
                        <div id="feedback" class="feedback" style="display: none;"></div>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">
                            💡 Nhấn Enter để kiểm tra đáp án
                        </p>
                    </div>
                `;
            break;

        case 'fillPinyin':
            questionHTML = `
                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 20px;">Điền Pinyin:</h4>
                        <p style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 20px 0;">
                            ${currentItem.chinese}
                        </p>
                        <div style="margin: 15px 0;">
                            <button class="btn" onclick="toggleHint('vietnameseHint')" style="padding: 8px 16px; font-size: 14px; margin-bottom: 10px;">
                                💡 Hiện gợi ý nghĩa
                            </button>
                            <div id="vietnameseHint" style="display: none; font-size: 18px; color: #27ae60; margin: 10px 0;">
                                <strong>Nghĩa:</strong> ${currentItem.vietnamese}
                            </div>
                        </div>
                        <input type="text" id="answerInput" class="answer-input"
                               placeholder="Nhập Pinyin..." 
                               onkeypress="checkAnswer(event, '${currentItem.pinyin.replace(/'/g, "\\'")}')">
                        <div id="feedback" class="feedback" style="display: none;"></div>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">
                            💡 Nhấn Enter để kiểm tra đáp án
                        </p>
                    </div>
                `;
            break;

        case 'sentenceFill':
            questionHTML = renderSentenceFill(currentItem);
            break;
    }

    questionCard.innerHTML = questionHTML;

    // Gắn IME cho ô trả lời nếu có (đặc biệt với Pinyin)
    const ansEl = document.getElementById('answerInput');
    if (ansEl) attachPinyinIME(ansEl);

    updateNavigationButtons();

    // Focus vào input
    setTimeout(() => {
        const inputElement = document.getElementById('answerInput');
        if (inputElement) {
            inputElement.focus();
        }
    }, 100);
}

// Xử lý trắc nghiệm (không phân biệt hoa thường cho Latin)
function selectMultipleChoice(selectedAnswer, correctAnswer, buttonElement) {
    const allButtons = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');

    // Disable tất cả buttons
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    const latinRegex = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
    const useLatinCompare = latinRegex.test(correctAnswer);
    const left = useLatinCompare ? normalizeLatin(selectedAnswer) : selectedAnswer;
    const right = useLatinCompare ? normalizeLatin(correctAnswer) : correctAnswer;
    const isCorrect = left === right;

    if (isCorrect) {
        buttonElement.style.background = '#e8f5e8';
        buttonElement.style.borderColor = '#4caf50';
        buttonElement.style.color = '#2e7d32';
        feedback.innerHTML = '✅ Chính xác! Tuyệt vời!';
        feedback.className = 'feedback correct';
        correctAnswers++;
        updateSRSForWord(correctAnswer, true);
    } else {
        buttonElement.style.background = '#ffeaea';
        buttonElement.style.borderColor = '#f44336';
        buttonElement.style.color = '#c62828';

        // Highlight đáp án đúng
        allButtons.forEach(btn => {
            if (btn.textContent.includes(correctAnswer) || btn.textContent === correctAnswer) {
                btn.style.background = '#e8f5e8';
                btn.style.borderColor = '#4caf50';
                btn.style.color = '#2e7d32';
            }
        });

        feedback.innerHTML = `❌ Sai rồi! Đáp án đúng là: <strong>${correctAnswer}</strong>`;
        feedback.className = 'feedback incorrect';
        incorrectAnswers++;
        updateSRSForWord(correctAnswer, false);

        incorrectQuestions.push({
            question: currentExerciseData[currentQuestionIndex],
            userAnswer: selectedAnswer,
            correctAnswer: correctAnswer
        });
    }

    feedback.style.display = 'block';

    // Lưu kết quả
    questionResults.push({
        questionIndex: currentQuestionIndex,
        isCorrect: isCorrect,
        userAnswer: selectedAnswer,
        correctAnswer: correctAnswer
    });

    updateScore();
    saveSRSMap();

    // Tự động chuyển câu sau 2 giây
    setTimeout(() => {
        if (currentQuestionIndex < currentExerciseData.length - 1) {
            nextQuestion();
        } else {
            setTimeout(() => {
                finishExercise();
            }, 1000);
        }
    }, 2000);
}

// Xử lý bài tập Đúng/Sai (không cần, nhưng giữ đồng nhất hiển thị)
function selectTrueFalse(userChoice, isCorrectPair, buttonElement) {
    const allButtons = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');

    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    const isCorrect = (userChoice && isCorrectPair) || (!userChoice && !isCorrectPair);

    if (isCorrect) {
        buttonElement.style.background = isCorrectPair ? '#e8f5e8' : '#ffeaea';
        buttonElement.style.borderColor = '#4caf50';
        feedback.innerHTML = '✅ Chính xác!';
        feedback.className = 'feedback correct';
        correctAnswers++;
    } else {
        buttonElement.style.background = '#ffeaea';
        buttonElement.style.borderColor = '#f44336';

        // Highlight đáp án đúng
        allButtons.forEach(btn => {
            const btnText = btn.textContent.trim();
            if ((isCorrectPair && btnText.includes('Đúng')) || (!isCorrectPair && btnText.includes('Sai'))) {
                btn.style.background = '#e8f5e8';
                btn.style.borderColor = '#4caf50';
            }
        });

        feedback.innerHTML = `❌ Sai rồi! Đáp án đúng là: <strong>${isCorrectPair ? 'Đúng' : 'Sai'}</strong>`;
        feedback.className = 'feedback incorrect';
        incorrectAnswers++;

        incorrectQuestions.push({
            question: currentExerciseData[currentQuestionIndex],
            userAnswer: userChoice ? 'Đúng' : 'Sai',
            correctAnswer: isCorrectPair ? 'Đúng' : 'Sai'
        });
    }

    feedback.style.display = 'block';

    questionResults.push({
        questionIndex: currentQuestionIndex,
        isCorrect: isCorrect,
        userAnswer: userChoice ? 'Đúng' : 'Sai',
        correctAnswer: isCorrectPair ? 'Đúng' : 'Sai'
    });

    updateScore();

    setTimeout(() => {
        if (currentQuestionIndex < currentExerciseData.length - 1) {
            nextQuestion();
        } else {
            setTimeout(() => {
                finishExercise();
            }, 1000);
        }
    }, 2000);
}

// Phát âm Pinyin (mô phỏng)
function playPinyin(pinyin) {
    // Sử dụng Speech Synthesis API nếu có
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(pinyin);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    } else {
        alert(`Phát âm: ${pinyin}`);
    }
}

// Hàm bật/tắt gợi ý
function toggleHint(hintId) {
    const hintElement = document.getElementById(hintId);
    const button = event.target;

    if (hintElement.style.display === 'none') {
        hintElement.style.display = 'block';
        button.innerHTML = '🙈 Ẩn gợi ý';
        button.style.background = 'linear-gradient(45deg, #ff7043, #f4511e)';
    } else {
        hintElement.style.display = 'none';
        button.innerHTML = '💡 Hiện gợi ý ' + (hintId.includes('pinyin') ? 'Pinyin' : 'nghĩa');
        button.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
}

// Kiểm tra đáp án khi nhấn Enter (không phân biệt hoa thường cho chữ Latin)
function checkAnswer(event, correctAnswer) {
    if (event.key === 'Enter') {
        const userAnswer = event.target.value.trim();
        const feedback = document.getElementById('feedback');
        const input = event.target;

        if (userAnswer === '') {
            return;
        }

        // Xác định có phải câu trả lời dạng Latin (pinyin/tiếng Việt) để bỏ phân biệt hoa/thường và dấu
        const latinRegex = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
        const useLatinCompare = latinRegex.test(correctAnswer);
        const left = useLatinCompare ? normalizeLatin(userAnswer) : userAnswer;
        const right = useLatinCompare ? normalizeLatin(correctAnswer) : correctAnswer;
        const isCorrect = left === right;

        // Hiển thị feedback
        feedback.style.display = 'block';
        if (isCorrect) {
            feedback.innerHTML = '✅ Chính xác! Tuyệt vời!';
            feedback.className = 'feedback correct';
            input.className = 'answer-input correct';
            correctAnswers++;
            updateSRSForWord(correctAnswer, true);
        } else {
            feedback.innerHTML = `❌ Sai rồi! Đáp án đúng là: <strong>${correctAnswer}</strong>`;
            feedback.className = 'feedback incorrect';
            input.className = 'answer-input incorrect';
            incorrectAnswers++;

            // Lưu câu trả lời sai
            incorrectQuestions.push({
                question: currentExerciseData[currentQuestionIndex],
                userAnswer: userAnswer,
                correctAnswer: correctAnswer
            });
        }

        // Lưu kết quả
        questionResults.push({
            questionIndex: currentQuestionIndex,
            isCorrect: isCorrect,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer
        });

        // Disable input
        input.disabled = true;

        // Cập nhật điểm số
        updateScore();
        saveSRSMap();

        // Tự động chuyển câu sau 2 giây
        setTimeout(() => {
            if (currentQuestionIndex < currentExerciseData.length - 1) {
                nextQuestion();
            } else {
                // Kết thúc bài tập
                setTimeout(() => {
                    finishExercise();
                }, 1000);
            }
        }, 1500);
    }
}

// Cập nhật tiến trình
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentExerciseData.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
}

// Cập nhật điểm số
function updateScore() {
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('incorrectCount').textContent = incorrectAnswers;
}

// Cập nhật nút điều hướng
function updateNavigationButtons() {
    const isAnswered = questionResults.some(result => result.questionIndex === currentQuestionIndex);

    // document.getElementById('prevBtn').style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
    // document.getElementById('nextBtn').style.display =
    //     (currentQuestionIndex === currentExerciseData.length - 1 || !isAnswered) ? 'none' : 'inline-block';
    document.getElementById('finishBtn').style.display =
        (currentQuestionIndex === currentExerciseData.length - 1 && isAnswered) ? 'inline-block' : 'none';
}

// Câu trước
// function previousQuestion() {
//     if (currentQuestionIndex > 0) {
//         currentQuestionIndex--;
//         generateQuestion();
//     }
// }

// // Câu sau
function nextQuestion() {
    if (currentQuestionIndex < currentExerciseData.length - 1) {
        currentQuestionIndex++;
        generateQuestion();
    }
}

// Kết thúc bài tập
function finishExercise() {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('exerciseResults').style.display = 'block';

    const percentage = Math.round((correctAnswers / currentExerciseData.length) * 100);

    // Hiển thị điểm số
    document.getElementById('finalScore').innerHTML = `
            <span style="color: ${percentage >= 80 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336'};">
                ${correctAnswers}/${currentExerciseData.length} (${percentage}%)
            </span>
        `;

    // Hiển thị lời khuyến khích
    let encouragement = '';
    if (percentage >= 90) {
        encouragement = '🎉 Xuất sắc! Bạn đã nắm vững từ vựng rất tốt!';
    } else if (percentage >= 80) {
        encouragement = '👏 Rất tốt! Bạn đang tiến bộ đáng kể!';
    } else if (percentage >= 60) {
        encouragement = '👍 Khá tốt! Hãy tiếp tục luyện tập nhé!';
    } else {
        encouragement = '💪 Đừng nản lòng! Hãy xem lại các câu sai và luyện tập thêm!';
    }

    document.getElementById('encouragement').textContent = encouragement;

    // Hiển thị/ẩn nút xem lại câu sai
    document.getElementById('reviewBtn').style.display =
        incorrectQuestions.length > 0 ? 'inline-block' : 'none';

    // Lưu lịch sử bài tập vào localStorage
    try {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            exerciseType: document.getElementById('exerciseType').value,
            lessonFilter: document.getElementById('lessonFilter').value,
            total: currentExerciseData.length,
            correct: correctAnswers,
            incorrect: incorrectAnswers,
            percentage: percentage,
            mistakes: incorrectQuestions.slice(0, 20), // lưu tối đa 20 lỗi mẫu
            durationMs: Math.max(0, Date.now() - (exerciseStartMs || Date.now()))
        };
        const stored = JSON.parse(localStorage.getItem('chineseVocab_history') || '[]');
        stored.unshift(entry);
        // giới hạn 100 bản ghi
        localStorage.setItem('chineseVocab_history', JSON.stringify(stored.slice(0, 100)));
        renderHistory();
    } catch (e) {
        console.log('Không thể lưu lịch sử:', e);
    }

    // Hiển thị thời gian
    const durationSec = Math.round((Math.max(0, Date.now() - (exerciseStartMs || Date.now()))) / 1000);
    const avg = (currentExerciseData.length ? (durationSec / currentExerciseData.length) : 0).toFixed(1);
    const durEl = document.getElementById('durationInfo');
    if (durEl) durEl.textContent = `⏱️ Thời gian: ${durationSec}s • Trung bình: ${avg}s/câu`;

    // Hiện lại lịch sử sau khi kết thúc
    const historySection = document.querySelector('.history-section');
    if (historySection) historySection.style.display = 'block';
}

// Hiển thị lịch sử khu vực bài tập
function renderHistory() {
    const listEl = document.getElementById('historyList');
    if (!listEl) return;
    const data = JSON.parse(localStorage.getItem('chineseVocab_history') || '[]');
    if (data.length === 0) {
        listEl.innerHTML = '<div style="color:#666; padding:8px;">Chưa có lịch sử bài tập.</div>';
        return;
    }
    listEl.innerHTML = data.map(item => `
        <div class="history-card">
            <h5>${new Date(item.timestamp).toLocaleString('vi-VN')}</h5>
            <div style="margin-bottom:6px;">
                <span class="pill">${labelExerciseType(item.exerciseType)}</span>
                <span class="pill">${item.lessonFilter === 'all' ? 'Tất cả bài' : item.lessonFilter}</span>
            </div>
            <div>
                Điểm: <strong>${item.correct}/${item.total}</strong> (${item.percentage}%)
            </div>
            <div class="actions">
                <button class="btn" style="padding:6px 10px; font-size:12px;" onclick="viewHistoryDetail(${item.id})">🔍 Xem</button>
            </div>
        </div>
    `).join('');
}

function labelExerciseType(t) {
    const map = {
        fillBlank: 'Điền chữ Hán',
        fillVietnamese: 'Điền nghĩa Việt',
        fillPinyin: 'Điền Pinyin',
        multipleChoice: 'Trắc nghiệm Hán',
        multipleChoiceVietnamese: 'Trắc nghiệm nghĩa',
        trueFalse: 'Đúng/Sai',
        matching: 'Nối từ',
        listening: 'Nghe Pinyin',
        buildSentence: 'Ghép câu',
        sentenceFill: 'Điền từ trong câu'
    };
    return map[t] || t;
}

function clearHistory() {
    if (!confirm('Xóa toàn bộ lịch sử bài tập?')) return;
    localStorage.removeItem('chineseVocab_history');
    renderHistory();
}

function showHistory() {
    renderHistory();
    // cuộn tới phần lịch sử
    const section = document.querySelector('.history-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function viewHistoryDetail(id) {
    const data = JSON.parse(localStorage.getItem('chineseVocab_history') || '[]');
    const item = data.find(e => e.id === id);
    if (!item) return;
    let html = `
        <div style="text-align:left">
            <div style="margin-bottom:8px; color:#555;">${new Date(item.timestamp).toLocaleString('vi-VN')}</div>
            <div style="margin-bottom:8px;">
                <span class="pill">${labelExerciseType(item.exerciseType)}</span>
                <span class="pill">${item.lessonFilter === 'all' ? 'Tất cả bài' : item.lessonFilter}</span>
            </div>
            <div style="margin-bottom:10px;">Điểm: <strong>${item.correct}/${item.total}</strong> (${item.percentage}%)</div>
            ${Array.isArray(item.mistakes) && item.mistakes.length ? '<h4>Câu sai</h4>' : ''}
            ${(item.mistakes || []).map((m, i) => `
                <div style="margin:8px 0; padding:8px; border-left:4px solid #f44336; background:#fff7f7; border-radius:6px;">
                    <div><strong>${i + 1}.</strong> ${m.question.chinese} — ${m.question.pinyin} — ${m.question.vietnamese}</div>
                    <div><span style="color:#c62828">Bạn trả lời:</span> ${m.userAnswer}</div>
                    <div><span style="color:#2e7d32">Đáp án đúng:</span> ${m.correctAnswer}</div>
                </div>
            `).join('')}
        </div>
    `;
    const detail = document.getElementById('historyDetail');
    if (detail) detail.innerHTML = html;
    const modal = document.getElementById('historyModal');
    if (modal) modal.style.display = 'block';
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) modal.style.display = 'none';
}

function exportHistory() {
    const dataStr = localStorage.getItem('chineseVocab_history') || '[]';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lich_su_bai_tap_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Progress charts and insights =====
function drawBarChart(canvasId, labels, values, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const max = Math.max(1, ...values);
    const barW = Math.max(8, Math.floor(w / (values.length * 1.6)));
    const gap = barW * 0.6;
    const leftPad = 20;
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, w, h);
    values.forEach((v, i) => {
        const x = leftPad + i * (barW + gap);
        const bh = Math.round((v / max) * (h - 30));
        ctx.fillStyle = color;
        ctx.fillRect(x, h - bh - 10, barW, bh);
        ctx.fillStyle = '#666';
        ctx.font = '10px sans-serif';
        ctx.fillText(String(labels[i]).slice(0, 5), x, h - 2);
    });
}

function renderProgress() {
    try {
        const hist = JSON.parse(localStorage.getItem('chineseVocab_history') || '[]');
        if (!hist.length) return;
        // Daily
        const byDay = {};
        hist.forEach(e => {
            const d = new Date(e.timestamp);
            const key = d.toISOString().slice(0, 10);
            byDay[key] = (byDay[key] || 0) + (e.percentage || 0);
            byDay[key + '_count'] = (byDay[key + '_count'] || 0) + 1;
        });
        const dayLabels = Object.keys(byDay)
            .filter(k => !k.endsWith('_count'))
            .sort()
            .slice(-10);
        const dayValues = dayLabels.map(k => Math.round(byDay[k] / (byDay[k + '_count'] || 1)));
        drawBarChart('dailyChart', dayLabels, dayValues, '#667eea');

        // Weekly (ISO week)
        const byWeek = {};
        hist.forEach(e => {
            const d = new Date(e.timestamp);
            const y = d.getFullYear();
            const firstThu = new Date(d); firstThu.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
            const week1 = new Date(firstThu.getFullYear(), 0, 4);
            const week = Math.ceil((((firstThu - week1) / 86400000) + 1) / 7);
            const key = `${y}-W${week}`;
            byWeek[key] = (byWeek[key] || 0) + (e.percentage || 0);
            byWeek[key + '_count'] = (byWeek[key + '_count'] || 0) + 1;
        });
        const weekLabels = Object.keys(byWeek)
            .filter(k => !k.endsWith('_count'))
            .sort()
            .slice(-10);
        const weekValues = weekLabels.map(k => Math.round(byWeek[k] / (byWeek[k + '_count'] || 1)));
        drawBarChart('weeklyChart', weekLabels, weekValues, '#26a69a');

        // Accuracy by exercise type
        const byType = {};
        hist.forEach(e => {
            const t = e.exerciseType || 'other';
            byType[t] = byType[t] || { correct: 0, total: 0 };
            byType[t].correct += (e.correct || 0);
            byType[t].total += (e.total || 0);
        });
        const typeBody = document.getElementById('byTypeBody');
        if (typeBody) {
            typeBody.innerHTML = Object.keys(byType).map(k => {
                const c = byType[k].correct, t = byType[k].total, p = t ? Math.round(c * 100 / t) : 0;
                return `<tr><td>${labelExerciseType(k)}</td><td>${c}</td><td>${t}</td><td>${p}%</td></tr>`;
            }).join('');
        }

        // Accuracy by grammar (aggregate from history mistakes vs total)
        const byGrammar = {};
        hist.forEach(e => {
            (e.mistakes || []).forEach(m => {
                const g = (m.question?.grammar) || 'N/A';
                byGrammar[g] = byGrammar[g] || { correct: 0, total: 0 };
                byGrammar[g].total += 1;
            });
            // approximate corrects: total per attempt minus mistakes grammar if available
            // For simplicity, we skip exact grammar for corrects and display mistakes distribution
        });
        const gramBody = document.getElementById('byGrammarBody');
        if (gramBody) {
            gramBody.innerHTML = Object.keys(byGrammar).map(k => {
                const t = byGrammar[k].total; // mistakes count as proxy
                return `<tr><td>${k}</td><td>-</td><td>${t}</td><td>-</td></tr>`;
            }).join('');
        }
    } catch (e) { console.log('renderProgress failed', e); }
}

// Xem lại câu sai
function reviewMistakes() {
    if (incorrectQuestions.length === 0) return;

    let reviewHTML = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';
    incorrectQuestions.forEach((mistake, index) => {
        reviewHTML += `
                <div style="margin: 15px 0; padding: 15px; border-radius: 8px; background: #ffeaea; border-left: 4px solid #f44336;">
                    <strong>Câu ${index + 1}:</strong><br>
                    <div style="margin: 8px 0;">
                        <strong>Chữ Hán:</strong> ${mistake.question.chinese}<br>
                        <strong>Pinyin:</strong> ${mistake.question.pinyin}<br>
                        <strong>Nghĩa:</strong> ${mistake.question.vietnamese}<br>
                        <strong>Bạn trả lời:</strong> <span style="color: #c62828;">${mistake.userAnswer}</span><br>
                        <strong>Đáp án đúng:</strong> <span style="color: #2e7d32;">${mistake.correctAnswer}</span>
                    </div>
                    ${mistake.question.example ? `
                    <div style="font-size: 14px; color: #666; margin-top: 8px;">
                        <strong>Ví dụ:</strong> ${mistake.question.example}
                    </div>` : ''}
                </div>
            `;
    });
    reviewHTML += '</div>';

    document.getElementById('reviewContent').innerHTML = reviewHTML;
    document.getElementById('reviewModal').style.display = 'block';
}

// Đóng modal xem lại
function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
}

// Reset bài tập
function resetExercise() {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('exerciseResults').style.display = 'none';
    currentExerciseData = [];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    questionResults = [];
    incorrectQuestions = [];

    // Hiện lại lịch sử
    const historySection = document.querySelector('.history-section');
    if (historySection) historySection.style.display = 'block';
}

// Tải file Excel tất cả từ vựng
function downloadExcel() {
    const workbook = XLSX.utils.book_new();

    // Tạo worksheet chính
    const mainData = vocabularyData.map((item, index) => ({
        'STT': index + 1,
        'Bài học': item.lesson,
        'Chủ đề': item.topic,
        'Chữ Hán': item.chinese,
        'Pinyin': item.pinyin,
        'Từ loại': item.grammar,
        'Nghĩa tiếng Việt': item.vietnamese,
        'Ví dụ': item.example || '',
        'Nguồn': item.isUserAdded ? 'Người dùng thêm' : 'Từ vựng gốc'
    }));

    const mainWs = XLSX.utils.json_to_sheet(mainData);
    XLSX.utils.book_append_sheet(workbook, mainWs, "Tất cả từ vựng");

    // Tạo worksheet cho từng bài
    const lessons = [...new Set(vocabularyData.map(item => item.lesson))];
    lessons.forEach(lesson => {
        const lessonData = vocabularyData
            .filter(item => item.lesson === lesson)
            .map((item, index) => ({
                'STT': index + 1,
                'Chủ đề': item.topic,
                'Chữ Hán': item.chinese,
                'Pinyin': item.pinyin,
                'Từ loại': item.grammar,
                'Nghĩa tiếng Việt': item.vietnamese,
                'Ví dụ': item.example || ''
            }));

        const lessonWs = XLSX.utils.json_to_sheet(lessonData);
        XLSX.utils.book_append_sheet(workbook, lessonWs, lesson);
    });

    // Tạo worksheet từ do người dùng thêm
    const userWords = vocabularyData.filter(item => item.isUserAdded);
    if (userWords.length > 0) {
        const userWordsData = userWords.map((item, index) => ({
            'STT': index + 1,
            'Bài học': item.lesson,
            'Chủ đề': item.topic,
            'Chữ Hán': item.chinese,
            'Pinyin': item.pinyin,
            'Từ loại': item.grammar,
            'Nghĩa tiếng Việt': item.vietnamese,
            'Ví dụ': item.example || ''
        }));

        const userWordsWs = XLSX.utils.json_to_sheet(userWordsData);
        XLSX.utils.book_append_sheet(workbook, userWordsWs, "Từ người dùng thêm");
    }

    XLSX.writeFile(workbook, 'Tu_vung_tieng_Trung_nang_cao.xlsx');
}

// Tải file Excel flashcards
function downloadFlashcards() {
    const workbook = XLSX.utils.book_new();

    const flashcardData = vocabularyData.map((item, index) => ({
        'STT': index + 1,
        'Mặt trước (Chữ Hán)': item.chinese,
        'Mặt sau (Tiếng Việt)': item.vietnamese,
        'Pinyin': item.pinyin,
        'Từ loại': item.grammar,
        'Ví dụ': item.example || '',
        'Bài học': item.lesson,
        'Chủ đề': item.topic
    }));

    const ws = XLSX.utils.json_to_sheet(flashcardData);
    XLSX.utils.book_append_sheet(workbook, ws, "Flashcards");

    XLSX.writeFile(workbook, 'Flashcards_tieng_Trung_nang_cao.xlsx');
}

// Tải file Excel bài tập với kiểm tra tự động
function downloadExercises() {
    const workbook = XLSX.utils.book_new();

    // Bài tập điền chữ Hán
    const fillChineseData = vocabularyData.map((item, index) => ({
        'STT': index + 1,
        'Bài học': item.lesson,
        'Câu tiếng Việt': item.vietnamese,
        'Pinyin gợi ý': item.pinyin,
        'Điền chữ Hán': '',
        'Kết quả': `=IF(E${index + 2}=G${index + 2},"✓ Đúng","✗ Sai")`,
        '_Đáp án': item.chinese
    }));

    const fillChineseWs = XLSX.utils.json_to_sheet(fillChineseData);
    if (!fillChineseWs['!cols']) fillChineseWs['!cols'] = [];
    fillChineseWs['!cols'][6] = { hidden: true };
    XLSX.utils.book_append_sheet(workbook, fillChineseWs, "Điền chữ Hán");

    // Bài tập điền tiếng Việt
    const fillVietnameseData = vocabularyData.map((item, index) => ({
        'STT': index + 1,
        'Bài học': item.lesson,
        'Chữ Hán': item.chinese,
        'Pinyin': item.pinyin,
        'Điền nghĩa tiếng Việt': '',
        'Kết quả': `=IF(E${index + 2}=G${index + 2},"✓ Đúng","✗ Sai")`,
        '_Đáp án': item.vietnamese
    }));

    const fillVietnameseWs = XLSX.utils.json_to_sheet(fillVietnameseData);
    if (!fillVietnameseWs['!cols']) fillVietnameseWs['!cols'] = [];
    fillVietnameseWs['!cols'][6] = { hidden: true };
    XLSX.utils.book_append_sheet(workbook, fillVietnameseWs, "Điền tiếng Việt");

    // Bài tập điền Pinyin
    const fillPinyinData = vocabularyData.map((item, index) => ({
        'STT': index + 1,
        'Bài học': item.lesson,
        'Chữ Hán': item.chinese,
        'Nghĩa tiếng Việt': item.vietnamese,
        'Điền Pinyin': '',
        'Kết quả': `=IF(E${index + 2}=G${index + 2},"✓ Đúng","✗ Sai")`,
        '_Đáp án': item.pinyin
    }));

    const fillPinyinWs = XLSX.utils.json_to_sheet(fillPinyinData);
    if (!fillPinyinWs['!cols']) fillPinyinWs['!cols'] = [];
    fillPinyinWs['!cols'][6] = { hidden: true };
    XLSX.utils.book_append_sheet(workbook, fillPinyinWs, "Điền Pinyin");

    // Sheet hướng dẫn
    const instructionData = [
        { 'Hướng dẫn sử dụng': 'File Excel bài tập tự động kiểm tra' },
        { 'Hướng dẫn sử dụng': '' },
        { 'Hướng dẫn sử dụng': '1. Điền chữ Hán: Nhìn nghĩa tiếng Việt và Pinyin, điền chữ Hán vào cột "Điền chữ Hán"' },
        { 'Hướng dẫn sử dụng': '2. Điền tiếng Việt: Nhìn chữ Hán và Pinyin, điền nghĩa tiếng Việt vào cột "Điền nghĩa tiếng Việt"' },
        { 'Hướng dẫn sử dụng': '3. Điền Pinyin: Nhìn chữ Hán và nghĩa, điền Pinyin vào cột "Điền Pinyin"' },
        { 'Hướng dẫn sử dụng': '' },
        { 'Hướng dẫn sử dụng': '✅ Kết quả sẽ tự động hiển thị "✓ Đúng" hoặc "✗ Sai" trong cột "Kết quả"' },
        { 'Hướng dẫn sử dụng': '📊 Bạn có thể dùng hàm COUNTIF để đếm số câu đúng/sai' },
        { 'Hướng dẫn sử dụng': '' },
        { 'Hướng dẫn sử dụng': '🎯 Chúc bạn học tập hiệu quả!' }
    ];

    const instructionWs = XLSX.utils.json_to_sheet(instructionData);
    XLSX.utils.book_append_sheet(workbook, instructionWs, "Hướng dẫn");

    XLSX.writeFile(workbook, 'Bai_tap_tieng_Trung_tu_dong_nang_cao.xlsx');
}

// Đóng modal khi click bên ngoài
window.onclick = function (event) {
    const reviewModal = document.getElementById('reviewModal');
    const editModal = document.getElementById('editModal');

    if (event.target === reviewModal) {
        closeReviewModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
}

// Xử lý phím tắt
// document.addEventListener('keydown', function (event) {
//     if (document.getElementById('exerciseContainer').style.display === 'block') {
//         if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
//             const isAnswered = questionResults.some(result => result.questionIndex === currentQuestionIndex);
//             if (isAnswered) {
//                 previousQuestion();
//             }
//         }
//         if (event.key === 'ArrowRight' && currentQuestionIndex < currentExerciseData.length - 1) {
//             const isAnswered = questionResults.some(result => result.questionIndex === currentQuestionIndex);
//             if (isAnswered) {
//                 nextQuestion();
//             }
//         }
//     }
// });

// Lấy index gốc trong mảng vocabularyData cho một item (theo cặp chinese+pinyin)
function getOriginalIndex(item) {
    const idx = vocabularyData.findIndex(w => w.chinese === item.chinese && w.pinyin === item.pinyin);
    return idx === -1 ? 0 : idx;
}

// Thiết lập controls bộ lọc và sắp xếp
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const lessonSelect = document.getElementById('filterLesson');
    const topicInput = document.getElementById('filterTopic');
    const grammarSelect = document.getElementById('filterGrammar');
    const sortSelect = document.getElementById('sortSelect');
    const favOnly = document.getElementById('favOnly');
    const togglePinyinCheckbox = document.getElementById('togglePinyin');

    if (!lessonSelect) return; // không ở tab này

    // Bổ sung danh sách bài học
    const lessons = [...new Set(vocabularyData.map(i => i.lesson))].sort();
    lessons.forEach(ls => {
        const opt = document.createElement('option');
        opt.value = ls;
        opt.textContent = ls;
        lessonSelect.appendChild(opt);
    });

    const refresh = () => displayVocabulary();
    const handlers = [searchInput, lessonSelect, topicInput, grammarSelect, sortSelect, favOnly].filter(Boolean);
    handlers.forEach(el => el.addEventListener('input', refresh));
    if (togglePinyinCheckbox) togglePinyinCheckbox.addEventListener('change', refresh);
}

// Lọc và sắp xếp dữ liệu theo controls
function getFilteredSortedData() {
    const searchRaw = (document.getElementById('searchInput')?.value || '').trim();
    const search = normalizeLatin(searchRaw);
    const lesson = document.getElementById('filterLesson')?.value || 'all';
    const topic = (document.getElementById('filterTopic')?.value || '').trim().toLowerCase();
    const grammar = document.getElementById('filterGrammar')?.value || 'all';
    const sort = document.getElementById('sortSelect')?.value || 'default';
    const favOnly = document.getElementById('favOnly')?.checked || false;

    let data = [...vocabularyData];
    if (lesson !== 'all') data = data.filter(i => i.lesson === lesson);
    if (topic) data = data.filter(i => (i.topic || '').toLowerCase().includes(topic));
    if (grammar !== 'all') data = data.filter(i => (i.grammar || '').toLowerCase() === grammar.toLowerCase());
    if (favOnly) data = data.filter(i => i.isFavorite);
    if (search) {
        data = data.filter(i =>
            i.chinese.includes(searchRaw) ||
            normalizeLatin(i.pinyin || '').includes(search) ||
            normalizeLatin(i.vietnamese || '').includes(search)
        );
    }

    switch (sort) {
        case 'chinese_asc':
            data.sort((a, b) => a.chinese.localeCompare(b.chinese, 'zh-Hant'));
            break;
        case 'chinese_desc':
            data.sort((a, b) => b.chinese.localeCompare(a.chinese, 'zh-Hant'));
            break;
        case 'pinyin_asc':
            data.sort((a, b) => (a.pinyin || '').localeCompare(b.pinyin || ''));
            break;
        case 'pinyin_desc':
            data.sort((a, b) => (b.pinyin || '').localeCompare(a.pinyin || ''));
            break;
        default:
            break;
    }
    return data;
}

// Đánh dấu yêu thích và lưu
function toggleFavorite(chinese) {
    const idx = vocabularyData.findIndex(i => i.chinese === chinese);
    if (idx === -1) return;
    vocabularyData[idx].isFavorite = !vocabularyData[idx].isFavorite;
    saveToLocalStorage();
    updateStats();
    displayVocabulary();
}

// Hiển thị pinyin với màu thanh điệu, có công tắc ẩn/hiện
function renderPinyin(pinyin) {
    const show = document.getElementById('togglePinyin')?.checked !== false;
    if (!show) return '';
    if (!pinyin) return '';
    const toneMap = {
        'ā': '1', 'ē': '1', 'ī': '1', 'ō': '1', 'ū': '1', 'ǖ': '1', 'Ā': '1', 'Ē': '1', 'Ī': '1', 'Ō': '1', 'Ū': '1', 'Ǖ': '1',
        'á': '2', 'é': '2', 'í': '2', 'ó': '2', 'ú': '2', 'ǘ': '2', 'Á': '2', 'É': '2', 'Í': '2', 'Ó': '2', 'Ú': '2', 'Ǘ': '2',
        'ǎ': '3', 'ě': '3', 'ǐ': '3', 'ǒ': '3', 'ǔ': '3', 'ǚ': '3', 'Ǎ': '3', 'Ě': '3', 'Ǐ': '3', 'Ǒ': '3', 'Ǔ': '3', 'Ǚ': '3',
        'à': '4', 'è': '4', 'ì': '4', 'ò': '4', 'ù': '4', 'ǜ': '4', 'À': '4', 'È': '4', 'Ì': '4', 'Ò': '4', 'Ù': '4', 'Ǜ': '4'
    };
    let tone = '0';
    for (const ch of pinyin) {
        if (toneMap[ch]) { tone = toneMap[ch]; break; }
    }
    return `<span class="tone-${tone}">${pinyin}</span>`;
}

// Chuẩn hóa latin: bỏ dấu và đưa về thường (dùng cho pinyin/tiếng Việt)
function normalizeLatin(str) {
    return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '')
        .replace(/đ/g, 'd');
}

// ========== Flashcards ==========
let flashcards = [];
let flashIndex = 0;
let flashIsFront = true;

function initFlashcards() {
    const lesson = document.getElementById('fcLesson')?.value || 'all';
    const favOnly = document.getElementById('fcFavorites')?.checked;
    let data = vocabularyData;
    if (lesson !== 'all') data = data.filter(d => d.lesson === lesson);
    if (favOnly) data = data.filter(d => d.isFavorite);
    flashcards = data.sort(() => 0.5 - Math.random());
    flashIndex = 0;
    flashIsFront = true;
    renderFlashcard();
}

function renderFlashcard() {
    const front = document.getElementById('flashFront');
    const back = document.getElementById('flashBack');
    const info = document.getElementById('flashInfo');
    const twoSided = document.getElementById('fcTwoSided')?.checked;
    const autoplay = document.getElementById('fcAutoplay')?.checked;
    if (!front || !back || !info) return;

    if (!flashcards.length) {
        front.innerHTML = '<div>Chưa có thẻ. Hãy bấm "Tạo bộ thẻ".</div>';
        back.style.display = 'none';
        info.textContent = '';
        return;
    }
    const item = flashcards[flashIndex];

    const showFront = twoSided ? (Math.random() < 0.5) : true;
    flashIsFront = showFront;

    const frontHTML = `
        <div>${getDisplayChinese(item.chinese)}</div>
    `;
    const backHTML = `
        <div class="pinyin">${item.pinyin}</div>
        <div class="viet">${item.vietnamese}</div>
        ${item.example ? `<div style="margin-top:8px; font-size:16px; color:#555;">${item.example}</div>` : ''}
    `;

    front.innerHTML = frontHTML;
    back.innerHTML = backHTML;
    front.style.display = flashIsFront ? 'block' : 'none';
    back.style.display = flashIsFront ? 'none' : 'block';

    info.textContent = `${flashIndex + 1}/${flashcards.length}`;

    if (autoplay) speakFlashcard();
}

function flipFlashcard() {
    const front = document.getElementById('flashFront');
    const back = document.getElementById('flashBack');
    if (!front || !back) return;
    flashIsFront = !flashIsFront;
    front.style.display = flashIsFront ? 'block' : 'none';
    back.style.display = flashIsFront ? 'none' : 'block';
}

function nextFlashcard() {
    if (!flashcards.length) return;
    flashIndex = (flashIndex + 1) % flashcards.length;
    flashIsFront = true;
    renderFlashcard();
}
function prevFlashcard() {
    if (!flashcards.length) return;
    flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
    flashIsFront = true;
    renderFlashcard();
}

// ====== TTS Voice Handling for Flashcards ======
let cachedVoices = [];

function loadVoicesAndPopulate() {
    const select = document.getElementById('fcVoice');
    if (!select) return;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return;
    cachedVoices = voices;
    const preferred = voices.filter(v => /zh|chinese|mandarin/i.test(`${v.lang} ${v.name}`));
    select.innerHTML = '';
    const list = preferred.length ? preferred : voices;
    list.forEach((v, idx) => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        select.appendChild(opt);
    });
    if (preferred.length) select.selectedIndex = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoicesAndPopulate;
        // Some browsers need an initial call
        setTimeout(loadVoicesAndPopulate, 100);
    }
});

function resolveSelectedVoice() {
    const name = document.getElementById('fcVoice')?.value;
    if (!name) return null;
    return cachedVoices.find(v => v.name === name) || null;
}

function speakText(text) {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    const rate = parseFloat(document.getElementById('fcRate')?.value || '1') || 1;
    utter.rate = rate;
    const v = resolveSelectedVoice();
    if (v) utter.voice = v;
    else utter.lang = 'zh-CN';
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

function speakFlashcard() {
    if (!flashcards.length) return;
    const item = flashcards[flashIndex];
    const mode = document.getElementById('fcReadMode')?.value || 'pinyin';
    let text = '';
    if (mode === 'hanzi') text = item.chinese;
    else if (mode === 'both') text = `${item.chinese}，${item.pinyin}`;
    else text = item.pinyin;
    speakText(text);
}

document.addEventListener('keydown', function (e) {
    const active = document.querySelector('#flashcards.tab-content');
    if (!active || active.style.display === 'none') return;
    if (e.code === 'Space') { e.preventDefault(); flipFlashcard(); }
    else if (e.key === 'ArrowRight') { nextFlashcard(); }
    else if (e.key === 'ArrowLeft') { prevFlashcard(); }
    else if (e.key.toLowerCase() === 'a') { speakFlashcard(); }
});

// ====== Pinyin IME (auto-mark tones) ======
const PINYIN_TONE_MAP = {
    a: ['ā', 'á', 'ǎ', 'à'],
    e: ['ē', 'é', 'ě', 'è'],
    i: ['ī', 'í', 'ǐ', 'ì'],
    o: ['ō', 'ó', 'ǒ', 'ò'],
    u: ['ū', 'ú', 'ǔ', 'ù'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ']
};

function replaceToneVowel(syllable, tone) {
    // Rule: a > e > (o/u) > i > ü. Place on a/e first if present.
    const t = Math.max(1, Math.min(4, tone));
    const order = ['a', 'e', 'o', 'u', 'i', 'ü'];
    let base = syllable;
    // Allow 'v' or 'uu' as 'ü'
    base = base.replace(/v/g, 'ü').replace(/uu/g, 'ü');
    for (const vowel of order) {
        const idx = base.indexOf(vowel);
        if (idx !== -1) {
            const map = PINYIN_TONE_MAP[vowel];
            if (!map) break;
            const repl = map[t - 1];
            return base.slice(0, idx) + repl + base.slice(idx + vowel.length);
        }
    }
    return base;
}

function autoMarkPinyin(inputEl) {
    const val = inputEl.value;
    // Convert syllable+digit to diacritics, e.g. ni3 -> nǐ ; hao3 -> hǎo
    const out = val.replace(/([a-zA-Züv]+?)([1-4])(?!\d)/g, (m, syl, d) => {
        // Split potential compound syllables by apostrophe or space are handled by global replace
        const lower = syl.toLowerCase();
        const marked = replaceToneVowel(lower, parseInt(d, 10));
        // Preserve original case: simple approach
        return /[A-Z]/.test(syl[0]) ? marked.charAt(0).toUpperCase() + marked.slice(1) : marked;
    });
    if (out !== val) {
        const start = inputEl.selectionStart;
        inputEl.value = out;
        inputEl.selectionStart = inputEl.selectionEnd = start;
    }
}

function attachPinyinIME(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => autoMarkPinyin(inputEl));
    inputEl.addEventListener('keydown', (e) => {
        // Quick ü: Alt+u or typing 'v' converts to ü via input processing
        if ((e.altKey && e.key.toLowerCase() === 'u')) {
            e.preventDefault();
            insertAtCursor(inputEl, 'ü');
        }
    });
    inputEl.addEventListener('focus', (e) => {
        // Optionally show toolbar on focus
    });
    inputEl.addEventListener('click', (e) => positionToolbarNearInput(inputEl));
    inputEl.addEventListener('focus', (e) => positionToolbarNearInput(inputEl));
}

function positionToolbarNearInput(inputEl) {
    const toolbar = document.getElementById('pinyinToolbar');
    if (!toolbar) return;
    const rect = inputEl.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    toolbar.style.left = (rect.left + scrollX) + 'px';
    toolbar.style.top = (rect.bottom + scrollY + 6) + 'px';
    toolbar.style.display = 'block';

    toolbar.querySelectorAll('.pbtn').forEach(btn => {
        btn.onclick = () => {
            const ch = btn.getAttribute('data-char');
            insertAtCursor(inputEl, ch);
            inputEl.focus();
        };
    });
}

function insertAtCursor(input, text) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.substring(0, start) + text + val.substring(end);
    const pos = start + text.length;
    input.selectionStart = input.selectionEnd = pos;
    input.dispatchEvent(new Event('input'));
}

// Attach to Pinyin-related inputs after DOM ready
(document.addEventListener('DOMContentLoaded', () => {
    ['newPinyin', 'editPinyin', 'answerInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) attachPinyinIME(el);
    });
}));

// Wire side keypad to current answer input
(function () {
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('pinyinPanel');
        if (!panel) return;
        if (e.target && e.target.classList && e.target.classList.contains('pbtn')) {
            const active = document.activeElement;
            const ans = document.getElementById('answerInput');
            const target = (active && active.id === 'answerInput') ? active : ans;
            if (target) {
                const ch = e.target.getAttribute('data-char');
                insertAtCursor(target, ch);
                target.focus();
            }
        }
    });
})();

function dedupeVocabulary() {
    const map = new Map();
    for (const item of vocabularyData) {
        const key = item.chinese;
        if (!key) continue;
        if (!map.has(key)) {
            map.set(key, { ...item });
            continue;
        }
        // Merge with existing
        const existing = map.get(key);
        // Prefer editedOriginal over original, and userAdded over original
        const preferNew = (item.isEditedOriginal && !existing.isEditedOriginal)
            || (item.isUserAdded && !existing.isUserAdded);
        const chosen = preferNew ? { ...item } : { ...existing };
        // Merge favorite
        chosen.isFavorite = Boolean(existing.isFavorite || item.isFavorite);
        // Merge srs (prefer whichever has data; if both, keep the one from chosen)
        if (!chosen.srs && (existing.srs || item.srs)) chosen.srs = existing.srs || item.srs;
        // Keep originalChinese reference if present
        if (!chosen.originalChinese && (existing.originalChinese || item.originalChinese)) {
            chosen.originalChinese = existing.originalChinese || item.originalChinese;
        }
        map.set(key, chosen);
    }
    vocabularyData = Array.from(map.values());
}

// ===== Table Virtualization =====
const VIRT_THRESHOLD = 300;
const VIRT_WINDOW = 60;
const VIRT_OVERSCAN = 20;
let virtualCache = { enabled: false, rowHeight: 44, data: null };

function buildRowHTML(item, absoluteIndex) {
    return `
            <td>${absoluteIndex + 1}</td>
            <td>${item.lesson}</td>
            <td>${item.topic}</td>
            <td class="chinese">${getDisplayChinese(item.chinese)}</td>
            <td class="pinyin">${renderPinyin(item.pinyin)}</td>
            <td><span class="grammar">${item.grammar}</span></td>
            <td class="vietnamese">${item.vietnamese}</td>
            <td>${item.example || ''}</td>
            <td>
                <button class="star-btn ${item.isFavorite ? 'fav' : ''}" title="Yêu thích" onclick="toggleFavorite('${item.chinese.replace(/'/g, "\\'")}')">${item.isFavorite ? '★' : '☆'}</button>
                <button class="btn" onclick="editWord(${getOriginalIndex(item)})" style="padding: 5px 10px; font-size: 12px; margin-right: 5px; background: linear-gradient(45deg, #ff9800, #f57c00);">✏️ Sửa</button>
                ${item.isUserAdded ?
            `<button class="btn btn-danger" onclick="deleteWord(${getOriginalIndex(item)})" style="padding: 5px 10px; font-size: 12px;">🗑️ Xóa</button>` :
            '<span style="color: #999; font-size: 12px;">Từ gốc</span>'
        }
            </td>
        `;
}

function renderVirtualTable(data) {
    const tbody = document.getElementById('vocabularyBody');
    const container = document.querySelector('.table-container');
    if (!tbody || !container) return;

    // Estimate row height if empty
    if (!virtualCache.enabled || virtualCache.data !== data) {
        // Create a temp row to measure
        const temp = document.createElement('tr');
        temp.innerHTML = buildRowHTML(data[0] || { lesson: '', topic: '', chinese: '', pinyin: '', grammar: '', vietnamese: '', example: '' }, 0);
        tbody.innerHTML = '';
        tbody.appendChild(temp);
        virtualCache.rowHeight = temp.getBoundingClientRect().height || 44;
        tbody.innerHTML = '';
        virtualCache.enabled = true;
        virtualCache.data = data;
        // Hide pagination when virtualizing
        const pag = document.querySelector('.pagination-controls');
        if (pag) pag.style.display = 'none';
    }

    const total = data.length;
    const viewHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    const visibleCount = Math.max(1, Math.ceil(viewHeight / virtualCache.rowHeight) + VIRT_OVERSCAN * 2);
    let start = Math.max(0, Math.floor(scrollTop / virtualCache.rowHeight) - VIRT_OVERSCAN);
    let end = Math.min(total, start + Math.max(visibleCount, VIRT_WINDOW));

    const topSpacerH = start * virtualCache.rowHeight;
    const bottomSpacerH = Math.max(0, (total - end) * virtualCache.rowHeight);

    // Build rows
    const rows = [];
    if (topSpacerH > 0) rows.push(`<tr><td colspan="9" style="height:${Math.round(topSpacerH)}px;"></td></tr>`);
    for (let i = start; i < end; i++) {
        const item = data[i];
        rows.push(`<tr>${buildRowHTML(item, i)}</tr>`);
    }
    if (bottomSpacerH > 0) rows.push(`<tr><td colspan="9" style="height:${Math.round(bottomSpacerH)}px;"></td></tr>`);

    tbody.innerHTML = rows.join('');

    // Info line
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) pageInfo.textContent = `Tổng ${total} từ`;

    // Attach scroll handler once
    if (!container._virtBound) {
        container.addEventListener('scroll', () => {
            if (!virtualCache.enabled) return;
            renderVirtualTable(virtualCache.data);
        });
        container._virtBound = true;
    }
}

// ===== Lessons/Topics Management =====
function refreshManageSelectors() {
    const lessonSel = document.getElementById('manageLesson');
    if (lessonSel) {
        const lessons = [...new Set(vocabularyData.map(i => i.lesson))].sort();
        lessonSel.innerHTML = lessons.map(l => `<option value="${l}">${l}</option>`).join('');
    }
    renderGroupStats();
}

document.addEventListener('DOMContentLoaded', refreshManageSelectors);

function createLesson() {
    const name = (document.getElementById('newLessonName').value || '').trim();
    if (!name) { alert('Nhập tên bài.'); return; }
    if (vocabularyData.some(i => i.lesson === name)) { alert('Bài đã tồn tại.'); return; }
    // Không cần thêm từ, chỉ đưa vào danh sách khi thêm từ mới thuộc bài này
    document.getElementById('newLesson').insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`);
    updateLessonOptions();
    refreshManageSelectors();
    alert('Đã tạo bài.');
}

function renameLesson() {
    const lessonSel = document.getElementById('manageLesson');
    const from = lessonSel?.value;
    const to = (document.getElementById('newLessonName').value || '').trim();
    if (!from || !to) { alert('Chọn bài và nhập tên mới.'); return; }
    if (from === to) return;
    vocabularyData.forEach(i => { if (i.lesson === from) i.lesson = to; });
    saveToLocalStorage();
    displayVocabulary();
    updateStats();
    updateLessonOptions();
    refreshManageSelectors();
    alert(`Đã đổi tên bài "${from}" → "${to}".`);
}

function deleteLesson() {
    const lessonSel = document.getElementById('manageLesson');
    const name = lessonSel?.value;
    if (!name) { alert('Chọn bài.'); return; }
    const count = vocabularyData.filter(i => i.lesson === name).length;
    if (!confirm(`Xóa bài "${name}" và ${count} từ thuộc bài này?`)) return;
    vocabularyData = vocabularyData.filter(i => i.lesson !== name);
    saveToLocalStorage();
    displayVocabulary();
    updateStats();
    updateLessonOptions();
    refreshManageSelectors();
}

function createTopic() {
    const target = (document.getElementById('targetTopic').value || '').trim();
    if (!target) { alert('Nhập tên chủ đề.'); return; }
    if (vocabularyData.some(i => i.topic === target)) { alert('Chủ đề đã tồn tại.'); return; }
    // Không cần thêm từ, chủ đề xuất hiện khi có ít nhất một từ thuộc chủ đề
    alert('Đã tạo chủ đề. Thêm từ để chủ đề xuất hiện trong danh sách.');
    renderGroupStats();
}

function renameTopic() {
    const from = (document.getElementById('manageTopic').value || '').trim();
    const to = (document.getElementById('targetTopic').value || '').trim();
    if (!from || !to) { alert('Nhập chủ đề nguồn và tên mới.'); return; }
    if (from === to) return;
    let changed = 0;
    vocabularyData.forEach(i => { if (i.topic === from) { i.topic = to; changed++; } });
    if (!changed) { alert('Không tìm thấy từ thuộc chủ đề nguồn.'); return; }
    saveToLocalStorage();
    displayVocabulary();
    updateStats();
    renderGroupStats();
    alert(`Đã đổi tên chủ đề "${from}" → "${to}" (${changed} từ).`);
}

function mergeTopics() {
    const from = (document.getElementById('manageTopic').value || '').trim();
    const to = (document.getElementById('targetTopic').value || '').trim();
    if (!from || !to) { alert('Nhập chủ đề nguồn và chủ đề đích.'); return; }
    if (from === to) { alert('Chọn hai chủ đề khác nhau.'); return; }
    let changed = 0;
    vocabularyData.forEach(i => { if (i.topic === from) { i.topic = to; changed++; } });
    if (!changed) { alert('Không có từ nào thuộc chủ đề nguồn.'); return; }
    saveToLocalStorage();
    displayVocabulary();
    updateStats();
    renderGroupStats();
    alert(`Đã gộp ${changed} từ từ chủ đề "${from}" và "${to}".`);
}

function deleteTopic() {
    const topic = (document.getElementById('manageTopic').value || '').trim();
    if (!topic) { alert('Nhập chủ đề cần xóa.'); return; }
    const count = vocabularyData.filter(i => i.topic === topic).length;
    if (!count) { alert('Không có từ nào thuộc chủ đề này.'); return; }
    if (!confirm(`Loại bỏ chủ đề của ${count} từ? (Không xóa từ, chỉ xóa nhãn chủ đề)`)) return;
    vocabularyData.forEach(i => { if (i.topic === topic) i.topic = 'Chung'; });
    saveToLocalStorage();
    displayVocabulary();
    updateStats();
    renderGroupStats();
}

function renderGroupStats() {
    const byLessonBody = document.getElementById('statsByLessonBody');
    const byTopicBody = document.getElementById('statsByTopicBody');
    if (byLessonBody) {
        const map = new Map();
        vocabularyData.forEach(i => map.set(i.lesson, (map.get(i.lesson) || 0) + 1));
        byLessonBody.innerHTML = Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
    }
    if (byTopicBody) {
        const map = new Map();
        vocabularyData.forEach(i => map.set(i.topic, (map.get(i.topic) || 0) + 1));
        byTopicBody.innerHTML = Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
    }
}

// ===== Sentence Fill Exercise =====
function buildSentenceFromExample(item) {
    const ex = item.example || '';
    if (!ex || ex.length < 2) return null;
    // Replace target chinese with blanks if present; else remove 1-2 random characters as blanks
    let sentence = ex;
    const blank = '____';
    if (sentence.includes(item.chinese)) {
        sentence = sentence.replaceAll(item.chinese, blank);
        return { sentence, answers: [item.chinese] };
    }
    // Fallback: blank out first occurrence of any Hanzi from the word
    const chars = Array.from(item.chinese);
    for (const ch of chars) {
        const idx = sentence.indexOf(ch);
        if (idx !== -1) {
            sentence = sentence.slice(0, idx) + blank + sentence.slice(idx + 1);
            return { sentence, answers: [item.chinese] };
        }
    }
    // As last resort just create a single blank at center
    const mid = Math.max(0, Math.floor(sentence.length / 2) - 1);
    sentence = sentence.slice(0, mid) + blank + sentence.slice(mid + 2);
    return { sentence, answers: [item.chinese] };
}

function renderSentenceFill(currentItem) {
    const data = buildSentenceFromExample(currentItem);
    const display = data ? data.sentence : '____';

    // Build options: correct + distractors from same lesson or random
    const options = new Set([currentItem.chinese]);
    const pool = vocabularyData
        .filter(v => v.chinese !== currentItem.chinese && (v.lesson === currentItem.lesson))
        .sort(() => 0.5 - Math.random());
    for (const v of pool) { if (options.size >= 4) break; options.add(v.chinese); }
    if (options.size < 4) {
        const extra = vocabularyData.filter(v => !options.has(v.chinese)).sort(() => 0.5 - Math.random());
        for (const v of extra) { if (options.size >= 4) break; options.add(v.chinese); }
    }
    const optionList = Array.from(options).sort(() => 0.5 - Math.random());

    const questionHTML = `
            <div style="text-align:center;">
                <h4 style="margin-bottom: 14px;">Kéo thả hoặc gõ từ còn thiếu:</h4>
                <p style="font-size:20px; margin:12px 0;">${display}</p>
                <p style="font-size:16px; color:#e74c3c; margin:8px 0;">Pinyin: ${currentItem.pinyin}</p>
                <div style="display:flex; gap:10px; align-items:center; justify-content:center; margin-top:12px;">
                    <div ondragover="allowDrop(event)" ondrop="dropWord(event)" data-answer="${currentItem.chinese.replace(/"/g, '&quot;')}" 
                         style="min-width:160px; min-height:42px; border:2px dashed #90caf9; border-radius:10px; padding:8px 12px; background:#f5fbff;">
                        <input type="text" id="answerInput" class="answer-input" placeholder="Thả vào hoặc nhập..." 
                               onkeypress="checkAnswer(event, '${currentItem.chinese.replace(/'/g, "\\'")}')" style="width:100%;">
                    </div>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:12px;">
                    ${optionList.map(w => `
                        <button class="btn" draggable="true" ondragstart="dragWord(event, '${w.replace(/'/g, "\\'")}')" 
                                onclick="document.getElementById('answerInput').value='${w.replace(/'/g, "\\'")}';" 
                                style="padding:8px 12px; border:1px solid #ddd; border-radius:999px; background:#fff;">
                            ${w}
                        </button>
                    `).join('')}
                </div>
                <div id="feedback" class="feedback" style="display:none;"></div>
            </div>
        `;
    return questionHTML;
}

// Drag and drop handlers for sentence fill
function dragWord(ev, text) { ev.dataTransfer.setData('text/plain', text); }
function allowDrop(ev) { ev.preventDefault(); }
function dropWord(ev) {
    ev.preventDefault();
    const text = ev.dataTransfer.getData('text/plain');
    const input = document.getElementById('answerInput');
    if (input) {
        input.value = text;
        // Trigger a check as user would press Enter automatically? Keep manual: optional auto-check
        // Simulate enter keypress
        const correct = ev.currentTarget.getAttribute('data-answer') || '';
        // Reuse existing checkAnswer by creating a dummy event with key==='Enter'
        const e = new KeyboardEvent('keypress', { key: 'Enter' });
        Object.defineProperty(e, 'target', { writable: false, value: input });
        checkAnswer(e, correct);
    }
}

// ===== Favorites Share (link-embed base64 JSON) =====
function generateFavoritesShare() {
    const favs = vocabularyData.filter(i => i.isFavorite).map(i => i.chinese);
    const payload = { type: 'favorites', ts: Date.now(), items: favs };
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const link = location.origin + location.pathname + '#fav=' + b64;
    const el = document.getElementById('favShareLink');
    if (el) { el.value = link; el.select(); document.execCommand('copy'); }
    alert('Đã tạo link và sao chép vào clipboard!');
}

function importFavoritesShare() {
    const el = document.getElementById('favImportLink');
    const txt = el?.value.trim();
    if (!txt) { alert('Dán link chia sẻ vào trước.'); return; }
    try {
        const hash = txt.includes('#') ? txt.split('#')[1] : txt;
        const param = new URLSearchParams(hash.startsWith('?') ? hash.slice(1) : hash);
        let b64 = null;
        if (hash.startsWith('fav=')) b64 = hash.slice(4);
        else if (param.has('fav')) b64 = param.get('fav');
        if (!b64) { alert('Link không hợp lệ.'); return; }
        const payload = JSON.parse(decodeURIComponent(escape(atob(b64))));
        if (!payload || payload.type !== 'favorites' || !Array.isArray(payload.items)) { alert('Dữ liệu không hợp lệ.'); return; }
        const favSet = new Set(payload.items);
        vocabularyData.forEach(i => { if (favSet.has(i.chinese)) i.isFavorite = true; });
        saveToLocalStorage();
        displayVocabulary();
        alert(`Đã import ${payload.items.length} từ yêu thích.`);
    } catch (e) {
        alert('Import thất bại: ' + e.message);
    }
}

let exerciseTimerInterval = null;

function setExerciseActive(active) {
    const tab = document.getElementById('exercise');
    if (!tab) return;
    if (active) tab.classList.add('exercise-active');
    else tab.classList.remove('exercise-active');
}

function startTimer() {
    const disp = document.getElementById('timerDisplay');
    if (exerciseTimerInterval) clearInterval(exerciseTimerInterval);
    exerciseTimerInterval = setInterval(() => {
        if (!exerciseStartMs || !disp) return;
        const secs = Math.floor((Date.now() - exerciseStartMs) / 1000);
        const mm = String(Math.floor(secs / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');
        disp.textContent = `${mm}:${ss}`;
    }, 500);
}

// override/extend startExercise
const _startExercise_old = startExercise;
startExercise = function () {
    _startExercise_old();
    setExerciseActive(true);
    startTimer();
    // show finish button
    const finishBtn = document.getElementById('finishBtn');
    if (finishBtn) finishBtn.style.display = 'inline-block';
};

const _finishExercise_old = finishExercise;
finishExercise = function () {
    if (exerciseTimerInterval) { clearInterval(exerciseTimerInterval); exerciseTimerInterval = null; }
    _finishExercise_old();
    setExerciseActive(false);
};

// Extend finishExercise results to include average per question
const _finishExerciseCore = finishExercise;

function stopExercise() {
    if (!confirm('Dừng bài hiện tại? Kết quả sẽ không được lưu.')) return;
    if (exerciseTimerInterval) { clearInterval(exerciseTimerInterval); exerciseTimerInterval = null; }
    // reset UI to initial state
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('exerciseResults').style.display = 'none';
    setExerciseActive(false);
    // clear progress bar and counters
    const disp = document.getElementById('timerDisplay'); if (disp) disp.textContent = '00:00';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('correctCount').textContent = '0';
    document.getElementById('incorrectCount').textContent = '0';
    document.getElementById('currentQuestion').textContent = '1';
    document.getElementById('totalQuestions').textContent = '0';
}

function closeResultModal() { document.getElementById('resultModal').style.display = 'none'; }

// Replace finishExercise's display logic to show modal only
const __finishExercise_original = finishExercise;
finishExercise = function () {
    __finishExercise_original();
    // Hide inline results, use modal instead
    const inlineRes = document.getElementById('exerciseResults');
    if (inlineRes) inlineRes.style.display = 'none';

    // Populate modal
    const percentage = Math.round((correctAnswers / currentExerciseData.length) * 100);
    const scoreText = `${correctAnswers}/${currentExerciseData.length} (${percentage}%)`;
    const fsM = document.getElementById('finalScoreModal'); if (fsM) fsM.textContent = scoreText;
    const encM = document.getElementById('encouragementModal'); if (encM) encM.textContent = document.getElementById('encouragement')?.textContent || '';
    const durM = document.getElementById('durationInfoModal'); if (durM) durM.textContent = document.getElementById('durationInfo')?.textContent || '';

    // Toggle modal buttons
    const rb = document.getElementById('reviewBtnModal');
    if (rb) rb.style.display = (incorrectQuestions && incorrectQuestions.length > 0) ? 'inline-block' : 'none';
    const hb = document.getElementById('historyBtnModal');
    if (hb) hb.style.display = 'inline-block';

    // Show modal
    const modal = document.getElementById('resultModal'); if (modal) modal.style.display = 'block';
};