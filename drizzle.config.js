/** @type { import("drizzle-kit").Config} */
export default {
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:BWPNUh3k2xJI@ep-cool-tooth-a2b3y4ie.eu-central-1.aws.neon.tech/shortly?sslmode=require',
  },
};
