import "server-only";

import { unstable_rethrow } from "next/navigation";

// Để Next tự xử lý các lỗi điều hướng nội bộ như redirect/notFound.
export function rethrowNextFrameworkError(error: unknown) {
  unstable_rethrow(error);
}

// Kiểm tra các promise bị reject sau Promise.allSettled để không nuốt redirect của Next.
export function rethrowSettledNextFrameworkErrors(
  results: PromiseSettledResult<unknown>[],
) {
  results.forEach((result) => {
    if (result.status === "rejected") {
      rethrowNextFrameworkError(result.reason);
    }
  });
}
