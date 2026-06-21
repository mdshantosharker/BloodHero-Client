import { serverFetch } from "../server";

export const paymentsHistory = async (page) => {
  if (!page) {
    page = 1;
  }
  const res = await serverFetch(`/payments?page=${page}`);
  return res;
};
export const paymentsHistory2 = async () => {
  const res = await serverFetch(`/payment`);
  return res;
};
