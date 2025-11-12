import React from 'react';

interface ShopPromoBoxProps {
  language: string;
}

const translations = {
  ro: "Planse magnetice Timp, Emotii, Vreme, Reguli Circulatie, Harta Prieteniei",
  en: "Magnetic Boards: Time, Emotions, Weather, Traffic Rules, Friendship Map",
  hu: "Mágneses Táblák: Idő, Érzelmek, Időjárás, Közlekedési Szabályok, Barátság Térkép",
  de: "Magnettafeln: Zeit, Emotionen, Wetter, Verkehrsregeln, Freundschaftskarte",
  es: "Láminas magnéticas: Tiempo, Emociones, Clima, Reglas de Tráfico, Mapa de Amistad",
  it: "Tavole magnetiche: Tempo, Emozioni, Meteo, Regole Stradali, Mappa dell'Amicizia",
  fr: "Planches magnétiques: Temps, Émotions, Météo, Règles de Circulation, Carte de l'Amitié",
  ru: "Магнитные доски: Время, Эмоции, Погода, Правила дорожного движения, Карта дружбы",
  el: "Μαγνητικοί Πίνακες: Χρόνος, Συναισθήματα, Καιρός, Κανόνες Κυκλοφορίας, Χάρτης Φιλίας",
  bg: "Магнитни табла: Време, Емоции, Времето, Правила за движение, Карта на приятелството",
  pl: "Plansze magnetyczne: Czas, Emocje, Pogoda, Zasady ruchu drogowego, Mapa przyjaźni",
  ar: "لوحات مغناطيسية: الوقت، العواطف، الطقس، قواعد المرور، خريطة الصداقة",
  cs: "Magnetické tabule: Čas, Emoce, Počasí, Dopravní předpisy, Mapa přátelství",
  pt: "Placas magnéticas: Tempo, Emoções, Clima, Regras de Trânsito, Mapa da Amizade"
};

const ShopPromoBox: React.FC<ShopPromoBoxProps> = ({ language }) => {
  const handleClick = () => {
    window.open('https://copilul-meu.numlit.eu/search/generatia/all/', '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes rainbow-border {
          0% { border-color: hsl(0, 70%, 60%); }
          16.66% { border-color: hsl(60, 70%, 60%); }
          33.33% { border-color: hsl(120, 70%, 60%); }
          50% { border-color: hsl(180, 70%, 60%); }
          66.66% { border-color: hsl(240, 70%, 60%); }
          83.33% { border-color: hsl(300, 70%, 60%); }
          100% { border-color: hsl(0, 70%, 60%); }
        }
        
        @keyframes rainbow-text {
          0% { color: hsl(0, 70%, 50%); }
          16.66% { color: hsl(60, 70%, 50%); }
          33.33% { color: hsl(120, 70%, 50%); }
          50% { color: hsl(180, 70%, 50%); }
          66.66% { color: hsl(240, 70%, 50%); }
          83.33% { color: hsl(300, 70%, 50%); }
          100% { color: hsl(0, 70%, 50%); }
        }
        
        .rainbow-border-animation {
          border: 3px solid;
          animation: rainbow-border 3s linear infinite;
        }
        
        .rainbow-text-animation {
          animation: rainbow-text 4s linear infinite;
        }
      `}</style>
      <div 
        onClick={handleClick}
        className="relative cursor-pointer p-1 bg-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 select-none rainbow-border-animation text-center"
        style={{ height: '280px', width: '120%' }}
      >
        <div className="h-full flex items-center justify-center px-2">
          <p className="text-2xl font-bold rainbow-text-animation leading-tight break-words">
            {translations[language as keyof typeof translations] || translations.ro}
          </p>
        </div>
      </div>
    </>
  );
};

export default ShopPromoBox;