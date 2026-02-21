function paginate(items, page, pageSize, maxPageSize = 50) {
  const total = items.length;
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Math.min(maxPageSize, Number(pageSize) || 10));
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize: safePageSize,
    total,
    hasMore: end < total,
  };
}

module.exports = { paginate };
