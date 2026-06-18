import { serverFetch } from "../server";

export const getAllUsers = async () => {
  const res = await serverFetch("/allUsers");
  return res;
};

export const getDonations = async () => {
  const res = await serverFetch("/donationRequests");
  return res;
};
