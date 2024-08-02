"use client";

import { addDistrict } from "@/actions/district";
import InfoMessageCard from "@/components/InfoMessageCard";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFormAction from "@/hooks/useFormAction";

const districtFormFields = [
  {
    label: "Name",
    id: "name",
  },
  {
    label: "District Charter Date",
    id: "districtCharterDate",
    type: "date",
  },
  {
    label: "District Meet 1",
    id: "districtMeet1",
  },
  {
    label: "District Meet 2",
    id: "districtMeet2",
  },
];

const districtDeputyFormFields = [
  {
    label: "First Name",
    id: "firstName",
  },
  {
    label: "Last Name",
    id: "lastName",
  },
  {
    label: "Username",
    id: "username",
  },
  {
    label: "Email",
    id: "email",
    type: "email",
  },
  {
    label: "Password",
    id: "password",
    type: "password",
  },
];

const AddDistrictForm = () => {
  const {
    formAction,
    formMessage,
    formState,
    infoMessage,
    setInfoMessage,
  } = useFormAction(addDistrict);

  return (
    <>
      {infoMessage.message && (
        <InfoMessageCard
          message={infoMessage.message}
          clearMessage={setInfoMessage}
          variant={infoMessage.variant}
        />
      )}
      <form
        className="grid grid-cols-1 gap-5 w-full overflow-x-hidden p-2"
        action={formAction}
      >
        
        <h3 className="text-xl font-semibold text-slate-600">
          District Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {districtFormFields.map(({ id, label, type }, indx) => (
            <div className="w-full flex flex-col gap-1" key={indx}>
              <p className="text-red-500 text-xs font-medium">
                {typeof formMessage === "string"
                  ? ""
                  : formMessage && formMessage[id]}
              </p>
              <Label htmlFor={id} className="text-slate-600">
                {label}
              </Label>
              <Input id={id} type={type || "text"} name={id} />
            </div>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-slate-600">Deputy Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {districtDeputyFormFields.map(({ id, label, type }, indx) => (
            <div className="w-full flex flex-col gap-1" key={indx}>
              <p className="text-red-500 text-xs font-medium">
                {typeof formMessage === "string"
                  ? ""
                  : formMessage && formMessage[id]}
              </p>
              <Label htmlFor={id} className="text-slate-600">
                {label}
              </Label>
              <Input id={id} type={type || "text"} name={id} />
            </div>
          ))}
        </div>
        <SubmitButton>Add District</SubmitButton>
      </form>
    </>
  );
};

export default AddDistrictForm;
