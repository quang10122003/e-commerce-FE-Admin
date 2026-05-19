// Tạo URL cho trạng thái chọn room: không có roomId thì trở về danh sách room.
export function buildChatPageHref(roomId?: number | null) {
  if (!roomId) {
    return "/admin/chat";
  }

  return `/admin/chat?room=${roomId}`;
}
