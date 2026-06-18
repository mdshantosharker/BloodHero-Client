"use server";

import { deleteMutation, serverMutation } from "../server";

export const createDonation = async (data) => {
  const resData = await serverMutation("/donationRequests", "POST", data);
  return resData;
};

export const updateMyRequests = async (data, id) => {
  const resData = await serverMutation(
    `/donationRequests/my/${id}`,
    "PATCH",
    data,
  );
  return resData;
};

export const deleteMyRequests = async (id) => {
  const resData = await deleteMutation(`/donationRequests/my/${id}`, "DELETE");
  return resData;
};

export const doneRequest = async (data, id) => {
  const resData = await serverMutation(
    `/donationRequests/my/${id}`,
    "PATCH",
    data,
  );
  return resData;
};
