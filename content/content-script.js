// 监听来自background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GENERATE_CARD") {
    // 显示卡片生成界面
    showCardGenerator(message.text);
  }
});

// 创建卡片生成器界面
function showCardGenerator(selectedText) {
  // 创建卡片生成器容器
  const container = document.createElement('div');
  container.id = 'quote-card-generator';
  container.innerHTML = `
    <div class="card-editor">
      <div class="toolbar">
        <!-- 工具栏内容 -->
      </div>
      <div class="preview">
        <!-- 预览区域 -->
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  // 初始化编辑器
  initializeEditor(container, selectedText);
} 