# Boss Timeline Pro

Ứng dụng quản lý lịch hồi sinh Boss và bảng chấm công theo thời gian thực.

## Cấu trúc chính

- `index.html`: cấu trúc giao diện.
- `assets/app.css`: toàn bộ kiểu hiển thị.
- `assets/app.js`: logic ứng dụng.
- `firebase-config.js`: cấu hình Firebase phía trình duyệt.
- `database.rules.json`: quyền truy cập Realtime Database.
- `api/discord.js`: API gửi thông báo Discord.

## Quản trị và dữ liệu

- Tài khoản đăng nhập được xác thực bằng Firebase Authentication.
- Admin phụ chỉ hoạt động khi có bản ghi đang bật trong `admin_access/{uid}`; khi quyền bị thu hồi, phiên quản trị trên web bị thoát ngay.
- Nút **Sao Lưu** trong bảng Chấm Công & Lương tải xuống một tệp JSON chứa dữ liệu Boss, máy chủ và chấm công. Tệp sao lưu không chứa mật khẩu hay Discord webhook.
- Dữ liệu cũ trong `localStorage` chỉ được dùng làm bản dự phòng tương thích; dữ liệu trực tuyến nằm trong Firebase Realtime Database.

## Discord an toàn

- Webhook chỉ được lưu bằng biến môi trường trên Vercel; trình duyệt và Firebase không lưu URL bí mật.
- Dùng `DISCORD_WEBHOOK_URL` cho webhook chung.
- Nếu mỗi server có webhook riêng, dùng `DISCORD_WEBHOOK_S1`, `DISCORD_WEBHOOK_S2`... Biến theo server được ưu tiên trước biến chung.
- API `/api/discord` yêu cầu Firebase ID token và kiểm tra quyền Admin trước khi gửi tin nhắn hoặc ảnh.

## Chạy và triển khai

Nên chạy qua dịch vụ web tĩnh (GitHub Pages, Firebase Hosting hoặc máy chủ tương đương), không mở trực tiếp bằng `file://`. Sau khi thay đổi mã nguồn, tải đúng các file lên cùng cấu trúc thư mục và kiểm tra lại cấu hình miền được phép trong Firebase Authentication.
