import { Types } from "mongoose";
import React from "react";

const ChapterSettings = ({
  params: { chapterId },
}: {
  params: { chapterId?: Types.ObjectId };
}) => {
  return <div>ChapterSettings {chapterId?.toString()}</div>;
};

export default ChapterSettings;
