"use client";

import { ChapterDocument } from "@/models/chapter";
import { StatusDocument } from "@/models/status";
import { ChapterReportAggregation } from "@/types/globals";
import { capitalize, formatDate, getDaysInMonth, getMonth } from "@/utils";
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
  },
  header: {
    textAlign: "center",
    borderBottom: "1px solid black",
    paddingBottom: 5,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    width: "100%",
    border: "1px solid black",
    padding: 10,
    marginBottom: 5,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginHorizontal: "auto",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 10,
  },
  amount: {
    width: 50,
    backgroundColor: "#cce5ff",
    textAlign: "right",
    paddingRight: 5,
  },
  subtotal: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    textAlign: "center",
    padding: 5,
  },
  footer: {
    borderTop: "1px solid black",
    marginTop: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  table: {
    // @ts-ignore
    display: "table",
    width: "100%",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    width: "100%",
  },
  tableCellHeader: {
    borderBottom: "2px solid black",
    borderRight: "2px solid black",
    padding: 4,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "left",
    width: "25%",
  },
  tableCell: {
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    padding: 4,
    fontSize: 10,
    width: "25%",
  },
  lastTableCell: {
    borderBottom: "1px solid black",
    padding: 4,
    fontSize: 10,
    width: "10%",
  },
});

const ChapterReport = ({
  data,
}: {
  data: {
    report: ChapterReportAggregation & {
      regularMembersCount: number;
      specialMembersCount: number;
    };
    statuses: StatusDocument[];
    chapters: ChapterDocument[];
  };
}) => {
  const startOfMonth = formatDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toString()
  );
  const endOfMonth = formatDate(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      Number(getDaysInMonth(new Date().getMonth()))
    ).toString()
  );

  const headings = {
    sectionA: [
      {
        label: "on roll on last report",
        value: data.report.activeMembersLastMonth.length,
      },
      {
        label: "INITIATED",
        value: data.report.initiatedMembersMonthCount,
      },
      {
        label: "REINSTATED",
        value: data.report.reinstatedMembersMonthCount,
      },
      {
        label: "ENLIGHTENED",
        value: data.report.enlightenedMembersCount,
      },
    ],
    sectionB: [
      {
        label: "DROPPED FOR NPD",
        value: data.report.droppedMembersCount,
      },
      {
        label: " DEMITTED OUT",
        value: data.report.demittedMembersMonthCount,
      },
      {
        label: "SUSPENDED (OTHER)",
        value: data.report.suspendedMembersMonthCount,
      },
      {
        label: "EXPELLED",
        value: data.report.expelledMembersMonthCount,
      },
      {
        label: "DECEASED",
        value: data.report.deceasedMembersMonthCount,
      },
    ],
    taxes: [
      {
        label: `Per Capita Taxes (per regular member on roll (${data.report.regularMembersCount})) @ $4.00`,
        perMember: 4,
        members: data.report.regularMembersCount,
      },
      {
        label: `Per Capita Taxes (per special member on roll (${data.report.specialMembersCount})) @ $3.00`,
        perMember: 3,
        members: data.report.specialMembersCount,
      },
      {
        label: `Reinstatement fee ${data.report.reinstatedMembersAfterYearCount} member(s) @ $15.00 ea. (dropped over than one (1) year)`,
        perMember: 15,
        members: data.report.reinstatedMembersAfterYearCount,
      },
      {
        label: `Reinstatement fee ${data.report.reinstatedMembersInYearCount} member(s) @ $10.00 ea. (dropped less than one (1) year) `,
        perMember: 10,
        members: data.report.reinstatedMembersInYearCount,
      },
      {
        label: `Received by Demit-In ${data.report.demittedInMembersMonthCount} @$3.00`,
        perMember: 3,
        members: data.report.demittedInMembersMonthCount,
      },
      {
        label: "Certificates (0) @ $10.00",
        perMember: 10,
        members: 0,
      },
      {
        label: "Technology Fee @ $10.00 monthly",
        perMember: 10,
        members: 1,
      },
    ],
  };

  const subTotalSectionA = headings.sectionA.reduce((a, b) => a + b.value, 0);
  const subTotalSectionB =
    headings.sectionB.reduce((a, b) => a + b.value, 0) * -1;

  return (
    <Document>
      <Page style={styles.container} size="A4">
        <View>
          <Text style={styles.header}>
            Esther Grand Chapter of Louisiana Order of the Eastern Star
          </Text>
          <View style={{ ...styles.section, border: "none" }}>
            <View style={styles.logoRow}>
              <Image style={styles.logo} src="/upload/logo.png" />
              <Text style={styles.title}>
                Esther Grand Chapter of the Eastern Star
              </Text>
              <Image style={styles.logo} src="/upload/logo.png" />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginBottom: 5,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Text style={styles.subtitle}>
                Reports must be postmarked by due date to avoid late fee of $25
              </Text>
              <Text style={styles.text}>
                Chapter Name: {data?.report.name}{" "}
                <Text style={styles.boldText}>
                  Chapter No. {data?.report.chapterNumber} O.E.S, Louisiana
                  Jurisdiction
                </Text>
              </Text>
              <Text style={styles.text}>
                {getMonth(new Date().toString())} Monthly Installment of Annual
                Dues from: {startOfMonth} to: {endOfMonth}
              </Text>
              <Text style={styles.text}>
                FOR: {data?.report.name} #{data?.report.chapterNumber} of ,
                Louisiana
              </Text>
            </View>

            <View>
              <Text style={{ ...styles.sectionTitle, fontWeight: "extrabold" }}>
                Section A
              </Text>
              {headings.sectionA.map(({ label, value }, indx) => (
                <View key={indx} style={styles.item}>
                  <Text style={styles.itemText}>
                    {indx + 1}. Number of members{" "}
                    <Text style={{ fontWeight: "extrabold" }}>{label}</Text>:
                    {!label.includes("report") &&
                      `between ${startOfMonth} and ${endOfMonth}`}
                  </Text>
                  <Text style={{ ...styles.amount, fontSize: 12 }}>
                    {value}
                  </Text>
                </View>
              ))}
              <View style={styles.subtotal}>
                <Text style={{ fontSize: 12 }}>SUBTOTAL SECTION A:</Text>
                <Text style={{ ...styles.amount, fontSize: 12 }}>
                  {subTotalSectionA}
                </Text>
              </View>
            </View>

            <View>
              <Text style={{ ...styles.sectionTitle, fontWeight: "extrabold" }}>
                Section B
              </Text>
              {headings.sectionB.map(({ label, value }, indx) => (
                <View key={indx} style={styles.item}>
                  <Text style={styles.itemText}>
                    {indx + 1}. Number of members{" "}
                    <Text style={styles.boldText}>{label}</Text>: between{" "}
                    {startOfMonth} and {endOfMonth}
                  </Text>
                  <Text style={{ ...styles.amount, fontSize: 12 }}>
                    {value}
                  </Text>
                </View>
              ))}
              <View style={styles.subtotal}>
                <Text style={{ fontSize: 12 }}>SUBTOTAL SECTION B:</Text>
                <Text style={{ ...styles.amount, fontSize: 12 }}>
                  {subTotalSectionB}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 12 }}>
                MEMBERSHIP TOTAL on {formatDate(new Date().toString())}
              </Text>
              <Text style={{ ...styles.amount, fontSize: 12 }}>
                {subTotalSectionA + subTotalSectionB}
              </Text>
            </View>

            <View>
              <Text style={{ ...styles.sectionTitle, paddingHorizontal: 10 }}>
                Grand Chapter Per Capita Taxes due as of{" "}
                {formatDate(new Date().toString())}
              </Text>
              {headings.taxes.map(({ label, members, perMember }, indx) => (
                <View key={indx} style={styles.item}>
                  <Text style={styles.itemText}>
                    {indx + 1}. {label}
                  </Text>
                  <Text style={{ ...styles.amount, fontSize: 12 }}>
                    ${(perMember || 0) * (members || 0)}
                  </Text>
                </View>
              ))}
              <View style={styles.subtotal}>
                <Text style={{ fontSize: 12 }}>Total Due Grand Chapter:</Text>
                <Text style={{ ...styles.amount, fontSize: 12 }}>
                  $
                  {headings.taxes.reduce(
                    (prev, current) =>
                      prev + (current.perMember || 0) * (current.members || 0),
                    0
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View>
                <Text style={styles.text}>
                  Send this report and all checks to the office of the Grand
                  Secretary
                </Text>
                <Text style={styles.text}>Original: Grand Secretary</Text>
                <Text style={styles.text}>Copy: Grand Worthy Matron</Text>
                <Text style={styles.text}>Copy: Chapter Files</Text>
              </View>
              <View>
                <Text style={styles.text}>WM Sis. Kavadas, Cox</Text>
                <Text style={styles.text}>Sec Embry-Flemings, LaTarsha</Text>
                <Text style={styles.text}>WP Bro. Delmus, Dunn</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
      <Page style={styles.container} size={"A4"}>
        <View>
          <Text style={styles.header}>
            Esther Grand Chapter of Louisiana Order of the Eastern Star
          </Text>

          <View style={{ ...styles.section, border: "none" }}>
            <View
              style={{
                ...styles.sectionHeader,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text style={styles.sectionTitle}>Initiated During the Year</Text>
              <Text style={styles.sectionTitle}>
                Number of members: {data?.report.initiatedMembers.length}
              </Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Name of Candidate
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Date
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Address
                </Text>
              </View>
              {data?.report.initiatedMembers.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {formatDate(member.initiationDate?.toString())}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                    {member.address1} {member.address2}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>Reinstated During the Year</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Date Suspended
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Date Reinstated
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "25%" }}>
                  Address
                </Text>
              </View>
              {data?.report.reinstatedMembers.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {formatDate(member.suspendDate?.toString())}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {formatDate(member.reinstatedDate?.toString())}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "25%" }}>
                    {member.address1} {member.address2}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>Deceased During the Year</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Place of Death
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Date of Death
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "25%" }}>
                  Address
                </Text>
              </View>
              {data?.report.deceasedMembers.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {member.deathPlace}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {formatDate(member.deathDate?.toString())}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "25%" }}>
                    {member.address1} {member.address2}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>Demitted During the Year</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Chapter Demitted to
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "25%" }}>
                  Date of Demit
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "25%" }}>
                  Address
                </Text>
              </View>
              {data?.report.demittedMembers.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>{}</Text>
                  <Text style={{ ...styles.tableCell, width: "25%" }}>
                    {formatDate(
                      data.chapters.find(
                        (c) =>
                          c._id.toString() === member.demitToChapter?.toString()
                      )?.name ?? ""
                    )}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "25%" }}>
                    {member.address1} {member.address2}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>
              Petitioners Rejected During the Year
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Date Rejected
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                  Address
                </Text>
              </View>
              {/* {data?.report.petitionersRejected.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {member.name}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {member.date}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                    {member.address}
                  </Text>
                </View>
              ))} */}
            </View>
          </View>

          <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>Suspended During the Year</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Date Suspended
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                  Months Delinquent Amount Owed Address
                </Text>
              </View>
              {data?.report.suspendedMembers.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {formatDate(member.suspendDate?.toString())}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                    {member.address1} {member.address2}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>Expelled from Membership</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Date Expelled / Expelled Reason
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                  Address
                </Text>
              </View>
              {data?.report.expelledMembers.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={{ ...styles.tableCell, width: "33%" }}>
                    {formatDate(member.expelDate?.toString())}
                  </Text>
                  <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                    {member.address1} {member.address2}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* <View style={{ ...styles.section, border: "none" }}>
            <Text style={styles.sectionTitle}>Life Memberships</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Name
                </Text>
                <Text style={{ ...styles.tableCellHeader, width: "33%" }}>
                  Service Years
                </Text>
                <Text style={{ ...styles.lastTableCell, width: "33%" }}>
                  Address
                </Text>
              </View>
              {lifeMemberships.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={{...styles.tableCell, width: "33%"}}>{member.name}</Text>
                  <Text style={{...styles.tableCell, width: "33%"}}>{member.years}</Text>
                  <Text style={{...styles.lastTableCell, width: "33%"}}>{member.address}</Text>
                </View>
              ))}
            </View>
          </View> */}
        </View>
      </Page>
      <Page style={styles.container} size="A4">
        <View>
          <Text style={styles.header}>
            Esther Grand Chapter of Louisiana Order of the Eastern Star
          </Text>
          <View>
            <Text style={styles.title}>
              {new Date().getFullYear()} {data?.report.name}{" "}
              {data?.report.chapterNumber} Roster
            </Text>
            <Text style={styles.title}>
              Number of members: {data?.report.allMembers.length}
            </Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCellHeader}>Member Name</Text>
                <Text style={styles.tableCellHeader}>Mobile Phone</Text>
                <Text style={styles.tableCellHeader}>Member Status</Text>
                <Text style={styles.tableCellHeader}>Address</Text>
                <Text style={styles.tableCellHeader}>Years of Service</Text>
              </View>
              {/* Table Rows */}
              {data?.report.allMembers.map((member) => (
                <View key={member.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {`${member.firstName} ${member.middleName || ""} ${
                      member.lastName
                    }`}
                  </Text>
                  <Text style={styles.tableCell}>{member.phoneNumber1}</Text>
                  <Text style={styles.tableCell}>
                    {
                      data.statuses.find(
                        (status) =>
                          status._id.toString() === member.status?.toString()
                      )?.name
                    }
                  </Text>
                  <Text style={styles.tableCell}>
                    {member.address1} {member?.address2 || ""}
                  </Text>
                  <Text style={styles.lastTableCell}>
                    {Math.max(
                      0,
                      new Date(
                        new Date().getTime() -
                          new Date(member.createdAt || Date.now()).getTime()
                      ).getUTCFullYear() - 1970
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const ChapterReportsDownloadLink = ({
  data,
}: {
  data: {
    report: ChapterReportAggregation & {
      regularMembersCount: number;
      specialMembersCount: number;
    };
    statuses: StatusDocument[];
    chapters: ChapterDocument[];
  };
}) => {
  return (
    <PDFDownloadLink
      document={<ChapterReport data={data} />}
      fileName={`${capitalize(data.report.name)} - Chapter Report - ${getMonth(
        new Date()
      )}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <LoadingSpinner className="size-8" />
        ) : (
          <Button className="px-4 py-2 w-fit rounded-xl bg-button-primary hover:bg-button-primary text-white">
            ChapterReport
          </Button>
        )
      }
    </PDFDownloadLink>
  );
};
