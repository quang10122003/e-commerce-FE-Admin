"use client";

import { ImagePlus, Save, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { ProductFormMode } from "./types";
import type { CategorySummaryResponse } from "@/types/categories";
import type { AdminProductImage, AdminProductItem } from "@/types/product";
import { useCreateProductMutation, useUpdateProductMutation } from "@/client/api/backend-api";
import { useNotification } from "@/components/ui/BrowserNotification";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { useRouter } from "next/navigation";

// Kiểu dữ liệu mà react-hook-form quản lý trong form product.
type ProductFormValues = {
  name: string;
  desc: string;
  price: number;
  stock: number;
  categoryId: number;
  thumbnail: FileList;
  images: FileList;
};

// Props truyền từ ProductsClient xuống để form biết đang idle/create/edit và dữ liệu edit là gì.
type ProductFormProps = {
  categories: CategorySummaryResponse[];
  mode: ProductFormMode;
  productEdit: AdminProductItem | null;
};

// Mỗi ảnh mới người dùng chọn được lưu kèm previewUrl để hiển thị preview nhỏ trong chip.
type GalleryFileItem = {
  file: File;
  id: string;
  previewUrl: string;
};

export function ProductForm({
  categories,
  mode,
  productEdit,
}: ProductFormProps) {
  const router = useRouter();
  const {showNotification} = useNotification()
  const [createProducts] = useCreateProductMutation()
  // Mutation riêng cho edit product vì backend yêu cầu PUT multipart kèm version hiện tại.
  const [updateProduct] = useUpdateProductMutation()
  // Các biến boolean giúp JSX dễ đọc hơn khi đổi giao diện theo mode.
  const isIdle = mode === "idle";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  // Ảnh thumbnail hiện tại chỉ có trong mode edit; create và idle sẽ không có ảnh cũ.
  const currentThumbnailUrl = isEdit ? productEdit?.thumbnail ?? null : null;
  // Danh sách ảnh cũ của product edit; người dùng có thể bấm X để đánh dấu bỏ ảnh.
  const initialImages = isEdit ? productEdit?.images ?? [] : [];
  // Các label/hint đổi theo mode để tránh nhầm giữa tạo mới và chỉnh sửa.
  const formTitle = isCreate ? "Them product" : isEdit ? "Chinh sua product" : "Product";
  const formDescription = isCreate
    ? "Nhap thong tin de tao product moi."
    : isEdit
      ? `Dang sua #${productEdit?.id ?? ""} - ${productEdit?.name ?? ""}`
      : "Chon product de chinh sua hoac tao product moi.";
  const thumbnailHint = isCreate
    ? "Bat buoc khi tao product"
    : isEdit
      ? "Khong chon file moi se giu anh hien tai"
      : "Form dang khoa";
  const submitLabel = isCreate ? "Tao product" : "Luu product";
  const submittingLabel = isCreate ? "Dang tao..." : "Dang luu...";
  const emptyThumbnailLabel = isCreate
    ? "Chon thumbnail"
    : isEdit
      ? "Chon thumbnail moi"
      : "Thumbnail";
  const galleryHint = isEdit
    ? "Anh hien co co the xoa; anh moi chi hien ten file da chon."
    : isCreate
      ? "Chon nhieu anh va kiem tra ten file da chon."
      : "Danh sach anh se hien thi khi chon create hoac edit.";

  // URL đang hiển thị trong khung thumbnail: ảnh cũ khi edit hoặc blob URL của file mới.
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] =
    useState<string | null>(currentThumbnailUrl);
  // Tên file thumbnail mới, chỉ hiện khi người dùng đã chọn file từ máy.
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(null);
  // Ảnh cũ còn giữ lại của product; xóa khỏi state này nghĩa là sẽ bỏ ảnh đó khi submit.
  const [currentImages, setCurrentImages] =
    useState<AdminProductImage[]>(initialImages);
  // Các file ảnh mới được chọn thêm vào danh sách ảnh product.
  const [galleryFileItems, setGalleryFileItems] = useState<GalleryFileItem[]>([]);

  // Lưu blob URL thumbnail để revoke khi đổi ảnh hoặc unmount, tránh rò rỉ bộ nhớ.
  const thumbnailBlobUrlRef = useRef<string | null>(null);
  // Lưu FileList thumbnail hợp lệ gần nhất để khôi phục nếu người dùng chọn nhầm file không phải ảnh.
  const prevThumbnailFileListRef = useRef<FileList | null>(null);
  // Ref giữ danh sách ảnh mới hiện tại để event handler luôn đọc được dữ liệu mới nhất.
  const galleryFileItemsRef = useRef<GalleryFileItem[]>([]);

  // Khởi tạo react-hook-form với dữ liệu edit nếu có; create/idle sẽ dùng giá trị rỗng.
  const {
    clearErrors,
    handleSubmit,
    register,
    resetField,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: productEdit?.name ?? "",
      desc: productEdit?.description ?? "",
      price: productEdit?.price ?? undefined,
      stock: productEdit?.stock ?? undefined,
      categoryId: productEdit?.categoryId ?? 0,
    },
    mode: "onBlur",
  });

  // Khi component bị tháo khỏi DOM, revoke tất cả blob URL do form tạo ra.
  useEffect(() => {
    const thumbnailRef = thumbnailBlobUrlRef;
    const galleryRef = galleryFileItemsRef;

    return () => {
      if (thumbnailRef.current) {
        URL.revokeObjectURL(thumbnailRef.current);
      }

      galleryRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  // Xóa blob URL thumbnail cũ trước khi tạo preview mới.
  function revokeThumbnailPreview() {
    if (thumbnailBlobUrlRef.current) {
      URL.revokeObjectURL(thumbnailBlobUrlRef.current);
      thumbnailBlobUrlRef.current = null;
    }
  }

  // Cập nhật khung preview thumbnail: có file mới thì dùng blob URL, không có thì quay về ảnh cũ khi edit.
  function updateThumbnailPreview(file?: File) {
    revokeThumbnailPreview();

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      thumbnailBlobUrlRef.current = objectUrl;
      setThumbnailPreviewUrl(objectUrl);
      setThumbnailFileName(file.name);
      return;
    }

    setThumbnailPreviewUrl(isEdit ? currentThumbnailUrl : null);
    setThumbnailFileName(null);
  }

  // Tạo FileList mới từ mảng File để đồng bộ lại value cho react-hook-form sau khi xóa từng file.
  function toFileList(files: File[]) {
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    return transfer.files;
  }

  // Đồng bộ state ảnh mới, ref ảnh mới và field images trong react-hook-form.
  function syncGalleryFiles(items: GalleryFileItem[]) {
    galleryFileItemsRef.current = items;
    setGalleryFileItems(items);

    // Không còn file mới thì reset field để submit không gửi ảnh mới.
    if (!items.length) {
      resetField("images");
      clearErrors("images");
      return;
    }

    // react-hook-form cần FileList, nên phải convert mảng File thành FileList mới.
    setValue("images", toFileList(items.map((item) => item.file)), {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors("images");
  }

  // Thêm một hoặc nhiều file ảnh mới vào danh sách ảnh product, đồng thời tạo preview nhỏ.
  function addGalleryFiles(files: File[]) {
    const items = files.map((file, index) => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${index}`,
      previewUrl: URL.createObjectURL(file),
    }));

    syncGalleryFiles([...galleryFileItemsRef.current, ...items]);
  }

  // Xóa một file ảnh mới theo id, chỉ bỏ file đó thay vì xóa toàn bộ danh sách.
  function removeGalleryFile(id: string) {
    const itemToRemove = galleryFileItemsRef.current.find((item) => item.id === id);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }

    syncGalleryFiles(galleryFileItemsRef.current.filter((item) => item.id !== id));
  }

  // Validate thumbnail chỉ kiểm tra định dạng file; required create được xử lý khi submit để không báo lỗi quá sớm.
  const thumbnailField = register("thumbnail", {
    validate: (files) => {
      const file = files?.[0];

      if (!file) {
        return isCreate ? "Vui lòng chọn thumbnail" : true;
      }

      if (!file.type.startsWith("image/")) {
        return "File thumbnail phải là ảnh";
      }

      return true;
    },
  });

  // Validate danh sách ảnh mới: tất cả file được chọn phải là ảnh.
  const imagesField = register("images", {
    validate: (files) => {
      const selectedFiles = Array.from(files ?? []);

      return (
        selectedFiles.every((file) => file.type.startsWith("image/")) ||
        "Tất cả file trong danh sách phải là ảnh"
      );
    },
  });

  // Xóa ảnh cũ khỏi preview; submit sẽ dựa vào state này để biết ảnh nào bị bỏ khỏi product.
  function removeCurrentImage(index: number) {
    setCurrentImages((images) => images.filter((_, imageIndex) => imageIndex !== index));
  }

  async function onSubmit(data: ProductFormValues) {
    // Idle là trạng thái chưa chọn create/edit nên không cho submit.
    if (isIdle) {
      return;
    }

    // Edit mà không tìm thấy product thì không submit để tránh gửi dữ liệu sai.
    if (isEdit && !productEdit) {
      return;
    }

    const thumbnailFile = data.thumbnail?.[0] ?? null;
    // Gallery input is cleared after each pick so the same file can be selected again.
    // Use the managed gallery state as the submit source of truth instead of the DOM file input.
    const imageFiles = galleryFileItems.map((item) => item.file);

    // Create bắt buộc có thumbnail, nhưng lỗi này chỉ hiện khi bấm submit.
    if (isCreate && !thumbnailFile) {
      setError("thumbnail", {
        message: "Vui long chon thumbnail",
      });
      return;
    }

    try{
      // edit submit
      if (isEdit && productEdit) {
        console.log(productEdit.version)
        // currentImages là ảnh cũ còn được giữ trên form; ảnh cũ không còn trong state này sẽ bị xóa ở backend.
        const currentImageIds = new Set(currentImages.map((image) => image.id));
        const deleteImageUrls = initialImages
          .filter((image) => !currentImageIds.has(image.id))
          .map((image) => image.url);

        const respone = await updateProduct({
          productId: productEdit.id,
          // Version lấy từ response lúc mở form, dùng để backend chặn ghi đè khi product đã bị người khác sửa.
          version: productEdit.version,
          name: data.name,
          description: data.desc,
          price: data.price,
          stock: data.stock,
          status: productEdit.status,
          categoryId: data.categoryId,
          thumbnail: thumbnailFile,
          images: imageFiles,
          deleteImageUrls,
        }).unwrap();

        showNotification(respone.message,{title:"cap nhat thanh cong san pham",tone:"success"})
        router.replace("/admin/products",{
          scroll:false
        })
        return;
      }

      // create submit
      if (isCreate) {
        const respone = await createProducts({
          name: data.name,
          description: data.desc,
          price: data.price,
          stock: data.stock,
          status: "ACTIVE",
          categoryId: data.categoryId,
          thumbnail: thumbnailFile!,
          images: imageFiles,
        }).unwrap();

      showNotification(respone.message,{title:"tạo thành công sản phẩm",tone:"success"})
        router.replace("/admin/products",{
          scroll:false
        })
      }
    }catch(e){
      showNotification(getApiErrorMessage(e,"lỗi"),{title:"lỗi",tone:"error"})
      console.log(e)
      router.replace("/admin/products", {
        scroll: false
      })
    }
    

  }


  return (
    <article
      id="product-form"
      className={`panel relative transition scroll-mt-40 ${
        isIdle ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {/* Overlay khóa form khi URL chưa có create=1 hoặc edit=<id>. */}
      {isIdle && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40 px-4 text-center backdrop-blur-[1px]">
          <span className="text-sm font-medium text-slate-500">
            Vui long chon product de chinh sua hoac tao product moi
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="section-title">{formTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {formDescription}
          </p>
        </div>

        <Link className="btn-outline" href="/admin/products">
          Huy
        </Link>
      </div>

      <form className="mt-5 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
          <div className="space-y-4">
            {/* Nhóm input thông tin cơ bản của product. */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Name</span>
                <input
                  className="field-input"
                  disabled={isIdle}
                  placeholder="Vi du: iPhone 16 Pro 256GB"
                  type="text"
                  {...register("name", {
                    required: "Vui lòng nhập tên sản phẩm",
                    minLength: {
                      value: 2,
                      message: "Tên sản phẩm phải có ít nhất 2 ký tự",
                    },
                    maxLength: {
                      value: 50,
                      message: "Tên sản phẩm nhiều nhất 50 ký tự",
                    },
                    validate: (value) =>
                      value.trim().length >= 2 ||
                      "Tên sản phẩm phải có ít nhất 2 ký tự",
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-error">{errors.name.message}</p>
                )}
              </label>

              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Desc</span>
                <textarea
                  className="field-textarea min-h-28"
                  disabled={isIdle}
                  placeholder="Mo ta ngan gon ve product"
                  {...register("desc", {
                    maxLength: {
                      value: 100,
                      message: "Mô tả không quá 100 ký tự",
                    },
                  })}
                />
                {errors.desc && (
                  <p className="text-sm text-error">{errors.desc.message}</p>
                )}
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Price</span>
                <input
                  className="field-input"
                  disabled={isIdle}
                  min={0}
                  placeholder="31990000"
                  type="number"
                  {...register("price", {
                    required: "Vui lòng nhập giá",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Giá không được âm",
                    },
                    validate: (value) =>
                      !Number.isNaN(value) || "Giá không hợp lệ",
                  })}
                />
                {errors.price && (
                  <p className="text-sm text-error">{errors.price.message}</p>
                )}
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Stock</span>
                <input
                  className="field-input"
                  disabled={isIdle}
                  min={1}
                  placeholder="12"
                  type="number"
                  {...register("stock", {
                    required: "Vui lòng nhập stock",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Stock phải lớn hơn 0",
                    },
                    validate: (value) =>
                      Number.isInteger(value) || "Stock phải là số nguyên",
                  })}
                />
                {errors.stock && (
                  <p className="text-sm text-error">{errors.stock.message}</p>
                )}
              </label>

              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Danh muc</span>
                <select
                  className="field-select w-full"
                  disabled={isIdle}
                  {...register("categoryId", {
                    required: "Vui long chon danh muc",
                    valueAsNumber: true,
                    validate: (value) => value > 0 || "Vui long chon danh muc",
                  })}
                >
                  <option value={0}>
                    {isIdle ? "Chua chon mode" : "Chon danh muc"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-error">{errors.categoryId.message}</p>
                )}
              </label>
            </div>

            {/* Khu vực chọn thumbnail: edit sẽ ưu tiên hiển thị ảnh cũ nếu chưa chọn file mới. */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-800">Thumbnail</h3>
                <span className="text-xs text-slate-400">
                  {thumbnailHint}
                </span>
              </div>

              <label className="flex min-h-72 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
                {thumbnailPreviewUrl ? (
                  <span className="relative h-64 w-full overflow-hidden rounded-lg">
                    <Image
                      fill
                      alt="Preview thumbnail product"
                      className="object-cover object-center"
                      sizes="(max-width: 1280px) 100vw, 50vw"
                      src={thumbnailPreviewUrl}
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-2 text-slate-600">
                    <ImagePlus className="size-8 text-slate-500" />
                    {emptyThumbnailLabel}
                  </span>
                )}

                <input
                  accept="image/*"
                  className="sr-only"
                  disabled={isIdle}
                  type="file"
                  {...thumbnailField}
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    // Người dùng mở hộp chọn file rồi hủy thì giữ nguyên preview và không báo lỗi.
                    if (!file) {
                      return;
                    }

                    if (file.type.startsWith("image/")) {
                      // File hợp lệ: lưu FileList, cập nhật preview và xóa lỗi cũ nếu có.
                      prevThumbnailFileListRef.current = event.target.files;
                      thumbnailField.onChange(event);
                      updateThumbnailPreview(file);
                      clearErrors("thumbnail");
                    } else {
                      // File không hợp lệ: khôi phục file hợp lệ trước đó hoặc reset field.
                      if (prevThumbnailFileListRef.current) {
                        setValue("thumbnail", prevThumbnailFileListRef.current);
                      } else {
                        resetField("thumbnail");
                      }

                      setError("thumbnail", {
                        message: "File thumbnail phai la anh",
                      });
                    }
                  }}
                />
              </label>

              {errors.thumbnail && (
                <p className="text-sm text-error">{errors.thumbnail.message}</p>
              )}

              {thumbnailFileName && (
                <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <ImagePlus className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate font-medium">{thumbnailFileName}</span>
                  <button
                    aria-label="Xoa thumbnail moi"
                    className="text-slate-400 transition hover:text-slate-700"
                    disabled={isIdle}
                    onClick={() => {
                      prevThumbnailFileListRef.current = null;
                      resetField("thumbnail");
                      clearErrors("thumbnail");
                      updateThumbnailPreview();
                    }}
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Khu vực ảnh phụ: ảnh cũ có preview lớn để xóa, ảnh mới là chip nhỏ có preview và nút X. */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Danh sach anh product
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {galleryHint}
                </p>
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
              <UploadCloud className="size-4 text-slate-500" />
              <span>
                Them file
              </span>
              <input
                accept="image/*"
                className="sr-only"
                disabled={isIdle}
                multiple
                type="file"
                {...imagesField}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);

                  // Người dùng hủy hộp chọn file thì không thay đổi danh sách ảnh hiện tại.
                  if (!files.length) {
                    return;
                  }

                  if (files.every((file) => file.type.startsWith("image/"))) {
                    // File hợp lệ: thêm vào danh sách, cho phép chọn tiếp cùng file lần sau bằng cách reset input value.
                    addGalleryFiles(files);
                    event.currentTarget.value = "";
                  } else {
                    // File không hợp lệ: chỉ báo lỗi, không phá danh sách file đã chọn trước đó.
                    setError("images", {
                      message: "Tat ca file trong danh sach phai la anh",
                    });
                    event.currentTarget.value = "";
                  }
                }}
              />
            </label>

            {errors.images && (
              <p className="text-sm text-error">{errors.images.message}</p>
            )}

            {/* Preview nhỏ cho các file ảnh mới được thêm vào. */}
            {galleryFileItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {galleryFileItems.map((item) => (
                  <span
                    className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 px-2 py-2 text-sm text-slate-700"
                    key={item.id}
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        fill
                        alt={`Preview ${item.file.name}`}
                        className="object-cover"
                        sizes="40px"
                        src={item.previewUrl}
                        unoptimized
                      />
                    </span>
                    <span className="max-w-48 truncate font-medium">{item.file.name}</span>
                    <button
                      aria-label={`Xoa ${item.file.name}`}
                      className="shrink-0 text-slate-400 transition hover:text-rose-600"
                      disabled={isIdle}
                      onClick={() => removeGalleryFile(item.id)}
                      type="button"
                    >
                      <X className="size-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Preview ảnh cũ của product edit; bấm X sẽ đánh dấu ảnh đó bị bỏ khỏi product. */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              {currentImages.map((image, index) => (
                <div
                  className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                  key={image.id}
                >
                  <Image
                    fill
                    alt="Anh product hien tai"
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 20vw"
                    src={image.url}
                    unoptimized
                  />
                  <button
                    aria-label="Xoa anh hien tai"
                    className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                    disabled={isIdle}
                    onClick={() => removeCurrentImage(index)}
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}

            </div>

            {!currentImages.length && !galleryFileItems.length ? (
              <div className="flex min-h-28 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500">
                Chua co anh nao
              </div>
            ) : null}
          </section>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
          <Link
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            href="/admin/products"
          >
            Huy
          </Link>
          <button
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || isIdle}
            type="submit"
          >
            <Save className="size-4" />
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </article>
  );
}
