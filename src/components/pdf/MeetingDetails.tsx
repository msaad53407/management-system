/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
// "use client";

import { MeetingDocument } from "@/models/meeting";
import { capitalize } from "@/utils";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  Text as HTMLText,
} from "html-react-parser";

type Props = { data: MeetingDocument };

const styles = StyleSheet.create({
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
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  subheader: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  center: {
    textAlign: "center",
  },
});

const MeetingDetailsDocument = ({ data }: Props) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        switch (domNode.name) {
          case "div":
            if (
              domNode.attribs.style &&
              domNode.attribs.style.includes("display: flex;")
            ) {
              return (
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 10,
                    width: "100%",
                    marginHorizontal: "auto",
                  }}
                >
                  <Image
                    src="/upload/logo.png"
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              );
            }
            return <View>{domToReact(domNode.children, options)}</View>;
          case "h3":
            return (
              <Text style={[styles.header, styles.center]}>
                {domToReact(domNode.children, options)}
              </Text>
            );
          case "h4":
            return (
              <Text style={styles.subheader}>
                {domToReact(domNode.children, options)}
              </Text>
            );
          case "p":
            return (
              <Text style={styles.paragraph}>
                {domToReact(domNode.children, options)}
              </Text>
            );
          case "ul":
          case "ol":
            return (
              <View
                style={{
                  ...styles.subheader,
                  marginLeft: 20,
                  textAlign: "start",
                }}
              >
                {domToReact(domNode.children, options)}
              </View>
            );
          case "li":
            return (
              <Text
                style={{
                  width: "100%",
                }}
              >
                • {domToReact(domNode.children, options)}
              </Text>
            );

          case "strong":
          case "b":
            return (
              <Text style={styles.bold}>
                {domToReact(domNode.children, options)}
              </Text>
            );
          default:
            return undefined;
        }
      }
      if (domNode instanceof HTMLText && domNode.data.trim()) {
        return <Text>{domNode.data}</Text>;
      }
    },
  };

  const parsedContent = parse(data.meetingDoc, options);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Meeting Details</Text>
          <View style={styles.section}>
            <Text style={styles.summary}>
              Date: {new Date(data.meetingDate).toISOString().split("T")[0]}
            </Text>
            <Text style={styles.summary}>
              Document Type: {capitalize(data.meetingDocType)}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontFamily: "Helvetica", fontSize: 12 }}>
              {parsedContent}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MeetingDetailsDocument;
