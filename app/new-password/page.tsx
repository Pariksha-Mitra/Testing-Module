import React, { Suspense } from "react";
import NewPassword from "@/components/NewPassword";

const Page = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <NewPassword />
    </Suspense>
  );
};

export default Page;
