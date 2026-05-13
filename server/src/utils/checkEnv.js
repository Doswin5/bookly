export const checkEnv = () => {
  const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "CLIENT_URL",
    "GOOGLE_CLIENT_ID"
  ];

  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
};