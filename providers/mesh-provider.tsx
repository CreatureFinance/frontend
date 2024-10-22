"use client";

import { MeshProvider } from "@meshsdk/react";
import { ReactNode } from "react";

const DynamicMeshProvider = ({ children }: { children: ReactNode }) => {
  return <MeshProvider>{children}</MeshProvider>;
};

export default DynamicMeshProvider;
