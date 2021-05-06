import React from 'react';

// == import local
import ProfileDescription from 'src/components/ProfilDescription';
import ContactMe from 'src/components/ContactMe';
import UserInfos from 'src/components/UserInfos';
import Services from 'src/components/Services';
import ResidentMap from 'src/components/ResidentMap';
import ModifyButton from 'src/components/ModifyButton';
import HelperButton from 'src/components/HelperButton';


// == import style 
import './profile.scss';


const Profile = ({ isMyProfile }) => (

  // ----- Profil's Card -----

  <div className="profile">
    { isMyProfile && <HelperButton /> }
    <div className="profile__title"> {isMyProfile ? 'Mon profil' : 'Le nom du helpeur/voyageur'} </div>
    <div className="profile__all">
      <div className="profile__left">
        <div className="member">
          <div className="member__name">Jean-José</div>
          <div className="member__date"> Membre depuis Mars 2018 </div>
          <div className="member__image" />
          <div className="member__update">Mettre à jour votre photo</div>
          <div className="member__infos">Massy-Palaiseau, France</div>
        </div>
        { !isMyProfile && <ContactMe /> }
        <ResidentMap />
        { isMyProfile && <UserInfos /> }
        <ModifyButton />
      </div>
      <div className="profile__right">
        <ProfileDescription />
        <Services />
      
      </div>
    </div>

  </div>
);

export default Profile;
