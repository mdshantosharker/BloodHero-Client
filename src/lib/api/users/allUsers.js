import { serverFetch } from "../server";

export const getAllUsers = async (page) => {
  if (!page) {
    page = 1;
  }
  const res = await serverFetch(`/allUsers?page=${page}`);
  return res;
};

export const getDonations = async () => {
  const res = await serverFetch("/donationRequests");
  return res;
};

export const getDonations2 = async (page) => {
  if (!page) {
    page = 1;
  }
  const res = await serverFetch(`/donationRequest?page=${page}`);
  return res;
};
export const getAllUsers2 = async () => {
  const res = await serverFetch("/donor");
  return res;
};
