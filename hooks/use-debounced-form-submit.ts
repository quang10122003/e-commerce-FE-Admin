"use client";

import { useEffect, useRef } from "react";

// Tạo hàm submit form có debounce để dùng lại cho các bộ lọc dạng GET.
export function useDebouncedFormSubmit() {
  // Lưu timeout hiện tại để hủy lần submit cũ khi người dùng nhập tiếp.
  const submitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  // Submit form sau một khoảng delay, dùng delay 0 cho select/date cần submit ngay.
  function submitForm(form: HTMLFormElement, delay: number) {
    if (submitTimeoutRef.current) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }

    submitTimeoutRef.current = window.setTimeout(() => {
      if (!form.isConnected) {
        return;
      }

      form.requestSubmit();
    }, delay);
  }

  return submitForm;
}
