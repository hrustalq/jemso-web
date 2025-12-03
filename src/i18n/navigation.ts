import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Create locale-aware navigation components and hooks
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
  permanentRedirect,
} = createNavigation(routing);
