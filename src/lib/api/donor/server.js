import { serverFetch } from "../server";

export const getAllRequest = async (email) => {
  const res = await serverFetch(`/donationRequests/${email}`);
  return res;
};
