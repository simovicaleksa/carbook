"use client";

import { Plus } from "lucide-react";

import { useAddHistoryEventDialog } from "~/context/add-history-event-dialog-context";

import { Button, type ButtonProps } from "../ui/button";

export default function AddHistoryEventHeaderButton(props: ButtonProps) {
  const { toggleOpen } = useAddHistoryEventDialog();

  return (
    <Button size={"sm"} onClick={toggleOpen} {...props}>
      <Plus /> Add event
    </Button>
  );
}
