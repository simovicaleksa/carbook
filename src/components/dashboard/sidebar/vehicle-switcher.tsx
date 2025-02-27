"use client";

import { ChevronsUpDown, Loader2, Plus } from "lucide-react";

import { cn } from "~/lib/utils";
import { getBrandIcon } from "~/lib/utils/icon";

import { useAddVehicleDialog } from "~/context/add-vehicle-dialog-context";
import {
  useSelectedVehicle,
  type VehicleType,
} from "~/context/selected-vehicle-context";
import { useUserVehicles } from "~/context/user-vehicles-context";

import { useIsMobile } from "~/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export default function VehicleSwitcher() {
  const isMobile = useIsMobile();
  const { toggleOpen } = useAddVehicleDialog();
  const { vehicles } = useUserVehicles();
  const { selectedVehicle, isLoading } = useSelectedVehicle();
  const Icon = getBrandIcon(selectedVehicle);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size={"lg"}>
              <div
                className={cn(
                  "flex size-8 flex-row items-center justify-center rounded-[var(--radius)] bg-primary text-sidebar-primary-foreground",
                  {
                    "bg-background": isLoading,
                  },
                )}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin text-foreground" />
                ) : (
                  <Icon />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-normal">
                  <span className="font-semibold">{selectedVehicle?.make}</span>
                  {" - "}
                  {selectedVehicle?.model}
                </span>
                <span className="truncate text-xs font-light italic">
                  {selectedVehicle?.year}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Vehicles
            </DropdownMenuLabel>
            {vehicles.map((vehicle) => (
              <VehicleSwitcherItem vehicle={vehicle} key={vehicle.id} />
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={toggleOpen}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add vehicle
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function VehicleSwitcherItem(props: { vehicle: VehicleType }) {
  const { selectedVehicle, changeSelectedVehicle } = useSelectedVehicle();
  const vehicle = props.vehicle;
  const Icon = getBrandIcon(vehicle);

  const handleVehicleChange = async (vehicle: VehicleType) => {
    await changeSelectedVehicle(vehicle);
  };

  return (
    <DropdownMenuItem
      key={vehicle.id}
      className="cursor-pointer gap-2 p-2 font-medium"
      onClick={() => handleVehicleChange(vehicle)}
      disabled={selectedVehicle?.id === vehicle.id}
    >
      <div
        className={cn(
          "flex size-7 items-center justify-center rounded-[var(--radius)] p-4 *:!size-6",
          {
            "bg-primary text-primary-foreground":
              selectedVehicle?.id === vehicle.id,
          },
        )}
      >
        <Icon />
      </div>

      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-normal">
          <span className="font-semibold">{vehicle.make}</span>
          {" - "}
          {vehicle.model}
        </span>
        <span className="truncate text-xs font-light italic">
          {vehicle.year}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
