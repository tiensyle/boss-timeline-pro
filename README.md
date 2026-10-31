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
- Global Attendance nằm tại `boss_timeline_attendance_global`, được đọc công khai cho toàn Guild (Thành viên/Khách ở chế độ chỉ xem); chỉ Admin đã được cấp quyền mới được chỉnh sửa điểm danh, thêm tuần và điều chỉnh quỹ thưởng. Chế độ Thành viên không hiển thị các nút thao tác quản trị.
- Lần đầu Admin mở phiên bản mới, nếu nhánh mới chưa có dữ liệu, ứng dụng chuyển toàn bộ bảng cũ tại `boss_timeline_state/attendance_global` sang nhánh mới bằng transaction chỉ khởi tạo khi trống. Dữ liệu cũ vẫn được giữ ở nhánh đã khóa quyền đọc công khai.
- Các chỉnh sửa đồng thời được gộp theo từng trường và ID. Hai Admin sửa cùng một trường thì lần ghi cuối thắng; thao tác xóa không bị phục hồi bởi bản chỉnh sửa cũ.
- Tuần mới giữ thành viên, server, hệ số thập phân và các tuần trước; chỉ điểm danh của tuần mới được bỏ chọn. Có thể chọn giữ hoặc xóa cột hoạt động cho tuần mới.
- Tính năng **Thưởng Vị Trí / Chức Danh** (`🎖️ Thưởng VT`): Admin có thể cài đặt tỷ lệ % thưởng trích trước từ tổng quỹ (DIAS & USDT) cho các chức danh (Bang Chủ, Phó Bang, Thư Ký, Top cống hiến...). Phần quỹ còn lại được chia đều theo điểm danh cho thành viên đạt điều kiện. Thuật toán phân bổ bảo toàn chính xác 100% quỹ (không lệch xu/cent). Có hỗ trợ ghi đè % thưởng riêng cho từng thành viên.
- **Thanh lọc Server ngay tại cột Server:** Tiêu đề cột `Server` trên bảng chấm công tích hợp thanh xổ chọn từng Server hoặc Tất cả Server, đồng bộ 2 chiều với bộ lọc toolbar và các nút thống kê server.
- Tính năng **Xếp Hạng Lực Chiến & Áp Hệ Số Lương Tự Động** (`⚔️ Lực Chiến`): Mỗi thành viên có trường Lực Chiến (hỗ trợ nhập số hoặc viết tắt như `18.5M`, `900k`). Modal quản lý Lực Chiến cho phép Admin cập nhật nhanh hàng loạt hoặc dán danh sách từ game/Excel, thiết lập các mốc Top (ví dụ: Top 1-5 x2, Top 6-10 x1.5, Còn lại x1) và bấm "⚡ Sắp Xếp & Áp Hệ Số" để tự động gán hệ số cho thành viên (tùy chọn xếp top riêng theo từng Server hoặc tính chung toàn Guild).

## Lịch và báo cáo

- Lịch ngày dùng khoảng `[00:00, 00:00 ngày kế tiếp)`, lịch 7 ngày bắt đầu từ 00:00 hôm nay. Mỗi khung giờ cố định và mỗi lượt lặp đều có một dòng riêng.
- Chu kỳ sau khi chết là dự báo theo mốc chết/hồi sinh đã ghi nhận, không phải bảo đảm boss sẽ xuất hiện theo giờ cố định. Boss chưa có mốc ghi nhận chưa có dự báo chu kỳ.
- Màn hình, CSV, PDF và báo cáo Discord dùng cùng danh sách lượt xuất hiện. CSV xử lý dấu nháy, xuống dòng và vô hiệu hóa công thức bảng tính trong nội dung nhập.
- Discord dùng ảnh cho tối đa 150 lượt; lịch dài hơn hoặc không tạo được ảnh sẽ gửi CSV đầy đủ để tránh vượt kích thước Canvas.

## Discord an toàn

- Webhook được lưu trong nhánh Firebase `boss_timeline_webhook_urls/{serverId}`, chỉ Admin được đọc/ghi. Giao diện Admin đọc URL vào bộ nhớ và gửi tới API qua HTTPS; không lưu vào localStorage. API và Cron cùng ưu tiên URL này, rồi biến môi trường riêng của server, cuối cùng webhook chung.
- Dùng `DISCORD_WEBHOOK_URL` cho webhook chung.
- Nếu mỗi server có webhook riêng, dùng `DISCORD_WEBHOOK_S1`, `DISCORD_WEBHOOK_S2`... Biến theo server được ưu tiên trước biến chung, sau webhook được lưu trong giao diện.
- API `/api/discord` yêu cầu Firebase ID token và kiểm tra quyền Admin trước khi gửi tin nhắn hoặc ảnh.
- Bản GitHub Pages tại `https://tiensyle.github.io/boss-timeline-pro/` tự gọi API hiện có tại `https://bosschill.vercel.app/api/discord`. API cho phép đúng origin `https://tiensyle.github.io`, vẫn yêu cầu Admin; các website GitHub Pages của tài khoản khác không được phép.
- Thông báo tự động được khóa bằng transaction để hai tab không cùng gửi một sự kiện; khi gửi thất bại, khóa được gỡ để cho phép thử lại. Các yêu cầu được xếp hàng và xử lý thời gian chờ khi API trả về 429.
- API `/api/cron-daily` bắt buộc biến `CRON_SECRET`; Vercel Cron gửi giá trị này dưới dạng `Authorization: Bearer ...`. Không đặt bí mật này trong mã nguồn hoặc trình duyệt.
- Cron dùng khóa idempotent theo ngày Việt Nam và server tại `boss_timeline_cron_runs`. Đặt `FIREBASE_DATABASE_AUTH` trong môi trường backend để API có quyền ghi khóa mà không mở quyền ghi công khai trong Database Rules.
- Nếu Discord xác nhận gửi nhưng việc cập nhật khóa gặp lỗi, Cron giữ khóa `pending` để tránh gửi lặp ngay lập tức. Các lần gửi Discord thất bại rõ ràng sẽ gỡ khóa để lần chạy sau thử lại.
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

## Bản sửa đồng bộ nhiều máy — 31/10/2026

- Máy vừa mở phải nhận và áp dụng dữ liệu Firebase trước khi tự xử lý boss hồi sinh. Dữ liệu cũ thiếu revision được kiểm tra xung đột theo nội dung, tránh ghi đè mốc chết mới.
- Nhãn Đã đồng bộ chỉ xuất hiện sau khi đã nhận dữ liệu boss; kết nối Firebase đơn thuần chưa được tính là đồng bộ.
- Các phép tính lịch và định dạng giờ trong giao diện dùng UTC+7, không phụ thuộc múi giờ máy.
- Server mới dùng UUID, không tái sử dụng mã server đã xóa và không nhận nhầm webhook/chấm công cũ.
- Thưởng chức danh được phân bổ chung theo đơn vị nguyên để bảo toàn quỹ. Nếu tổng tỷ lệ vượt 100%, toàn bộ quỹ được chia theo tỷ trọng thưởng, phần chia điểm danh bằng 0; giao diện hiển thị cảnh báo. Cấu hình thưởng rỗng nghĩa là tắt thưởng, không tự khôi phục mặc định. Sửa thưởng một tuần không thay đổi cấu hình các tuần khác.
- Cài đặt Discord chỉ báo lưu thành công khi Firebase xác nhận. Cron tuân theo enabled, notifyDailySchedule và tagEveryone; lịch dài được đính kèm CSV đầy đủ. Cron trả lỗi khi có server gửi thất bại hoặc thiếu webhook.

### Áp dụng bản sửa lên hệ thống thật

1. Sao lưu dữ liệu bằng phiên Admin và đóng các tab cũ trên cả hai máy.
2. Triển khai mã mới lên Vercel và publish database.rules.json. Rules bổ sung yêu cầu metadata revision trên từng boss để từ chối các bản cũ làm mất metadata. Bản sửa không tự sửa các giờ boss đã bị ghi đè trước đây.
3. Mở lại cùng URL có ?sv=s1 trên hai máy, đợi Đã đồng bộ, đối chiếu cùng một boss. Thử ghi nhận chết một boss theo dữ liệu thực tế và kiểm tra máy còn lại nhận đúng.
4. Xác minh CRON_SECRET và FIREBASE_DATABASE_AUTH, cài đặt Discord trên từng server. Kiểm tra trước ở môi trường thử nghiệm; bộ test Rules trong dự án chưa thay thế Firebase Emulator.

Chạy kiểm thử: npm test, npm run check, npm run test:browser. Trong môi trường hạn chế tạo tiến trình con, có thể dùng node --test --test-isolation=none tests/*.test.mjs.
