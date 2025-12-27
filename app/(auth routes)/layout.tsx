"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Це запобігає розбіжностям між сервером і клієнтом (Hydration Error)
  if (!isMounted) {
    return null; // Або <div>Loading...</div>
  }

  return <>{children}</>;
}
