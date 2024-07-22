/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";
import { FinancesAggregationResult } from "@/types/globals";
import { getMonth } from "@/utils";
import { DistrictDocument } from "@/models/district";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
  },
  subheading2: {
    fontSize: 14,
    marginBottom: 10,
  },
  member: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  memberImage: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  memberDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  memberText: {
    width: "33%",
  },
  chartImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
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

export const SystemDetailsPDFViewer = ({
  districts,
  finances,
}: {
  districts: DistrictDocument[];
  finances: FinancesAggregationResult[];
}) => {
  return (
    <Document language="en">
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>{`System Details`}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading2}>All Districts</Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.tableHeaderText]}>Name</Text>
          </View>
          {districts.map((district) => (
            <View key={district.id} style={styles.tableRow}>
              <Text style={styles.tableCol}>{district.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.header}>
          <Text style={styles.heading2}>All Members Finances</Text>
          <Text style={styles.heading2}>{getMonth(new Date())}</Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.tableHeaderText]}>
              Members
            </Text>
            <Text style={[styles.tableCol, styles.tableHeaderText]}>
              Paid Dues
            </Text>
            <Text style={[styles.tableCol, styles.tableHeaderText]}>
              Total Dues
            </Text>
          </View>
          {finances.length > 0 ? (
            finances.map(
              ({ firstName, lastName, paidDues, totalDues }, indx) => (
                <View key={indx} style={styles.tableRow}>
                  <Text style={styles.tableCol}>
                    {firstName + " " + lastName}
                  </Text>
                  <Text style={styles.tableCol}>{paidDues}</Text>
                  <Text style={styles.tableCol}>{totalDues}</Text>
                </View>
              )
            )
          ) : (
            <View>
              <Text style={styles.text}>No Members Finances Data</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default function SystemDetailsPDF({
  districts,
  finances,
  children,
}: {
  districts: DistrictDocument[];
  children: React.ReactNode;
  finances: FinancesAggregationResult[];
}) {
  return (
    <PDFDownloadLink
      document={
        <SystemDetailsPDFViewer districts={districts} finances={finances} />
      }
      fileName="system-details.pdf"
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
