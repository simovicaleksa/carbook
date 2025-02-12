"use client";

import { useEffect } from "react";

import { useEvents } from "~/context/events-context";

import { useUrl } from "~/hooks/use-url";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export default function AppPagination({ perPage = 20 }: { perPage?: number }) {
  const { getParam, setParam, createQueryString, pathname } = useUrl();
  const page = Number(getParam("page")) ?? 1;
  const { total } = useEvents();

  const maxPage = Math.ceil(total / perPage);

  const previousPage = `${pathname}?${createQueryString("page", String(page - 1 > 0 ? page - 1 : 1))}`;
  const nextPage = `${pathname}?${createQueryString("page", String(page + 1 < maxPage ? page + 1 : maxPage))}`;

  useEffect(() => {
    if (!page) setParam("page", "1", "replace");
  }, [page, setParam]);

  return (
    <div className="mx-auto flex w-fit flex-col items-center justify-center gap-2">
      <Pagination>
        <PaginationContent>
          <PaginationPrevious href={previousPage} />
          <PaginationItem>
            <PaginationLink isActive href={"#"}>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationNext href={nextPage} />
        </PaginationContent>
      </Pagination>
      <span className="text-sm text-muted-foreground">
        {page} of {Math.ceil(total / perPage)}
      </span>
    </div>
  );
}
