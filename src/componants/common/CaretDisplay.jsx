import React from "react";
import redCaret from "/assets/siteimage/redchilli.jpg";
import blackCaret from "/assets/siteimage/blackchilli.jpg";

const CaretDisplay = ({ value, className,style }) => {
  const maxValue = 5;
  const roundedValue = Math.round(value);
  return (
    <div className={`rarity flex ${className}`} style={style}>
      {[...Array(maxValue)].map((_, index) => (
        <>
          <div>
            <img
              key={index}
              src={index < roundedValue ? redCaret : blackCaret}
              alt={index < roundedValue ? "Red Caret" : "Black Caret"}
            />
          </div>
        </>
      ))}
    </div>
  );
};

export default CaretDisplay;
