export {};

export type Roles =
  | "grand-administrator"
  | "grand-officer"
  | "worthy-matron"
  | "member"
  | "district-deputy"
  | "secretary";

export type NavLink = {
  heading: string;
  links: {
    title: string;
    href: string;
    Icon: React.ReactNode;
  }[];
  roles?: Roles[];
};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
