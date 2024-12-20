import { templateManager } from '../src/templates/template-manager.js';
import { StyleEditor } from '../src/editor/style-editor.js';

class PopupManager {
  constructor() {
    this.templateList = document.getElementById('templateList');
    this.editor = null;
    this.selectedTemplateId = null;
    
    this.init();
  }

  async init() {
    await this.loadTemplates();
    this.bindEvents();
  }

  // 加载模板列表
  async loadTemplates() {
    const templates = templateManager.getAllTemplates();
    this.templateList.innerHTML = templates.map(template => `
      <div class="template-item" data-id="${template.id}">
        <div class="template-thumbnail" style="background-image: url(${template.thumbnail})"></div>
        <div class="template-name">${template.name}</div>
      </div>
    `).join('');
  }

  // 绑定事件
  bindEvents() {
    // 模板选择
    this.templateList.addEventListener('click', (e) => {
      const templateItem = e.target.closest('.template-item');
      if (templateItem) {
        this.selectTemplate(templateItem.dataset.id);
      }
    });
  }

  // 选择模板
  selectTemplate(templateId) {
    // 更新选中状态
    const items = this.templateList.querySelectorAll('.template-item');
    items.forEach(item => {
      item.classList.toggle('active', item.dataset.id === templateId);
    });

    // 获取模板数据
    const template = templateManager.getTemplateById(templateId);
    if (template) {
      this.selectedTemplateId = templateId;
      
      // 初始化编辑器
      const editorContainer = document.querySelector('.editor-section');
      this.editor = new StyleEditor(editorContainer, template);
      
      // 设置预览文本
      this.editor.setPreviewText('预览文本');
    }
  }
}

// 初始化
new PopupManager(); 