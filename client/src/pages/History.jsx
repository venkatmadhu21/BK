import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const History = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white rounded-xl shadow-lg p-12 max-w-2xl mx-auto">
        <div className="mb-6">
          <BookOpen size={80} className="mx-auto text-primary-600 mb-4" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('history.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('history.subtitle')}
        </p>
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <p className="text-lg text-primary-700 font-medium">
            📜 {t('history.title')}
          </p>
          <p className="text-sm text-primary-600 mt-2">
            {t('history.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;