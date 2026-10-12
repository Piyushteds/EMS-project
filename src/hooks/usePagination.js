import { useMemo, useState } from "react";

export default function usePagination(items = [], pageSize = 5) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  const currentItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  const goToPage = (nextPage) =>
    setPage(Math.min(Math.max(nextPage, 1), pageCount));

  return { page, pageCount, currentItems, goToPage };
}
