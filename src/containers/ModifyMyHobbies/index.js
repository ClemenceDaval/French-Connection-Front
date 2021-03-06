import { connect } from 'react-redux';

import ModifyMyHobbies from 'src/components/ModifyMyHobbies';

import { saveSelectedHobby, addSelectedHobby, removeHobby } from 'src/actions/hobbies';

// connection de props en lecture sur le state
// ces props seront des tableaux, objets, booléens, numériques, string
const mapStateToProps = (state, ownProps) => ({
  hobbiesList: state.hobbies.hobbiesList,
  myHobbies: state.log.connectedUserData.hobbies,
  selectedHobby: state.log.selectedHobby,
});

// connection de props fonctions qui déclenchent des actions
// ces props seraont des fonctions
const mapDispatchToProps = (dispatch, ownProps) => ({
  saveSelectedHobby: (hobbyId, hobbyName) => {
    dispatch(saveSelectedHobby(hobbyId, hobbyName));
  },
  addSelectedHobby: (hobby) => {
    dispatch(addSelectedHobby(hobby));
  },
  removeHobby: (newHobbiesList) => {
    dispatch(removeHobby(newHobbiesList));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyMyHobbies);
