import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AnalizaPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Adamski kontra Adamska - Analiza Przedmeczowa | Adamowo</title>
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
              ADAMSKI KONTRA ADAMSKA
            </h1>
            <p className="text-xl italic">Analiza Przedmeczowa: Starcie o Dom z Papieru i Pianki</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg prose prose-lg max-w-none">
            <h2>⚔️ Analiza w przygotowaniu</h2>
            <p>
              Szczegółowe zestawienie sił, taktyk i uzbrojenia obu stron konfliktu zostanie wkrótce
              opublikowane.
            </p>
            <p>Tymczasem zapraszamy do zapoznania się z:</p>
            <ul>
              <li>
                <Link to="/teatr-absurdu/spektakl" className="text-red-900 hover:text-yellow-600">
                  Pełnym spektaklem
                </Link>
              </li>
              <li>
                <Link to="/o-sprawie" className="text-red-900 hover:text-yellow-600">
                  Chronologią wydarzeń
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalizaPage;
