"use client";

import { toast } from "sonner";

import { logout } from "~/app/auth/logout/actions";

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
  DialogTrigger,
} from "../ui/dialog";
import LoadingButton from "../ui/loading-button";

export default function LogoutDialog() {
  const loading = useLoading();

  const handleLogout = async () => {
    loading.start();

    const res = await logout();

    if (res.error) {
      toast.error(`Error - ${res.status}`, {
        description: res.error.message,
      });
    }

    loading.end();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Logout</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <LoadingButton
            onClick={handleLogout}
            isLoading={loading.isLoading}
            loadingText="Logging out"
            variant={"destructive"}
          >
            Logout
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
