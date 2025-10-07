import React from "react";
import type { LabelProps } from "../../../types/Label";

const Label: React.FC<LabelProps> = ({ children }) => {
  return <label className="text-sm uppercase">{children}</label>;
};

export default Label;
