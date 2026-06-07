# microgrant
micro grant project

# 新闻鉴证专家 · 苏格拉底式AI

> 一个基于认知科学研究的交互式新闻鉴证工具，采用“支架式教学”策略培养用户独立判断能力，避免AI依赖悖论。

## 📖 项目简介

本项目实现了研究论文中提出的“苏格拉底式AI助手”概念。与传统的直接给出答案的AI不同，本系统通过**引导性问题**、**深度追问**和**可迁移技能培养**，帮助用户建立独立的虚假信息识别能力。

### 核心设计理念

| 策略 | 效果 | 研究依据 |
|------|------|----------|
| ✅ **引导式提问** | 正向促进独立判断 (r=0.29, p=0.047) | Scaffolding策略 |
| ✅ **深度追问** | 保持用户认知警惕 | 元认知激活 |
| ❌ **直接给答案** | 短期准确率↑21%，长期能力↓15.3% | 依赖悖论 |
| ❌ **置信度校准** | 损害独立表现 (r=-0.42, p=0.003) | 认知卸载风险 |

## 🏗️ 项目架构

```
project/
├── index.html          # 主页面结构
├── styles.css          # 全局样式（需自行创建或使用内置样式）
├── config.js           # ⚙️ 全局配置（API密钥、模式开关）
├── newsData.js         # 📰 新闻数据模型与管理
├── aiStrategy.js       # 🤖 AI响应策略与外部接口
├── chatUI.js           # 💬 聊天界面渲染与管理
├── main.js             # 🎮 主控制器，协调各模块
└── README.md           # 本文档
```

### 模块职责

| 模块 | 职责 | 何时修改 |
|------|------|----------|
| `config.js` | 应用配置、API端点、系统提示词 | 接入真实AI、修改响应延迟、更换模型 |
| `newsData.js` | 新闻案例数据、增删改查新闻 | 添加新的鉴证案例、更新事实库 |
| `aiStrategy.js` | 响应生成逻辑、外部API调用 | 优化引导策略、接入新的AI服务 |
| `chatUI.js` | 界面渲染、消息管理、交互事件 | 调整UI样式、修改消息显示逻辑 |
| `main.js` | 模块协调、应用初始化 | 修改整体流程、添加新功能 |

## 🚀 快速开始

### 1. 环境要求

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 无需安装任何依赖（纯原生JavaScript）

### 2. 运行项目

```bash
# 方式一：直接打开
open index.html

# 方式二：使用本地服务器（推荐，避免跨域问题）
npx serve .
# 或使用 Python
python -m http.server 8000
```

访问 `http://localhost:8000` 即可使用。

### 3. 首次使用

系统默认运行在**模拟模式**，无需任何API密钥即可体验苏格拉底式引导对话。AI会：
- 通过提问引导你思考
- 绝不直接给出“真/假”结论
- 鼓励你独立查证

## 🔧 如何修改与扩展

### 📰 添加新的新闻鉴证案例

编辑 `newsData.js`，在 `NEWS_DATABASE.items` 中添加新对象：

```javascript
'your_news_id_001': {
    id: 'your_news_id_001',
    badge: '🔍 待鉴证 · 类别标签',
    headline: '新闻标题',
    imageSvg: `<svg>...</svg>`,  // 或使用 <img src="...">
    caption: '图片说明',
    metaNotes: [
        '💡 <strong>新闻摘要</strong><br/>描述内容...',
        '🧠 <strong>鉴证挑战</strong><br/>引导用户注意的点...'
    ],
    groundTruth: {
        summary: '事实真相摘要',
        keyFallacies: ['谬误点1', '谬误点2'],
        verificationSteps: ['验证步骤1', '验证步骤2']
    }
}
```

然后切换当前新闻：
```javascript
NEWS_DATABASE.setCurrentNews('your_news_id_001');
```

### 🤖 接入真实 OpenAI GPT-4o

1. 编辑 `config.js`：

```javascript
const APP_CONFIG = {
    useMockAI: false,  // 关闭模拟模式
    aiApiEndpoint: 'https://api.openai.com/v1/chat/completions',
    aiApiKey: 'sk-your-api-key-here',  // 生产环境请使用环境变量
    aiModel: 'gpt-4o',
    // ... 其他配置
};
```

2. 修改系统提示词（在 `config.js` 的 `systemPrompt` 中）：

```javascript
systemPrompt: `你是一位新闻鉴证专家，采用苏格拉底式教学法。
核心原则：
1. 绝不直接给出"这是真的/假的"的结论
2. 使用引导性问题帮助用户自己发现证据漏洞
3. 鼓励可迁移的鉴证技能...
4. 每次回复应包含2-3个引导性问题`,
```

> ⚠️ **安全提示**：生产环境请将API密钥存储在后端，不要硬编码在前端。

### 🔍 接入 Google Custom Search API

1. 获取API凭证（Google Cloud Console）
2. 编辑 `config.js`：

```javascript
searchApiEndpoint: 'https://www.googleapis.com/customsearch/v1',
searchApiKey: 'your-api-key',
searchEngineId: 'your-search-engine-id',
```

3. 在 `aiStrategy.js` 中调用 `AIStrategy.performWebSearch(query)` 获取搜索结果。

### 🎨 修改UI样式

创建或编辑 `styles.css` 文件（参考下方样式模板）。主要样式类：

| 类名 | 作用 |
|------|------|
| `.forensic-container` | 主容器 |
| `.evidence-panel` | 左侧新闻面板 |
| `.chat-panel` | 右侧对话面板 |
| `.message` / `.bubble` | 消息气泡 |
| `.user-message` / `.ai-message` | 用户/AI消息样式 |

### 🧠 优化引导策略

编辑 `aiStrategy.js` 中的 `generateMockResponse` 函数：

```javascript
function generateMockResponse(userMessage, context) {
    // 添加新的关键词检测
    if (/你的新关键词/.test(userMessage)) {
        return `你的自定义引导回复...`;
    }
    // 修改现有回复文案
}
```

### 🔌 扩展API接口

`main.js` 中暴露了全局 `window.appAPI` 供外部调用：

```javascript
// 切换新闻案例
window.appAPI.switchNews('moon_landing_002');

// 获取对话历史（用于导出/分析）
const history = window.appAPI.getConversationHistory();

// 切换模拟/真实模式
window.appAPI.setMockMode(false);  // 切换到真实API
```

## 📊 数据流说明

```
用户输入
    ↓
main.js (handleSendMessage)
    ↓
ChatUI.getUserInputAndClear() → 显示用户消息
    ↓
AIStrategy.getResponse(userMessage, history, context)
    ├── useMockAI=true  → generateMockResponse()
    └── useMockAI=false → callRealAI() → OpenAI API
    ↓
ChatUI.addMessage('assistant', response)
    ↓
更新 conversationHistory
```

## 🧪 测试与调试

### 开启控制台日志

所有模块都包含 `console.log/warn/error`，打开浏览器开发者工具即可查看。

### 测试不同新闻案例

```javascript
// 在控制台执行
window.appAPI.switchNews('moon_landing_002');
```

### 重置对话

切换新闻时会自动重置上下文，也可以手动调用：
```javascript
AIStrategy.resetContext();
```

## 📁 样式模板 (styles.css)

如果尚未创建 `styles.css`，请将以下内容保存到项目根目录：

```css
/* 基础样式重置 */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(145deg, #f0f4fa 0%, #e6edf4 100%);
    min-height: 100vh;
    padding: 24px;
}

.forensic-container {
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(255,255,255,0.75);
    border-radius: 2rem;
    overflow: hidden;
    box-shadow: 0 25px 45px -12px rgba(0,0,0,0.25);
}

.dashboard {
    display: flex;
    flex-wrap: wrap;
}

.evidence-panel {
    flex: 1.2;
    background: white;
    padding: 1.8rem;
    border-right: 1px solid rgba(0,0,0,0.08);
}

.chat-panel {
    flex: 1.5;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 1.2rem;
}

/* 消息区域样式 */
.messages-area {
    flex: 1;
    max-height: 460px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message {
    display: flex;
    flex-direction: column;
    max-width: 85%;
}

.user-message { align-self: flex-end; }
.ai-message { align-self: flex-start; }

.bubble {
    padding: 0.75rem 1rem;
    border-radius: 1.2rem;
    line-height: 1.45;
}

.user-message .bubble {
    background: #0f172a;
    color: white;
}

.ai-message .bubble {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
}

/* 输入区域 */
.input-group {
    display: flex;
    gap: 12px;
    margin-top: 1rem;
}

textarea {
    flex: 1;
    border: 1px solid #cbd5e1;
    border-radius: 1.5rem;
    padding: 12px 16px;
    font-family: inherit;
    resize: none;
}

button {
    background: #1e3a5f;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 40px;
    cursor: pointer;
}

/* 响应式 */
@media (max-width: 780px) {
    .dashboard { flex-direction: column; }
    .messages-area { max-height: 350px; }
}
```

## 🤝 贡献指南

### 添加新的鉴证策略

1. 在 `aiStrategy.js` 的 `generateMockResponse` 中添加新的 `if` 分支
2. 确保回复中包含至少1个引导性问题
3. 避免直接给出“正确/错误”结论

### 添加新的UI主题

1. 复制 `styles.css` 为 `styles.dark.css`
2. 修改颜色变量
3. 在 `index.html` 中替换引用的样式文件

## 📚 研究背景

本项目基于以下研究发现：

- **依赖悖论 (Dependency Paradox)**：AI辅助下准确率提高21%，但脱离AI后独立判断能力下降15.3%
- **支架式教学 (Scaffolding)**：引导式提问是唯一正向预测独立准确率的策略 (r=0.29)
- **置信度校准风险**：频繁询问用户信心水平会损害后续独立表现 (r=-0.42)

## 📄 许可证

MIT License

## 📮 联系方式

如需帮助或报告问题，请查阅项目文档或在GitHub提交Issue。

---

**核心原则**：设计AI作为认知增强器，支持人类自主性而非取代之。
