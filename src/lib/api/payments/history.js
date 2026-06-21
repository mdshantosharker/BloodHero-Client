import { serverFetch } from "../server";

export const paymentsHistory = async (page) => {
  if (!page) {
    page = 1;
  }
  const res = await serverFetch(`/payments?page=${page}`);
  return res;
};
