// ============================================
// newsData.js - 新闻数据模型与管理
// ============================================

/**
 * 新闻数据结构定义
 * @typedef {Object} NewsItem
 * @property {string} id - 唯一标识
 * @property {string} badge - 标签文字
 * @property {string} headline - 标题
 * @property {string} imageSvg - 图片SVG或URL
 * @property {string} caption - 图片说明
 * @property {Array<string>} metaNotes - 元信息备注数组
 * @property {Object} groundTruth - 事实真相数据（供AI参考，不直接展示）
 * @property {string} groundTruth.summary - 事实摘要
 * @property {Array<string>} keyFallacies - 关键谬误点
 * @property {Array<string>} verificationSteps - 验证步骤
 */

/**
 * 新闻数据存储
 * 可轻松添加、修改、删除新闻案例
 */
const NEWS_DATABASE = {
    // 当前激活的新闻ID
    currentId: 'antarctica_pyramid_001',
    
    // 新闻库
    items: {
        'antarctica_pyramid_001': {
            id: 'antarctica_pyramid_001',
            badge: '🔍 待鉴证 · 新闻图文',
            headline: '🌍 突发！南极洲惊现"远古金字塔"，科学家称发现史前文明证据',
            imageSvg: `<svg width="100%" height="180" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#d9e2ef; border-radius:16px;">
                        <rect width="400" height="180" fill="#cbdde9" rx="16"/>
                        <path d="M120 140 L200 60 L280 140 Z" fill="#b0aa7a" stroke="#5e5a3a" stroke-width="2"/>
                        <rect x="170" y="130" width="60" height="30" fill="#8c7f5c" />
                        <circle cx="210" cy="100" r="8" fill="#f7d44a" />
                        <text x="140" y="160" fill="#2d3748" font-size="12" font-weight="bold">❄️ 南极卫星图像 · 神秘结构</text>
                    </svg>`,
            caption: '📸 网络流传: "南极金字塔热成像图" (来源不明)',
            metaNotes: [
                '💡 <strong>新闻摘要</strong><br/>多家社交媒体疯传: 南极科考队发现三座古老金字塔，远超埃及文明，主流学界隐瞒真相。配图显示雪原上类似金字塔的结构。',
                '🧠 <strong>鉴证挑战</strong> — 你能识别其中的误导吗? AI 将引导你思考，而不是直接给答案。'
            ],
            groundTruth: {
                summary: '所谓"南极金字塔"实为南极埃尔斯沃思山脉的天然山峰，因冰雪侵蚀形成棱锥状外观，无任何考古证据支持人造结构说法。',
                keyFallacies: ['图像误认天然山峰', '缺乏权威科考报告', '无同行评审研究', '主流科学媒体未报道'],
                verificationSteps: [
                    '使用Google Images反向搜索该图片',
                    '查询NASA或BAS南极卫星影像数据库',
                    '在Snopes、AP Fact Check等核查网站搜索关键词',
                    '查阅地质学期刊关于南极 nunataks 的文献'
                ]
            }
        },
        
        // 可扩展更多新闻案例，例如：
        'moon_landing_002': {
            id: 'moon_landing_002',
            badge: '🔍 待鉴证 · 历史谣言',
            headline: '🌙 解密档案：阿波罗登月现场惊现神秘灯光，宇航员隐瞒真相？',
            imageSvg: `<!-- 示例图片占位 -->`,
            caption: '📸 网络流传: "月球表面异常反光物体"',
            metaNotes: [
                '💡 <strong>新闻摘要</strong><br/>社交媒体传言阿波罗任务照片中存在无法解释的光源...',
                '🧠 <strong>鉴证挑战</strong> — 分析光影物理特性与胶片处理工艺'
            ],
            groundTruth: {
                summary: '所谓"神秘灯光"实为镜头眩光、胶片颗粒或反光板反射，已被多次辟谣。',
                keyFallacies: ['忽略摄影光学原理', '断章取义原始照片说明'],
                verificationSteps: ['查阅NASA原始照片档案', '学习基本摄影光学知识']
            }
        }
    },
    
    /**
     * 获取当前新闻数据
     */
    getCurrentNews: function() {
        return this.items[this.currentId];
    },
    
    /**
     * 切换新闻案例
     * @param {string} newsId - 新闻ID
     * @returns {boolean} 是否切换成功
     */
    setCurrentNews: function(newsId) {
        if (this.items[newsId]) {
            this.currentId = newsId;
            return true;
        }
        return false;
    },
    
    /**
     * 添加新新闻案例
     * @param {string} id - 唯一ID
     * @param {Object} newsData - 新闻数据
     */
    addNews: function(id, newsData) {
        this.items[id] = { id, ...newsData };
    },
    
    /**
     * 获取所有新闻ID列表 (供UI选择)
     */
    getAllNewsIds: function() {
        return Object.keys(this.items);
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NEWS_DATABASE;
} else {
    window.NEWS_DATABASE = NEWS_DATABASE;
}