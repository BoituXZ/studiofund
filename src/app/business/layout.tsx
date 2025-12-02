import { BusinessLayoutClient } from "./layout-client";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <BusinessLayoutClient>{children}</BusinessLayoutClient>;
}

