"use client";

import { CategorySummaryResponse } from "@/types/categories";
import { ImagePlus, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type CategoryEditFormValues = {
  name: string;
  image: FileList;
};
type CategoryFormEditProps = {
  categoriesEdit: CategorySummaryResponse | null
};

export function CategoryFormEdit({  categoriesEdit }: CategoryFormEditProps) {
  const router = useRouter();
  // trạng thái tổng: xác định form có đang ở chế độ edit hay không
  const isDisabled = !categoriesEdit;
  // dùng để disable toàn bộ UI khi chưa chọn category để edit

  // URL blob để hiển thị preview ảnh đã chọn
  const [previewUrl, setPreviewUrl] = useState<string | null>(categoriesEdit?.image ?? null);
  // Tên file hiển thị trong chip bên dưới vùng chọn ảnh
  const [fileName, setFileName] = useState<string | null>(null);

  // Lưu lại FileList hợp lệ gần nhất để restore khi người dùng chọn file không hợp lệ hoặc cancel
  const prevFileListRef = useRef<FileList | null>(null);

  const {
    handleSubmit,
    register,
    resetField,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CategoryEditFormValues>({
    defaultValues: { name: categoriesEdit?.name },
    mode: "onBlur",
  });

  // Revoke URL blob cũ để tránh memory leak, tạo URL mới nếu có file
  function updatePreview(file?: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setFileName(file?.name ?? null);
  }

  const imageField = register("image", {
    validate: (files) => {
      const file = files?.[0];
      if (!file) return true;
      return file.type.startsWith("image/") || "File được chọn phải là ảnh";
    },
  });

  function onSubmit(data: CategoryEditFormValues) {
    console.log({
      name: data.name.trim(),
      image: data.image?.[0] ?? null,
    });
  }

  return (
    <div
      className={`panel relative transition ${isDisabled ? "opacity-60 pointer-events-none" : ""
        }`}
    >
      {/* overlay khi chưa chọn edit */}
      {isDisabled && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-[1px]">
          <span className="text-sm font-medium text-slate-500">
            Vui lòng chọn category để chỉnh sửa
          </span>
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-900">
        Chỉnh sửa category
      </h2>

      <form
        className="mt-4 space-y-3"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Tên danh mục */}
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">
            Tên danh mục
          </span>

          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            placeholder="Ví dụ: Gaming Gear"
            type="text"
            disabled={!categoriesEdit}
            {...register("name", {
              required: "Vui lòng nhập tên danh mục",
              minLength: {
                value: 2,
                message: "Tên danh mục phải có ít nhất 2 ký tự",
              },
            })}
          />

          {errors.name && (
            <p className="text-sm text-error">
              {errors.name.message}
            </p>
          )}
        </label>

        {/* Ảnh danh mục */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">
              Ảnh danh mục
            </span>
            {/* Ghi chú nhỏ: nhắc người dùng rằng không chọn file = giữ nguyên ảnh cũ */}
            <span className="text-xs text-slate-400">
              (Không chọn file sẽ giữ nguyên ảnh hiện tại)
            </span>
          </div>

          <label className="flex min-h-36 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
            {previewUrl ? (
              <span className="relative h-32 w-full overflow-hidden rounded-lg">
                <Image
                  fill
                  alt="Preview ảnh danh mục"
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  src={previewUrl}
                  unoptimized
                />
              </span>
            ) : (
              <span className="flex flex-col items-center gap-2 text-slate-600">
                <ImagePlus className="size-7 text-slate-500" />
                Chọn file ảnh (không bắt buộc)
              </span>
            )}

            <input
              accept="image/*"
              className="sr-only disabled:cursor-not-allowed"
              type="file"
              {...imageField}
              onChange={(e) => {
                const file = e.target.files?.[0];

                // Người dùng mở dialog rồi cancel (không chọn file) → giữ nguyên mọi thứ
                if (!file) return;

                if (file.type.startsWith("image/")) {
                  // File hợp lệ → lưu FileList mới, cập nhật preview, xóa error cũ nếu có
                  prevFileListRef.current = e.target.files;
                  imageField.onChange(e);
                  updatePreview(file);
                  clearErrors("image");
                } else {
                  // File không hợp lệ → restore FileList hợp lệ cũ vào form (không làm mất preview),
                  // đồng thời set error thủ công thay vì dùng trigger (trigger sẽ validate lại
                  // file cũ đã restore → không có lỗi)
                  if (prevFileListRef.current) {
                    setValue("image", prevFileListRef.current);
                  } else {
                    resetField("image");
                  }
                  setError("image", {
                    message: "File được chọn phải là ảnh",
                  });
                }
              }}
              disabled={!categoriesEdit}
            />
          </label>

          {errors.image && (
            <p className="text-sm text-error">
              {errors.image.message}
            </p>
          )}

          {/* Chip hiển thị tên file hợp lệ đang được chọn + nút xóa */}
          {fileName && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <ImagePlus className="size-4 shrink-0 text-slate-400" />
              <span className="max-w-48 truncate font-medium">
                {fileName}
              </span>

              <button
                className="ml-1 text-slate-400 transition hover:text-slate-700"
                onClick={() => {
                  // Xóa file: reset toàn bộ state về ban đầu
                  prevFileListRef.current = null;
                  resetField("image");
                  clearErrors("image");
                  updatePreview();
                }}
                type="button"
                aria-label="Xóa ảnh"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            type="button"
            onClick={() =>  router.push("/admin/categories") }
          >
            <span className="inline-flex items-center justify-center gap-2">
              <X className="size-4" /> Hủy
            </span>
          </button>

          <button
            className="rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            disabled={isSubmitting}
            type="submit"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Save className="size-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu category"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}