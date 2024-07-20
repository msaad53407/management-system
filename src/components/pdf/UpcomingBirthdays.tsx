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

// Mock data
const month = "July";
const upcomingBirthdays = [
  { id: 1, name: "John Doe", rank: "Captain", birthday: "July 5" },
  { id: 2, name: "Jane Smith", rank: "Lieutenant", birthday: "July 15" },
];

export const UpcomingBirthdaysPDFViewer = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.heading}>Upcoming Birthdays</Text>
        <Text style={styles.heading}>{month}</Text>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCol, styles.tableHeaderText]}>Name</Text>
          <Text style={[styles.tableCol, styles.tableHeaderText]}>Rank</Text>
          <Text style={[styles.tableCol, styles.tableHeaderText]}>
            Birthday
          </Text>
        </View>
        {upcomingBirthdays.map((member) => (
          <View key={member.id} style={styles.tableRow}>
            <Text style={styles.tableCol}>{member.name}</Text>
            <Text style={styles.tableCol}>{member.rank}</Text>
            <Text style={styles.tableCol}>{member.birthday}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default function UpcomingBirthdaysPDF({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PDFDownloadLink
      document={<UpcomingBirthdaysPDFViewer />}
      fileName="upcoming-birthdays.pdf"
    >
      {({ loading }) =>
        loading ? (
          <LoadingSpinner className="size-8" />
        ) : (
          <Button className="px-4 py-2 w-fit rounded-xl bg-purple-700 hover:bg-purple-600">
            {children}
          </Button>
        )
      }
    </PDFDownloadLink>
  );
}
