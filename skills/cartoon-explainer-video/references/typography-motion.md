# Typography motion: chữ là đạo cụ

Chữ lớn, rõ, và có **vật lý**: có bề rộng, có mặt phẳng trên để nhân vật đứng hoặc ngồi, có thể bị đẩy, kéo, trượt. Chữ không chỉ hiện ra rồi biến mất.

## Chữ có kích thước thật

Vẽ chữ bằng SVG `<text>` (không dùng ảnh). Đo bằng canvas để biết bề rộng và độ cao chữ in hoa:

```js
const m2 = document.createElement('canvas').getContext('2d'); m2.font = FONT;   // dùng ĐÚNG phông và cỡ chữ đang vẽ
const meas = s => { const m = m2.measureText(s); return { w: m.width, a: m.actualBoundingBoxAscent }; };
const K = meas('KNOW');            // K.w = bề rộng, K.a = cao từ đường cơ sở lên đỉnh chữ
const TOP_K = BASE - K.a;          // mặt phẳng để nhân vật đứng
```

Đợi phông nhúng tải xong trước khi đo (phông thật cho số đo thật). Khi bố cục có nhiều chữ, tính vị trí từ bề rộng đo được, cộng khoảng cách cố định (60–80 px), và kiểm tra tổng bề rộng còn cách mép ≥ 6%.

## Chữ có thể làm gì

| Việc | Cách làm |
|---|---|
| Hiện ra | `spring` phóng nhẹ (0,85→1) kèm độ mờ; một từ một lần, đúng lúc lời dẫn nhắc tới nó |
| Làm chỗ ngồi/đứng | `y` nhân vật = mặt trên chữ; ngồi trên dòng chữ như ngồi trên ghế hoặc vầng trăng khuyết |
| Làm bệ phóng | nhân vật bật khỏi chữ, chữ lún xuống nhẹ (3–6 px) rồi bật lại |
| Bị trượt, bị kéo | `x` của chữ là hàm của `t`; nếu nhân vật đứng trên chữ thì `x` nhân vật = `x` chữ + độ lệch |
| Dẫn người xem sang cảnh sau | chữ trượt sang một bên và trở thành một phần của cảnh tiếp theo (không biến mất) |
| Nhấn từ khóa | ô nhấn/gạch chân quét từ trái sang phải sau từ (0,3–0,45 s), màu nhấn duy nhất |
| Đổi nghĩa | một chữ biến thành chữ khác bằng cách đổi từng chữ cái theo `spring`, giữ vị trí |

## Quy tắc đọc được

- Mỗi lần trên màn hình tối đa **một ý chữ** (một đến hai từ lớn, hoặc một dòng ngắn ≤ 6 từ). Chữ khác (phụ đề) nhỏ và nhạt để không tranh chú ý.
- Chữ đủ lớn để đọc trên điện thoại; chữ đạo cụ thường 150–220 px ở 1080p; phụ đề 40–54 px.
- Tương phản cao với nền; không đặt chữ lên chỗ có hạt nhiễu nặng.
- Chữ đứng yên đủ lâu để đọc (tối thiểu 1,2 s sau khi chuyển động kết thúc); không chữ nào bay liên tục.
- Phông có đủ dấu tiếng Việt và nhúng base64; thử bằng câu nhiều dấu trước khi render bản cuối. Chữ có dấu cần `line-height` thoải mái và không bị cắt trên dưới.

## Đồng bộ với lời dẫn

Từ trong lời dẫn là mốc kích hoạt: chữ hiện **đúng lúc từ đó được đọc** (hoặc sớm hơn 0,05–0,1 s), nhân vật phản ứng ngay sau đó. Lấy giờ từ `WORDS` (xem `voiceover-and-sound.md`), không đặt giờ bằng mắt.
