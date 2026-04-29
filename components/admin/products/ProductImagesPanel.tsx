type ProductImagesPanelProps = {
  images: string[];
};

export function ProductImagesPanel({ images }: ProductImagesPanelProps) {
  return (
    <article className="panel">
      <h2 className="section-title">Product images</h2>
      <div className="mt-4 space-y-3">
        {images.map((image) => (
          <div className="card-item" key={image}>
            <span className="truncate pr-3 text-slate-700">{image}</span>
            <button className="btn-outline" type="button">
              Remove
            </button>
          </div>
        ))}
      </div>

      <label className="mt-4 block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Them image URL</span>
        <input className="field-input" placeholder="/images/products/iphone-new.jpg" type="text" />
      </label>
      <button className="btn-primary mt-3 w-full" type="button">
        Luu bo anh
      </button>
    </article>
  );
}
