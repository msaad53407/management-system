import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  chapterNumber?: number;
  payee: string;
  treasurerName: string;
  billAmount: number;
  onAccountOf: string;
  billDate: Date;
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const billDetails = {
  background: "#f4f4f4",
  borderRadius: "4px",
  padding: "24px",
  margin: "16px 0",
};

const btn = {
  backgroundColor: "#5469d4",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const BillReviewEmail = ({
  treasurerName,
  billAmount,
  onAccountOf,
  billDate,
  payee,
  chapterNumber,
}: Props) => (
  <Html>
    <Head />
    <Preview>Bill Payment Request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bill Payment Request</Heading>
        <Text style={text}>
          Dear Treasurer, {treasurerName} of Chapter #{chapterNumber},
        </Text>
        <Text style={text}>
          A bill has been approved and requires payment. Please review the
          details below:
        </Text>
        <Section style={billDetails}>
          <Text style={text}>
            <strong>Amount:</strong> {billAmount} $
          </Text>
          <Text style={text}>
            <strong>Description:</strong> {onAccountOf}
          </Text>
          <Text style={text}>
            <strong>Payee:</strong> {payee}
          </Text>
          <Text style={text}>
            <strong>Date:</strong>{" "}
            {new Date(billDate).toISOString().split("T")[0]}
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated message. If you have any questions, please
          contact the Worthy Matron or Secretary.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BillReviewEmail;
