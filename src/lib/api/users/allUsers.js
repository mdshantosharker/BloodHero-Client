import { serverFetch } from "../server";

export const getAllUsers = async () => {
  const res = await serverFetch("/allUsers");
  return res;
};


