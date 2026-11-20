# Engine: trang HTML `seek(t)`

Cùng cách làm với các skill explainer trong repo: một file HTML tự chứa vẽ được **bất kỳ khung hình nào từ một giá trị thời gian**, rồi `scripts/render.mjs` chụp từng khung (có motion blur nếu muốn) và ghép với âm thanh thành MP4. Lý do chọn cách này: render chính xác từng khung, sửa một cảnh không làm lệch cảnh khác, và người dùng kéo thanh thời gian xem trực tiếp được trong trình duyệt.

Điểm bắt đầu là `assets/template.html` cùng `assets/avatar.js` (nhân vật dẫn chuyện tách riêng; template đã chạy thử: nhân vật ngồi, nhảy, được chữ chở đi, chạy theo chữ; có phụ đề và âm thanh). Gộp thành một file bằng `node scripts/inline.mjs`. Hàm hỗ trợ nằm trong `scripts/helpers.js`, đã dán sẵn trong template.

## Hợp đồng của trang

- `window.VIDEO = {w, h, duration}` và `window.seek(t)` là **hàm thuần theo thời gian**: đặt mọi phần tử cho thời điểm `t` (giây). Không dùng CSS transition/animation, không `setTimeout`, không giữ trạng thái từ khung trước. Khung nào cũng phải đúng khi vẽ riêng lẻ, theo thứ tự bất kỳ. Đo layout trong `seek` (`offsetLeft`, `measureText`) thì được.
- Ngẫu nhiên (hạt nhiễu, hạt bụi) dùng bộ sinh có hạt giống (`rng`), không dùng `Math.random`.
- Thứ cần lịch sử (camera trễ theo vật chuyển động, mô phỏng vật lý) thì **tính sẵn một lần lúc tải**: chạy từ 0 đến `duration` với bước 1/240 s, lưu lại, `seek` đọc ra có nội suy.
- Có `?render` trong URL: không điều khiển, không co giãn xem trước, sân khấu đúng `w × h` ở góc trên trái. Không có `?render`: co sân khấu vừa cửa sổ và hiện điều khiển xem trước.
- **Phông chữ: nhúng vào.** Tải woff2 và nhúng base64 trong `@font-face` để render không âm thầm đổi phông. Chọn phông có đủ dấu tiếng Việt (Be Vietnam Pro, Inter, Noto Sans) và thử bằng một câu nhiều dấu như "Nguyễn Thị Hương chuyển đến Thủ Đức".
- **Lớp**: nền trong suốt ở từng lớp cảnh, màu nền chỉ đặt ở sân khấu, để lớp sau không vô tình che lớp trước. Chữ định vị tuyệt đối cần `white-space: nowrap`.
- **Tốc độ**: `filter: blur()` lớn và gradient mờ lớn chụp rất chậm. Vẽ gradient, ánh sáng, hạt nhiễu lên canvas **một lần lúc tải** rồi di chuyển canvas đó.

## Cấu trúc theo dữ liệu

Tách "nói gì, lúc nào" khỏi "vẽ thế nào":

```js
const SCENES = [{ a: 0, b: 4, line: '…', hl: 3, cam: [[0, 1.0, 0, 0], [4, 1.14, -40, 10]] }, …];
const WORDS  = [{ si, i, w, t, d }, …];   // từng từ: cảnh, thứ tự, chữ, giờ bắt đầu, độ dài
```

- `a`/`b`: giây bắt đầu và kết thúc cảnh, lấy từ độ dài thật của file giọng đọc.
- `line`/`hl`: câu phụ đề và chỉ số từ được tô nhấn.
- `cam`: các khóa camera `[thời gian, zoom, x, y]`.
- `WORDS` dùng cho phụ đề **và** cho mấp máy môi, nên nó phải khớp giọng đọc thật (xem `voiceover-and-sound.md`).

## Camera: tiết chế

Không cắt cứng. Camera là một transform `translate() scale()` trên lớp thế giới, gần như đứng yên: trôi rất chậm theo nhân vật (vài phần trăm), không zoom mạnh, không rung, không xoay. Chuyển cảnh do hành động của nhân vật/vật thể thực hiện, xem `smooth-transitions.md`. Nếu cần chuyển camera, dùng ease 0,6–1,2 s hoặc `spring` giảm chấn mạnh (`z` ≥ 0,95), không nảy.

## Phụ đề

- Hiện từng từ theo `WORDS`, ô nhấn màu quét từ trái sang phải sau từ khóa (xem `.hl` trong template; cần `isolation:isolate` ở từ để ô nhấn nằm sau chữ).
- Mỗi lần chỉ một câu, tối đa khoảng 8 từ, đặt thấp trong vùng an toàn (cách mép 5–8%), **dưới** nhân vật, không che mặt hay số liệu.
- Với video dọc 9:16 phụ đề cao hơn một chút (đừng dưới vùng giao diện nền tảng che).

## Khổ dọc 9:16

Đổi `W, H = 1080, 1920` và dùng một hàm `layout()` đặt lại vị trí nhân vật, biểu đồ, phụ đề theo khổ; đừng chỉ co giãn khung ngang. Dùng chung `SCENES` và `WORDS`.

## Âm thanh trong trang

`window.buildAudio(ctx)` xếp toàn bộ âm thanh (giọng đọc, hiệu ứng, nhạc) từ thời điểm 0 trên `AudioContext` hoặc `OfflineAudioContext` được đưa vào, dùng đúng các mốc thời gian của hình. Tải file bằng XHR (fetch không đọc được `file://`). Chi tiết ở `voiceover-and-sound.md`. Xem trước trong trình duyệt: lần phát đầu render âm thanh vào một buffer rồi phát từ vị trí kéo, dùng đoạn mã `play/pause/now` có trong skill `explainer-default` của repo nếu cần thanh điều khiển.

## Lỗi hay gặp

- Khung đầu trống: `seek(0)` phải vẽ ra cảnh đầu hoàn chỉnh (hook phải có chuyển động ngay).
- Phần tử tràn mép khi camera zoom: kiểm tra still ở thời điểm zoom lớn nhất.
- Số liệu dùng số đã làm tròn trong khi nguồn ghi số khác: lấy từ `research.md`, không gõ lại từ trí nhớ.
- Chữ có dấu bị cắt trên/dưới: tăng `line-height`, đặt `overflow: visible`.
