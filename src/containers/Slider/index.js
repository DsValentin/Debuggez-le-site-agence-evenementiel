import React, { useEffect, useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

  const nextCardTimeoutRef = useRef(null);

  const nextCard = () => {
    if (byDateDesc && byDateDesc.length > 0) {
      nextCardTimeoutRef.current = setTimeout(
        () =>
          setIndex((prevIndex) =>
            prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
          ),
        5000
      );
    }
  };

  const handleBulletClick = (idx) => {
    setIndex(idx);
    // Effacer le timeout lorsque l'utilisateur interagit avec les bullets
    clearTimeout(nextCardTimeoutRef.current);
  };

  useEffect(() => {
    nextCard();

    // Nettoyer le timeout lors du démontage du composant
    return () => {
      clearTimeout(nextCardTimeoutRef.current);
    };
  }, [index]); // On inclut index dans les dépendances pour forcer l'effet à se déclencher à chaque changement de slide

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={event.title}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt={event.title} />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((bullet, radioIdx) => (
            <input
              key={`${bullet.title}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handleBulletClick(radioIdx)}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
