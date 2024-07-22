import "server-only";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";
import { District, DistrictDocument } from "@/models/district";
import { Chapter, ChapterDocument } from "@/models/chapter";
import { Member, MemberDocument } from "@/models/member";
import { Rank, RankDocument } from "@/models/rank";
import { Status, StatusDocument } from "@/models/status";
import {
  AggregationResult,
  BirthdayAggregationResult,
  BirthdaysInput,
  FinancesAggregationResult,
  MemberDropdownAggregationResult,
} from "@/types/globals";
import { State, StateDocument } from "@/models/state";
import { ChapterOfficeDocument } from "@/models/chapterOffice";
import { GrandOfficeDocument } from "@/models/grandOffice";
import { ReasonDocument } from "@/models/reason";

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
          _id: districtId,
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
          _id: chapterId,
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
  memberId?: Types.ObjectId
) {
  try {
    await connectDB();
    const pipeline = [];
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

export async function getMembersBirthdays(Input: BirthdaysInput) {
  try {
    const pipeline = [];

    if (Input) {
      pipeline.push({
        $match: {
          $or: [
            { districtId: Input.districtId },
            { chapterId: Input.chapterId },
          ],
        },
      });
    }

    pipeline.push(
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
      }
    );

    const membersBirthdays = await Member.aggregate(pipeline);

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

export async function getAllStatuses() {
  try {
    await connectDB();
    const statuses = await Status.find();
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
          from: "states",
          pipeline: [
            { $match: {} },
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
          },
          allStates: 1,
          allStatuses: 1,
          allChapterOffices: 1,
          allGrandOffices: 1,
          allRanks: 1,
          allReasons: 1,
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

export async function getMemberChapter(memberId: Types.ObjectId) {
  try {
    const memberChapterAggregation = await Member.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(memberId),
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
