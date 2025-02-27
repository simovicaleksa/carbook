"use client";

export default function Copyright() {
  const year = new Date().getFullYear();

  return (
    <span className="text-muted-foreground">
      &copy; {year} CarBook . All rights reserved.
    </span>
  );
}
