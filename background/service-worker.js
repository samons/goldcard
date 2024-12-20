// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generate-quote-card",
    title: "生成金句卡片",
    contexts: ["selection"]
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generate-quote-card") {
    // 向content script发送消息
    chrome.tabs.sendMessage(tab.id, {
      type: "GENERATE_CARD",
      text: info.selectionText
    });
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 处理消息
  if (message.type === "SAVE_TEMPLATE") {
    // 保存模板
    chrome.storage.local.set({
      templates: message.templates
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
}); 