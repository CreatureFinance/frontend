import createMiddleware from "next-intl/middleware";
import { supportedLangs } from "./config";
import { routing } from "./routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    `/(${supportedLangs.join("|")})/:path*`,
    "'/((?!_next|_vercel|.*\\..*).*)'",
  ],
};
