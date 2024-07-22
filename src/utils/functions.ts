import "server-only";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";
import { District, DistrictDocument } from "@/models/district";
import { Chapter } from "@/models/chapter";
import { Member } from "@/models/member";
import { Rank, RankDocument } from "@/models/rank";
import { Status, StatusDocument } from "@/models/status";
import {
  AggregationResult,
  BirthdayAggregationResult,
  BirthdaysInput,
  FinancesAggregationResult,
} from "@/types/globals";

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
    const chapters = await Chapter.find({ districtId });
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
