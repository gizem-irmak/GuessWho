import React from 'react';
import '../App.css';

const Item = ({ item, isEnabled, onSelectItem, isWin, isLost }) => {
  const handleItemClick = () => {
    if (isEnabled && !isWin && !isLost) {
      onSelectItem(item);
    }
  };

  return (
    <div
      className={`item ${isEnabled ? '' : 'disabled'}`}
      onClick={handleItemClick}
    >
      <img src={item.image_url} alt="Item" className="animal" />
    </div>
  );
};

export default Item;

