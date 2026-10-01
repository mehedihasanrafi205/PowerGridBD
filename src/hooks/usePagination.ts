"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
}

export function usePagination(options: PaginationOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    defaultPage = 1,
    defaultLimit = 20,
    defaultSortBy = "createdAt",
    defaultSortOrder = "desc",
  } = options;

  const page = Number(searchParams.get("page")) || defaultPage;
  const limit = Number(searchParams.get("limit")) || defaultLimit;
  const sortBy = searchParams.get("sortBy") || defaultSortBy;
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || defaultSortOrder;

  const createQueryString = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      return newParams.toString();
    },
    [searchParams],
  );

  const setPage = useCallback(
    (newPage: number) => {
      const queryString = createQueryString({ page: newPage });
      router.push(`?${queryString}`, { scroll: false });
    },
    [createQueryString, router],
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      const queryString = createQueryString({ limit: newLimit, page: 1 });
      router.push(`?${queryString}`, { scroll: false });
    },
    [createQueryString, router],
  );

  const setSort = useCallback(
    (newSortBy: string, newSortOrder?: "asc" | "desc") => {
      const order =
        newSortOrder ||
        (sortBy === sortBy && sortOrder === "asc" ? "desc" : "asc");
      const queryString = createQueryString({
        sortBy: newSortBy,
        sortOrder: order,
        page: 1,
      });
      router.push(`?${queryString}`, { scroll: false });
    },
    [createQueryString, router, sortBy, sortOrder],
  );

  const setFilters = useCallback(
    (filters: Record<string, string | number | undefined>) => {
      const queryString = createQueryString({ ...filters, page: 1 });
      router.push(`?${queryString}`, { scroll: false });
    },
    [createQueryString, router],
  );

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSort,
    setFilters,
    // Helper for API calls
    queryParams: {
      page,
      limit,
      sortBy,
      sortOrder,
    },
  };
}
