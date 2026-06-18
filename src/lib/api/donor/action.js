"use server";

import { serverMutation } from "../server";


export const createDonation = async (data) => {
  const resData = await serverMutation("/donationRequests", "POST", data);
  return resData;
};
