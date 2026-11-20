# Pipeline chi tiết

## 1. Nghiên cứu (`research.md`)

Cấu trúc:

```
# Chủ đề
## Ý chính (1 câu)
## Dữ kiện then chốt (5–10 gạch đầu dòng, mỗi dòng có nguồn)
## Số liệu (bảng: số liệu | giá trị | nguồn | ngày)
## Điểm gây tranh cãi / chỗ dễ sai
## Nguồn (link)
```

Lấy tối thiểu 3 nguồn độc lập cho chủ đề thời sự. Ghi ngày truy cập. Nếu hai nguồn mâu thuẫn, ghi cả hai và chọn cách nói thận trọng trong lời dẫn ("theo X...", "ước tính khoảng...").

## 2. Kịch bản (`script.md`)

Cấu trúc ba hồi, tỉ lệ theo thời lượng:

| Hồi | Tỉ lệ | Vai trò |
|---|---|---|
| Hook + đặt vấn đề | 10–15% | Gây tò mò, nêu câu hỏi |
| Thân | 65–75% | 3–5 ý nhỏ dẫn tới luận điểm, mỗi ý một cảnh hoặc nhóm cảnh |
| Chốt | 10–15% | Nhắc luận điểm, một câu để người xem mang đi |

Quy tắc viết lời dẫn để nghe, không để đọc:
- Câu ngắn, 8–16 từ. Một câu một ý.
- Tốc độ đọc tiếng Việt khoảng 2,5–3 từ/giây; tiếng Anh khoảng 2,5 từ/giây. Dùng con số này để ước thời lượng từng cảnh trước khi có giọng đọc thật.
- Con số quan trọng nói một lần, kèm so sánh dễ hình dung.
- Tránh ngoặc đơn và câu lồng, vì không đọc lên được.

## 3. Storyboard (`storyboard.md`)

Một bảng, mỗi hàng một cảnh:

| # | Giây | Lời dẫn | Hình (ẩn dụ thị giác) | Chuyển động | Chữ trên màn hình | Âm thanh |
|---|---|---|---|---|---|---|

Kiểm tra trước khi duyệt:
- Tổng thời lượng khớp mục tiêu (sai số ±10%).
- Không có hai cảnh liền nhau cùng bố cục.
- Mỗi cảnh có thể mô tả bằng một câu "người xem nhìn thấy…".
- Chữ trên màn hình tối đa khoảng 8 từ, chỉ để nhấn từ khóa hoặc số liệu.

## 4. Nhân vật và asset

Mặc định dùng **nhân vật dẫn chuyện có sẵn `assets/avatar.js`** (vẽ bằng SVG, điều khiển bằng một đối tượng tư thế), vì như vậy chuyển động (thở, chớp mắt, mấp máy môi) điều khiển được theo thời gian. Khóa trước một **bảng phong cách**: kiểu nét, bảng màu (tối đa 5 màu chính + 1 màu nhấn), kiểu nền, và danh sách nhân vật (tên, đặc điểm nhận dạng, 3–5 biểu cảm). Nếu người dùng có ảnh nhân vật riêng (PNG/SVG tách lớp, nền trong suốt), dùng chúng; có thể dùng skill `ai-character-factory` hoặc `video-asset-factory` nếu có sẵn.

## 5. Dựng, âm thanh, render

Xem `character-system.md`, `typography-motion.md`, `smooth-transitions.md`, `engine.md`, `voiceover-and-sound.md`. Thời lượng từng cảnh lấy từ file giọng đọc thật. Sau khi render, kiểm tra: tổng thời lượng, chữ không bị cắt ở mép, phụ đề không che mặt nhân vật, giọng rõ hơn nhạc nền, và xem lại hook 5 giây đầu.

## 6. Giao

Gửi file video, kèm `script.md` và danh sách nguồn. Nói ngắn gọn video đạt gì và một việc nên làm tiếp (ví dụ phiên bản dọc 9:16 hoặc phụ đề ngôn ngữ khác).
