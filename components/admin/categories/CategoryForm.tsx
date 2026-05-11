"use client";

import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/client/api/backend-api";
import { useNotification } from "@/components/ui/BrowserNotification";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { CategorySummaryResponse } from "@/types/categories";
import { ImagePlus, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type CategoryEditFormValues = {
  name: string;
  image: FileList;
};

type CategoryFormMode = "idle" | "create" | "edit";

type CategoryFormProps = {
  mode: CategoryFormMode;
  categoryEdit: CategorySummaryResponse | null;
};

export function CategoryForm({ mode, categoryEdit }: CategoryFormProps) {
  const router = useRouter();

  const { showNotification } = useNotification();

  const [updateCategory] = useUpdateCategoryMutation();
  const [createCategory] = useCreateCategoryMutation();

  const isIdle = mode === "idle";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  // Các nội dung hiển thị thay đổi theo mode để form create/edit không dùng chung nhãn gây nhầm lẫn.
  const formTitle = isCreate ? "Thêm category" : isEdit ? "Chỉnh sửa category" : "Category";
  const submitLabel = isCreate ? "Tạo category" : "Lưu category";
  const submittingLabel = isCreate ? "Đang tạo..." : "Đang lưu...";
  const imageHint = isCreate
    ? "(Bắt buộc khi tạo category)"
    : "(Không chọn file sẽ giữ nguyên ảnh hiện tại)";
  const emptyImageLabel = isCreate ? "Chọn file ảnh (bắt buộc)" : "Chọn file ảnh mới";

  // Ảnh hiện tại chỉ có ở mode edit, dùng để hiển thị preview ban đầu và khôi phục khi xoá file mới chọn.
  const currentImageUrl = categoryEdit?.image ?? null;

  // previewUrl là ảnh đang hiển thị trong khung chọn ảnh: ảnh cũ khi edit hoặc blob URL của file mới.
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  // fileName chỉ hiển thị chip tên file khi người dùng đã chọn một file mới từ máy.
  const [fileName, setFileName] = useState<string | null>(null);

  // Lưu blob URL hiện tại để revoke trước khi tạo preview mới, tránh rò rỉ bộ nhớ trên trình duyệt.
  const blobUrlRef = useRef<string | null>(null);
  // Lưu FileList hợp lệ gần nhất để có thể khôi phục nếu người dùng chọn nhầm file không phải ảnh.
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
    defaultValues: {
      name: categoryEdit?.name ?? "",
    },
    mode: "onBlur",
  });

  // Chỉ revoke blob URL do form tạo ra; URL ảnh từ server không được revoke.
  function revokeBlobPreview() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }

  // Cập nhật preview sau khi chọn file mới, hoặc reset về ảnh cũ khi edit / rỗng khi create.
  function updatePreview(file?: File) {
    revokeBlobPreview();

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      blobUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      setFileName(file.name);
      return;
    }

    setPreviewUrl(isEdit ? currentImageUrl : null);
    setFileName(null);
  }

  const imageField = register("image", {
    validate: (files) => {
      const file = files?.[0];

      // Create bắt buộc phải có ảnh, còn edit được phép bỏ trống để giữ ảnh hiện tại.
      if (!file) {
        return isCreate ? "Vui lòng chọn ảnh danh mục" : true;
      }

      return file.type.startsWith("image/") || "File được chọn phải là ảnh";
    },
  });

  async function onSubmit(data: CategoryEditFormValues) {
    if (isIdle) {
      return;
    }

    if (isEdit && !categoryEdit) {
      return;
    }

    const file = data.image?.[0] ?? null;

    // Chặn thêm một lớp ở submit để đảm bảo create luôn gửi kèm file, kể cả khi validate chưa chạy.
    if (isCreate && !file) {
      setError("image", {
        message: "Vui lòng chọn ảnh danh mục",
      });
      return;
    }

    try {
      let response;

      if (isEdit) {
        response = await updateCategory({
          categoryId: categoryEdit!.id,
          name: data.name,
          file,
        }).unwrap();
      }

      if (isCreate) {
        response = await createCategory({
          name: data.name,
          file,
        }).unwrap();
      }

      if (!response) {
        return;
      }

      showNotification(response.message, {
        title: isEdit ? "Cập nhật thành công" : "Tạo category thành công",
        tone: "success",
      });

      router.replace("/admin/categories", {
        scroll: false,
      });
    } catch (e: unknown) {
      showNotification(
        getApiErrorMessage(
          e,
          isEdit
            ? "Lỗi chưa cập nhật được danh mục"
            : "Lỗi chưa tạo được danh mục",
        ),
        {
          title: isEdit ? "Lỗi cập nhật danh mục" : "Lỗi tạo danh mục",
          tone: "error",
        },
      );
    }
  }

  return (
    <div
      className={`panel relative transition ${
        isIdle ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {isIdle && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-[1px]">
          <span className="text-sm font-medium text-slate-500">
            Vui lòng chọn category để chỉnh sửa hoặc tạo category mới
          </span>
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-900">
        {formTitle}
      </h2>

      <form
        className="mt-4 space-y-3"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">
            Tên danh mục
          </span>

          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            placeholder="Ví dụ: Gaming Gear"
            type="text"
            disabled={isIdle}
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

        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-700">
              Ảnh danh mục
            </span>
            <span className="text-xs text-slate-400">
              {imageHint}
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
                {emptyImageLabel}
              </span>
            )}

            <input
              accept="image/*"
              className="sr-only disabled:cursor-not-allowed"
              type="file"
              {...imageField}
              onChange={(e) => {
                const file = e.target.files?.[0];

                // Nếu người dùng mở hộp chọn file rồi bấm huỷ, giữ nguyên preview và dữ liệu hiện tại.
                if (!file) {
                  imageField.onChange(e);
                  return;
                }

                if (file.type.startsWith("image/")) {
                  // File hợp lệ: cập nhật form value, preview và xoá lỗi ảnh cũ nếu có.
                  prevFileListRef.current = e.target.files;
                  imageField.onChange(e);
                  updatePreview(file);
                  clearErrors("image");
                } else {
                  // File không hợp lệ: khôi phục file hợp lệ trước đó để preview không bị mất.
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
              disabled={isIdle}
            />
          </label>

          {errors.image && (
            <p className="text-sm text-error">
              {errors.image.message}
            </p>
          )}

          {fileName && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <ImagePlus className="size-4 shrink-0 text-slate-400" />
              <span className="max-w-48 truncate font-medium">
                {fileName}
              </span>

              <button
                className="ml-1 text-slate-400 transition hover:text-slate-700"
                onClick={() => {
                  // Xoá file mới chọn; ở edit sẽ quay lại ảnh cũ, ở create sẽ về trạng thái chưa chọn ảnh.
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

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/admin/categories"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer inline-flex items-center justify-center gap-2"
            scroll={false}
          >
            <X className="size-4" />
            Hủy
          </Link>

          <button
            className="rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            disabled={isSubmitting || isIdle}
            type="submit"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Save className="size-4" />
              {isSubmitting ? submittingLabel : submitLabel}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
