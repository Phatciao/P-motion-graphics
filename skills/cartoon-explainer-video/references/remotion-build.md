> **Phương án thay thế.** Mặc định của skill là bộ dựng HTML `seek(t)` (xem `engine.md`). Chỉ dùng tài liệu này khi dự án của người dùng đã có sẵn Remotion hoặc một "Story Engine" riêng; khi đó giữ nguyên các quy tắc về hook, nhịp, nhân vật và âm thanh ở các tài liệu khác.

# Dựng bằng Remotion

Cách tổ chức giúp một kịch bản biến thành video mà không phải viết lại mã cho mỗi cảnh: **dữ liệu cảnh tách khỏi component**.

## Cấu trúc dự án gợi ý

```
src/
  Root.tsx              # đăng ký Composition (fps 30, kích thước theo nền tảng)
  Video.tsx             # ghép các Sequence từ scenes.json
  scenes.json           # mỗi cảnh: id, start, duration (frame), layout, assets, text, audio
  components/
    Scene.tsx           # khung cảnh: nền, lớp giữa, lớp trước
    Character.tsx       # nhân vật + biểu cảm/tư thế theo thời gian
    Caption.tsx         # chữ nhấn / phụ đề
    Chart.tsx           # biểu đồ động (số liệu từ props)
    Transition.tsx      # chuyển cảnh dùng chung
  lib/
    timing.ts           # đổi giây ↔ frame, đọc thời lượng từ audio
public/
  assets/               # ảnh nhân vật, nền (PNG trong suốt hoặc SVG)
  audio/                # voiceover theo cảnh, nhạc nền, sfx
```

Lý do dùng `scenes.json`: sửa lời dẫn hoặc đổi thời lượng chỉ là sửa dữ liệu, các component không đổi. Nếu người dùng đã có một "Story Engine" riêng trong dự án, theo kiến trúc đó thay vì tạo mới.

## Thời lượng theo giọng đọc

1. Tạo giọng đọc từng cảnh (một file một cảnh).
2. Đọc thời lượng thực của mỗi file, đặt `duration` của cảnh = thời lượng audio + khoảng thở 0,3–0,5 giây.
3. Tính lại tổng, so với mục tiêu.

Cách này tránh hình và lời lệch nhau, thứ khiến video trông thiếu chuyên nghiệp nhất.

## Chuyển động

- Ưu tiên `spring()` và `interpolate()` của Remotion với easing mượt; tránh chuyển động tuyến tính cứng.
- Mỗi cảnh: vào (0,3–0,5 giây), giữ, ra. Chuyển động nền rất chậm (zoom/pan nhẹ) giữ cảnh sống mà không gây xao nhãng.
- Nhân vật: nhịp thở nhẹ khi đứng yên, đổi biểu cảm đúng lúc lời dẫn nhấn.
- Thị sai nhiều lớp cho chiều sâu khi có asset tách lớp.
- Giữ ít loại chuyển cảnh (2–3 kiểu) cho toàn video để đồng nhất.

## Chữ và phụ đề

Cỡ chữ đủ đọc trên điện thoại. Vùng an toàn cách mép 5–8%. Phông có hỗ trợ đầy đủ dấu tiếng Việt (kiểm tra thật bằng một câu có nhiều dấu). Phụ đề tách theo cụm nói, mỗi dòng tối đa khoảng 42 ký tự.

## Âm thanh

Lời dẫn là chính; nhạc nền nhỏ, hạ nhạc khi có lời; hiệu ứng âm thanh chỉ ở điểm nhấn. Dùng nhạc và sfx có giấy phép rõ ràng (CC0 hoặc tự tạo); ghi nguồn trong file giao.

## Render

```bash
npx remotion render src/index.ts Main out/video.mp4 --codec=h264
```

Xem nhanh bằng `npx remotion studio` hoặc render một đoạn (`--frames=0-150`) trước khi render đầy đủ. Với nền tảng dọc, tạo Composition thứ hai 1080×1920 dùng chung `scenes.json` và chỉnh layout.

## Kiểm tra cuối

- Mọi asset tải đúng (không có ô trống).
- Không có chữ bị cắt ở mép.
- Thời lượng lời dẫn không bị cắt ở cuối cảnh.
- Hook 5 giây đầu có chuyển động ngay (không có khung tĩnh).
