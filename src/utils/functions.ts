import "server-only";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";
import { District } from "@/models/district";
import { Chapter } from "@/models/chapter";
import { Member } from "@/models/member";

type AggregationResult =
  | {
      name: string;
      totalDues: number;
      paidDues: number;
    }
  | undefined;

type FinancesAggregationResult =
  | {
      firstName: string;
      lastName: string;
      middleName: string;
      email: string;
      phoneNumber1: string;
      totalDues: number;
      paidDues: number;
    }
  | undefined;

export async function getDistrictFinances(
  districtId: Types.ObjectId,
  month?: number
) {
  const currentMonth = new Date().getMonth();
  const isCurrentMonth = month === currentMonth;
  try {
    await connectDB();
    // console.log(districtId);
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
                              { $month: new Date() },
                            ],
                          },
                        },
                        {
                          $expr: {
                            $eq: [{ $year: "$dueDate" }, { $year: new Date() }],
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

export async function getChapterFinances(chapterId: Types.ObjectId) {
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
                              { $month: new Date() },
                            ],
                          },
                        },
                        {
                          $expr: {
                            $eq: [{ $year: "$dueDate" }, { $year: new Date() }],
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

export async function getMemberFinances(memberId: Types.ObjectId) {
  try {
    await connectDB();
    const memberFinances = await Member.aggregate([
      {
        $match: {
          _id: memberId,
        },
      },
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
                      $eq: [{ $month: "$dueDate" }, { $month: new Date() }],
                    },
                  },
                  {
                    $expr: {
                      $eq: [{ $year: "$dueDate" }, { $year: new Date() }],
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
          firstName: 1,
          lastName: 1,
          middleName: 1,
          email: 1,
          phoneNumber1: 1,
          totalDues: 1,
          paidDues: 1,
        },
      },
    ]);

    const result = JSON.parse(JSON.stringify(memberFinances))?.at(
      0
    ) as FinancesAggregationResult;

    if (!result) {
      return { data: null, message: "No member finances found" };
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
