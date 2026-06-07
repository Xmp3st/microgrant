// ============================================
// aiStrategy.js - AI响应策略与外部接口
// ============================================

/**
 * AI策略引擎
 * 负责生成苏格拉底式回复，支持模拟模式与真实API接入
 */

// 依赖全局配置
const AIStrategy = (function() {
    // 对话历史记录 (用于上下文感知)
    let conversationHistory = [];
    let userInsightLevel = 0;  // 追踪用户推理深度
    
    /**
     * 模拟模式：基于规则生成苏格拉底式回复
     * @param {string} userMessage - 用户消息
     * @param {Object} context - 上下文（当前新闻数据等）
     * @returns {string} AI回复
     */
    function generateMockResponse(userMessage, context) {
        const lowerMsg = userMessage.toLowerCase();
        const groundTruth = context.groundTruth;
        
        // 检测用户关键推理
        const hasRecognizedNatural = /天然|山峰|雪山|地质|侵蚀|冰盖|岩石|不是金字塔|不是人造|自然形成/i.test(lowerMsg);
        const hasQuestionSource = /来源不明|没有权威|可信度低|没有证据|谁发的|官方|科考队否认|辟谣/i.test(lowerMsg);
        const hasSearchIntent = /搜索|查一下|google|找资料|求证|反向/i.test(lowerMsg);
        
        // 更新用户洞察等级
        if (hasRecognizedNatural || hasQuestionSource) {
            userInsightLevel = Math.min(userInsightLevel + 1, 3);
        }
        
        // 根据洞察等级和关键词生成不同层次的引导
        if (hasSearchIntent) {
            return `🔎 非常好的查证意识！这正是培养独立鉴证能力的关键步骤。
            
你可以尝试以下具体搜索策略：
1️⃣ 使用反向图片搜索（Google Images / TinEye）查看图片来源
2️⃣ 搜索关键词："南极 金字塔 事实核查" 或 "Antarctica pyramid fact check"
3️⃣ 查阅权威地质调查局关于南极 nunataks（冰原岛峰）的资料

完成搜索后，分享你的发现，我们继续探讨。`;
        }
        
        if (hasRecognizedNatural) {
            return `✅ 精彩的观察！你提到了"天然形成"的可能性，这正是科学思维的核心。
            
基于你目前的推理，我想邀请你进一步思考：
• 如果是天然山峰，为何传播者要称其为"金字塔"？这反映了什么传播心理？
• 要彻底证伪"人造结构"的说法，还需要哪三类证据？

这种层层拆解的能力，正是可迁移的媒体素养。你如何看待信息传播中的"标题党"现象？`;
        }
        
        if (hasQuestionSource) {
            return `🔍 质疑信息来源是非常宝贵的批判性思维！
            
根据研究，优秀的鉴证者会追问：
1️⃣ 原始发布者是否有相关学科背景？
2️⃣ 信息是否被任何主流科学期刊或权威机构引用？
3️⃣ 是否存在利益相关方推动传播？

针对当前新闻，你可以尝试查找：是否有南极研究科学委员会(SCAR)的相关声明？期待你的进一步发现。`;
        }
        
        // 用户要求直接答案时，拒绝并引导
        if (/是真的吗|真假|对不对|告诉我答案|直接说|是不是假的|正确答案/i.test(lowerMsg)) {
            return `🧭 研究显示：直接给出答案虽能短期提升准确率21%，但会导致"依赖悖论"——脱离AI后能力下降15.3%。
            
因此，我不会直接告诉您真假。让我们换一种方式：
• 请您列出这条新闻中最可疑的三个细节
• 对于每个细节，思考一种验证方法
• 我们一起讨论这些方法的可行性

您愿意从第一个可疑细节开始吗？`;
        }
        
        // 用户已经完全相信时
        if (/是真的|我相信|确实有|肯定存在/i.test(lowerMsg) && !hasRecognizedNatural) {
            return `🤔 理解您被这条震撼新闻吸引。让我们做一个思维实验：
            
假设南极真有史前金字塔，您预期会看到哪些现象？
• 主流科学媒体（Nature, Science）的头条报道
• 联合国教科文组织的遗产申请
• 全球考古学家的独立验证

目前这些现象都没有出现，您认为可能的原因是什么？这能帮助我们建立更可靠的判断框架。`;
        }
        
        // 默认引导（苏格拉底开场）
        return `感谢您的分享。让我们用鉴证思维一起分析：

❓ **引导性问题**
1. 这张图片的原始出处在哪里？是否有更高清版本？
2. 文中"科学家称"具体指的是哪位科学家？在哪个机构工作？
3. 如果是重大发现，为什么主流媒体均未报道？

您可以尝试回答其中任何一个问题，或者提出您自己的疑点。我们一起构建完整的证据链。`;
    }
    
    /**
     * 调用真实AI接口 (OpenAI兼容)
     * @param {string} userMessage - 用户消息
     * @param {Array} history - 对话历史
     * @param {Object} context - 上下文
     * @returns {Promise<string>} AI回复
     */
    async function callRealAI(userMessage, history, context) {
        const messages = [
            { role: 'system', content: APP_CONFIG.systemPrompt },
            { role: 'system', content: `当前鉴证新闻背景: ${context.groundTruth.summary} (仅供内部参考，不要在回复中直接给出结论，而是通过提问引导用户)` },
            ...history.slice(-APP_CONFIG.maxHistoryLength),
            { role: 'user', content: userMessage }
        ];
        
        try {
            const response = await fetch(APP_CONFIG.aiApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_CONFIG.aiApiKey}`
                },
                body: JSON.stringify({
                    model: APP_CONFIG.aiModel,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI API调用失败，降级到模拟模式:', error);
            return generateMockResponse(userMessage, context);
        }
    }
    
    /**
     * 执行Google搜索 (外部接口示例)
     * @param {string} query - 搜索查询
     * @returns {Promise<Array>} 搜索结果
     */
    async function performWebSearch(query) {
        if (!APP_CONFIG.searchApiKey || !APP_CONFIG.searchEngineId) {
            console.warn('搜索API未配置');
            return [];
        }
        
        try {
            const url = `${APP_CONFIG.searchApiEndpoint}?key=${APP_CONFIG.searchApiKey}&cx=${APP_CONFIG.searchEngineId}&q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('搜索失败:', error);
            return [];
        }
    }
    
    /**
     * 主入口：获取AI响应
     * @param {string} userMessage - 用户输入
     * @param {Array} history - 对话历史
     * @param {Object} context - 当前新闻上下文
     * @returns {Promise<string>} AI响应文本
     */
    async function getResponse(userMessage, history, context) {
        // 更新内部历史（用于规则引擎）
        conversationHistory = [...history];
        
        if (APP_CONFIG.useMockAI) {
            // 模拟延迟，更真实
            await new Promise(resolve => setTimeout(resolve, APP_CONFIG.responseDelay));
            return generateMockResponse(userMessage, context);
        } else {
            return await callRealAI(userMessage, history, context);
        }
    }
    
    /**
     * 重置对话状态 (切换新闻时调用)
     */
    function resetContext() {
        conversationHistory = [];
        userInsightLevel = 0;
    }
    
    /**
     * 获取用户洞察等级 (用于UI反馈)
     */
    function getInsightLevel() {
        return userInsightLevel;
    }
    
    // 公开API
    return {
        getResponse,
        resetContext,
        getInsightLevel,
        performWebSearch  // 供外部调用
    };
})();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIStrategy;
} else {
    window.AIStrategy = AIStrategy;
}