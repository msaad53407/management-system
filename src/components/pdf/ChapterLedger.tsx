import { BillDocument } from "@/models/bill";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CheckIcon, LucideCheck } from "lucide-react";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    marginBottom: 10,
  },
  table: {
    //@ts-ignore
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "14%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  approved: {
    backgroundColor: "#E8F5E9",
    padding: 5,
    marginBottom: 10,
  },
});

type Props = { data: BillDocument[] };

const ChapterLedgerDocument = ({ data }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Bills Summary</Text>
        <Text style={styles.summary}>Number of Bills: {data.length}</Text>
        <Text style={styles.summary}>
          Bill Totals $: {data.reduce((acc, curr) => acc + curr.amount, 0)}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Bill #</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Bill Date</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Bill Amount</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Payee</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>On Account Of</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>WM Approval</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Treasurer Review</Text>
            </View>
          </View>
          {data?.map((bill) => (
            <View style={styles.tableRow} key={bill._id.toString()}>
              <View style={styles.tableCol}>
                <Text
                  // @ts-ignore
                  style={{
                    ...styles.tableCell,
                    overflow: "hidden",
                    display: "-webkit-box",
                    "-webkit-line-clamp": 1,
                    "-webkit-box-orient": "vertical",
                  }}
                >
                  {bill._id.toString()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(bill.date).toISOString().split("T")[0]}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${bill.amount}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{bill.payee}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{bill.onAccountOf}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {bill.workflowStarted
                    ? bill.wmApproval === "Pending"
                      ? "Pending"
                      : bill.wmApproval === "Approved"
                      ? "Approved"
                      : "Declined"
                    : "Inactive"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {bill.workflowStarted
                    ? bill.treasurerReview === "Reviewed"
                      ? "Reviewed"
                      : "Pending"
                    : "Inactive"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default ChapterLedgerDocument;
