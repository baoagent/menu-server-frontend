import { getMenuPdf } from './api.ts';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
          <div className="language-switcher">
          <button className={i18n.language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>English</button>
          <button className={i18n.language === 'zh' ? 'active' : ''} onClick={() => changeLanguage('zh')}>中文</button>
          <button className={i18n.language === 'es' ? 'active' : ''} onClick={() => changeLanguage('es')}>Español</button>
        </div>
        <div className="pdf-generator">
          <button onClick={handleGeneratePdf}>{t('generate_pdf')}</button>
        </div>
        </header>
        <div className="container">
          <div className="section-card">
            <h1 className="section-title">{t('menu')}</h1>
            <Routes>
              <Route path="/" element={<MenuList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;