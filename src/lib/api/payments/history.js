import { serverFetch } from "../server";

export const paymentsHistory = async () => {
  const res = await serverFetch("/payments");
  return res;
};
