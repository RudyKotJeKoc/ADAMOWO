import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SpektaklPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dom z Papieru i Pianki - Spektakl Pełny | Adamowo</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/teatr-absurdu"
            className="inline-block mb-8 text-red-900 hover:text-yellow-600 font-bold"
          >
            ← Powrót do menu
          </Link>

          <div className="bg-red-900 text-amber-50 p-8 text-center border-4 border-yellow-600 mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              DOM Z PAPIERU I PIANKI MONTAŻOWEJ
            </h1>
            <p className="text-xl italic">Kabaret Rodzinny w Trzech Aktach</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg prose prose-lg max-w-none">
            <h2>🎭 Spektakl w przygotowaniu</h2>
            <p>
              Pełny tekst spektaklu zostanie wkrótce opublikowany. Pracujemy nad formatowaniem
              trzech aktów, prologu i epilogu.
            </p>
            <p>Tymczasem zapraszamy do zapoznania się z:</p>
            <ul>
              <li>
                <Link to="/teatr-absurdu/analiza" className="text-red-900 hover:text-yellow-600">
                  Analizą Przedmeczową
                </Link>
              </li>
              <li>
                <Link to="/dokumenty" className="text-red-900 hover:text-yellow-600">
                  Wersją dokumentalną
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpektaklPage;
