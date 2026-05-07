"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type CategoryImagePreviewProps = {
  image?: string | null;
  name: string;
};

export function CategoryImagePreview({ image, name }: CategoryImagePreviewProps) {
  // Lưu trạng thái ảnh lỗi để hiển thị placeholder thay vì tiếp tục render ảnh hỏng.
  const [hasImageError, setHasImageError] = useState(false);
  // Chuẩn hóa src, giúp chuỗi rỗng hoặc chỉ có khoảng trắng được xem như không có ảnh.
  const imageSrc = image?.trim();

  if (!imageSrc || hasImageError) {
    return (
      <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-linear-to-br from-blue-50 to-indigo-100 text-slate-500">
        <ImageIcon className="size-8" />
      </div>
    );
  }

  return (
    <div className="relative mb-3 h-28 overflow-hidden rounded-xl bg-linear-to-br from-blue-50 to-indigo-100">
      <Image
        alt={name}
        className="h-full w-full object-cover"
        fill
        onError={() => setHasImageError(true)}
        sizes="(min-width: 1024px) 25vw, 50vw"
        src={imageSrc}
        unoptimized
      />
    </div>
  );
}
