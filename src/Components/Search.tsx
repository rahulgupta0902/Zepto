import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './style.css';

//Importing the type of user and the chip from index.ts in Types folder 
import { User, Chip } from '../Types/index';
import { dummyUsers } from '../Assets/Content';

// A compare function which compares on the basis of name
function compare(a : User,b : User) : number{
   return a.name.localeCompare(b.name)
}

const SeacrhComponent: React.FC = () => {
 
  const [focus, setFocus] = useState<boolean>(false)
  //State for the input field 
  const [inputValue, setInputValue] = useState<string>('');

  //State for managing the selelcted users
  const [chips, setChips] = useState<Chip[]>([]);

  //State to show the filtered Users
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  //Using the useRef Hook for the input textfield 
  const inputRef = useRef<HTMLInputElement>(null);

  //Assingi the dummyUsers which we generated in the content.tsx file in Assets folder 
  const users: User[] = dummyUsers;

  useEffect(() => {
    console.log(focus)
    setFilteredUsers(
      users
        .filter(
          user => !chips.find(chip => chip.user.id === user.id)
        )
        .sort(compare) // Sort alphabetically
    );
  }, [chips, users,focus]);


  //Handling the input change in the inputfield and not showing the users which are already selected 
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    //if the input field is zero show the users 
    if(value.length == 0){
      setFilteredUsers(
        users
          .filter(
            user => !chips.find(chip => chip.user.id === user.id) 
          )
          .sort(compare) // Sort alphabetically
      )

    }
    else{
    setFilteredUsers(
      users
        .filter(
          user => !chips.find(chip => chip.user.id === user.id) && (
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
          )
        )
        .sort(compare) // Sort alphabetically
    );
          }
  };
  
  //Adding the Chip
  const handleUserClick = (user: User) => {
    setChips([...chips, { id: chips.length + 1, user }]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  //Removing the Chip
  const handleChipRemove = (id: number) => {
    setChips(chips.filter(chip => chip.id !== id));
  };

  //Using Backsapce for Removing
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      // Highlight and remove the last chip on backspace press when input is empty
      const lastChip = chips[chips.length - 1];
      handleChipRemove(lastChip.id);
    }
  };

  //Using focus when clicked in the input field shows the dropdown list
  const onFocuss = () =>{
    setFocus(true)
  }

  const card = (chip : Chip) => {
    return (
      <div key={chip.id} className="chip">
      <img className="imgsrc" src={chip.user.profilePicture} alt="Profile" />
      <span>{chip.user.name} ({chip.user.email})</span>
      <button onClick={() => handleChipRemove(chip.id)}>X</button>
    </div>
    )
  }

  const dropDownCard = (user : User) => {
    return (
    <div key={user.id} onClick={() => handleUserClick(user)} className="autocomplete-item">
      <img className='imgsrc' src={user.profilePicture} alt="Profile" />
      <span>{user.name} ({user.email})</span>
    </div>
    )
  }

  return (
    <div className="autocomplete-chips">

      {/* Selected Chips Container */}
      <div className="chips-container">
        {chips.map(chip => (card(chip)))}
      </div>

      {/* //Input Field for Search  */}
      <input ref={inputRef} type="text" placeholder='Type Your Text Here !!' value={inputValue} onChange={handleInputChange} onKeyDown={handleInputKeyDown} onFocus={onFocuss}/>
      
      {/* // DropDown Container and List */}
      {inputValue && filteredUsers.length === 0 && (
        <div className="no-results">No results found</div>
      )}
      {filteredUsers.length > 0 && focus && (
        <div className="autocomplete-dropdown">
          {filteredUsers.map(user => ( dropDownCard(user)))}
        </div>
      )}

    </div>
  );
};

export default SeacrhComponent;
