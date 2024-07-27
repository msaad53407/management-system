"use client";

import { formatDate } from "@/utils";
import React from "react";
import { Button } from "../ui/button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MemberDocument } from "@/models/member";

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
  taxes: [
    {
      label: "Per Capita Taxes (per regular member on roll (38)) @ $4.00",
      perMember: 4,
      members: 38,
    },
    {
      label: "Per Capita Taxes (per special member on roll (8)) @ $3.00",
      perMember: 3,
      members: 8,
    },
    {
      label:
        " Reinstatement fee 0 member(s) @ $15.00 ea. (dropped over than one (1) year)",
      perMember: 15,
      members: 0,
    },
    {
      label:
        "Reinstatement fee 0 member(s) @ $10.00 ea. (dropped less than one (1) year) ",
      perMember: 10,
      members: 0,
    },
    {
      label: "Received by Demit-In 0 @$3.00",
      perMember: 3,
      members: 0,
    },
    {
      label: "Certificates (0) @ $10.00",
      perMember: 10,
      members: 0,
    },
    {
      label: "Duplicate Certificates (0) @ $10.00",
      perMember: 10,
      members: 0,
    },
    {
      label: "Technology Fee @ $10.00 monthly",
    },
  ],
  members: [
    {
      memberName: "John Doe",
      mobilePhone: "555-555-5555",
      address: "123 Main Street, City, State 12345",
      memberStatus: "Regular",
      yearsOfService: 0,
    },
    {
      memberName: "Jane Doe",
      mobilePhone: "555-7837-5555",
      address: "123 City, State 12345",
      memberStatus: "Special",
      yearsOfService: 5,
    },
  ],
};

const downloadPDF = () => {
  const capture = document.querySelector<HTMLElement>(".actual-receipt")!;
  html2canvas(capture).then((canvas) => {
    const imgData = canvas.toDataURL("img/png");
    const doc = new jsPDF("l", "px", "a4");
    const componentWidth = doc.internal.pageSize.getWidth();
    const componentHeight = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
    doc.save("receipt.pdf");
  });
};

export const ChapterReportOverview = () => {
  return (
    <>
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
            <div className="space-y-1">
              <div className="flex w-full items-center justify-between">
                <h3 className="font-bold text-base bg-yellow-400">
                  MEMBERSHIP TOTAL on 14 April 2023
                </h3>
                <div className="flex gap-2">
                  <span className="min-w-[100px] bg-blue-300 text-end px-1">
                    30
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">
              Grand Chapter Per Capita Taxes due as of 14 April 2023
            </h3>
            {data.taxes.map(({ label, members, perMember }, indx) => (
              <div className="space-y-1" key={indx}>
                <div className="flex w-full items-center justify-between">
                  <h3 className="font-medium text-base">
                    {indx + 1}. {label}
                  </h3>
                  <div className="flex gap-2">
                    <span className="min-w-[100px] bg-blue-300 text-end px-1">
                      ${(perMember || 0) * (members || 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="space-y-1">
              <div className="flex w-full items-center justify-between">
                <h3 className="font-bold text-base">
                  Total Due Grand Chapter:
                </h3>
                <div className="flex gap-2">
                  <span className="min-w-[100px] bg-blue-300 text-end px-1">
                    $
                    {data.taxes.reduce(
                      (prev, current) =>
                        prev +
                        (current.perMember || 0) * (current.members || 0),
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="!mt-10 border-t-2 border-t-black flex justify-between items-center w-full">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">
                Send this report and all checks to the office of the Grand
                Secretary{" "}
              </p>
              <p>
                Original: Grand Secretary <br />
                Copy: Grand Worthy Matron <br /> Copy: Chapter Files
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">WM Sis. Kavadas, Cox</p>
              <p className="font-bold">Sec Embry-Flemings, LaTarsha</p>
              <p className="font-bold">WP Bro. Delmus, Dunn</p>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={downloadPDF}>Download</Button>
    </>
  );
};

export const ChapterMemberOverview = () => {
  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-base text-center border-b border-b-black">
            Esther Grand Chapter of Louisiana Order of the Eastern Star
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Initiated During the Year
                </h3>
                <p>Number of members: 0</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name of Candidate
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        John Doe
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-04-15
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        123 Main St, Anytown USA
                      </td>
                    </tr>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Jane Smith
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-05-01
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        456 Oak Rd, Somewhere LA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Affiliated During the Year
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Affiliations
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Affiliation Type
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Affiliation Date
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Signed Bylaws
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Alice Johnson
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Esther Chapter No. 123
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Affiliate
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-06-01
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        Yes
                      </td>
                    </tr>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Bob Williams
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Jephthah Chapter No. 456
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Affiliate
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-07-15
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        Yes
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Reinstated During the Year
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date Suspended
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date Reinstated
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Carol Davis
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2022-12-31
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-03-01
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        789 Elm St, Somewhere Else LA
                      </td>
                    </tr>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        David Lee
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-01-15
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-04-01
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        321 Pine Rd, Anytown USA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Deceased During the Year
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Place of death
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date of death
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Eva Green
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Anytown Hospital
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-02-28
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        159 Oak Ln, Somewhere LA
                      </td>
                    </tr>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Frank Reyes
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Home
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-05-01
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        246 Maple St, Anytown USA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Demitted During the Year
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Chapter Demitted to
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date of Demit
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Gina Hernandez
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Jephthah Chapter No. 456
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-06-30
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        369 Elm St, Somewhere Else LA
                      </td>
                    </tr>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Henry Kim
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Esther Chapter No. 123
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-08-15
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        753 Oak Rd, Anytown USA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                PETITIONERS REJECTED DURING THE YEAR
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date Rejected
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Gina Hernandez
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-06-30
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        369 Elm St, Somewhere Else LA
                      </td>
                    </tr>
                    <tr>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        Henry Kim
                      </td>
                      <td className="border-2 border-r-0 border-t-0 border-black px-4 py-2">
                        2023-08-15
                      </td>
                      <td className="border-2 border-t-0 border-black px-4 py-2">
                        753 Oak Rd, Anytown USA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                SUSPENDED DURING THE YEAR
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date Suspended
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Months Delinquent Amount Owed Address
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                EXPELLED FROM MEMBERSHIP
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Date Expelled / Expelled Reason
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">LIFE MEMBERSHIPS</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-2 border-black">
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Service Years
                      </th>
                      <th className="px-4 py-2 text-left border-r-2 border-r-black">
                        Address
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button onClick={downloadPDF}>Download</Button>
    </>
  );
};

export const ChapterMemberDetails = ({
  members,
}: {
  members: MemberDocument[];
}) => {
  return (
    <>
      <Card className="w-full max-w-4xl mx-auto actual-receipt">
        <CardHeader>
          <CardTitle className="text-base text-center border-b border-b-black">
            Esther Grand Chapter of Louisiana Order of the Eastern Star
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-md font-bold">2023 Evening Star 46 Roster</h3>
          <h3 className="text-md font-bold">Number of members: 46</h3>
          <div className="overflow-x-auto !mt-10">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-2 border-black">
                  <th className="px-4 py-2 text-left border-r-2 border-r-black">
                    Member Name
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-r-black">
                    Mobile Phone
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-r-black">
                    Member Status
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-r-black">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-r-black">
                    Years of Service
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-2 border-black">
                    <td className="px-4 py-2 border-r-2 border-r-black">
                      {`${member.firstName} ${
                        member.middleName && member.middleName
                      } ${member.lastName}`}
                    </td>
                    <td className="px-4 py-2 border-r-2 border-r-black">
                      {member.phoneNumber1}
                    </td>
                    <td className="px-4 py-2 border-r-2 border-r-black">
                      {member.status?.toString() || ""}
                    </td>
                    <td className="px-4 py-2 border-r-2 border-r-black">
                      {member.address1}
                    </td>
                    <td className="px-4 py-2 border-r-2 border-r-black">
                      {Math.max(
                        0,
                        new Date(
                          new Date(member.createdAt!).getTime() -
                            new Date().getTime()
                        ).getUTCFullYear() - 1970
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Button onClick={downloadPDF}>Download</Button>
    </>
  );
};
