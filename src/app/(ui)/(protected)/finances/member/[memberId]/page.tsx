import { notFound } from "next/navigation";
import React from "react";

const MemberFinances = ({
  params: { memberId },
}: {
  params: { memberId?: string };
}) => {
  if (!memberId) {
    return notFound();
  }

  return <div>MemberFinances</div>;
};

export default MemberFinances;
