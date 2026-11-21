# THE 1ST THROW — animatic (90 s)
Engine: `skills/cartoon-explainer-video` (page with `window.seek(t)`).
Render: `CHROME_PATH=/usr/bin/google-chrome node ../../scripts/render.mjs video.html out.mp4 30 1 4`
Scrub live: open `video.html`. Timing tables are at the top of the script (CLOSES, SEGS, REV).

## Scene map (global seconds)
01 0-6 empty · 02 6-12 P1 arrives · 03 12-15 close-up throw · 04 15-21 P1 leaves · 05 21-28 P2 notices (long pause)
06 28-32 close-up (hesitates) · 07 32-39 P2 leaves, P3 arrives (short pause) · 08 39-43 close-up
09 43-57 five wide/close cycles, shrinking pauses · 10 57-67 wide, close, wide (no hesitation)
11 67-77 static result · 12 77-90 reverse, P1 frozen before release, black, end card

## Assets
Placeholders drawn in code: 9 flat passer-by specs (SPEC), 6 prop types (item()), pile = items 0..8 added in order (states 1-9), street set.
## Assumptions / limits
- Animatic quality: placeholder flat shapes, synthesized sound (wind, footsteps, thumps), no real sound files yet.
- Salty is NOT used: the brief forbids a narrator/hero and needs distinct passers-by.
- Montage uses time jumps (new person starts mid-stride); pile has 9 items max.
- Reverse: wide steps remove items, two reversed close-ups; not every close-up is rewound.
- Not yet checked: smoothness of leave/turn animation frame by frame; final polish, real foley.

---

## v2 (animatic nâng cấp theo S1–S5 + brief enhancement)

- `video.html` = v2; `video_v1.html` = bản silhouette cũ; `assets/chars.js` = bộ phận nhân vật (đầu/thân/chân dạng PNG, vật dụng đã vector hoá bằng vtracer cho nét sắc).
- Casting: S1 = Person 1 (áo xanh rêu, túi đen buộc), S2 = Person 2 (áo vàng mù tạt, ly cà phê), S3 = Person 3 (áo xanh, ba lô, túi giấy nhàu), S4 = 3 người qua đường trong montage, S5 = người qua đường cuối (cảnh 10, vỏ gói).
- Diễn xuất: lớp biểu cảm (mắt, mày, miệng) đè lên mặt gốc, đầu cúi/nghiêng, đổi trọng tâm; độ do dự giảm dần P2 > P3 > các người sau > người cuối không do dự.
- Vật lý rơi theo trọng lượng (túi nặng bẹp, hộp nảy xoay, ly lăn, vỏ gói bay lượn); cận cảnh tay khớp màu tay áo/vật với cảnh wide.
- Đống rác nhỏ hơn 15–25%, xoay và chồng đa dạng; montage có trạng thái đống rác khác nhau.
- Kết cảnh tua ngược: gỡ vật mới nhất trước, tay ngược lại, về còn một túi, P1 cầm túi đầu tiên, dừng trước khi chạm đất, cắt đen, end card.
- Âm thanh: tổng hợp placeholder, giảm ở cảnh 11, gần im lặng trước túi đầu.
- Giới hạn: là animatic (chưa render final); rig dạng paper-doll cắt từ ảnh nên chân bước kiểu ngang; có thể còn vệt mảnh giữa hai chân ở một số nhân vật.

## v2.1 (tay/chân/đồ cầm vẽ lại bằng vector)
- Thân + đầu vẫn là ảnh cắt từ S1–S5 (đã bỏ phần tay/chân khỏi thân). Tay (vai–khuỷu–cổ tay, tay áo, bàn tay mở/nắm) và chân (đùi–cẳng, đầu gối gập, giày) được vẽ vector trong `video.html` (`mkArm/poseArm`, `mkLeg/poseLeg`), thông số từng nhân vật nằm ở `d.vec` trong `assets/chars.js` (sinh bởi script build ngoài repo).
- 4 món cầm tay (túi đen buộc, cốc cà phê, túi giấy nhàu, vỏ gói) là SVG vẽ tay, không còn trace từ ảnh.
- Giới hạn: vai còn hơi tròn, tay cầm cốc của S2 hơi cứng, bàn tay chưa có ngón riêng.
