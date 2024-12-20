import { defaultTemplates } from './templates.js';

class TemplateManager {
  constructor() {
    this.templates = [...defaultTemplates];
    this.loadCustomTemplates();
  }

  // 加载自定义模板
  async loadCustomTemplates() {
    try {
      const result = await chrome.storage.local.get('customTemplates');
      if (result.customTemplates) {
        this.templates = [...this.templates, ...result.customTemplates];
      }
    } catch (error) {
      console.error('加载自定义模板失败:', error);
    }
  }

  // 获取所有模板
  getAllTemplates() {
    return this.templates;
  }

  // 根据ID获取模板
  getTemplateById(id) {
    return this.templates.find(template => template.id === id);
  }

  // 添加自定义模板
  async addCustomTemplate(template) {
    // 生成唯一ID
    template.id = 'custom_' + Date.now();
    
    try {
      const result = await chrome.storage.local.get('customTemplates');
      const customTemplates = result.customTemplates || [];
      customTemplates.push(template);
      
      await chrome.storage.local.set({ customTemplates });
      this.templates.push(template);
      
      return template;
    } catch (error) {
      console.error('保存自定义模板失败:', error);
      throw error;
    }
  }

  // 更新模板
  async updateTemplate(id, updates) {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return null;

    // 只允许更新自定义模板
    if (!id.startsWith('custom_')) {
      throw new Error('不能修改预设模板');
    }

    const updatedTemplate = {
      ...this.templates[index],
      ...updates
    };

    try {
      const result = await chrome.storage.local.get('customTemplates');
      const customTemplates = result.customTemplates || [];
      const customIndex = customTemplates.findIndex(t => t.id === id);
      
      if (customIndex !== -1) {
        customTemplates[customIndex] = updatedTemplate;
        await chrome.storage.local.set({ customTemplates });
        this.templates[index] = updatedTemplate;
      }

      return updatedTemplate;
    } catch (error) {
      console.error('更新模板失败:', error);
      throw error;
    }
  }

  // 删除模板
  async deleteTemplate(id) {
    // 只允许删除自定义模板
    if (!id.startsWith('custom_')) {
      throw new Error('不能删除预设模板');
    }

    try {
      const result = await chrome.storage.local.get('customTemplates');
      const customTemplates = result.customTemplates || [];
      const filteredTemplates = customTemplates.filter(t => t.id !== id);
      
      await chrome.storage.local.set({ customTemplates: filteredTemplates });
      this.templates = this.templates.filter(t => t.id !== id);
      
      return true;
    } catch (error) {
      console.error('删除模板失败:', error);
      throw error;
    }
  }
}

export const templateManager = new TemplateManager(); 