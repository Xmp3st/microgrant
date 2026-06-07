// ============================================
// config.js - 全局配置与常量
// ============================================

/**
 * 全局配置对象
 * 修改此处即可调整应用行为，无需改动核心逻辑
 */
const APP_CONFIG = {
    // AI 响应延迟模拟（毫秒），接入真实API时可设为0或实际网络延迟
    responseDelay: 800,
    
    // 是否启用模拟模式 (true=使用内置策略生成回复, false=调用外部AI接口)
    useMockAI: true,
    
    // 真实AI接口配置 (当useMockAI=false时生效)
    aiApiEndpoint: 'https://api.openai.com/v1/chat/completions',  // OpenAI 兼容接口
    aiApiKey: '',  // 生产环境应从后端获取，勿硬编码
    aiModel: 'gpt-4o',
    
    // Google Custom Search API 配置
    searchApiEndpoint: 'https://www.googleapis.com/customsearch/v1',
    searchApiKey: '',  // 应从安全渠道注入
    searchEngineId: '',  // 搜索引擎ID
    
    // 系统提示词 (苏格拉底式系统角色)
    systemPrompt: `你是一位新闻鉴证专家，采用苏格拉底式教学法。你的核心原则：
1. 绝不直接给出"这是真的/假的"的结论
2. 使用引导性问题帮助用户自己发现证据漏洞
3. 当用户提出正确观点时，给予肯定并追问更深层问题
4. 避免"置信度校准"类提问（研究显示会损害独立判断）
5. 鼓励可迁移的鉴证技能（反向图片搜索、信源追踪等）
6. 每次回复应包含1-3个引导性问题，促进深度思考`,
    
    // 对话历史最大保留条数
    maxHistoryLength: 20,
    
    // UI 相关配置
    typingIndicatorText: '✍️ 鉴证专家正在分析你的观点...',
    defaultStrategyNote: '🧠 策略提示: 我会采用引导式提问 / 深度追问 · 而非直接揭露答案'
};

// 导出（浏览器环境使用全局变量）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
} else {
    window.APP_CONFIG = APP_CONFIG;
}