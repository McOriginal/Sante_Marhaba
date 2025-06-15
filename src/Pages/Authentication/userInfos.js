const authUser = localStorage.getItem('authUser');
const dataParse = JSON.parse(authUser);

// extracting user information from localStorage

// Getting User name
const contectedUserName = dataParse.user.name;

// Getting User id
const contectedUserId = dataParse.user._id;

// Getting User email
const contectedUserEmail = dataParse.user.email;

// Getting User role
const contectedUserRole = dataParse.user.role;

export {
  contectedUserId,
  contectedUserName,
  contectedUserEmail,
  contectedUserRole,
};
