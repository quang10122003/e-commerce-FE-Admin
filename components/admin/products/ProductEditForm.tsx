export function ProductEditForm() {
  return (
    <article className="panel">
      <h2 className="section-title">Chi tiet product dang sua</h2>
      <form className="mt-4 grid grid-cols-2 gap-3">
        <label className="col-span-2 space-y-1 text-sm">
          <span className="font-medium text-slate-700">Ten san pham</span>
          <input className="field-input" defaultValue="iPhone 16 Pro 256GB" type="text" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Gia</span>
          <input className="field-input" defaultValue="31990000" type="text" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Stock</span>
          <input className="field-input" defaultValue="12" type="number" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Status</span>
          <select className="field-select w-full">
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select className="field-select w-full">
            <option>Dien thoai</option>
            <option>Laptop</option>
            <option>Phu kien</option>
          </select>
        </label>
        <label className="col-span-2 space-y-1 text-sm">
          <span className="font-medium text-slate-700">Description</span>
          <textarea
            className="field-textarea h-24"
            defaultValue="Flagship phone, chip A18, camera tele 5x."
          />
        </label>
      </form>
    </article>
  );
}
