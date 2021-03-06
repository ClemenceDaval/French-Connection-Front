/* eslint-disable no-console */
import axios from 'axios';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

import {
  LOAD_USER_PROFILE,
  LOAD_USERS_CARDS,
  LOAD_USERS_REVIEWS,
  saveUserProfile,
  saveUsersCards,
  saveUsersReviews,
} from 'src/actions/user';

import {
  LOG_IN,
  LOAD_CONNECTED_USER_DATA,
  LOG_OUT,
  saveConnectedUserId,
  saveConnectedUserData,
  saveTokenInState,
  setIsConnected,
  resetPassword
} from 'src/actions/log';

import {
  LOAD_USERS_BY_COUNTRY,
  saveUsersList,
  saveUsersCities,
  loadingCities,
  saveUsersCity,
} from 'src/actions/map';

import {
  LOAD_HOBBIES_LIST,
  saveHobbiesList,
  setLoadingHobbies,
} from 'src/actions/hobbies';

import {
  LOAD_SERVICES_LIST,
  saveServicesList,
  setLoadingServices,
} from 'src/actions/services';

import {
  toggleLogIn,
  toggleLogOut,
  toggleSignIn
} from 'src/actions/modals';

import {
  MODIFY_PROFILE,
  redirectToMyProfile,
  saveModifiedConnectedUserData,
  resetCityField,
} from 'src/actions/modifyForm';

import {
  setLoading,
  setMyProfileLoading,
} from 'src/actions/loading';

import {
  ADD_NEW_USER,
  resetSignInFields
} from 'src/actions/signIn';

const api = axios.create({
  baseURL: 'http://ec2-34-239-254-34.compute-1.amazonaws.com/api/v1/',
});

export default (store) => (next) => (action) => {
  switch (action.type) {
    
    // Creation of a new user
    case ADD_NEW_USER: {
      const state = store.getState();
      const {
        firstname, lastname, email, password, confirmedPassword,
      } = state.signIn;
      api
        .post(
          '/user',
          {
            firstname,
            lastname,
            email,
            confirmedPassword,
            password,
          },
        )
        .then((response) => {
          toast.info('Inscription réussie. Veuillez vous connecter');
          store.dispatch(toggleSignIn(false));
          store.dispatch(resetSignInFields());
        }).catch((error) => {
          console.log(error);
          toast.info('Un problème est survenu');
        });
      next(action);
      break;
    }

    case LOAD_USER_PROFILE: {
      // CONNECTED USER ONLY
      const userToken = localStorage.getItem('token');
      // SET LOADER TO TRUE
      store.dispatch(setLoading(true));
      // RETRIEVE ID FROM ACTION TO DETERMINE WHICH ENDPOINT
      const idParam = (action.userId);
      
      // REQUEST
      api
        .get(`/user/${idParam}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        // RESPONSE
        .then((response) => {
          const userInfos = response.data;
          // SAVE OF USER INFOS IN STATE
          store.dispatch(saveUserProfile(userInfos));
          // SET LOADER TO FALSE
          store.dispatch(setLoading(false));
        // ERROR
        }).catch((error) => {
          const errorStatus = error.response.status;
          if (errorStatus === 401) {
            window.location.href = '/403';
          }
          if (errorStatus === 404) {
            window.location.href = '/404';
          }
        });
      next(action);
      break;
    }

    case LOG_IN: {
      // connexion de l'utilisateur
      // on extrait l'email et le password du state
      const state = store.getState();
      const { email: username, password } = state.log;

      api
        .post(
          '/login',
          {
            username,
            password,
          },
        )
        .then((response) => {
          // on récupère le token et on paramètre axios pour le faire apparaitre dans notre header
          const userToken = (response.data.token);
          console.log(userToken);

          // on stocke le token dans le localStorage
          localStorage.setItem('token', (userToken));

          // on configure Axios
          api.defaults.headers.common.Authorization = `Bearer ${userToken}`;

          // on stocke le token dans le state
          store.dispatch(saveTokenInState(userToken));

          // on décode le token pour aller chercher son id
          const decodedToken = jwt_decode(userToken);

          // on sauvegarde l'id de l'utilisateur
          store.dispatch(saveConnectedUserId(decodedToken.id));

          // on ferme le modal de logIn et on passe en connecté
          store.dispatch(setIsConnected(true));
          store.dispatch(toggleLogIn(false));

          // on informe l'utilisateur qu'il est connecté
          toast.info('Vous êtes maintenant connectés');
        }).catch((error) => {
          console.log(error);
          console.log('Vous n\'avez pas pu être identifié');
          toast.info('Vous n\'avez pas pu être identifié');
        });
      next(action);
      break;
    }

    case LOAD_CONNECTED_USER_DATA: {
      const { id } = action;
      const userToken = localStorage.getItem('token');
      store.dispatch(setMyProfileLoading(false));

      api
        .get(`/user/${id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          console.log(userToken);
          const connectedUserInfos = response.data;
          console.log(connectedUserInfos);
          // on sauvegarde ces infos
          store.dispatch(saveConnectedUserData(connectedUserInfos));
          // gestion du loader dans la page profil
          console.log('on load les infos de l\'utilisateur');
          store.dispatch(setMyProfileLoading(true));
        }).catch((error) => {
          store.dispatch(setMyProfileLoading(true));
          // eslint-disable-next-line no-console
          const errorStatus = error.response.status;
          // console.log(error.response.status);
          console.log('vous ne passerez pas');
          // if (errorStatus === 401) {
          //   window.location.href = '/403';
          // }
          // if (errorStatus === 404) {
          //   window.location.href = '/404';
          // }
        });
      // puis on décide si on la laisse filer ou si on la bloque
      next(action);
      break;
    }
    
    case LOAD_USERS_CARDS:
      // affichage de tous les profils sous forme de cards

      api
        .get('user')
        .then((response) => {
          console.log(response);
          const usersList = response.data;
          store.dispatch(saveUsersCards(usersList));
        }).catch((error) => {
        // eslint-disable-next-line no-console
          console.log(error);
        })
        // -- gestion loader for profilPage
        .finally(() => {
          store.dispatch(setLoading(false));
        });

      // puis on décide si on la laisse filer ou si on la bloque
      next(action);
      break;

    case LOAD_USERS_REVIEWS:
    // affichage de tous les profils sur la HP

      api
        .get('/user/home')
        .then((response) => {
          // console.log(response);
          const usersReviewList = response.data;
          store.dispatch(saveUsersReviews(usersReviewList));
        }).catch((error) => {
        // eslint-disable-next-line no-console
          console.log(error);
          console.log('Les usersReviews n\'ont pas pu être chargées');
        });

      // puis on décide si on la laisse filer ou si on la bloque
      next(action);
      break;

    case MODIFY_PROFILE: {
      // on récupère l'ID de la personne connectée
      const { userId, myHobbiesList: hobbies, myServicesList: services } = action;
      // const {  } = action ;
      console.log(userId);

      // on récupère le token stocké dans le localStorage
      const userToken = localStorage.getItem('token');
      console.log(userToken);

      // on récupère les nouvelles données de la personne connectée, ainsi que celles non modifiées
      const state = store.getState();
      const {
        connectedUserData,
        newPassword: password,
        confirmedNewPassword: confirmedPassword,
      } = state.log;

      const {
        email,
        firstname,
        lastname,
        nickname,
        phoneNumber,
        biography,
        helper,
      } = connectedUserData;

      const { completeNewAddress: userAdress } = state.log;

      api
        .put(`/user/${userId}`,
          {
            email,
            lastname,
            firstname,
            password,
            confirmedPassword,
            nickname,
            biography,
            phoneNumber,
            userAdress,
            hobbies,
            helper,
            services,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
        .then((response) => {
          console.log(response);
          store.dispatch(resetPassword());
          store.dispatch(redirectToMyProfile(true));
          store.dispatch(saveModifiedConnectedUserData(response.data));
          store.dispatch(resetCityField());
          toast.info('Vos modifications ont été enregistrées');
          // window.location.href = '/mon-profil';
          // const usersList = response.data;
          // store.dispatch(saveUsersCards(usersList));
        }).catch((error) => {
          // eslint-disable-next-line no-console
          store.dispatch(redirectToMyProfile(true));
          store.dispatch(resetCityField());
          toast.info('Un problème est survenu. Vos modifications n\'ont pas été enregistrées');

          const errorStatus = error.response.status;
          console.log(errorStatus);
          console.log('vous ne passerez pas');
        });
      next(action);
      break;
    }
    case LOAD_USERS_BY_COUNTRY: {
      // on récupère le pays
      const state = store.getState();
      console.log(state);
      const country = state.map.userAddress[1];

      api
        .get(`/user/search?country=${country}`)
        .then((response) => {
          console.log(response);
          const usersList = response.data;
          let usersWithCity = [];
          usersList[0].cities.forEach((city) => {
            usersWithCity = usersWithCity.concat(city.users.map((user) => ({ ...user, city: city.name })));
          });
          console.log(usersWithCity);
          console.log(usersList[0].cities);
          let userCountCity = [];

          usersList[0].cities.map((city) => {
            console.log(city.users);
            userCountCity = [...userCountCity, city.users];
            console.log(userCountCity);
          });
          console.log(userCountCity);

          let userCount = [];
          userCountCity.map((userArray) => {
            userCount = userCount.concat(userArray);
          });

          const address = state.map.userAddress;
          const usersCity = (response.data[0].cities).find((city) => address.includes(city.name));

          console.log(userCount);
          // Object.values(userCount);
          console.log(userCount);
          store.dispatch(saveUsersList(userCount));
          store.dispatch(saveUsersCities(response.data));
          store.dispatch(loadingCities(false));
          store.dispatch(saveUsersCity(usersCity.users, usersCity.name));

          console.log(usersCity);
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
      next(action);
      break;
    }

    case LOG_OUT:
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
      console.log('je me déconnecte');
      store.dispatch(toggleLogOut(false));
      next(action);
      break;

    case LOAD_HOBBIES_LIST: {
      const userToken = localStorage.getItem('token');
      console.log(userToken);

      api
        .get('hobby',
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
        .then((response) => {
          // console.log(response.data);
          const hobbiesList = response.data;
          store.dispatch(saveHobbiesList(hobbiesList));
          store.dispatch(setLoadingHobbies(true));
        }).catch((error) => {
          console.log(error);
        }).finally(() => {
          // gestion du loader
          // store.dispatch(setLoading(false));
        });
      break;
    }
    case LOAD_SERVICES_LIST: {
      const userToken = localStorage.getItem('token');
      console.log(userToken);

      api
        .get('service',
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
        .then((response) => {
          // console.log(response.data);
          const servicesList = response.data;
          store.dispatch(saveServicesList(servicesList));
          store.dispatch(setLoadingServices(true));
        }).catch((error) => {
        // eslint-disable-next-line no-console
          console.log(error);
        }).finally(() => {
          // gestion du loader
          // store.dispatch(setLoading(false));
        });
      break;
    }
    default:
      next(action);
  }
};
