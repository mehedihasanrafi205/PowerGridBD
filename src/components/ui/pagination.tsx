import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  showPageNumbers = true,
  maxPageNumbers = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = React.useMemo(() => {
    if (!showPageNumbers) return [];
    
    const half = Math.floor(maxPageNumbers / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);
    
    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages, maxPageNumbers, showPageNumbers]);

  return (
    <nav
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4",
        "border-t border-border",
        className
      )}
      aria-label="Pagination"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Page {page} of {totalPages}</span>
      </div>
      
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        )}
        
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {showPageNumbers && (
          <>
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1 rounded-md hover:bg-muted transition-colors"
                >
                  1
                </button>
                {pageNumbers[0] > 2 && (
                  <span className="px-1 text-muted-foreground">...</span>
                )}
              </>
            )}
            
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {p}
              </button>
            ))}
            
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-1 text-muted-foreground">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 rounded-md hover:bg-muted transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </>
        )}
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
}