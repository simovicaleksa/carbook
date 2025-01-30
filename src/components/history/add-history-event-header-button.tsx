"use client";

import { Plus } from "lucide-react";

import { useAddHistoryEventDialog } from "~/context/add-history-event-dialog-context";

import { Button } from "../ui/button";

export default function AddHistoryEventHeaderButton() {
  const { toggleOpen } = useAddHistoryEventDialog();

  return (
    <Button size={"sm"} onClick={toggleOpen}>
      <Plus /> Add event
    </Button>
  );
}
