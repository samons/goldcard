// 预设模板数据
export const defaultTemplates = [
  {
    id: 'simple',
    name: '简约',
    thumbnail: 'assets/templates/simple.png',
    styles: {
      background: {
        type: 'color',
        value: '#ffffff'
      },
      text: {
        font: 'Microsoft YaHei',
        size: '24px',
        color: '#333333',
        lineHeight: '1.5',
        align: 'center',
        letterSpacing: '1px'
      },
      container: {
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    }
  },
  {
    id: 'vintage',
    name: '复古',
    thumbnail: 'assets/templates/vintage.png',
    styles: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(45deg, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)'
      },
      text: {
        font: 'SimSun',
        size: '20px',
        color: '#4a4a4a',
        lineHeight: '2',
        align: 'left',
        letterSpacing: '2px'
      },
      container: {
        padding: '50px',
        border: '2px solid #8b8b8b',
        borderRadius: '0'
      }
    }
  },
  {
    id: 'modern',
    name: '现代',
    thumbnail: 'assets/templates/modern.png',
    styles: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)'
      },
      text: {
        font: 'Helvetica',
        size: '28px',
        color: '#ffffff',
        lineHeight: '1.6',
        align: 'center',
        letterSpacing: '0.5px'
      },
      container: {
        padding: '60px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.1)'
      }
    }
  }
]; 