export function ProductFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        className="field-input field-inline field-input-compact flex-1"
        defaultValue="iphone"
        type="text"
      />
      <select className="field-select h-10">
        <option>Tat ca category</option>
        <option>Dien thoai</option>
        <option>Laptop</option>
        <option>Phu kien</option>
      </select>
      <select className="field-select h-10">
        <option>Tat ca status</option>
        <option>ACTIVE</option>
        <option>INACTIVE</option>
      </select>
    </div>
  );
}
