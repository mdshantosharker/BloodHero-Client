import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("bloodhero");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      bloodGroup: {
        type: "string",
        required: true,
      },

      district: {
        type: "string",
        required: true,
      },

      upazila: {
        type: "string",
        required: true,
      },

      role: {
        type: "string",
        defaultValue: "donor",
      },

      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
});
