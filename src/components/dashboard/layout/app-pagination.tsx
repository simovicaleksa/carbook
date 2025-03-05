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

export default function AppPagination({ perPage = 10 }: { perPage?: number }) {
  const { getParam, setParam, createQueryString, pathname } = useUrl();
  const page = Number(getParam("page")) ?? 1;
  const { total } = useEvents();

  const maxPage = total == 0 ? 1 : Math.ceil(total / perPage);

  const hasPrevious = page > 1;
  const hasNext = page < maxPage;

  const previousPage = `${pathname}?${createQueryString("page", String(hasPrevious ? page - 1 : 1))}`;
  const nextPage = `${pathname}?${createQueryString("page", String(hasNext ? page + 1 : maxPage))}`;

  useEffect(() => {
    if (!page) setParam("page", "1", "replace");
  }, [page, setParam]);

  return (
    <div className="mx-auto flex w-fit flex-col items-center justify-center gap-2">
      <Pagination>
        <PaginationContent>
          <PaginationPrevious href={previousPage} disabled={!hasPrevious} />
          <PaginationItem>
            <PaginationLink isActive href={"#"}>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationNext href={nextPage} disabled={!hasNext} />
        </PaginationContent>
      </Pagination>
      <span className="text-sm text-muted-foreground">
        {page} of {maxPage}
      </span>
    </div>
  );
}
