// 样式编辑器类
export class StyleEditor {
  constructor(container, template) {
    this.container = container;
    this.template = template;
    this.previewElement = null;
    this.selectedText = '';
    
    // 初始化编辑器
    this.init();
  }

  // 初始化编辑器
  init() {
    this.initPreview();
    this.initControls();
    this.bindEvents();
  }

  // 初始化预览区域
  initPreview() {
    // 创建预览尺寸控制
    const sizeControls = document.createElement('div');
    sizeControls.className = 'preview-size-controls';
    sizeControls.innerHTML = `
      <label>宽度:</label>
      <input type="number" id="previewWidth" value="100" min="30" max="100">
      <label>%</label>
    `;
    
    // 创建预览容器
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview';
    
    // 创建预览元素
    this.previewElement = document.createElement('div');
    this.previewElement.className = 'card-preview';
    this.previewElement.contentEditable = 'true';
    
    // 创建预览控制器
    const previewControls = document.createElement('div');
    previewControls.className = 'preview-controls';
    previewControls.innerHTML = `
      <button id="resetSize">重置大小</button>
      <button id="copyText">复制文本</button>
    `;
    
    // 组装预览区域
    previewContainer.appendChild(this.previewElement);
    previewContainer.appendChild(previewControls);
    
    // 添加到编辑器容器
    const previewSection = this.container.querySelector('.preview');
    previewSection.appendChild(sizeControls);
    previewSection.appendChild(previewContainer);
    
    // 绑定预览相关事件
    this.bindPreviewEvents();
  }

  // 初始化控制器
  initControls() {
    // 背景控制
    this.bgTypeSelect = document.getElementById('bgType');
    this.bgValueContainer = document.getElementById('bgValueContainer');
    this.updateBackgroundControls(this.template.styles.background.type);

    // 文字控制
    this.fontFamilySelect = document.getElementById('fontFamily');
    this.fontSizeInput = document.getElementById('fontSize');
    this.fontColorInput = document.getElementById('fontColor');
    
    // 布局控制
    this.textAlignSelect = document.getElementById('textAlign');
    this.paddingInput = document.getElementById('padding');

    // 设置初始值
    this.setInitialValues();
  }

  // 设置初始值
  setInitialValues() {
    const { styles } = this.template;
    
    // 背景设置
    this.bgTypeSelect.value = styles.background.type;
    this.updateBackgroundValue(styles.background.value);
    
    // 文字设置
    this.fontFamilySelect.value = styles.text.font;
    this.fontSizeInput.value = parseInt(styles.text.size);
    this.fontColorInput.value = styles.text.color;
    
    // 布局设置
    this.textAlignSelect.value = styles.text.align;
    this.paddingInput.value = parseInt(styles.container.padding);
  }

  // 更��背景控制器
  updateBackgroundControls(type) {
    let html = '';
    switch (type) {
      case 'color':
        html = '<input type="color" id="bgColor">';
        break;
      case 'gradient':
        html = `
          <input type="color" id="gradientColor1">
          <input type="color" id="gradientColor2">
          <select id="gradientDirection">
            <option value="to right">从左到右</option>
            <option value="to bottom">从上到下</option>
            <option value="45deg">45度</option>
            <option value="135deg">135度</option>
          </select>
        `;
        break;
      case 'image':
        html = '<input type="file" id="bgImage" accept="image/*">';
        break;
    }
    this.bgValueContainer.innerHTML = html;
  }

  // 更新背景值
  updateBackgroundValue(value) {
    const type = this.bgTypeSelect.value;
    switch (type) {
      case 'color':
        document.getElementById('bgColor').value = value;
        break;
      case 'gradient':
        // 解析渐变值
        const colors = value.match(/#[a-f\d]{6}/gi);
        if (colors) {
          document.getElementById('gradientColor1').value = colors[0];
          document.getElementById('gradientColor2').value = colors[1];
        }
        break;
    }
  }

  // 绑定事件
  bindEvents() {
    // 背景类型变更
    this.bgTypeSelect.addEventListener('change', (e) => {
      this.updateBackgroundControls(e.target.value);
      this.updatePreview();
    });

    // 文字样式变更
    this.fontFamilySelect.addEventListener('change', () => this.updatePreview());
    this.fontSizeInput.addEventListener('input', () => this.updatePreview());
    this.fontColorInput.addEventListener('input', () => this.updatePreview());
    
    // 布局变更
    this.textAlignSelect.addEventListener('change', () => this.updatePreview());
    this.paddingInput.addEventListener('input', () => this.updatePreview());

    // 背景值变更事件
    this.bgValueContainer.addEventListener('change', () => this.updatePreview());
    this.bgValueContainer.addEventListener('input', () => this.updatePreview());
  }

  // 更新预览
  updatePreview() {
    const styles = this.getCurrentStyles();
    // 添加更新动画
    this.previewElement.style.transition = 'all 0.3s ease';
    this.applyStyles(styles);
  }

  // 获取当前样式
  getCurrentStyles() {
    const styles = {
      background: {
        type: this.bgTypeSelect.value,
        value: this.getBackgroundValue()
      },
      text: {
        font: this.fontFamilySelect.value,
        size: `${this.fontSizeInput.value}px`,
        color: this.fontColorInput.value,
        align: this.textAlignSelect.value,
        lineHeight: this.template.styles.text.lineHeight,
        letterSpacing: this.template.styles.text.letterSpacing
      },
      container: {
        padding: `${this.paddingInput.value}px`,
        borderRadius: this.template.styles.container.borderRadius,
        boxShadow: this.template.styles.container.boxShadow
      }
    };

    return styles;
  }

  // 获取背景值
  getBackgroundValue() {
    const type = this.bgTypeSelect.value;
    switch (type) {
      case 'color':
        return document.getElementById('bgColor').value;
      case 'gradient': {
        const color1 = document.getElementById('gradientColor1').value;
        const color2 = document.getElementById('gradientColor2').value;
        const direction = document.getElementById('gradientDirection').value;
        return `linear-gradient(${direction}, ${color1}, ${color2})`;
      }
      case 'image':
        // 处理图片背景
        const fileInput = document.getElementById('bgImage');
        return fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : '';
    }
  }

  // 应用样式
  applyStyles(styles) {
    const { background, text, container } = styles;
    
    // 应用背景
    if (background.type === 'image') {
      this.previewElement.style.backgroundImage = `url(${background.value})`;
      this.previewElement.style.backgroundSize = 'cover';
      this.previewElement.style.backgroundPosition = 'center';
    } else if (background.type === 'gradient') {
      this.previewElement.style.backgroundImage = background.value;
    } else {
      this.previewElement.style.backgroundColor = background.value;
    }

    // 应用文字样式
    Object.assign(this.previewElement.style, {
      fontFamily: text.font,
      fontSize: text.size,
      color: text.color,
      textAlign: text.align,
      lineHeight: text.lineHeight,
      letterSpacing: text.letterSpacing
    });

    // 应用容器样式
    Object.assign(this.previewElement.style, {
      padding: container.padding,
      borderRadius: container.borderRadius,
      boxShadow: container.boxShadow
    });
  }

  // 设置预览文本
  setPreviewText(text) {
    this.selectedText = text;
    this.previewElement.textContent = text;
    this.updatePreview();
    
    // 添加文本设置动画
    this.previewElement.style.opacity = '0';
    requestAnimationFrame(() => {
      this.previewElement.style.opacity = '1';
    });
  }

  // 获取当前样式数据
  getStyleData() {
    return this.getCurrentStyles();
  }

  // 添加预览事件绑定
  bindPreviewEvents() {
    // 预览尺寸调整
    const widthInput = document.getElementById('previewWidth');
    widthInput.addEventListener('input', (e) => {
      this.previewElement.style.width = `${e.target.value}%`;
    });
    
    // 重置大小
    document.getElementById('resetSize').addEventListener('click', () => {
      widthInput.value = '100';
      this.previewElement.style.width = '100%';
    });
    
    // 复制文本
    document.getElementById('copyText').addEventListener('click', () => {
      navigator.clipboard.writeText(this.previewElement.textContent)
        .then(() => {
          // 显示复制成功提示
          const button = document.getElementById('copyText');
          const originalText = button.textContent;
          button.textContent = '已复制';
          setTimeout(() => {
            button.textContent = originalText;
          }, 1500);
        });
    });
    
    // 文本编辑
    this.previewElement.addEventListener('focus', () => {
      this.previewElement.classList.add('editing');
    });
    
    this.previewElement.addEventListener('blur', () => {
      this.previewElement.classList.remove('editing');
      this.selectedText = this.previewElement.textContent;
    });
    
    // 添加输入防抖
    this.previewElement.addEventListener('input', this.debounce(() => {
      this.selectedText = this.previewElement.textContent;
      this.updatePreview();
    }, 300));
  }

  // 添加防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
} 