"use client";

import { formatDate } from "@/utils";
import React from "react";

const data = {
  sectionA: [
    {
      label: "on roll on last report:",
      value: 38,
      sign: null,
    },
    {
      label: "INITIATED",
      value: 0,
      sign: "+",
    },
    {
      label: "REINSTATED",
      value: 0,
      sign: "+",
    },
    {
      label: "received by AFFILIATED",
      value: 0,
      sign: "+",
    },
    {
      label: "DECEASED",
      value: 0,
      sign: "-",
    },
    {
      label: "DEMITTED",
      value: 0,
      sign: "-",
    },
    {
      label: "ENLIGHTENED",
      value: 0,
      sign: "+",
    },
    {
      label: "DROPPED FOR NPD",
      value: 0,
      sign: "-",
    },
    {
      label: "SUSPENDED (OTHER)",
      value: 0,
      sign: "-",
    },
    {
      label: "EXPELLED",
      value: 0,
      sign: "-",
    },
  ],
  sectionB: [
    {
      label: "DROPPED FOR NPD",
      value: 0,
    },
    {
      label: " DEMITTED OUT",
      value: 0,
    },
    {
      label: "SUSPENDED (OTHER)",
      value: 0,
    },
    {
      label: "EXPELLED",
      value: 0,
    },
    {
      label: "DECEASED",
      value: 0,
    },
  ],
};

const ChapterReportOverview = () => {
  return (
    <div className="w-full flex flex-col items-center gap-5 p-5">
      <h1 className="text-base font-bold border-b border-b-black w-full text-center">
        Esther Grand Chapter of Louisiana Order of the Eastern Star
      </h1>
      <div className="w-full border-2 border-black p-2 space-y-2">
        <div className="w-full flex items-center justify-center">
          <h2 className="text-sm font-bold">
            Esther Grand Chapter of the Eastern Star
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <h2 className="text-sm font-bold">
            Reports must be postmarked by due date to avoid late fee of $25
          </h2>
          <h4 className="text-base font-medium">
            Chapter Name: Evening Star{" "}
            <span className="font-bold">
              Chapter No. 46 O.E.S, Louisiana Jurisdiction
            </span>
          </h4>
          <h4 className="text-base font-medium">
            APRIL Monthly Installment of Annual Dues from: 2023-04-01 to:
            2023-04-30
          </h4>
          <h4 className="text-base font-medium">
            FOR: Evening Star #46 of , Louisiana
          </h4>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">Section A</h3>
          {data.sectionA.map(({ label, sign, value }, indx) => (
            <div className="space-y-1" key={indx}>
              <div className="flex w-full items-center justify-between">
                <h3 className="font-medium text-base">
                  {indx + 1}. Number of members{" "}
                  <span className="font-bold">{label}</span>: between{" "}
                  {formatDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      1
                    ).toString()
                  )}{" "}
                  and{" "}
                  {formatDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      30
                    ).toString()
                  )}
                </h3>
                <div className="flex gap-2">
                  <span>{sign && `(${sign})`}</span>
                  <span className="min-w-[100px] bg-blue-300 text-end px-1">
                    {value}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-1 pt-6">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-bold text-base">SUBTOTAL SECTION A:</h3>
              <div className="flex gap-2">
                <span className="min-w-[100px] bg-blue-300 text-end px-1">
                  {data.sectionA.reduce(
                    (prev, current) => prev + current.value,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">Section B</h3>
          {data.sectionB.map(({ label, value }, indx) => (
            <div className="space-y-1" key={indx}>
              <div className="flex w-full items-center justify-between">
                <h3 className="font-medium text-base">
                  {indx + 1}. Number of members{" "}
                  <span className="font-bold">{label}</span>: between{" "}
                  {formatDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      1
                    ).toString()
                  )}{" "}
                  and{" "}
                  {formatDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      30
                    ).toString()
                  )}
                </h3>
                <div className="flex gap-2">
                  <span className="min-w-[100px] bg-blue-300 text-end px-1">
                    {value}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-1 pt-6">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-bold text-base">SUBTOTAL SECTION B:</h3>
              <div className="flex gap-2">
                <span className="min-w-[100px] bg-blue-300 text-end px-1">
                  {data.sectionB.reduce(
                    (prev, current) => prev + current.value,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">Section B</h3>
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-medium text-base bg-yellow-400">
                MEMBERSHIP TOTAL on 14 April 2023
              </h3>
              <div className="flex gap-2">
                <span className="min-w-[100px] bg-blue-300 text-end px-1">
                  30
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1 pt-6">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-bold text-base">SUBTOTAL SECTION B:</h3>
              <div className="flex gap-2">
                <span className="min-w-[100px] bg-blue-300 text-end px-1">
                  {data.sectionB.reduce(
                    (prev, current) => prev + current.value,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">
            Grand Chapter Per Capita Taxes due as of{" "}
            {formatDate(new Date().toString())}
          </h3>
          {data.sectionA.map(({ label, sign, value }, indx) => (
            <div className="space-y-1" key={indx}>
              <div className="flex w-full items-center justify-between">
                <h3 className="font-medium text-base">
                  {indx + 1}. Number of members{" "}
                  <span className="font-bold">{label}</span>: between{" "}
                  {formatDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      1
                    ).toString()
                  )}{" "}
                  and{" "}
                  {formatDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      30
                    ).toString()
                  )}
                </h3>
                <div className="flex gap-2">
                  <span>{sign && `(${sign})`}</span>
                  <span className="min-w-[100px] bg-blue-300 text-end px-1">
                    {value}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-1 pt-6">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-bold text-base">SUBTOTAL SECTION A:</h3>
              <div className="flex gap-2">
                <span className="min-w-[100px] bg-blue-300 text-end px-1">
                  {data.sectionA.reduce(
                    (prev, current) => prev + current.value,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterReportOverview;
