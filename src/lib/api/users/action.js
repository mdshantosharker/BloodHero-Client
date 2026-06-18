"use server";

import { serverMutation } from "../server";

// export const addOrganization = async (data) => {
//   const resData = await serverMutation("/api/organizations", "POST", data);
//   return resData;
// };

export const updateUserStatus = async (data, id) => {
  console.log(data, id);
  const resData = await serverMutation(`/allUsers/${id}`, "PATCH", data);
  return resData;
};

export const updateProfile = async (data, id) => {
  console.log(data, id);
  const resData = await serverMutation(`/profile/${id}`, "PATCH", data);
  return resData;
};
