import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const TeatrAbsurdu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{t('teatr.meta.title')} | Adamowo</title>
        <meta name="description" content={t('teatr.meta.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
        {/* Theater Poster Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900 to-red-800 opacity-90" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.05) 10px, rgba(0,0,0,.05) 20px)',
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
            {/* Decorative masks */}
            <div className="text-6xl mb-4 opacity-30">🎭</div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-amber-50 mb-4 tracking-wide uppercase">
              {t('teatr.title')}
            </h1>

            <p className="text-2xl md:text-3xl text-amber-100 italic mb-2">{t('teatr.subtitle')}</p>

            <div className="mt-6 text-lg text-amber-200">{t('teatr.tagline')}</div>

            {/* Decorative bottom mask */}
            <div className="text-6xl mt-8 opacity-30">🎭</div>
          </div>

          {/* Golden border */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        </div>

        {/* Warning Notice */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-md">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-bold text-yellow-800 mb-2">{t('teatr.warning.title')}</p>
                <p className="text-yellow-700">{t('teatr.warning.content')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acts Menu */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Act 1: Full Play */}
            <div
              onClick={() => navigate('/teatr-absurdu/spektakl')}
              className="group bg-white p-8 border-4 border-yellow-600 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-6xl text-center mb-4">📜</div>
              <h2 className="font-serif text-2xl font-bold text-red-900 text-center mb-4">
                {t('teatr.acts.fullPlay.title')}
              </h2>
              <p className="text-gray-700 text-center mb-6">
                {t('teatr.acts.fullPlay.description')}
              </p>
              <button className="w-full bg-red-900 text-amber-50 py-3 px-6 rounded font-bold border-2 border-yellow-600 hover:bg-yellow-600 hover:text-red-900 transition-colors">
                {t('teatr.acts.fullPlay.button')}
              </button>
            </div>

            {/* Act 2: Fight Analysis */}
            <div
              onClick={() => navigate('/teatr-absurdu/analiza')}
              className="group bg-white p-8 border-4 border-yellow-600 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-6xl text-center mb-4">⚔️</div>
              <h2 className="font-serif text-2xl font-bold text-red-900 text-center mb-4">
                {t('teatr.acts.analysis.title')}
              </h2>
              <p className="text-gray-700 text-center mb-6">
                {t('teatr.acts.analysis.description')}
              </p>
              <button className="w-full bg-red-900 text-amber-50 py-3 px-6 rounded font-bold border-2 border-yellow-600 hover:bg-yellow-600 hover:text-red-900 transition-colors">
                {t('teatr.acts.analysis.button')}
              </button>
            </div>

            {/* Act 3: Documentary */}
            <div
              onClick={() => navigate('/dokumenty')}
              className="group bg-white p-8 border-4 border-yellow-600 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-6xl text-center mb-4">⚖️</div>
              <h2 className="font-serif text-2xl font-bold text-red-900 text-center mb-4">
                {t('teatr.acts.documentary.title')}
              </h2>
              <p className="text-gray-700 text-center mb-6">
                {t('teatr.acts.documentary.description')}
              </p>
              <button className="w-full bg-red-900 text-amber-50 py-3 px-6 rounded font-bold border-2 border-yellow-600 hover:bg-yellow-600 hover:text-red-900 transition-colors">
                {t('teatr.acts.documentary.button')}
              </button>
            </div>
          </div>
        </div>

        {/* Context Note */}
        <div className="max-w-4xl mx-auto px-4 py-8 mb-12">
          <div className="bg-gray-50 border-l-4 border-red-900 p-8 rounded-r-lg shadow-md">
            <h3 className="font-serif text-2xl font-bold text-red-900 mb-4">
              📖 {t('teatr.context.title')}
            </h3>
            <p className="text-gray-700 mb-4">{t('teatr.context.paragraph1')}</p>
            <p className="text-gray-700 mb-4">
              <strong>{t('teatr.context.question')}</strong> {t('teatr.context.answer')}
            </p>
            <p className="text-gray-700">
              <a
                href="/o-sprawie"
                className="text-red-900 font-bold hover:text-yellow-600 transition-colors"
              >
                → {t('teatr.context.link')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeatrAbsurdu;
