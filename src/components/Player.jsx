import { useState } from 'react';

export default function Player({name, symbol, isActive, handlePlayerChange}) {
    const [isEditing, setIsEditing] = useState(false);
    const [playerName, setPlayerName] = useState(name);
    const handleEditClick = () => {
      setIsEditing(isEditing => !isEditing);
      if(isEditing) {
        handlePlayerChange(symbol,playerName);
      }
    }
    const handleNameChange = e => {
      setPlayerName(e.target.value);
    }
    const playerNameDisplay = <span className="player-name">{playerName}</span>
  const editablePlayerName = <input type="text" required value={playerName} onChange={handleNameChange} />
    return (
        <li className={isActive ? 'active' : undefined}>
            <span className="player">
                {isEditing ? editablePlayerName : playerNameDisplay}
                <span className="player-symbol">{symbol}</span>
            </span>
          <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
       </li>
    )
}