"use client";

import { useRouter } from "next/navigation";

import { User2 } from "lucide-react";
import { toast } from "sonner";

import { signout } from "~/app/auth/signout/actions";

import { useSignoutDialog } from "~/context/signout-dialog-context";
import { useUser } from "~/context/user-context";

import { useLoading } from "~/hooks/use-loading";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../ui/loading-button";

export default function SignOutDialog() {
  const loading = useLoading();
  const { isOpen, setIsOpen } = useSignoutDialog();
  const user = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    loading.start();

    const res = await signout();

    if (res.error) {
      toast.error(`Error - ${res.status}`, {
        description: res.error.message,
      });
    } else {
      router.push("/");
    }

    loading.end();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center gap-3 rounded-[var(--radius)] border p-3">
          <span className="flex size-fit items-center justify-center rounded-[var(--radius)] bg-primary p-2 text-primary-foreground">
            <User2 />
          </span>
          <div className="grid flex-1">
            <span className="truncate font-semibold">{`${user.firstName} ${user.lastName}`}</span>
            <span className="truncate text-sm">{user.username}</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <LoadingButton
            onClick={handleSignOut}
            isLoading={loading.isLoading}
            loadingText="Signing out"
            variant={"destructive"}
          >
            Sign out
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
