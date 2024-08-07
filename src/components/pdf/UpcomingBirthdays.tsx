"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";
import { BirthdayAggregationResult } from "@/types/globals";
import { formatDate, getMonth } from "@/utils";
import { RankDocument } from "@/models/rank";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
  },
  text: {
    margin: 12,
    fontSize: 12,
    textAlign: "center",
  },
  table: {
    //@ts-expect-error
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#d3d3d3",
  },
  tableHeaderText: {
    fontWeight: "bold",
  },
});

export const UpcomingBirthdaysPDFViewer = ({
  upcomingBirthdays,
  ranks,
}: {
  upcomingBirthdays: BirthdayAggregationResult[];
  ranks: RankDocument[];
}) => {
  const month = getMonth(new Date());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.heading}>Upcoming Birthdays</Text>
          <Text style={styles.heading}>{month}</Text>
        </View>
        {upcomingBirthdays.length > 0 ? (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>
                Name
              </Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>
                Rank
              </Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>
                Birthday
              </Text>
            </View>
            {upcomingBirthdays.map((birthday, indx) => (
              <View key={indx} style={styles.tableRow}>
                <Text style={styles.tableCol}>
                  {birthday.firstName +
                    " " +
                    birthday.middleName +
                    " " +
                    birthday.lastName}
                </Text>
                <Text style={styles.tableCol}>
                  {ranks.find((rank) => rank._id === birthday.rank)?.name}
                </Text>
                <Text style={styles.tableCol}>
                  {formatDate(birthday.birthDate)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={styles.text}>No Upcoming Birthdays in {month}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default function UpcomingBirthdaysPDF({
  upcomingBirthdays,
  ranks,
  children,
}: {
  upcomingBirthdays: BirthdayAggregationResult[];
  ranks: RankDocument[];
  children: React.ReactNode;
}) {
  return (
    <PDFDownloadLink
      document={
        <UpcomingBirthdaysPDFViewer
          upcomingBirthdays={upcomingBirthdays}
          ranks={ranks}
        />
      }
      fileName={`Upcoming Birthdays - ${getMonth(new Date())}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <LoadingSpinner className="size-8" />
        ) : (
          <Button className="px-4 py-2 w-fit rounded-xl bg-button-primary hover:bg-button-primary text-white">
            {children}
          </Button>
        )
      }
    </PDFDownloadLink>
  );
}
