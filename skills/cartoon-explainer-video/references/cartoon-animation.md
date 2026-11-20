# Hoạt hình cartoon trong trang `seek(t)`

Mục tiêu: nhân vật "sống" và dễ thương mà không cần phần mềm rig. Nhân vật là các nhóm SVG xếp lớp (thân, đầu, mắt, miệng, tay), mỗi bộ phận chỉ là một `transform` hay thuộc tính tính từ `t`.

## Bộ nguyên tắc tối thiểu (làm đủ là đã trông chuyên nghiệp)

| Hiệu ứng | Cách làm | Số gợi ý |
|---|---|---|
| Thở | thân dịch lên xuống theo sin | biên độ 5–8 px, chu kỳ 2,5 s |
| Chớp mắt | mắt `scaleY` về 0,1 trong thời gian ngắn | mỗi 3–4 s, kéo dài 0,12 s |
| Mấp máy môi | độ mở miệng theo từ đang nói (`WORDS`) | mở 0,45–1,0 khi có từ, 0 khi nghỉ |
| Xuất hiện | `spring` trượt hoặc phóng vào, hơi vọt quá | `spring(t, 12, 0.7)` |
| Nhấn mạnh | co dãn: bẹp khi chạm, kéo dài khi bay | chạm 1,25×0,8 trong khoảng 60 ms; bay tới 1,15×0,9 |
| Chuẩn bị (anticipation) | lùi nhẹ trước khi lao tới | 0,1–0,2 s |
| Theo sau (follow-through) | tay, tóc, đồ vật chậm hơn thân một nhịp | trễ 0,05–0,1 s |
| Ánh nhìn | mắt nhìn về vật đang nói tới | dịch con ngươi 6–10 px |

Quy tắc chuyển động: không bao giờ đổi vị trí tức thời; mọi thay đổi đi qua `spring` hoặc `ease`. Chuyển động nền của camera rất chậm (zoom/pan 1–2%) để cảnh không chết cứng.

## Mấp máy môi

Dùng giờ từ đã căn với giọng đọc (`WORDS`). Trong `[t, t + d]` của một từ: độ mở = `0.45 + 0.55·|sin((t − t0)·22)|`; ngoài từ: miệng gần đóng. Cách này không cần phân tích âm thanh và khớp đủ tốt với cartoon. Nếu cần chính xác hơn, tính đường bao biên độ của file giọng đọc một lần lúc tải (đọc buffer, lấy RMS theo cửa sổ 1/60 s, lưu mảng) rồi `seek` đọc ra.

## Biểu cảm

Mỗi nhân vật có 3–5 biểu cảm thiết kế sẵn (trung tính, ngạc nhiên, băn khoăn, vui, buồn) làm bằng cách đổi hình lông mày, miệng, mắt; chuyển giữa các biểu cảm bằng `spring` ngắn. Đổi biểu cảm **đúng lúc lời dẫn nhấn ý**, không đổi liên tục.

## Phong cách "on twos" (tùy chọn)

Muốn cảm giác hoạt hình vẽ tay: lượng tử hóa thời gian của riêng nhân vật, `tc = Math.floor(t * 12) / 12`, rồi tạo pose từ `tc` (camera và chữ vẫn dùng `t` để mượt). Render ở 24 fps, không motion blur.

## Thiết kế nhân vật

- **Đơn giản và nhận ra bằng bóng**: hình khối cơ bản (tròn, bo góc), 1 màu áo nổi bật, 1 đặc điểm riêng (kính, mũ, tóc). Giữ ≤ 5 màu chính + 1 màu nhấn cho cả video.
- **Nhất quán**: một bản thiết kế cho cả video; khi vẽ biểu cảm hay góc mới, so lại với bản gốc (kích thước đầu, vị trí mắt, màu áo).
- **Đa dạng không rập khuôn**: nhân vật đại diện (người đi làm, chủ quán, học sinh) khác nhau về dáng, tuổi, tóc, nhưng không gán đặc điểm cho một nhóm người.
- **Nhân vật thật**: không vẽ chân dung giống người thật. Dùng nhân vật cartoon đại diện (số áo, màu áo, đạo cụ để gợi) và gọi tên trong lời dẫn. Không dùng logo, huy hiệu, mẫu áo, linh vật có bản quyền.
- Mẫu nhân vật trong `assets/template.html` (`charSVG`) là thiết kế gốc dùng làm điểm xuất phát; thay đổi tự do.
- Nếu người dùng có ảnh nhân vật riêng, tách thành các lớp PNG/SVG (thân, đầu, mắt, miệng, tay) và chạy cùng `poseChar`.

## Ẩn dụ thị giác cho khái niệm trừu tượng

Hình phải minh họa **ý**, không minh họa chữ. Vài gợi ý:

| Ý | Hình |
|---|---|
| Lạm phát, giá tăng | chiếc bánh nhỏ dần; giỏ hàng cùng số tiền chứa ít đồ hơn |
| Nguyên nhân – hệ quả | chuỗi domino, ống nước dẫn từ bể này sang bể kia |
| Ùn tắc, nút thắt | cổ chai, ống nghẹn |
| Cân bằng, đánh đổi | cái cân, bập bênh |
| Quyền lực, đế chế | tháp xếp khối rồi đổ |
| Thời gian, lịch sử | con đường có cột mốc, dòng sông, bản đồ cách điệu chạy theo hành trình |
| Chiến thuật thể thao | sơ đồ sân với chấm và mũi tên, vùng tô màu |
| Câu hỏi triết học | ngã ba đường, hang động và bóng đổ, chiếc gương |

## Nền và bố cục theo mảng

- **Vấn đề đời sống**: nền phẳng sáng, vài đồ vật gần gũi, biểu đồ đơn giản (một biểu đồ một thông điệp).
- **Thể thao**: sân dạng sơ đồ, màu đậm, nhịp nhanh (đổi cảnh 2–4 s), số liệu chạy theo vòng.
- **Lịch sử**: bản đồ và dòng thời gian, tông màu ấm giấy cũ, hạt nhiễu nhẹ, trang phục và kiến trúc đúng thời kỳ.
- **Triết học**: tối giản, nhiều khoảng trống, chuyển động chậm (đổi cảnh 5–8 s), một ẩn dụ lớn.

Thêm hạt nhiễu (canvas vẽ một lần lúc tải, độ mờ 5–8%) cho cảm giác giấy; cấm dùng CSS blur lớn.
