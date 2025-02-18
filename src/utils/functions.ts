import { getChapter } from "@/actions/chapter";
import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { Bill } from "@/models/bill";
import { Chapter, ChapterDocument } from "@/models/chapter";
import { ChapterOfficeDocument } from "@/models/chapterOffice";
import { District, DistrictDocument } from "@/models/district";
import { GrandOfficeDocument } from "@/models/grandOffice";
import { Meeting } from "@/models/meeting";
import { Member, MemberDocument } from "@/models/member";
import { Rank, RankDocument } from "@/models/rank";
import { ReasonDocument } from "@/models/reason";
import { State, StateDocument } from "@/models/state";
import { Status, StatusDocument } from "@/models/status";
import {
  AggregationResult,
  BirthdayAggregationResult,
  ChapterOrDistrictType,
  ChapterReportAggregation,
  CurrentYearMemberGrowthAggregation,
  FinancesAggregationResult,
  MemberDropdownAggregationResult,
  MonthlyActiveMemberAggregation,
  MonthlyMemberGrowthAggregation,
  YearlyDuesAggregation,
} from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import "server-only";

export async function getSystemFinances(date: {
  month?: number;
  year?: number;
}) {
  try {
    await connectDB();

    const { data: districts, message } = await getAllDistricts();
    if (!districts || districts.length === 0) {
      return {
        data: null,
        message,
      };
    }

    const { data: finances, message: financesMessage } =
      await getMemberFinances(date);

    if (!finances || !Array.isArray(finances)) {
      return {
        data: null,
        message: financesMessage,
      };
    }

    return {
      data: {
        districts: JSON.parse(JSON.stringify(districts)) as DistrictDocument[],
        finances,
      },
      message: "Members Finances fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  }
}

export async function getDistrictFinances(
  districtId: Types.ObjectId,
  date: {
    month?: number;
    year?: number;
  }
) {
  try {
    await connectDB();
    const districtFinances = await District.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(districtId),
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "districtId",
          as: "members",
          pipeline: [
            {
              $lookup: {
                from: "dues",
                localField: "_id",
                foreignField: "memberId",
                as: "currentMonthDues",
                pipeline: [
                  {
                    $match: {
                      $and: [
                        {
                          $expr: {
                            $eq: [
                              { $month: "$dueDate" },
                              {
                                $month: new Date(
                                  date.year || new Date().getFullYear(),
                                  date.month || new Date().getMonth() + 1
                                ),
                              },
                            ],
                          },
                        },
                        {
                          $expr: {
                            $eq: [
                              { $year: "$dueDate" },
                              {
                                $year: new Date(
                                  date.year || new Date().getFullYear(),
                                  date.month || new Date().getMonth() + 1
                                ),
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      memberId: 1,
                      amount: 1,
                      totalDues: 1,
                      dueDate: 1,
                      paymentStatus: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                totalDues: { $sum: "$currentMonthDues.totalDues" },
                paidDues: {
                  $sum: "$currentMonthDues.amount",
                },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                middleName: 1,
                email: 1,
                phoneNumber1: 1,
                totalDues: 1,
                paidDues: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalDues: { $sum: "$members.totalDues" },
          paidDues: { $sum: "$members.paidDues" },
        },
      },
      {
        $project: {
          name: 1,
          members: 1,
          totalDues: 1,
          paidDues: 1,
        },
      },
    ]);

    const result = JSON.parse(JSON.stringify(districtFinances))?.at(
      0
    ) as AggregationResult;

    if (!result) {
      return { data: null, message: "No district finances found" };
    }

    return {
      data: result,
      message: "District finances fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllDistricts() {
  try {
    await connectDB();
    const districts = await District.find({});

    if (districts.length === 0) {
      return {
        data: null,
        message: "No districts found",
      };
    }

    return {
      data: districts,
      message: "Districts fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllChapters() {
  try {
    await connectDB();
    const chapters = await Chapter.find({});

    if (chapters.length === 0) {
      return {
        data: null,
        message: "No Chapters Found",
      };
    }

    return {
      data: chapters,
      message: "Chapters fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getChapterFinances(
  chapterId: Types.ObjectId,
  date: {
    month?: number;
    year?: number;
  }
) {
  try {
    await connectDB();
    const chapterFinances = await Chapter.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(chapterId),
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "chapterId",
          as: "members",
          pipeline: [
            {
              $lookup: {
                from: "dues",
                localField: "_id",
                foreignField: "memberId",
                as: "currentMonthDues",
                pipeline: [
                  {
                    $match: {
                      $and: [
                        {
                          $expr: {
                            $eq: [
                              { $month: "$dueDate" },
                              {
                                $month: new Date(
                                  date.year || new Date().getFullYear(),
                                  date.month || new Date().getMonth() + 1
                                ),
                              },
                            ],
                          },
                        },
                        {
                          $expr: {
                            $eq: [
                              { $year: "$dueDate" },
                              {
                                $year: new Date(
                                  date.year || new Date().getFullYear(),
                                  date.month || new Date().getMonth() + 1
                                ),
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      memberId: 1,
                      amount: 1,
                      totalDues: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                totalDues: { $sum: "$currentMonthDues.totalDues" },
                paidDues: {
                  $sum: "$currentMonthDues.amount",
                },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                middleName: 1,
                email: 1,
                phoneNumber1: 1,
                totalDues: 1,
                paidDues: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalDues: { $sum: "$members.totalDues" },
          paidDues: { $sum: "$members.paidDues" },
        },
      },
      {
        $project: {
          name: 1,
          members: 1,
          totalDues: 1,
          paidDues: 1,
        },
      },
    ]);

    const result = JSON.parse(JSON.stringify(chapterFinances))?.at(
      0
    ) as AggregationResult;

    if (!result) {
      return { data: null, message: "No chapter finances found" };
    }

    return { data: result, message: "Chapter Finances fetched Successfully" };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllChaptersByDistrict(districtId: Types.ObjectId) {
  try {
    await connectDB();
    const chapters = await Chapter.find({
      districtId: new Types.ObjectId(districtId),
    });
    if (chapters.length === 0) {
      return { data: null, message: "No chapters found for this district" };
    }
    return { data: chapters, message: "Chapters fetched successfully" };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMemberFinances(
  date: {
    month?: number;
    year?: number;
  },
  memberId?: Types.ObjectId,
  Input?: ChapterOrDistrictType
) {
  try {
    await connectDB();
    const pipeline = [];
    if (Input) {
      pipeline.push({
        $match: {
          $or: [
            {
              districtId: new Types.ObjectId(Input.districtId),
            },
            {
              chapterId: new Types.ObjectId(Input.chapterId),
            },
          ],
        },
      });
    }

    if (memberId) {
      pipeline.push({
        $match: {
          _id: new Types.ObjectId(memberId),
        },
      });
    }
    pipeline.push(
      {
        $lookup: {
          from: "dues",
          localField: "_id",
          foreignField: "memberId",
          as: "currentMonthDues",
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: [
                        { $month: "$dueDate" },
                        {
                          $month: new Date(
                            date.year || new Date().getFullYear(),
                            date.month || new Date().getMonth() + 1
                          ),
                        },
                      ],
                    },
                  },
                  {
                    $expr: {
                      $eq: [
                        { $year: "$dueDate" },
                        {
                          $year: new Date(
                            date.year || new Date().getFullYear(),
                            date.month || new Date().getMonth() + 1
                          ),
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                memberId: 1,
                dueDate: 1,
                amount: 1,
                totalDues: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalDues: { $sum: "$currentMonthDues.totalDues" },
          paidDues: {
            $sum: "$currentMonthDues.amount",
          },
          dueDate: {
            $first: "$currentMonthDues.dueDate",
          },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          middleName: 1,
          email: 1,
          phoneNumber1: 1,
          dueDate: 1,
          totalDues: 1,
          paidDues: 1,
        },
      }
    );
    const memberFinances = await Member.aggregate(pipeline);
    const result = JSON.parse(
      JSON.stringify(memberFinances)
    ) as FinancesAggregationResult[];

    if (!result) {
      return { data: null, message: "No member finances found" };
    }

    if (memberId) {
      return {
        data: result[0],
        message: "Member Finances fetched Successfully",
      };
    }

    return { data: result, message: "Member Finances fetched Successfully" };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMembersBirthdays(Input: ChapterOrDistrictType) {
  try {
    await connectDB();
    const membersBirthdays = await Member.aggregate([
      {
        $match: Input
          ? {
              $or: [
                { districtId: new Types.ObjectId(Input.districtId) },
                { chapterId: new Types.ObjectId(Input.chapterId) },
              ],
            }
          : {},
      },
      {
        $addFields: {
          currentDate: new Date(),
          month: { $month: new Date() },
          day: { $dayOfMonth: new Date() },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$birthDate" }, "$month"] },
              { $gte: [{ $dayOfMonth: "$birthDate" }, "$day"] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          birthDate: 1,
          firstName: 1,
          lastName: 1,
          middleName: 1,
          rank: 1,
        },
      },
    ]);

    const result = JSON.parse(
      JSON.stringify(membersBirthdays)
    ) as BirthdayAggregationResult[];

    if (!result) {
      return { data: null, message: "No upcoming birthdays found" };
    }

    return { data: result, message: "Members Birthdays fetched Successfully" };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllRanks() {
  try {
    await connectDB();
    const ranks = await Rank.find();
    if (!ranks) {
      return { data: null, message: "No ranks found" };
    }
    return {
      data: JSON.parse(JSON.stringify(ranks)) as RankDocument[],
      message: "Ranks fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllStatuses(active?: boolean) {
  try {
    await connectDB();
    const statuses = active
      ? await Status.find({
          name: { $in: ["Regular", "Special", "Petitioner"] },
        })
      : await Status.find();
    if (!statuses) {
      return { data: null, message: "No statuses found" };
    }
    return {
      data: JSON.parse(JSON.stringify(statuses)) as StatusDocument[],
      message: "Statuses fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllStates() {
  try {
    await connectDB();
    const states = await State.find();
    if (!states) {
      return { data: null, message: "No states found" };
    }
    return {
      data: JSON.parse(JSON.stringify(states)) as StateDocument[],
      message: "States fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getAllMemberDropdownOptions(memberId: string) {
  try {
    await connectDB();
    const result = await Member.aggregate([
      {
        $match: {
          userId: memberId,
        },
      },
      {
        $lookup: {
          from: "chapters",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allChapters",
        },
      },
      {
        $lookup: {
          from: "states",
          pipeline: [
            {
              $match: {},
            },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allStates",
        },
      },
      {
        $lookup: {
          from: "status",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allStatuses",
        },
      },
      {
        $lookup: {
          from: "chapteroffices",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allChapterOffices",
        },
      },
      {
        $lookup: {
          from: "grandoffices",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allGrandOffices",
        },
      },
      {
        $lookup: {
          from: "ranks",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allRanks",
        },
      },
      {
        $lookup: {
          from: "reasons",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allReasons",
        },
      },
      {
        $project: {
          member: {
            _id: "$_id",
            userId: "$userId",
            role: "$role",
            greeting: "$greeting",
            firstName: "$firstName",
            middleName: "$middleName",
            lastName: "$lastName",
            status: "$status",
            email: "$email",
            photo: "$photo",
            password: "$password",
            phoneNumber1: "$phoneNumber1",
            phoneNumber2: "$phoneNumber2",
            address1: "$address1",
            address2: "$address2",
            city: "$city",
            state: "$state",
            zipCode: "$zipCode",
            birthPlace: "$birthPlace",
            birthDate: "$birthDate",
            chapterOffice: "$chapterOffice",
            grandOffice: "$grandOffice",
            rank: "$rank",
            dropReason: "$dropReason",
            dropDate: "$dropDate",
            expelReason: "$expelReason",
            expelDate: "$expelDate",
            suspendReason: "$suspendReason",
            suspendDate: "$suspendDate",
            deathDate: "$deathDate",
            actualDeathDate: "$actualDeathDate",
            deathPlace: "$deathPlace",
            secretaryNotes: "$secretaryNotes",
            enlightenDate: "$enlightenDate",
            demitInDate: "$demitInDate",
            demitOutDate: "$demitOutDate",
            demitToChapter: "$demitToChapter",
            investigationDate: "$investigationDate",
            investigationAcceptOrRejectDate: "$investigationAcceptOrRejectDate",
            sponsor1: "$sponsor1",
            sponsor2: "$sponsor2",
            sponsor3: "$sponsor3",
            petitionDate: "$petitionDate",
            petitionReceivedDate: "$petitionReceivedDate",
            initiationDate: "$initiationDate",
            amaranthDate: "$amaranthDate",
            queenOfSouthDate: "$queenOfSouthDate",
            districtId: "$districtId",
            regionId: "$regionId",
            chapterId: "$chapterId",
            spouseName: "$spouseName",
            spousePhone: "$spousePhone",
            emergencyContact: "$emergencyContact",
            emergencyContactPhone: "$emergencyContactPhone",
            reinstatedDate: "$reinstatedDate",
          },
          allStates: 1,
          allStatuses: 1,
          allChapterOffices: 1,
          allGrandOffices: 1,
          allRanks: 1,
          allReasons: 1,
          allChapters: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return {
        data: null,
        message: "No Member Found",
      };
    }

    const {
      member,
      allStatuses,
      allStates,
      allChapterOffices,
      allGrandOffices,
      allRanks,
      allReasons,
      allChapters,
    } = result[0] as MemberDropdownAggregationResult;
    const parsedMember = JSON.parse(JSON.stringify(member)) as MemberDocument;
    const dropdownOptions = {
      state: JSON.parse(JSON.stringify(allStates)) as
        | StateDocument[]
        | undefined,
      memberStatus: JSON.parse(JSON.stringify(allStatuses)) as
        | StatusDocument[]
        | undefined,
      chapterOffice: JSON.parse(JSON.stringify(allChapterOffices)) as
        | ChapterOfficeDocument[]
        | undefined,
      grandChapterOffice: JSON.parse(JSON.stringify(allGrandOffices)) as
        | GrandOfficeDocument[]
        | undefined,
      memberRank: JSON.parse(JSON.stringify(allRanks)) as
        | RankDocument[]
        | undefined,
      reasons: JSON.parse(JSON.stringify(allReasons)) as
        | ReasonDocument[]
        | undefined,
      chapters: JSON.parse(JSON.stringify(allChapters)) as
        | ChapterDocument[]
        | undefined,
    };

    return {
      data: {
        member: parsedMember,
        dropdownOptions,
      },
      message: "Member Found",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMemberChapter(
  memberId?: Types.ObjectId,
  userId?: string
) {
  try {
    await connectDB();
    const memberChapterAggregation = await Member.aggregate([
      {
        $match: memberId
          ? {
              _id: new Types.ObjectId(memberId),
            }
          : {
              userId: userId,
            },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      {
        $project: {
          chapter: { $first: "$chapter" },
        },
      },
    ]);

    if (memberChapterAggregation.length === 0) {
      return {
        data: null,
        message: "Invalid member Id",
      };
    }

    const result = memberChapterAggregation[0] as {
      chapter: ChapterDocument;
    };

    return {
      data: result.chapter,
      message: "Member Chapter Fetched",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database.",
    };
  }
}

export async function getMemberByUserId(userId: string) {
  try {
    await connectDB();
    const member = await Member.findOne({ userId });
    if (!member) {
      return {
        data: null,
        message: "No Member Found",
      };
    }
    return {
      data: member,
      message: "Member Found",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getRegularAndSpecialMembersCount(
  Input: ChapterOrDistrictType
) {
  try {
    await connectDB();
    const { data: statuses, message } = await getAllStatuses();

    if (!statuses) {
      return {
        data: null,
        message,
      };
    }
    const regularStatusId = statuses.find(
      (status) => status.name === "Regular"
    )?._id;

    const specialStatusId = statuses.find(
      (status) => status.name === "Special"
    )?._id;

    if (!regularStatusId || !specialStatusId) {
      return {
        data: null,
        message: "Status Not Found",
      };
    }
    let pipeline = [];
    if (Input) {
      pipeline.push({
        $match: {
          $or: [
            { districtId: new Types.ObjectId(Input.districtId) },
            { chapterId: new Types.ObjectId(Input.chapterId) },
          ],
        },
      });
    }

    pipeline.push(
      {
        $match: {
          status: {
            $in: [
              new Types.ObjectId(regularStatusId),
              new Types.ObjectId(specialStatusId),
            ],
          },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      }
    );

    const result = await Member.aggregate(pipeline);

    if (!result || result.length === 0) {
      return {
        data: null,
        message: "No Members Found",
      };
    }

    const counts: { regularMembersCount: number; specialMembersCount: number } =
      result.reduce(
        (acc, { status, count }) => {
          if (status?.equals(regularStatusId)) {
            acc.regularMembersCount = count;
          } else if (status?.equals(specialStatusId)) {
            acc.specialMembersCount = count;
          }
          return acc;
        },
        { regularMembersCount: 0, specialMembersCount: 0 }
      );

    return {
      data: counts,
      message: "Regular and Special Members Count Fetched",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getCurrentYearMemberGrowth(Input: ChapterOrDistrictType) {
  try {
    await connectDB();
    const memberGrowth = (await Member.aggregate([
      {
        $match: Input
          ? {
              $or: [
                { districtId: new Types.ObjectId(Input.districtId) },
                { chapterId: new Types.ObjectId(Input.chapterId) },
              ],
            }
          : {},
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear() + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          count: 1,
        },
      },
      {
        $facet: {
          data: [{ $sort: { month: 1 } }],
          months: [
            {
              $addFields: {
                months: {
                  $range: [1, new Date().getMonth() + 2],
                },
              },
            },
            { $unwind: "$months" },
          ],
        },
      },
      {
        $project: {
          result: {
            $map: {
              input: "$months.months",
              as: "month",
              in: {
                month: "$$month",
                count: {
                  $let: {
                    vars: {
                      monthData: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$data",
                              as: "data",
                              cond: { $eq: ["$$data.month", "$$month"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$monthData.count", 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: "$result" },
      { $replaceRoot: { newRoot: "$result" } },
    ])) as CurrentYearMemberGrowthAggregation;

    if (!memberGrowth || memberGrowth.length === 0) {
      return {
        data: null,
        message: "No Member Growth Found",
      };
    }

    return {
      data: memberGrowth.slice(0, new Date().getMonth() + 1),
      message: "Current Year Member Growth Fetched",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMonthlyMemberGrowth(
  Input: ChapterOrDistrictType,
  date: {
    month?: number;
    year?: number;
  }
) {
  try {
    await connectDB();

    const currentMonthStart = new Date(
      date.year || new Date().getFullYear(),
      date.month ? date.month - 1 : new Date().getMonth(),
      1
    );
    const previousMonthStart = new Date(
      date.year || new Date().getFullYear(),
      date.month ? date.month - 2 : new Date().getMonth() - 1,
      1
    );
    const nextMonthStart = new Date(
      date.year || new Date().getFullYear(),
      date.month ? date.month : new Date().getMonth() + 1,
      1
    );

    const pipeline = [
      {
        $match: Input
          ? {
              $or: [
                { districtId: new Types.ObjectId(Input.districtId) },
                { chapterId: new Types.ObjectId(Input.chapterId) },
              ],
            }
          : {},
      },
      {
        $facet: {
          currentMonth: [
            {
              $match: {
                createdAt: {
                  $gte: currentMonthStart,
                  $lt: nextMonthStart,
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
          previousMonth: [
            {
              $match: {
                createdAt: {
                  $gte: previousMonthStart,
                  $lt: currentMonthStart,
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          currentMonthCount: {
            $ifNull: [{ $arrayElemAt: ["$currentMonth.count", 0] }, 0],
          },
          previousMonthCount: {
            $ifNull: [{ $arrayElemAt: ["$previousMonth.count", 0] }, 0],
          },
        },
      },
      {
        $addFields: {
          percentageChange: {
            $cond: {
              if: { $eq: ["$previousMonthCount", 0] },
              then: {
                $cond: {
                  if: { $eq: ["$currentMonthCount", 0] },
                  then: 0,
                  else: 100,
                },
              },
              else: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$currentMonthCount",
                          "$previousMonthCount",
                        ],
                      },
                      "$previousMonthCount",
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
    ];

    const memberGrowth = (await Member.aggregate(
      pipeline
    )) as MonthlyMemberGrowthAggregation[];

    if (!memberGrowth || memberGrowth.length === 0) {
      return {
        data: null,
        message: "No Member Growth Found",
      };
    }

    return {
      data: memberGrowth[0],
      message: "Current Month Member Growth Fetched",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMonthlyActiveMembers(
  Input: ChapterOrDistrictType,
  date: {
    month?: number;
    year?: number;
  }
) {
  try {
    await connectDB();

    const currentMonthStart = new Date(
      date.year || new Date().getFullYear(),
      date.month ? date.month - 1 : new Date().getMonth(),
      1
    );
    const previousMonthStart = new Date(
      date.year || new Date().getFullYear(),
      date.month ? date.month - 2 : new Date().getMonth() - 1,
      1
    );
    const nextMonthStart = new Date(
      date.year || new Date().getFullYear(),
      date.month ? date.month : new Date().getMonth() + 1,
      1
    );

    const pipeline = [
      {
        $match: Input
          ? {
              $or: [
                { districtId: new Types.ObjectId(Input.districtId) },
                { chapterId: new Types.ObjectId(Input.chapterId) },
              ],
            }
          : {},
      },
      {
        $facet: {
          currentMonth: [
            {
              $match: {
                createdAt: {
                  $gte: currentMonthStart,
                  $lt: nextMonthStart,
                },
              },
            },
            {
              $lookup: {
                from: "status",
                localField: "status",
                foreignField: "_id",
                as: "statuses",
              },
            },
            {
              $match: {
                "statuses.name": {
                  $in: ["Regular", "Special", "special", "regular"],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
          previousMonth: [
            {
              $match: {
                createdAt: {
                  $gte: previousMonthStart,
                  $lt: currentMonthStart,
                },
              },
            },
            {
              $lookup: {
                from: "status",
                localField: "status",
                foreignField: "_id",
                as: "statuses",
              },
            },
            {
              $match: {
                "statuses.name": {
                  $in: ["Regular", "Special", "special", "regular"],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          currentMonthCount: {
            $ifNull: [{ $arrayElemAt: ["$currentMonth.count", 0] }, 0],
          },
          previousMonthCount: {
            $ifNull: [{ $arrayElemAt: ["$previousMonth.count", 0] }, 0],
          },
        },
      },
      {
        $addFields: {
          percentageChange: {
            $cond: {
              if: { $eq: ["$previousMonthCount", 0] },
              then: {
                $cond: {
                  if: { $eq: ["$currentMonthCount", 0] },
                  then: 0,
                  else: 100,
                },
              },
              else: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$currentMonthCount",
                          "$previousMonthCount",
                        ],
                      },
                      "$previousMonthCount",
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
    ];

    const activeMembers = (await Member.aggregate(
      pipeline
    )) as MonthlyActiveMemberAggregation[];

    if (!activeMembers || activeMembers.length === 0) {
      return {
        data: null,
        message: "No Member Growth Found",
      };
    }

    return {
      data: activeMembers[0],
      message: "Current Month Member Growth Fetched",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMonthlyMoneyDetails(
  moneyType: "in" | "out",
  Input: ChapterOrDistrictType,
  date: {
    month?: number;
    year?: number;
  }
) {
  try {
    await connectDB();
    if (moneyType === "in") {
      const { data: currentMonthFinances } = await getMemberFinances(
        {
          month: date.month || new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        undefined,
        Input
      );
      const { data: previousMonthFinances } = await getMemberFinances(
        {
          month: date.month ? date.month - 1 : new Date().getMonth(),
          year: new Date().getFullYear(),
        },
        undefined,
        Input
      );

      let [
        currentMonthMoneyPaid,
        previousMonthMoneyPaid,
        previousMonthMoneyTotal,
        currentMonthMoneyTotal,
        percentageChange,
      ]: number[] = [0, 0, 0, 0, 0];
      if (!currentMonthFinances || !Array.isArray(currentMonthFinances)) {
        currentMonthMoneyPaid = 0;
        currentMonthMoneyTotal = 0;
      }
      if (!previousMonthFinances || !Array.isArray(previousMonthFinances)) {
        previousMonthMoneyPaid = 0;
        previousMonthMoneyTotal = 0;
      }
      if (currentMonthFinances && Array.isArray(currentMonthFinances)) {
        currentMonthMoneyPaid = currentMonthFinances.reduce(
          (acc, curr) => acc + curr.paidDues,
          0
        );
        currentMonthMoneyTotal = currentMonthFinances.reduce(
          (acc, curr) => acc + curr.totalDues,
          0
        );
      }
      if (previousMonthFinances && Array.isArray(previousMonthFinances)) {
        previousMonthMoneyPaid = previousMonthFinances.reduce(
          (acc, curr) => acc + curr.paidDues,
          0
        );
        previousMonthMoneyTotal = previousMonthFinances.reduce(
          (acc, curr) => acc + curr.totalDues,
          0
        );
      }
      if (previousMonthMoneyPaid === 0) {
        percentageChange = 0;
      } else {
        percentageChange = Math.round(
          ((currentMonthMoneyPaid - previousMonthMoneyPaid) /
            previousMonthMoneyPaid) *
            100
        );
      }
      return {
        data: {
          currentMonthMoneyPaid,
          previousMonthMoneyPaid,
          previousMonthMoneyTotal,
          currentMonthMoneyTotal,
          percentageChange,
        },
        message: "Current Month Money Details Fetched",
      };
    }

    return {
      data: {
        currentMonthMoneyPaid: 0,
        previousMonthMoneyPaid: 0,
        previousMonthMoneyTotal: 0,
        currentMonthMoneyTotal: 0,
        percentageChange: 0,
      },
      message: "Current Month Member Growth Fetched",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getQueryResults({
  filter,
  query,
}: {
  query: string;
  filter?: string;
}) {
  const { userId } = auth();
  if (!query) {
    return {
      data: null,
      message: "Query Not Found",
    };
  }
  try {
    await connectDB();

    if (checkRole(["grand-administrator", "grand-officer"])) {
      if (!filter) {
        const members = await Member.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    { firstName: { $regex: new RegExp(query, "i") } },
                    { lastName: { $regex: new RegExp(query, "i") } },
                  ],
                },
              ],
            },
          },
        ]);

        const chapters = await Chapter.aggregate([
          { $match: { $or: [{ name: { $regex: new RegExp(query, "i") } }] } },
        ]);

        const districts = await District.aggregate([
          { $match: { $or: [{ name: { $regex: new RegExp(query, "i") } }] } },
        ]);

        const result: {
          members?: MemberDocument[];
          chapters?: ChapterDocument[];
          districts?: DistrictDocument[];
        } = {
          members,
          chapters,
          districts,
        };

        return {
          data: result,
          message: "Results Fetched",
        };
      }

      if (filter === "chapter") {
        const chapters = await Chapter.aggregate([
          { $match: { $or: [{ name: { $regex: new RegExp(query, "i") } }] } },
        ]);
        return {
          data: {
            chapters: chapters as ChapterDocument[] | undefined,
          },
          message: "Chapters Fetched",
        };
      }

      if (filter === "district") {
        const districts = await District.aggregate([
          { $match: { $or: [{ name: { $regex: new RegExp(query, "i") } }] } },
        ]);
        return {
          data: {
            districts: districts as DistrictDocument[] | undefined,
          },
          message: "Districts Fetched",
        };
      }

      if (filter === "member") {
        const members = await Member.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    { firstName: { $regex: new RegExp(query, "i") } },
                    { lastName: { $regex: new RegExp(query, "i") } },
                  ],
                },
              ],
            },
          },
        ]);

        return {
          data: {
            members: members as MemberDocument[] | undefined,
          },
          message: "Members Fetched",
        };
      }

      return {
        data: null,
        message: "Invalid Filter",
      };
    }

    if (checkRole(["member", "secretary", "worthy-matron"])) {
      if (filter)
        return {
          data: null,
          message: "Filter Not Available",
        };

      if (checkRole("member")) {
        const member = await Member.findOne({ userId });
        if (!member) {
          return {
            data: null,
            message: "Could Not find Members",
          };
        }
        const members = await Chapter.aggregate([
          {
            $match: {
              _id: member.chapterId,
            },
          },
          {
            $lookup: {
              from: "members",
              localField: "_id",
              foreignField: "chapterId",
              as: "members",
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        $or: [
                          { firstName: { $regex: new RegExp(query, "i") } },
                          { lastName: { $regex: new RegExp(query, "i") } },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $unwind: "$members",
          },
          {
            $project: {
              chapterId: "$_id",
              members: "$members",
            },
          },
        ]);

        return {
          data: {
            members: members.map((member) => member.members) as
              | MemberDocument[]
              | undefined,
          },
          message: "Members Fetched",
        };
      }

      if (checkRole(["secretary", "worthy-matron"])) {
        const members = await Chapter.aggregate([
          {
            $match: checkRole("secretary")
              ? {
                  secretaryId: userId,
                }
              : {
                  matronId: userId,
                },
          },
          {
            $lookup: {
              from: "members",
              localField: "_id",
              foreignField: "chapterId",
              as: "members",
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        $or: [
                          { firstName: { $regex: new RegExp(query, "i") } },
                          { lastName: { $regex: new RegExp(query, "i") } },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $unwind: "$members",
          },
          {
            $project: {
              _id: 0,
              members: "$members",
            },
          },
        ]);
        return {
          data: {
            members: members?.map((member) => member.members) as
              | MemberDocument[]
              | undefined,
          },
          message: "Members Fetched",
        };
      }
    }

    if (!filter) {
      const chapters = await District.aggregate([
        { $match: { deputyId: userId } },
        {
          $lookup: {
            from: "chapters",
            localField: "_id",
            foreignField: "districtId",
            as: "chapters",
            pipeline: [
              {
                $match: {
                  $or: [
                    { name: { $regex: new RegExp(query, "i") } },
                    { chapterNumber: { $regex: new RegExp(query, "i") } },
                  ],
                },
              },
            ],
          },
        },
        {
          $unwind: "$chapters",
        },
        {
          $project: {
            districtId: "$_id",
            chapters: "$chapters",
          },
        },
      ]);
      const members = await District.aggregate([
        {
          $match: {
            deputyId: userId,
          },
        },
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "districtId",
            as: "members",
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $or: [
                        { firstName: { $regex: new RegExp(query, "i") } },
                        { lastName: { $regex: new RegExp(query, "i") } },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          $unwind: "$members",
        },
        {
          $project: {
            districtId: "$_id",
            members: "$members",
          },
        },
      ]);
      return {
        data: {
          chapters: chapters.map((chapter) => chapter?.chapters) as
            | ChapterDocument[]
            | undefined,
          members: members.map((member) => member.members) as
            | MemberDocument[]
            | undefined,
        },
        message: "Chapters And Members Fetched",
      };
    }

    if (filter === "chapter") {
      const chapters = await District.aggregate([
        { $match: { deputyId: userId } },
        {
          $lookup: {
            from: "chapters",
            localField: "_id",
            foreignField: "districtId",
            as: "chapters",
            pipeline: [
              {
                $match: {
                  $or: [
                    { name: { $regex: new RegExp(query, "i") } },
                    { chapterNumber: { $regex: new RegExp(query, "i") } },
                  ],
                },
              },
            ],
          },
        },
        {
          $unwind: "$chapters",
        },
        {
          $project: {
            districtId: "$_id",
            chapters: "$chapters",
          },
        },
      ]);
      return {
        data: {
          chapters: chapters.map((chapter) => chapter?.chapters) as
            | ChapterDocument[]
            | undefined,
        },
        message: "Chapters Fetched",
      };
    }

    if (filter === "member") {
      const members = await District.aggregate([
        {
          $match: {
            deputyId: userId,
          },
        },
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "districtId",
            as: "members",
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $or: [
                        { firstName: { $regex: new RegExp(query, "i") } },
                        { lastName: { $regex: new RegExp(query, "i") } },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          $unwind: "$members",
        },
        {
          $project: {
            districtId: "$_id",
            members: "$members",
          },
        },
      ]);

      return {
        data: {
          members: members.map((member) => member?.members) as
            | MemberDocument[]
            | undefined,
        },
        message: "Members Fetched",
      };
    }

    return {
      data: null,
      message: "Invalid Filter",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getDelinquentDues(Input: ChapterOrDistrictType) {
  // Pass true as argument to only get active members delinquent dues
  const { data, message } = await getAllStatuses();

  if (!data) {
    console.error(message);
    return {
      data: null,
      message: "Some error occurred",
    };
  }

  try {
    await connectDB();
    const pipeline = [];
    if (Input) {
      if (Input.chapterId)
        pipeline.push({
          $match: {
            chapterId: new Types.ObjectId(Input.chapterId),
          },
        });

      if (Input.districtId)
        pipeline.push({
          $match: {
            districtId: new Types.ObjectId(Input.districtId),
          },
        });
    }
    pipeline.push(
      {
        $match: {
          $expr: {
            $or: data.map((status) => ({
              $eq: ["$status", new Types.ObjectId(status._id)],
            })),
          },
        },
      },
      {
        $lookup: {
          from: "dues",
          localField: "_id",
          foreignField: "memberId",
          as: "dues",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$paymentStatus", "unpaid"] },
                        { $eq: ["$paymentStatus", "overdue"] },
                      ],
                    },
                    {
                      $lt: [
                        "$dueDate",
                        new Date(
                          new Date().setMonth(new Date().getMonth() - 1)
                        ),
                      ],
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                delinquentAmount: { $subtract: ["$totalDues", "$amount"] },
              },
            },
          ],
        },
      }
    );

    pipeline.push(
      {
        $unwind: "$dues",
      },
      {
        $group: {
          _id: null,
          delinquentDues: { $sum: "$dues.delinquentAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          delinquentDues: 1,
        },
      }
    );

    const result = await Member.aggregate(pipeline);

    if (!result || result.length === 0) {
      return {
        data: null,
        message: "No Delinquent Dues",
      };
    }

    return {
      data: result[0],
      message: "Delinquent Dues fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getChapterReport(chapterId: string) {
  try {
    await connectDB();
    const { data, message: statusesMessage } = await getAllStatuses(true);

    if (!data || data.length === 0) {
      console.error(statusesMessage);
      return {
        data: null,
        message: "Error fetching report",
      };
    }
    const aggregationPromise = Chapter.aggregate<ChapterReportAggregation>([
      {
        $match: {
          _id: new Types.ObjectId(chapterId),
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "chapterId",
          as: "members",
        },
      },
      {
        $addFields: {
          activeMembersLastMonth: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $lt: [
                      "$$member.initiationDate",
                      new Date(new Date().getFullYear(), new Date().getMonth()),
                    ],
                  },
                  {
                    $or:
                      data?.map((status) => ({
                        $eq: [
                          "$$member.status",
                          new Types.ObjectId(status._id),
                        ],
                      })) || [],
                  },
                ],
              },
            },
          },
          initiatedMembers: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$member.initiationDate",
                      new Date(new Date().getFullYear(), 0, 1),
                    ],
                  }, // startDate should be the start of the year
                  {
                    $lt: [
                      "$$member.initiationDate",
                      new Date(new Date().getFullYear() + 1, 0, 1),
                    ],
                  }, // endDate should be the end of the year
                ],
              },
            },
          },
          initiatedMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.initiationDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.initiationDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          reinstatedMembersAfterYearCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $lt: [
                        "$$member.dropDate",
                        new Date(
                          new Date().getFullYear() - 1,
                          new Date().getMonth(),
                          new Date().getDate()
                        ),
                      ],
                    },
                    {
                      $gte: [
                        "$$member.reinstatedDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.reinstatedDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          reinstatedMembersInYearCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.dropDate",
                        new Date(
                          new Date().getFullYear() - 1,
                          new Date().getMonth(),
                          new Date().getDate()
                        ),
                      ],
                    },
                    {
                      $gte: [
                        "$$member.reinstatedDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.reinstatedDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          reinstatedMembers: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$member.dropDate",
                      new Date(
                        new Date().getFullYear() - 1,
                        new Date().getMonth(),
                        new Date().getDate()
                      ),
                    ],
                  },
                  {
                    $gte: [
                      "$$member.reinstatedDate",
                      new Date(new Date().getFullYear(), 1, 1),
                    ],
                  },
                  {
                    $lt: [
                      "$$member.reinstatedDate",
                      new Date(new Date().getFullYear() + 1, 1, 1),
                    ],
                  },
                ],
              },
            },
          },
          reinstatedMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.reinstatedDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.reinstatedDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          deceasedMembers: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$member.deathDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  {
                    $lt: [
                      "$$member.deathDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        1
                      ),
                    ],
                  },
                ],
              },
            },
          },
          deceasedMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.deathDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.deathDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          demittedMembers: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$member.demitOutDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  {
                    $lt: [
                      "$$member.demitOutDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        1
                      ),
                    ],
                  },
                ],
              },
            },
          },
          demittedMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.demitOutDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.demitOutDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          demittedInMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.demitInDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.demitInDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          suspendedMembers: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$member.suspendDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  {
                    $lt: [
                      "$$member.suspendDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        1
                      ),
                    ],
                  },
                ],
              },
            },
          },
          suspendedMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.suspendDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.suspendDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          expelledMembers: {
            $filter: {
              input: "$members",
              as: "member",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$member.expelDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  {
                    $lt: [
                      "$$member.expelDate",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        1
                      ),
                    ],
                  },
                ],
              },
            },
          },
          expelledMembersMonthCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.expelDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.expelDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          enlightenedMembersCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.enlightenDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.enlightenDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
          droppedMembersCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$member.dropDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        ),
                      ],
                    },
                    {
                      $lt: [
                        "$$member.dropDate",
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ),
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          chapterNumber: 1,
          initiatedMembers: 1,
          initiatedMembersMonthCount: 1,
          reinstatedMembersAfterYearCount: 1,
          reinstatedMembersInYearCount: 1,
          reinstatedMembersMonthCount: 1,
          reinstatedMembers: 1,
          deceasedMembers: 1,
          deceasedMembersMonthCount: 1,
          demittedMembers: 1,
          demittedMembersMonthCount: 1,
          suspendedMembers: 1,
          suspendedMembersMonthCount: 1,
          expelledMembers: 1,
          expelledMembersMonthCount: 1,
          enlightenedMembersCount: 1,
          droppedMembersCount: 1,
          demittedInMembersMonthCount: 1,
          secretaryId: 1,
          matronId: 1,
          technologyFees: 1,
          activeMembersLastMonth: 1,
          allMembers: "$members",
        },
      },
    ]);

    const [result, { data: membersCount, message }] = await Promise.all([
      aggregationPromise,
      getRegularAndSpecialMembersCount({
        chapterId: new Types.ObjectId(chapterId),
      }),
    ]);

    if (!result || !membersCount) {
      console.error(message);
      return {
        data: null,
        message: "Error Fetching statistics",
      };
    }
    return {
      data: { ...result[0], ...membersCount },
      message: "Chapter Statistics fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getYearlyDues(
  memberId: string | Types.ObjectId,
  year: number = new Date().getFullYear()
) {
  try {
    await connectDB();
    const result = await Member.aggregate<YearlyDuesAggregation>([
      {
        $match: {
          _id: new Types.ObjectId(memberId),
        },
      },
      {
        $lookup: {
          from: "dues",
          localField: "_id",
          foreignField: "memberId",
          as: "yearlyDues",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $year: "$dueDate" }, year],
                },
              },
            },
            {
              $project: {
                _id: 1,
                memberId: 1,
                amount: 1,
                totalDues: 1,
                dueDate: 1,
                paymentStatus: 1,
                datePaid: 1,
                receiptNo: 1,
                balanceForward: 1,
                memberBalance: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                chpMonDues: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          middleName: 1,
          initiationDate: 1,
          chapterId: 1,
          extraDues: 1,
          duesLeftForYear: 1,
          email: 1,
          phoneNumber1: 1,
          yearlyDues: 1,
          chapter: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return {
        data: null,
        message: "Error Fetching statistics",
      };
    }

    return {
      data: result[0],
      message: "Yearly Dues fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getChapterBills(chapterId: string | Types.ObjectId) {
  try {
    await connectDB();

    const bills = await Bill.find({
      chapterId: new Types.ObjectId(chapterId),
    });

    if (!bills || bills.length === 0) {
      return {
        data: null,
        message: "No chapter bills found",
      };
    }

    return {
      data: bills,
      message: "Chapter bills fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getBill(billId: string | Types.ObjectId) {
  try {
    await connectDB();

    const bill = await Bill.findById(new Types.ObjectId(billId));

    if (!bill) {
      return {
        data: null,
        message: "Bill not found",
      };
    }

    return {
      data: bill,
      message: "Bill fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getChapterMeetings(chapterId: string | Types.ObjectId) {
  try {
    await connectDB();

    const meetings = await Meeting.find({
      chapterId: new Types.ObjectId(chapterId),
    });

    if (!meetings || !meetings.length) {
      return {
        data: null,
        message: "No chapter meetings found",
      };
    }

    return {
      data: meetings,
      message: "Chapter meetings fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}

export async function getMeeting(meetingId: string | Types.ObjectId) {
  try {
    await connectDB();

    const meeting = await Meeting.findById(new Types.ObjectId(meetingId));

    if (!meeting) {
      return {
        data: null,
        message: "Meeting not found",
      };
    }

    return {
      data: meeting,
      message: "Meeting fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}
