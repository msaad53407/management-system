import { ChapterDocument } from "@/models/chapter";
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

export type MemberDropdownAggregationResult = {
  _id?: mongoose.Types.ObjectId;
  member?: MemberDocument;
  allStates?: StateDocument[];
  allStatuses?: StatusDocument[];
  allChapterOffices?: ChapterOfficeDocument[];
  allGrandOffices?: GrandOfficeDocument[];
  allRanks?: RankDocument[];
  allReasons?: ReasonDocument[];
  allChapters?: ChapterDocument[];
};

export type BirthdayAggregationResult = {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  _id: Types.ObjectId;
  rank: Types.ObjectId;
};

export type FinancesAggregationResult = {
  _id?: Types.ObjectId;
  memberId?: Types.ObjectId;
  amount?: number;
  paymentStatus?: "unpaid" | "paid" | "overdue";
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber1: string;
  dueDate: string;
  totalDues: number;
  paidDues: number;
};

export type CurrentYearMemberGrowthAggregation = {
  month: number;
  count: number;
}[];

export type MonthlyMemberGrowthAggregation = {
  currentMonthCount: number;
  previousMonthCount: number;
  percentageChange: number;
};

export type MonthlyActiveMemberAggregation = MonthlyMemberGrowthAggregation;

export type ChapterOrDistrictType = {
  districtId?: Types.ObjectId;
  chapterId?: Types.ObjectId;
} | null;

interface BaseProps {
  type?: never;
  chapterId?: never;
  districtId?: never;
}

interface ChapterProps {
  type: "chapter";
  chapterId: string;
  districtId?: never;
}

interface DistrictProps {
  type: "district";
  districtId: string;
  chapterId?: never;
}

export type FilterProps = BaseProps | ChapterProps | DistrictProps;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
