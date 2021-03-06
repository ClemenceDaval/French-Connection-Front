import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './navBar.scss';
import network from 'src/assets/pictures/network.png';
import profile from 'src/assets/pictures/profile.png';
import search from 'src/assets/pictures/search.png';

const NavBar = ({ isConnected, toggleLogIn }) => { 
  const openLogIn = () => {
    toggleLogIn(true);
  };

  return (
    <div className="navBar">
      <ul className="navBar__list">
        <li className={isConnected === true ? 'navBar__item__hidden' : 'navBar__item'} onClick={openLogIn}>
          <button type="button" className="navBar__item__button">
            <img className="navBar__item__image" src={profile} alt="Logo profil" />
            <div className="navBar__item__title"> Se connecter </div>
          </button>
        </li>
        <li className={isConnected === true ? 'navBar__item' : 'navBar__item__hidden'}>
          <NavLink to="/mon-profil">
            <img className="navBar__item__image" src={profile} alt="Logo profil" />
            <div className="navBar__item__title"> Mon profil </div>
          </NavLink>
        </li>
        <li className="navBar__item">
          <NavLink to="/notre-reseau">
            <img className="navBar__item__image" src={network} alt="Logo reseau" />
            <div className="navBar__item__title"> Notre Réseau  </div>
          </NavLink>
        </li>
        <li className="navBar__item">
          <NavLink to="/">
            <img className="navBar__item__image" src={search} alt="Logo recherche" />
            <div className="navBar__item__title"> Rechercher  </div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

NavBar.propTypes = {
  isConnected: PropTypes.oneOf(['checking', true, false]).isRequired,
  toggleLogIn: PropTypes.func.isRequired,
};

export default NavBar;
