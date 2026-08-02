/**
 * Returns an array of pages to display, inserting "..." where
 * intermediate pages are omitted
 *
 * Example (siblingCount = 2):
 * [1, "...", 8, 9, 10, 11, 12, "...", 24]
 */

const DEFAULT_SIBLING_COUNT = 1;

export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  siblingCount = DEFAULT_SIBLING_COUNT,
): (number | "...")[] {
  // Number of pages shown at the beginning/end before collapsing
  // Example (siblingCount = 2): 1 2 3 4 5 6 7
  const edgeCount = siblingCount * 2 + 3;

  // If the total number of pages is small enough,
  // render every page without ellipsis
  const maxVisiblePages = edgeCount + 2;

  if (totalPages <= maxVisiblePages) {
    return Array.from(
      { length: totalPages },
      (_, i) => i + 1,
    );
  }

  // Calculate the window of pages around the current page
  const leftSibling = Math.max(
    currentPage - siblingCount,
    1,
  );

  const rightSibling = Math.min(
    currentPage + siblingCount,
    totalPages,
  );

  // Determine whether we need to collapse pages
  // on the left and/or right side
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  // Current page is close to the beginning
  // Example:
  // 1 2 3 4 5 6 7 ... 24
  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: edgeCount },
      (_, i) => i + 1,
    );

    return [...leftRange, "...", totalPages];
  }

  // Current page is close to the end
  // Example:
  // 1 ... 18 19 20 21 22 23 24
  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: edgeCount },
      (_, i) => totalPages - edgeCount + 1 + i,
    );

    return [1, "...", ...rightRange];
  }

  // Current page is somewhere in the middle
  // Example:
  // 1 ... 8 9 10 11 12 ... 24
  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );

  return [1, "...", ...middleRange, "...", totalPages];
}
