"use server";

import { serverMutation } from "../server";

export const createPayment = async (data) => {
  const resData = await serverMutation("/payments", "POST", data);
  return resData;
};
