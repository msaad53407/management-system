import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editMember } from "@/actions/chapter";
import { MemberDocument } from "@/models/member";

export default function EditMemberForm({
  memberId,
  member,
}: {
  memberId: string;
  member: MemberDocument;
}) {
  const fields = [
    {
      label: "Member ID",
      id: "memberId",
      placeholder: "3",
      type: "text",
      defaultValue: member.userId,
    },
    {
      label: "First Name",
      id: "firstName",
      placeholder: "Donald",
      defaultValue: member.firstName,
      type: "text",
    },
    {
      label: "Middle Name",
      id: "middleName",
      placeholder: "Middle Name",
      type: "text",
      defaultValue: member.middleName,
    },
    {
      label: "Last Name",
      id: "lastName",
      placeholder: "Duck",
      type: "text",
      defaultValue: member.lastName,
    },
    {
      label: "Email Address",
      id: "emailAddress",
      placeholder: "donald@gecosla.com",
      type: "email",
      defaultValue: member.email,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Password",
      type: "password",
      defaultValue: member.password,
    },
    {
      label: "Phone Number",
      id: "phoneNumber",
      placeholder: "4443467891",
      type: "text",
      defaultValue: member.phoneNumber1,
    },
    {
      label: "Address",
      id: "address",
      placeholder: "donald way",
      type: "text",
      defaultValue: member.address1,
    },
    {
      label: "City",
      id: "city",
      placeholder: "marrero",
      type: "text",
      defaultValue: member.city,
    },
    {
      label: "State",
      id: "state",
      placeholder: "Louisiana",
      type: "text",
      defaultValue: member.state?.toString(),
    },
    {
      label: "Zipcode",
      id: "zipcode",
      placeholder: "34567",
      type: "text",
      defaultValue: member.zipCode,
    },
    {
      label: "Petitioner 1",
      id: "petitioner1",
      placeholder: "S Williams",
      type: "text",
      defaultValue: member.sponsor1,
    },
    {
      label: "Petitioner 2",
      id: "petitioner2",
      placeholder: "M W",
      type: "text",
      defaultValue: member.sponsor2,
    },
    {
      label: "Petitioner 3",
      id: "petitioner3",
      placeholder: "SL",
      type: "text",
      defaultValue: member.sponsor3,
    },
    {
      label: "Member Status",
      id: "memberStatus",
      placeholder: "Regular",
      type: "text",
    },
    {
      label: "Chapter Office",
      id: "chapterOffice",
      placeholder: "Worthy Patron",
      type: "text",
      defaultValue: member.chapterOffice?.toString(),
    },
    {
      label: "Grand Chapter Office",
      id: "grandChapterOffice",
      placeholder: "None",
      type: "text",
      defaultValue: member.grandOffice?.toString(),
    },
    {
      label: "Member Rank",
      id: "memberRank",
      placeholder: "Select Member Rank",
      type: "text",
    },
    {
      label: "Birthdate",
      id: "birthdate",
      placeholder: "04/15/1960",
      type: "date",
      defaultValue: member.birthDate?.toString(),
    },
    {
      label: "Initiation Date",
      id: "initiationDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.initiationDate?.toString(),
    },
    {
      label: "Queen of the South",
      id: "queenOfTheSouth",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.queenOfSouthDate?.toString(),
    },
    {
      label: "Amarant",
      id: "amarant",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.amaranthDate?.toString(),
    },
    {
      label: "Petition Date",
      id: "petitionDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.petitionDate?.toString(),
    },
    {
      label: "Petition Received",
      id: "petitionReceived",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.petitionReceivedDate?.toString(),
    },
    {
      label: "Demit In",
      id: "demitIn",
      placeholder: "mm/dd/yyyy",
      type: "date",

      defaultValue: member.demitInDate?.toString(),
    },
    {
      label: "Demit Out",
      id: "demitOut",
      placeholder: "mm/dd/yyyy",
      type: "date",

      defaultValue: member.demitOutDate?.toString(),
    },
    {
      label: "Demit to Chapter",
      id: "demitToChapter",
      placeholder: "Demit to Chapter",
      type: "text",
    },
    {
      label: "Investigation Date",
      id: "investigationDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.investigationDate?.toString(),
    },
    {
      label: "Investigation Accept/Reject",
      id: "investigationAcceptReject",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.investigationAcceptOrRejectDate?.toString(),
    },
    {
      label: "Enlightened Date",
      id: "enlightenedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.enlightenDate?.toString(),
    },
    {
      label: "Dropped Date",
      id: "droppedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.dropDate?.toString(),
    },
    {
      label: "Drop Reason",
      id: "dropReason",
      placeholder: "Select Drop Reason",
      type: "text",
      defaultValue: member.dropReason?.toString(),
    },
    {
      label: "Suspension/Expelled Date",
      id: "suspensionExpelledDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.suspendDate?.toString(),
    },
    {
      label: "Suspension/Expelled Reason",
      id: "suspensionExpelledReason",
      placeholder: "Select Suspension/Expelled Reason",
      type: "text",
      defaultValue: member.suspendReason?.toString(),
    },
    {
      label: "Reinstated Date",
      id: "reinstatedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
    },
    {
      label: "Date of Death",
      id: "dateOfDeath",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.deathDate?.toString(),
    },
    {
      label: "Actual Date of Death",
      id: "actualDateOfDeath",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.actualDeathDate?.toString(),
    },
    {
      label: "Place of Death",
      id: "placeOfDeath",
      placeholder: "Place of Death",
      type: "text",
      defaultValue: member.deathPlace,
    },
    {
      label: "Emergency Contact",
      id: "emergencyContact",
      placeholder: "Emergency Contact",
      type: "text",
    },
    {
      label: "Emergency Contact Phone No",
      id: "emergencyContactPhone",
      placeholder: "Emergency Contact Phone No",
      type: "text",
    },
  ];

  return (
    <form className="flex flex-col gap-4" action={editMember}>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {fields.map(({ id, label, placeholder, type, defaultValue }, indx) => (
          <div className="space-y-2" key={indx}>
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              placeholder={placeholder}
              type={type}
              name={id}
              defaultValue={defaultValue}
            />
          </div>
        ))}
        <div className="col-span-full space-y-2">
          <Label htmlFor="secretaryNotes">Secretary Notes</Label>
          <Textarea
            id="secretaryNotes"
            placeholder="Secretary Notes"
            className="min-h-[100px]"
          />
        </div>
      </div>
      <div className="w-1/2 mx-auto">
        <Button
          type="submit"
          className="w-1/2 mx-auto bg-purple-800 hover:bg-purple-700 text-white"
        >
          Update Member
        </Button>
      </div>
    </form>
  );
}
