import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function InspectEventDialog() {
  const { isOpen, setIsOpen } = useInspectEventDialog();
  const { event } = useSelectedEvent();

  if (!event?.id) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
