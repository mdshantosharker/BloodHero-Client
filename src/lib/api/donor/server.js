import { serverFetch } from "../server";

export const getAllRequest = async (email, page) => {
  if (!page) {
    page = 1;
  }
  const res = await serverFetch(`/donationRequests/${email}?page=${page}`);
  return res;
};
export const getMyRequest = async (id) => {
  const res = await serverFetch(`/donationRequests/my/${id}`);
  return res;
};
