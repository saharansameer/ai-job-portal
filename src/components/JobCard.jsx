import React from "react";
import Markdown from "react-markdown";

export function JobCard({ title, description }) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-border shadow-2xs p-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <Markdown>{description}</Markdown>
    </div>
  );
}
