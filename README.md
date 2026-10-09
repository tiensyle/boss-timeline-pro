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
- Lịch Boss công khai được đọc từ `.../state/data` (Server 1: `boss_timeline_state/data`). Không đọc cả nhánh cha có dữ liệu chấm công cũ.
- Global Attendance nằm tại `boss_timeline_attendance_global`, chỉ Admin đã được cấp quyền được đọc và sửa. Chế độ Thành viên không hiển thị chấm công/lương.
- Lần đầu Admin mở phiên bản mới, nếu nhánh mới chưa có dữ liệu, ứng dụng chuyển toàn bộ bảng cũ tại `boss_timeline_state/attendance_global` sang nhánh mới bằng transaction chỉ khởi tạo khi trống. Dữ liệu cũ vẫn được giữ ở nhánh đã khóa quyền đọc công khai.
- Các chỉnh sửa đồng thời được gộp theo từng trường và ID. Hai Admin sửa cùng một trường thì lần ghi cuối thắng; thao tác xóa không bị phục hồi bởi bản chỉnh sửa cũ.
- Tuần mới giữ thành viên, server, hệ số thập phân và các tuần trước; chỉ điểm danh của tuần mới được bỏ chọn. Có thể chọn giữ hoặc xóa cột hoạt động cho tuần mới.

## Lịch và báo cáo

- Lịch ngày dùng khoảng `[00:00, 00:00 ngày kế tiếp)`, lịch 7 ngày bắt đầu từ 00:00 hôm nay. Mỗi khung giờ cố định và mỗi lượt lặp đều có một dòng riêng.
- Chu kỳ sau khi chết là dự báo theo mốc chết/hồi sinh đã ghi nhận, không phải bảo đảm boss sẽ xuất hiện theo giờ cố định. Boss chưa có mốc ghi nhận chưa có dự báo chu kỳ.
- Màn hình, CSV, PDF và báo cáo Discord dùng cùng danh sách lượt xuất hiện. CSV xử lý dấu nháy, xuống dòng và vô hiệu hóa công thức bảng tính trong nội dung nhập.
- Discord dùng ảnh cho tối đa 150 lượt; lịch dài hơn hoặc không tạo được ảnh sẽ gửi CSV đầy đủ để tránh vượt kích thước Canvas.

## Discord an toàn

- Webhook chỉ được lưu bằng biến môi trường trên Vercel; trình duyệt và Firebase không lưu URL bí mật.
- Dùng `DISCORD_WEBHOOK_URL` cho webhook chung.
- Nếu mỗi server có webhook riêng, dùng `DISCORD_WEBHOOK_S1`, `DISCORD_WEBHOOK_S2`... Biến theo server được ưu tiên trước biến chung.
- API `/api/discord` yêu cầu Firebase ID token và kiểm tra quyền Admin trước khi gửi tin nhắn hoặc ảnh.
- Bản GitHub Pages tại `https://tiensyle.github.io/boss-timeline-pro/` tự gọi API hiện có tại `https://bosschill.vercel.app/api/discord`. API cho phép đúng origin `https://tiensyle.github.io`, vẫn yêu cầu Admin; các website GitHub Pages của tài khoản khác không được phép.
- Thông báo tự động được khóa bằng transaction để hai tab không cùng gửi một sự kiện; khi gửi thất bại, khóa được gỡ để cho phép thử lại. Các yêu cầu được xếp hàng và xử lý thời gian chờ khi API trả về 429.
- Nếu website và API ở hai miền khác nhau, đặt `window.BOSS_TIMELINE_DISCORD_API` trong `firebase-config.js` thành URL HTTPS của API. Đặt biến `DISCORD_ALLOWED_ORIGINS` trên API thành danh sách origin website, phân cách bằng dấu phẩy, ví dụ `https://guild.example.com`. Không dùng dấu `*`.
- Khi tắt cấu hình tag mọi người, báo cáo gửi thủ công cũng không tag `@everyone`. Thông báo boss chết vẫn tắt theo thiết kế hiện tại.

## Chạy và triển khai

Chạy local bằng Node.js 22 trở lên:

```powershell
node tools/dev-server.mjs
```

Mở URL được in ra (mặc định `http://127.0.0.1:8137`). Máy chủ local có cả `/api/discord`; webhook vẫn cần biến môi trường và Admin hợp lệ. Nếu cổng đang được dùng, máy chủ chọn cổng tiếp theo.

Triển khai đầy đủ trên Vercel với cấu hình sẵn trong `vercel.json` và `package.json`. Đặt các biến webhook ở Vercel, không đặt trong JavaScript phía trình duyệt. GitHub Pages và Firebase Hosting chỉ phục vụ phần giao diện: khi dùng các dịch vụ đó, cần API Vercel riêng và cấu hình URL/CORS như trên. `firebase.json` hiện chỉ quản lý Database Rules, không triển khai API Discord.

Trước khi sử dụng bản mới trên dữ liệu thật:

1. Sao lưu Boss và Attendance bằng phiên Admin hiện tại, rồi đóng các tab chạy mã cũ.
2. Publish nội dung `database.rules.json` trong Firebase Realtime Database Rules. Các nhánh chấm công cũ và mới sẽ được bảo vệ; Boss vẫn đọc công khai ở nhánh `data`.
3. Đưa mã mới lên website và mở bằng Admin để chuyển dữ liệu Attendance tự động. Kiểm tra lại tuần, thành viên, server và quỹ thưởng trước khi chỉnh sửa tiếp.
4. Kiểm tra miền được phép trong Firebase Authentication và gửi thử Discord sau khi đặt biến môi trường.

Không chạy các bản cũ song song sau khi chuyển dữ liệu: bản cũ vẫn ghi vào nhánh Attendance cũ. Thay đổi file Rules local không tự cập nhật quyền của Firebase đang chạy.

## Kiểm thử

```powershell
node --test tests/*.test.mjs
node --check assets/app.js
node --check api/discord.js
node --check tools/dev-server.mjs
```

Kiểm thử giao diện trong `tests/browser.mjs` cần Playwright và Chromium. Có thể đặt `PLAYWRIGHT_MODULE_PATH` và `CHROMIUM_EXECUTABLE` để dùng runtime có sẵn; đặt `BOSS_TIMELINE_TEST_OUTPUT` để lưu ảnh kiểm tra. Kiểm thử dùng dữ liệu riêng, chặn ghi Firebase và gửi Discord thật.

PDF dùng chức năng in của trình duyệt; không tải thư viện `html2pdf` không còn được sử dụng.

Kiểm thử Rules trong Node kiểm tra các biểu thức cấp quyền và quy tắc kế thừa tại các đường dẫn liên quan; không thay thế Firebase Emulator hoặc kiểm tra quyền trên bản triển khai. Giới hạn gửi theo UID trong API là theo tiến trình; khóa thông báo tự động trong Firebase mới là phần chống gửi trùng giữa các tab/instance.
