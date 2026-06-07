// ============================================
// chatUI.js - 聊天界面渲染与管理
// ============================================

/**
 * UI管理模块
 * 负责消息显示、界面更新、事件绑定
 */
const ChatUI = (function() {
    // DOM 元素引用
    let messagesContainer;
    let userInput;
    let sendButton;
    let strategyNoteEl;
    
    // 状态
    let isWaitingResponse = false;
    let messageHandlers = [];
    
    /**
     * 初始化UI组件
     * @param {Object} elements - DOM元素对象
     * @param {Function} onSendMessage - 发送消息回调
     */
    function init(elements, onSendMessage) {
        messagesContainer = elements.messagesContainer;
        userInput = elements.userInput;
        sendButton = elements.sendButton;
        strategyNoteEl = elements.strategyNoteEl;
        
        // 绑定事件
        sendButton.addEventListener('click', () => {
            if (!isWaitingResponse) {
                onSendMessage(userInput.value);
            }
        });
        
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isWaitingResponse) {
                e.preventDefault();
                onSendMessage(userInput.value);
            }
        });
        
        // 初始滚动到底部
        scrollToBottom();
    }
    
    /**
     * 添加消息到界面
     * @param {string} role - 'user' 或 'assistant'
     * @param {string} content - 消息内容
     * @param {boolean} saveToHistory - 是否保存到历史（由外部管理）
     */
    function addMessage(role, content, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
        messageDiv.style.animation = 'fadeSlideUp 0.2s ease';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        // 支持换行
        bubble.innerHTML = content.replace(/\n/g, '<br>');
        
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(bubble);
        messageDiv.appendChild(timestamp);
        messagesContainer.appendChild(messageDiv);
        
        scrollToBottom();
        
        // 触发消息添加回调
        if (saveToHistory) {
            messageHandlers.forEach(handler => handler(role, content));
        }
    }
    
    /**
     * 显示/隐藏打字指示器
     * @param {boolean} show - 是否显示
     */
    function showTyping(show) {
        const existingIndicator = document.getElementById('typing-indicator');
        
        if (show && !existingIndicator) {
            const indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.className = 'message ai-message';
            indicator.innerHTML = `<div class="bubble" style="background:#e9eef3;">${APP_CONFIG.typingIndicatorText}</div>`;
            messagesContainer.appendChild(indicator);
            scrollToBottom();
            isWaitingResponse = true;
            sendButton.disabled = true;
        } else if (!show && existingIndicator) {
            existingIndicator.remove();
            isWaitingResponse = false;
            sendButton.disabled = false;
        }
    }
    
    /**
     * 获取用户输入并清空
     * @returns {string} 用户输入内容
     */
    function getUserInputAndClear() {
        const text = userInput.value.trim();
        if (text) {
            userInput.value = '';
            userInput.style.height = 'auto';
        }
        return text;
    }
    
    /**
     * 自动调整textarea高度
     */
    function autoResizeTextarea() {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    }
    
    /**
     * 更新策略提示区域
     * @param {string} text - 提示文本
     */
    function updateStrategyNote(text) {
        if (strategyNoteEl) {
            strategyNoteEl.innerHTML = text;
        }
    }
    
    /**
     * 清空所有消息
     */
    function clearMessages() {
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    }
    
    /**
     * 滚动到底部
     */
    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    /**
     * 注册消息添加回调
     * @param {Function} handler - 回调函数
     */
    function onMessageAdded(handler) {
        messageHandlers.push(handler);
    }
    
    /**
     * 设置输入框焦点
     */
    function focusInput() {
        userInput.focus();
    }
    
    // 监听textarea自动调整
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', () => {
            const textarea = document.getElementById('userInput');
            if (textarea) {
                textarea.addEventListener('input', autoResizeTextarea);
            }
        });
    }
    
    return {
        init,
        addMessage,
        showTyping,
        getUserInputAndClear,
        updateStrategyNote,
        clearMessages,
        scrollToBottom,
        onMessageAdded,
        focusInput,
        autoResizeTextarea
    };
})();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatUI;
} else {
    window.ChatUI = ChatUI;
}