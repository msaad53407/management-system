import { Types } from "mongoose";
import React from "react";

const DistrictSettings = ({
  params: { districtId },
}: {
  params: { districtId?: Types.ObjectId };
}) => {
  return <div>DistrictSettings {districtId?.toString()}</div>;
};

export default DistrictSettings;
