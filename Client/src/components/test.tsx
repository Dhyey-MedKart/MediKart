"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


const Test: React.FC = () => {
    const router = useRouter();


  return (
    router.push('/login')
  );
};

export default Test;
