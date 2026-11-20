# Giọng đọc, căn thời gian và âm thanh

Thứ tự ưu tiên khi trộn: **giọng đọc > hiệu ứng âm thanh > nhạc nền**. Hình khớp với lời là thứ làm video trông chuyên nghiệp nhất, nên thời gian của mọi cảnh lấy từ file giọng đọc thật.

## 1. Lấy giọng đọc

Hỏi ở bước brief, theo thứ tự ưu tiên:

1. **Người dùng tự thu** (hoặc có sẵn file): dùng file đó. Nhận mp3/wav/m4a.
2. **Tạo bằng công cụ giọng nói đã kết nối** (ví dụ một connector có chức năng voiceover): liệt kê giọng có sẵn, để người dùng chọn một giọng, tạo **từng cảnh một file** rồi nối. Công cụ có tính phí hoặc hạn mức thì nói trước.
3. **Chưa có giọng**: dựng **bản nháp im lặng** theo thời lượng ước tính (tiếng Việt 2,5–3 từ/giây), giao kèm `script.md` đánh dấu từng cảnh và file `.srt` để thu sau; khi có giọng thì chạy lại bước căn thời gian.

Không tự tạo giọng bằng mã tổng hợp giả. Tên riêng, số liệu và từ nước ngoài: hỏi cách đọc nếu chưa chắc, viết số ra cách đọc trong `script.md` ("hai nghìn không trăm hai mươi sáu") để giọng đọc không sai.

## 2. Căn thời gian

1. Đọc độ dài thật của từng file: `ffprobe -v error -show_entries format=duration -of csv=p=0 scene01.mp3`.
2. Độ dài cảnh `b − a` = độ dài giọng + khoảng thở 0,3–0,5 s (cảnh hook ngắn hơn, cảnh chốt dài hơn một chút). Cộng lại, so với mục tiêu; vượt quá thì cắt lời trong kịch bản, không tăng tốc giọng.
3. **Giờ từng từ** (`WORDS`) cho phụ đề và mấp máy môi, theo độ chính xác giảm dần:
   - Nhận dạng giọng có mốc thời gian từng từ (nếu cài được `faster-whisper`, dùng nó trên file giọng; chọn đúng ngôn ngữ).
   - Từ file phụ đề `.srt/.vtt`: skill `motion-broll` của repo có `scripts/words.py` ước lượng giờ từng từ (sai khoảng 0,2 s).
   - Chia đều theo số âm tiết trong khoảng giọng nói của câu (cách dùng trong template, chỉ để làm nháp).
4. Ghi kết quả vào `SCENES` và `WORDS`, dựng lại ảnh tĩnh, kiểm tra hình khớp lời ở 3–4 điểm.

## 3. Phụ đề

Phụ đề đã nằm trong trang (từ hiện theo giờ từ). Xuất thêm một file `.srt` từ `WORDS` gộp theo câu để người dùng dùng trên nền tảng nếu cần.

## 4. Hiệu ứng âm thanh

- **Chỉ dùng file thật, không tổng hợp bằng dao động/beep trong mã.**
- Nếu skill `sound-effects` có sẵn, dùng nó cho lượt xử lý âm thanh (có bộ CC0 đi kèm, kiểm tra nhịp, đo độ to trên MP4 đã xuất). Cách ánh xạ cho video cartoon:

| Khoảnh khắc | Loại âm thanh |
|---|---|
| đổi cảnh, camera lướt | whoosh (vào sớm 2 khung) |
| nhân vật, chữ, vật thể xuất hiện | pop |
| cột biểu đồ nhích lên, bước đếm | tick (rất nhỏ) |
| kết quả, bất ngờ, số liệu chốt | impact (to nhất trong nhóm hiệu ứng) |
| trước một khoảnh khắc lớn | riser (kết thúc đúng lúc cú đập) |
| thành công, đáp án | ding/pop |

- Mỗi khoảnh khắc **một** âm; thay đổi biến thể để lặp lại không máy móc. Thể thao: nhiều âm hơn, nhịp nhanh; triết học và lịch sử: ít, tinh tế.
- Đặt âm bằng file `cues.json` (`[{ "t": 4.8, "type": "pop" }, …]`) và vòng lặp trong `buildAudio`; dùng cùng mốc thời gian với hình.

Ví dụ đặt cue trong `buildAudio`:

```js
const SFX = { pop: 'audio/pop.ogg', whoosh: 'audio/whoosh.ogg', tick: 'audio/tick.ogg' };
const CUES = [{ t: 0, type: 'whoosh', g: 0.5 }, { t: 4.8, type: 'tick', g: 0.25 }];
for (const c of CUES) { try { play(await loadBuf(ctx, SFX[c.type]), c.t, c.g); } catch (e) {} }
```

## 5. Nhạc nền

Dùng nhạc người dùng đưa, hoặc nhạc miễn phí tải lúc chạy (xem `MUSIC.md` của skill `sound-effects`). Hỏi nguồn và giấy phép của bản nhạc và ghi vào `CREDITS.txt`; chưa xác nhận được thì nói rõ "chưa xác nhận giấy phép". Nhạc không lời, nhịp phù hợp mảng (thể thao nhanh, triết học chậm).

## 6. Độ to

Mục tiêu khoảng **−16 LUFS** tích hợp, đỉnh thật dưới −1,5 dBFS (`render.mjs` chuẩn hóa về mức này; nếu dùng skill `sound-effects`, theo ngưỡng của nó). Nhạc nền thấp hơn giọng khoảng 15–20 dB và hạ thêm 8–12 dB khi có lời. Đo trên **file MP4 đã xuất**, không đo file trung gian. Nghe thử qua tai nghe ở 5 thời điểm rủi ro (cảnh đổi lớn, đoạn nhạc to, chỗ giọng gần hiệu ứng) và báo người dùng kiểm tra; không nói "nghe ổn" khi chưa đo.

## 7. Giấy phép và ghi nguồn

Trước khi xuất bản, kiểm tra giấy phép hiện tại của từng nguồn âm thanh và nhạc cho đúng nơi đăng (YouTube, mạng xã hội, quảng cáo...). File `CREDITS.txt` liệt kê các âm thanh đã dùng và nhạc, để dán vào phần mô tả video và làm bằng chứng nguồn nếu nền tảng gắn cờ.
