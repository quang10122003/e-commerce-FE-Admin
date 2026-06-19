// Chuẩn hóa search param về string: lấy phần tử đầu nếu là array, dùng fallback nếu undefined
export function readSearchParam(value:string | string[] | undefined , fallback=""){
    return Array.isArray(value) ? value[0] ?? fallback : value ??fallback
}