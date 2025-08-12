import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMenuPdf } from './api.ts';
import MenuList from './components/MenuList.tsx';
import './App.css';
import i18n from './i18n';
import porkBunIcon from './assets/porkBunIcon.png'; // Import the icon

function App() {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleGeneratePdf = async () => {
    try {
      const response = await getMenuPdf();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'menu.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        
        <header className="app-header">
          <img src={porkBunIcon} alt="Pork Bun Icon" className="app-icon" />
          <div className="app-title-group">
            <h1 className="app-title">{t('bao_agent')}</h1>
            <p className="app-subtitle">{t('menu_management')}</p>
          </div>
          <div className="header-actions">
            <div className="language-switcher">
            <button className={i18n.language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>English</button>
            <button className={i18n.language === 'zh' ? 'active' : ''} onClick={() => changeLanguage('zh')}>中文</button>
            <button className={i18n.language === 'es' ? 'active' : ''} onClick={() => changeLanguage('es')}>Español</button>
          </div>
          <div className="pdf-generator">
            <button onClick={handleGeneratePdf}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
              {t('generate_pdf')}
            </button>
          </div>
          </div>
        </header>
        <div className="section-card">
          <h1 className="section-title">{t('menu')}</h1>
          <Routes>
            <Route path="/" element={<MenuList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;