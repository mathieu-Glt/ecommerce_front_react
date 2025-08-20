import axios from "axios";

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/create-or-update-user`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const registerOrUpdateUser = async (user) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/register-user`,
    user
  );
};

export const currentUser = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/current-user`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
