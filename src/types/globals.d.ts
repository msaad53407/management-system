import { Types } from "mongoose";

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
    roles?: Roles[];
  }[];
  roles?: Roles[];
};

export type FormMessage = {
  [key: string]: string[] | undefined;
};
export type MonthlyDue = {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  amount: number;
  totalDues: number;
  dueDate: Date;
  paymentStatus: "unpaid" | "paid" | "overdue";
};

export type GetResult<T> = Promise<
  | {
      data: null;
      message: string;
    }
  | {
      data: T;
      message: string;
    }
>;

export type AggregationResult =
  | {
      name: string;
      members: FinancesAggregationResult[];
      totalDues: number;
      paidDues: number;
    }
  | undefined;

export type BirthdayAggregationResult = {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  _id: Types.ObjectId;
  rank: Types.ObjectId;
};

export type FinancesAggregationResult = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber1: string;
  dueDate: string;
  totalDues: number;
  paidDues: number;
};

export type BirthdaysInput = {
  districtId?: Types.ObjectId;
  chapterId?: Types.ObjectId;
} | null;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
