export function applyPagination(documents, page, rowsPerPage) {
  if (!Array.isArray(documents)) {
    return [];
  }
  return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
