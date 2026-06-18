import { serverFetch } from "../server";

export const getAllRequest = async (email) => {
  const res = await serverFetch(`/donationRequests/${email}`);
  return res;
};
export const getMyRequest = async (id) => {
  const res = await serverFetch(`/donationRequests/my/${id}`);
  return res;
};
