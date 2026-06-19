import DonationDetailsClient from "@/components/DonationDetailsClient";
import { getMyRequest } from "@/lib/api/donor/server";
import React from "react";

const ViewDetailsPage = async ({ params }) => {
  const { id } = await params;

  const data = await getMyRequest(id);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500 font-medium">
        Donation request not found or has been removed.
      </div>
    );
  }

  return <DonationDetailsClient initialData={data} requestId={id} />;
};

export default ViewDetailsPage;
