// Dữ liệu từ vựng được khởi tạo an toàn
let vocabularyData = [];


// function initializeVocabularyData() {
//     vocabularyData = [
//         // Bài 1 - Chào mừng bạn đến Đài Loan - Từ mới 1
//         { lesson: "Bài 1", topic: "Giới thiệu", chinese: "陈月美", pinyin: "Chén Yuèměi", grammar: "N", vietnamese: "Trần Nguyệt Mỹ", example: "我是陈月美。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Giới thiệu", chinese: "李明华", pinyin: "Lǐ Mínghuá", grammar: "N", vietnamese: "Lý Minh Hoa", example: "他叫李明华。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Giới thiệu", chinese: "王开文", pinyin: "Wáng Kāiwén", grammar: "N", vietnamese: "Vương Khai Văn", example: "王开文是老师。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đại từ", chinese: "你", pinyin: "nǐ", grammar: "N", vietnamese: "Bạn", example: "你好！", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Động từ", chinese: "来", pinyin: "lái", grammar: "V", vietnamese: "Đến", example: "我来台湾。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Động từ", chinese: "是", pinyin: "shì", grammar: "Vst", vietnamese: "Là", example: "我是学生。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Danh từ", chinese: "小姐", pinyin: "xiǎojiě", grammar: "N", vietnamese: "Cô", example: "王小姐好。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Nghi vấn", chinese: "吗", pinyin: "ma", grammar: "Ptc", vietnamese: "Không", example: "你好吗？", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Động từ", chinese: "接", pinyin: "jiē", grammar: "V", vietnamese: "Đón", example: "我来接你。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đại từ", chinese: "我们", pinyin: "wǒmen", grammar: "N", vietnamese: "Chúng tôi", example: "我们是朋友。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đại từ", chinese: "我", pinyin: "wǒ", grammar: "N", vietnamese: "Tôi", example: "我很好。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Chỉ định", chinese: "这", pinyin: "zhè", grammar: "Det", vietnamese: "Này", example: "这是书。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Xưng hô", chinese: "先生", pinyin: "xiānshēng", grammar: "N", vietnamese: "Ông, ngài", example: "王先生好。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Tính từ", chinese: "好", pinyin: "hǎo", grammar: "Vs", vietnamese: "Tốt", example: "今天天气很好。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Động từ", chinese: "姓", pinyin: "xìng", grammar: "Vst", vietnamese: "Họ", example: "我姓王。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Gọi tên", chinese: "叫", pinyin: "jiào", grammar: "Vst", vietnamese: "Gọi, gọi tên", example: "我叫明华。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đại từ", chinese: "你们", pinyin: "nǐmen", grammar: "N", vietnamese: "Các bạn", example: "你们好！", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Địa danh", chinese: "台湾", pinyin: "Táiwān", grammar: "N", vietnamese: "Đài Loan", example: "我来台湾学习。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Chào hỏi", chinese: "欢迎", pinyin: "huānyíng", grammar: "", vietnamese: "Chào mừng", example: "欢迎你来台湾！", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Hỏi thăm", chinese: "请问", pinyin: "qǐngwèn", grammar: "", vietnamese: "Xin hỏi", example: "请问，你是王先生吗？", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Khẳng định", chinese: "是的", pinyin: "shì de", grammar: "", vietnamese: "Vâng, đúng vậy", example: "是的，我是王先生。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Cảm ơn", chinese: "谢谢", pinyin: "xièxie", grammar: "", vietnamese: "Cảm ơn", example: "谢谢你的帮助。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Lịch sự", chinese: "不客气", pinyin: "bùkèqì", grammar: "", vietnamese: "Đừng khách khí", example: "不客气，应该的。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Chào hỏi", chinese: "你好", pinyin: "nǐ hǎo", grammar: "", vietnamese: "Xin chào", example: "你好！很高兴见到你。", isUserAdded: false },

//         // Bài 1 - Từ mới 2
//         { lesson: "Bài 1", topic: "Xin mời", chinese: "请", pinyin: "qǐng", grammar: "V", vietnamese: "Xin mời", example: "请进！", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đồ uống", chinese: "喝", pinyin: "hē", grammar: "V", vietnamese: "Uống", example: "你喝茶吗？", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đồ uống", chinese: "茶", pinyin: "chá", grammar: "N", vietnamese: "Trà", example: "我喜欢喝茶。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Trạng từ", chinese: "很", pinyin: "hěn", grammar: "Adv", vietnamese: "Rất", example: "我很好。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Tính từ", chinese: "好喝", pinyin: "hǎohē", grammar: "Vs", vietnamese: "Ngon", example: "这茶很好喝。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Nghi vấn", chinese: "什么", pinyin: "shénme", grammar: "N", vietnamese: "Cái gì?", example: "这是什么？", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Danh từ", chinese: "人", pinyin: "rén", grammar: "N", vietnamese: "Người", example: "他是好人。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Tính từ", chinese: "喜欢", pinyin: "xǐhuān", grammar: "Vst", vietnamese: "Thích", example: "我喜欢中文。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Nghi vấn", chinese: "呢", pinyin: "ne", grammar: "Ptc", vietnamese: "Trợ từ để hỏi cuối câu", example: "你呢？", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đại từ", chinese: "他", pinyin: "tā", grammar: "N", vietnamese: "Anh ấy", example: "他是我朋友。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Phủ định", chinese: "不", pinyin: "bù", grammar: "Adv", vietnamese: "Không", example: "我不喝咖啡。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Nghi vấn", chinese: "哪", pinyin: "nǎ/něi", grammar: "Det", vietnamese: "Đâu?", example: "你是哪国人？", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Tính từ", chinese: "要", pinyin: "yào", grammar: "Vaux", vietnamese: "Muốn", example: "我要喝茶。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đồ uống", chinese: "咖啡", pinyin: "kāfēi", grammar: "N", vietnamese: "Cà phê", example: "我喜欢喝咖啡。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Đồ uống", chinese: "乌龙茶", pinyin: "wūlóng chá", grammar: "N", vietnamese: "Trà ô long", example: "台湾的乌龙茶很有名。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Quốc gia", chinese: "日本", pinyin: "Rìběn", grammar: "N", vietnamese: "Nhật Bản", example: "他来自日本。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Quốc gia", chinese: "美国", pinyin: "Měiguó", grammar: "N", vietnamese: "Nước Mỹ", example: "我来自美国。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Lời xin lỗi", chinese: "对不起", pinyin: "duìbùqǐ", grammar: "", vietnamese: "Xin lỗi", example: "对不起，我来晚了。", isUserAdded: false },
//         { lesson: "Bài 1", topic: "Nghi vấn", chinese: "哪国", pinyin: "nǎ guó/něi guó", grammar: "", vietnamese: "Nước nào?", example: "你是哪国人？", isUserAdded: false },

//         // Bài 2 - Từ mới 1
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "田中诚一", pinyin: "Tiánzhōng Chéngyī", grammar: "N", vietnamese: "Tanaka Seiichi", example: "我叫田中诚一。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "伯母", pinyin: "bómǔ", grammar: "N", vietnamese: "Bác gái", example: "这是我伯母。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "伯父", pinyin: "bófù", grammar: "N", vietnamese: "Bác trai", example: "伯父很好。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Đại từ", chinese: "您", pinyin: "nín", grammar: "N", vietnamese: "Ông, ngài", example: "您好！", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "名字", pinyin: "míngzì", grammar: "N", vietnamese: "Tên", example: "你的名字是什么？", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "书", pinyin: "shū", grammar: "N", vietnamese: "Sách", example: "这是中文书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "哥哥", pinyin: "gēge", grammar: "N", vietnamese: "Anh trai", example: "我哥哥很高。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Nghề nghiệp", chinese: "老师", pinyin: "lǎoshī", grammar: "N", vietnamese: "Giáo viên", example: "他是我的老师。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "看书", pinyin: "kànshū", grammar: "V-sep", vietnamese: "Đọc sách", example: "我喜欢看书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "几", pinyin: "jǐ", grammar: "N", vietnamese: "Mấy", example: "你有几个孩子？", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Lượng từ", chinese: "个", pinyin: "ge", grammar: "M", vietnamese: "Cái, chiếc", example: "三个人。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Phủ định", chinese: "没", pinyin: "méi", grammar: "Adv", vietnamese: "Không", example: "我没有书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "兄弟", pinyin: "xiōngdì", grammar: "N", vietnamese: "Anh em", example: "我有两个兄弟。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "姐妹", pinyin: "jiěmèi", grammar: "N", vietnamese: "Chị em", example: "她有三个姐妹。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Số từ", chinese: "五", pinyin: "wǔ", grammar: "N", vietnamese: "Năm", example: "我五岁。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Số từ", chinese: "两", pinyin: "liǎng", grammar: "N", vietnamese: "Hai", example: "我有两个孩子。", isUserAdded: false },

//         // Bài 2 - Từ mới 2
//         { lesson: "Bài 2", topic: "Giới thiệu", chinese: "张怡君", pinyin: "Zhāng Yíjūn", grammar: "", vietnamese: "Trương Di Quân", example: "她是张怡君。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Địa điểm", chinese: "马安同", pinyin: "Mǎ Āntóng", grammar: "", vietnamese: "Mã An Đồng", example: "马安同是我朋友。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Chỉ định", chinese: "的", pinyin: "de", grammar: "Ptc", vietnamese: "Chỉ sở hữu", example: "这是我的书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "家人", pinyin: "jiārén", grammar: "N", vietnamese: "Người nhà", example: "我的家人都很好。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "家", pinyin: "jiā", grammar: "N", vietnamese: "Nhà", example: "我的家在台北。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Tính từ", chinese: "漂亮", pinyin: "piàoliang", grammar: "Vs", vietnamese: "Xinh, đẹp", example: "她很漂亮。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "房子", pinyin: "fángzi", grammar: "N", vietnamese: "Căn/ngôi nhà", example: "这房子很大。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "坐", pinyin: "zuò", grammar: "Vi", vietnamese: "Ngồi", example: "请坐！", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Tính từ", chinese: "好", pinyin: "hǎo", grammar: "Ptc", vietnamese: "Tốt", example: "好，我坐下。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "有", pinyin: "yǒu", grammar: "Vst", vietnamese: "Có", example: "我有一本书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Số lượng", chinese: "多", pinyin: "duō", grammar: "Vs-pred", vietnamese: "Nhiều", example: "人很多。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "照片", pinyin: "zhàopiàn", grammar: "N", vietnamese: "Bức ảnh", example: "这是我的照片。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Trạng từ", chinese: "都", pinyin: "dōu", grammar: "Adv", vietnamese: "Đều", example: "我们都是学生。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "照相", pinyin: "zhàoxiāng", grammar: "V-sep", vietnamese: "Chụp ảnh", example: "我们一起照相。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Lượng từ", chinese: "张", pinyin: "zhāng", grammar: "M", vietnamese: "Tờ, bức, tấm", example: "一张照片。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Tính từ", chinese: "好看", pinyin: "hǎokàn", grammar: "Vs", vietnamese: "Đẹp", example: "这照片很好看。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Đại từ", chinese: "谁", pinyin: "shuí", grammar: "N", vietnamese: "Ai", example: "这是谁？", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "姐姐", pinyin: "jiějie", grammar: "N", vietnamese: "Chị gái", example: "我姐姐很聪明。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "妹妹", pinyin: "mèimei", grammar: "N", vietnamese: "Em gái", example: "我妹妹还小。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "爸爸", pinyin: "bàba", grammar: "N", vietnamese: "Bố", example: "我爸爸是医生。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "妈妈", pinyin: "māma", grammar: "N", vietnamese: "Mẹ", example: "我妈妈很温柔。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Lời mời", chinese: "请进", pinyin: "qǐng jìn", grammar: "", vietnamese: "Mời vào!", example: "请进！欢迎来我家。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Nghề nghiệp", chinese: "老师", pinyin: "lǎoshī", grammar: "N", vietnamese: "Giáo viên", example: "他是我的老师。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "看书", pinyin: "kànshū", grammar: "V-sep", vietnamese: "Đọc sách", example: "我喜欢看书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "几", pinyin: "jǐ", grammar: "N", vietnamese: "Mấy", example: "你有几个孩子？", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Lượng từ", chinese: "个", pinyin: "ge", grammar: "M", vietnamese: "Cái", example: "三个人。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Phủ định", chinese: "没", pinyin: "méi", grammar: "Adv", vietnamese: "Không", example: "我没有书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "兄弟", pinyin: "xiōngdì", grammar: "N", vietnamese: "Anh em", example: "我有两个兄弟。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Chỉ định", chinese: "的", pinyin: "de", grammar: "Ptc", vietnamese: "Chỉ sở hữu", example: "这是我的书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "家人", pinyin: "jiārén", grammar: "N", vietnamese: "Người nhà", example: "我的家人都很好。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "家", pinyin: "jiā", grammar: "N", vietnamese: "Nhà", example: "我的家在台北。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Tính từ", chinese: "漂亮", pinyin: "piàoliang", grammar: "Vs", vietnamese: "Xinh đẹp", example: "她很漂亮。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "坐", pinyin: "zuò", grammar: "Vi", vietnamese: "Ngồi", example: "请坐！", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Động từ", chinese: "有", pinyin: "yǒu", grammar: "Vst", vietnamese: "Có", example: "我有一本书。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Số lượng", chinese: "多", pinyin: "duō", grammar: "Vs-pred", vietnamese: "Nhiều", example: "人很多。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Danh từ", chinese: "照片", pinyin: "zhàopiàn", grammar: "N", vietnamese: "Bức ảnh", example: "这是我的照片。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Trạng từ", chinese: "都", pinyin: "dōu", grammar: "Adv", vietnamese: "Đều", example: "我们都是学生。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Đại từ", chinese: "谁", pinyin: "shuí", grammar: "N", vietnamese: "Ai", example: "这是谁？", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "姐姐", pinyin: "jiějie", grammar: "N", vietnamese: "Chị gái", example: "我姐姐很聪明。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "妹妹", pinyin: "mèimei", grammar: "N", vietnamese: "Em gái", example: "我妹妹还小。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "爸爸", pinyin: "bàba", grammar: "N", vietnamese: "Bố", example: "我爸爸是医生。", isUserAdded: false },
//         { lesson: "Bài 2", topic: "Gia đình", chinese: "妈妈", pinyin: "māma", grammar: "N", vietnamese: "Mẹ", example: "我妈妈很温柔。", isUserAdded: false }
//     ];
// }

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
        { lesson: "Bài 1", topic: "Chỉ định", chinese: "这", pinyin: "zhè", grammar: "Det", vietnamese: "Này", example: "这是书。", isUserAdded: false },
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

    localStorage.setItem('chineseVocab_userWords', JSON.stringify(userWords));
    localStorage.setItem('chineseVocab_editedOriginals', JSON.stringify(editedOriginalWords));
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
                                    word.isUserAdded = true;
                                    vocabularyData.push(word);
                                    addedCount++;
                                }
                            }
                        });
                        saveToLocalStorage();
                        displayVocabulary();
                        updateStats();
                        alert(`Đã import thành công ${addedCount} từ vựng!`);
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
    displayVocabulary();
    updateStats();
    updateLessonOptions(); // Cập nhật dropdown bài học

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

    vocabularyData.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
             <td>${index + 1}</td>
             <td>${item.lesson}</td>
             <td>${item.topic}</td>
             <td class="chinese">${item.chinese}</td>
             <td class="pinyin">${item.pinyin}</td>
             <td><span class="grammar">${item.grammar}</span></td>
             <td class="vietnamese">${item.vietnamese}</td>
             <td>${item.example || ''}</td>
             <td>
                 <button class="btn" onclick="editWord(${index})" style="padding: 5px 10px; font-size: 12px; margin-right: 5px; background: linear-gradient(45deg, #ff9800, #f57c00);">✏️ Sửa</button>
                 ${item.isUserAdded ?
                `<button class="btn btn-danger" onclick="deleteWord(${index})" style="padding: 5px 10px; font-size: 12px;">🗑️ Xóa</button>` :
                '<span style="color: #999; font-size: 12px;">Từ gốc</span>'
            }
             </td>
         `;
    });
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

    // Lọc dữ liệu theo bài học
    let filteredData = vocabularyData;
    if (lessonFilter !== 'all') {
        filteredData = vocabularyData.filter(item => item.lesson === lessonFilter);
    }

    if (filteredData.length === 0) {
        alert('❌ Không tìm thấy từ vựng nào cho bài học đã chọn!');
        return;
    }

    // Trộn ngẫu nhiên và lấy số câu theo yêu cầu
    const shuffled = filteredData.sort(() => 0.5 - Math.random());
    currentExerciseData = shuffled.slice(0, Math.min(questionCount, shuffled.length));

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

    generateQuestion();
}

// Tạo câu hỏi
function generateQuestion() {
    const exerciseType = document.getElementById('exerciseType').value;
    const currentItem = currentExerciseData[currentQuestionIndex];
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
                     <div style="margin: 15px 0;">
                         <button class="btn" onclick="toggleHint('pinyinHint')" style="padding: 8px 16px; font-size: 14px; margin-bottom: 10px;">
                             💡 Hiện gợi ý Pinyin
                         </button>
                         <div id="pinyinHint" style="display: none; font-size: 16px; color: #e74c3c; margin: 10px 0;">
                             <strong>Pinyin:</strong> ${currentItem.pinyin}
                         </div>
                     </div>
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
                     <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 400px; margin: 20px auto;">
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
                         ${currentItem.chinese}
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
                             ${currentItem.chinese}
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
                     <div style="margin: 15px 0;">
                         <button class="btn" onclick="toggleHint('pinyinHint')" style="padding: 8px 16px; font-size: 14px; margin-bottom: 10px;">
                             💡 Hiện gợi ý Pinyin
                         </button>
                         <div id="pinyinHint" style="display: none; font-size: 16px; color: #e74c3c; margin: 10px 0;">
                             <strong>Pinyin:</strong> ${currentItem.pinyin}
                         </div>
                     </div>
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
    }

    questionCard.innerHTML = questionHTML;
    updateNavigationButtons();

    // Focus vào input
    setTimeout(() => {
        const inputElement = document.getElementById('answerInput');
        if (inputElement) {
            inputElement.focus();
        }
    }, 100);
}

// Xử lý trắc nghiệm
function selectMultipleChoice(selectedAnswer, correctAnswer, buttonElement) {
    const allButtons = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');

    // Disable tất cả buttons
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
        buttonElement.style.background = '#e8f5e8';
        buttonElement.style.borderColor = '#4caf50';
        buttonElement.style.color = '#2e7d32';
        feedback.innerHTML = '✅ Chính xác! Tuyệt vời!';
        feedback.className = 'feedback correct';
        correctAnswers++;
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

// Xử lý bài tập Đúng/Sai
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

// Kiểm tra đáp án khi nhấn Enter
function checkAnswer(event, correctAnswer) {
    if (event.key === 'Enter') {
        const userAnswer = event.target.value.trim();
        const feedback = document.getElementById('feedback');
        const input = event.target;

        if (userAnswer === '') {
            return;
        }

        const isCorrect = userAnswer === correctAnswer;

        // Hiển thị feedback
        feedback.style.display = 'block';
        if (isCorrect) {
            feedback.innerHTML = '✅ Chính xác! Tuyệt vời!';
            feedback.className = 'feedback correct';
            input.className = 'answer-input correct';
            correctAnswers++;
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
        }, 2000);
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

    document.getElementById('prevBtn').style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display =
        (currentQuestionIndex === currentExerciseData.length - 1 || !isAnswered) ? 'none' : 'inline-block';
    document.getElementById('finishBtn').style.display =
        (currentQuestionIndex === currentExerciseData.length - 1 && isAnswered) ? 'inline-block' : 'none';
}

// Câu trước
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        generateQuestion();
    }
}

// Câu sau
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
document.addEventListener('keydown', function (event) {
    if (document.getElementById('exerciseContainer').style.display === 'block') {
        if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
            const isAnswered = questionResults.some(result => result.questionIndex === currentQuestionIndex);
            if (isAnswered) {
                previousQuestion();
            }
        }
        if (event.key === 'ArrowRight' && currentQuestionIndex < currentExerciseData.length - 1) {
            const isAnswered = questionResults.some(result => result.questionIndex === currentQuestionIndex);
            if (isAnswered) {
                nextQuestion();
            }
        }
    }
});