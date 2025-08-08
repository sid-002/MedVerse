import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TranslationPage from './pages/TranslationPage';
import SignLanguagePage from './pages/SignLanguagePage';
import PrescriptionPage from './pages/PrescriptionPage';
import ConsultationPage from './pages/ConsultationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/translation" element={<TranslationPage />} />
            <Route path="/sign-language" element={<SignLanguagePage />} />
            <Route path="/prescription" element={<PrescriptionPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;