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

## v2.3 (rig vector toàn thân, góc 3/4)
- Chỉ còn **đầu + biểu cảm** là ảnh cắt từ S1–S5 (đầu giữ cằm/cổ gốc, cắt lại từ `cut/`); thân, tay, chân, bàn tay, đồ cầm đều là vector trong `video.html` (`rigSpec`, `rigPose`, `torsoSVG`, `drawPerson`).
- Góc nhìn 3/4: thân quay theo yaw liên tục `psiT = 90° − 35°·dirF`, chân tiến dần về góc nghiêng khi đi. Khi quay đầu hướng (0,7 s) thân xoay qua chính diện, đầu lật theo dấu scaleX; không còn flip sprite.
- Chân: IK 2 khớp, chu kỳ bước theo quãng đường, nhấc chân + nhún hông; lớp chân nằm dưới thân, bắp chân dày hơn ống chân; đầu chân ẩn dưới gấu áo.
- Tay: vai ở mép thân để tay xa cũng thấy; tay xách đồ dùng góc `hold`, tay rảnh cùng độ cong khuỷu (12°) và đánh nhẹ ngược chân. Bàn tay = hình chữ nhật một đầu bo tròn, to hơn cổ tay (×1,85 chiều rộng, ×0,8 chiều dài).
- Đầu: `hflip` cho đầu gốc quay sai hướng (S3, S4c); `hdn/hbk` dịch đầu xuống/lùi (S3, `noneck`), `hbk` âm = ra trước (S4a). Cổ vector theo tâm cổ `ncx`/bề rộng `nw` của từng đầu; cô áo vàng (S2) lệch cổ riêng vì không có ve áo.
- Giới hạn: bàn tay chưa có ngón; S3 mất dải bóng cằm nhỏ/sợi tóc dưới tai do dọn mảng xanh; `assets/chars.js` còn chứa PNG thân cũ không dùng.

## v2.4
- Walk: elbow flexes with the swing, head lags the body, torso lean/sway follows the step, quicker foot lift and softer landing.
- Hands: every hand (wide shots, carrying, close-ups) uses the one "drop hand" shape (`handShape`).
- S5: both legs are the same white (no far-leg darkening for her).
- Rewind (T 77 to ~85): one continuous reverse of the whole film (`RWR` speed table, ramp in/out); everyone walks backwards, close-ups return items to hands, VHS overlay (REW, timecode counting down, blur by speed), tape whirr and stop click; holds P1 before the release, then black end card at 87.
- Set: tall street lamp bent over the pile, soft light cone, pool of light and a vignette (`wLight`).
