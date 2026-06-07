// ============================================
// main.js - 主控制器，协调各模块
// ============================================

/**
 * 主应用入口
 * 整合新闻数据、AI策略、UI模块
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用
    initApp();
});

// 对话历史存储
let conversationHistory = [];
let currentNewsContext = null;

async function initApp() {
    // 获取当前新闻数据
    currentNewsContext = NEWS_DATABASE.getCurrentNews();
    
    // 渲染左侧新闻面板
    renderNewsPanel(currentNewsContext);
    
    // 初始化UI
    ChatUI.init(
        {
            messagesContainer: document.getElementById('chatMessages'),
            userInput: document.getElementById('userInput'),
            sendButton: document.getElementById('sendBtn'),
            strategyNoteEl: document.getElementById('strategyNote')
        },
        handleSendMessage  // 发送消息回调
    );
    
    // 注册消息历史回调
    ChatUI.onMessageAdded((role, content) => {
        if (role === 'user') {
            conversationHistory.push({ role: 'user', content });
        } else if (role === 'assistant') {
            conversationHistory.push({ role: 'assistant', content });
        }
        // 限制历史长度
        if (conversationHistory.length > APP_CONFIG.maxHistoryLength * 2) {
            conversationHistory = conversationHistory.slice(-APP_CONFIG.maxHistoryLength * 2);
        }
    });
    
    // 添加欢迎消息
    ChatUI.addMessage('assistant', getWelcomeMessage(), true);
    ChatUI.focusInput();
}

/**
 * 渲染左侧新闻面板
 * @param {Object} news - 新闻数据对象
 */
function renderNewsPanel(news) {
    const panel = document.getElementById('evidencePanel');
    if (!panel) return;
    
    let metaNotesHtml = '';
    if (news.metaNotes && news.metaNotes.length) {
        metaNotesHtml = news.metaNotes.map(note => 
            `<div class="meta-note">${note}</div>`
        ).join('');
    }
    
    panel.innerHTML = `
        <div class="news-header">
            <span class="badge">${news.badge}</span>
            <h1 class="headline">${news.headline}</h1>
            <div class="image-card">
                ${news.imageSvg}
                <div class="caption">${news.caption}</div>
            </div>
            ${metaNotesHtml}
            <div class="meta-note" style="margin-top: 12px; background:#f0f2f5;">
                🧠 <strong>鉴证挑战</strong> — 你能识别其中的误导吗? AI 将引导你思考，而不是直接给答案。
            </div>
        </div>
    `;
}

/**
 * 获取欢迎消息
 */
function getWelcomeMessage() {
    return `你好，我是鉴证AI。我不会直接告诉你"这是真的"或"这是假的"。我会像一位鉴证导师，用提问帮你梳理证据。
    
请先观察左侧的新闻标题与图片。你认为这张图与"${currentNewsContext.headline.substring(0, 30)}..."的说法可信吗？为什么？`;
}

/**
 * 处理用户发送消息
 * @param {string} userText - 用户输入
 */
async function handleSendMessage(userText) {
    if (!userText || userText.trim() === '') {
        return;
    }
    
    // 显示用户消息
    ChatUI.addMessage('user', userText, true);
    
    // 显示打字指示器
    ChatUI.showTyping(true);
    
    try {
        // 调用AI策略获取响应
        const aiResponse = await AIStrategy.getResponse(
            userText,
            conversationHistory,
            currentNewsContext
        );
        
        // 隐藏指示器并显示AI回复
        ChatUI.showTyping(false);
        ChatUI.addMessage('assistant', aiResponse, true);
        
    } catch (error) {
        console.error('AI响应错误:', error);
        ChatUI.showTyping(false);
        ChatUI.addMessage('assistant', '抱歉，我遇到了一些问题。请稍后再试。', true);
    }
    
    // 滚动并聚焦
    ChatUI.scrollToBottom();
    ChatUI.focusInput();
}

/**
 * 切换新闻案例 (供外部调用，扩展功能)
 * @param {string} newsId - 新闻ID
 */
async function switchNews(newsId) {
    if (NEWS_DATABASE.setCurrentNews(newsId)) {
        currentNewsContext = NEWS_DATABASE.getCurrentNews();
        renderNewsPanel(currentNewsContext);
        
        // 重置AI上下文和对话历史
        AIStrategy.resetContext();
        conversationHistory = [];
        ChatUI.clearMessages();
        
        // 重新添加欢迎消息
        ChatUI.addMessage('assistant', getWelcomeMessage(), true);
        ChatUI.focusInput();
    } else {
        console.warn(`新闻ID ${newsId} 不存在`);
    }
}

/**
 * 获取当前对话历史 (用于调试或导出)
 */
function getConversationHistory() {
    return [...conversationHistory];
}

// 将扩展方法挂载到全局，方便调试/扩展
window.appAPI = {
    switchNews,
    getConversationHistory,
    getCurrentNews: () => NEWS_DATABASE.getCurrentNews(),
    getAllNews: () => NEWS_DATABASE.getAllNewsIds(),
    setMockMode: (mode) => { APP_CONFIG.useMockAI = mode; }
};