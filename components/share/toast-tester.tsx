"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";

const TEST_Toast = () => {
  return <p onClick={() => toast.success("hello")}>123</p>;
};

export default TEST_Toast;
