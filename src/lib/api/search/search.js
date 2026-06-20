import { serverFetch } from "../server";

export const searchDonationRequests = async ({
  bloodGroup,
  district,
  upazila,
}) => {
  const params = new URLSearchParams();

  if (bloodGroup) params.append("bloodGroup", bloodGroup);
  if (district) params.append("district", district);
  if (upazila) params.append("upazila", upazila);

  const res = await serverFetch(
    `/donationRequests/search?${params.toString()}`,
  );

  return res;
};
