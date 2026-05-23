import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT || 3000,
  connectionString: process.env.CONNECTION_STRING as string,
  jwtSecretKey: process.env.JWT_SECRET_KEY as string,
};

export default config;
