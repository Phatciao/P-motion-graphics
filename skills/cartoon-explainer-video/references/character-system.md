# Character system: nhân vật dẫn chuyện như một diễn viên 2D

Ngôn ngữ của skill này: **một nhân vật xuyên suốt cả video, là một phần của câu chuyện**, không đứng ở góc màn hình để nói. Nhân vật ngồi trên chữ, tựa vào tiêu đề, nhảy xuống một dấu chấm, chạy theo dòng chữ, kéo một từ sang chỗ khác, chỉ vào biểu đồ. Mỗi hành động có lý do kể chuyện (xem `smooth-transitions.md`).

## Nhân vật mặc định: theo ảnh tham chiếu của người dùng

Nhân vật được vẽ lại từ bảng tham chiếu `assets/character/reference/character-sheet-reference.png`: người đàn ông trẻ tóc đen gai ngắn, có nốt ruồi bên má, áo polo xám cổ chữ V hai cúc, quần jeans xắn gấu, giày thể thao màu be viền nâu, đồng hồ đen ở cổ tay (tay phía +x). **Giữ nguyên nhận dạng này** cho cả video và cả series: không đổi tóc, màu áo, quần, giày; mọi sắc thái khác nhau chỉ đến từ biểu cảm và tư thế. Bảng màu nằm ở `AVC` đầu file `assets/avatar.js`.

Đây là nhân vật tự thiết kế của người dùng (không phải người thật, không phải nhân vật có bản quyền của người khác). Nếu người dùng đưa nhân vật khác, làm lại theo cùng quy trình bên dưới và giữ nguyên tên các lớp.

## Các file

| File | Là gì |
|---|---|
| `assets/avatar.js` | Rig chạy được: SVG tách khớp, biểu cảm, IK cho tay, chân tự bám mặt đất |
| `assets/character/parts/*.svg` | 37 bộ phận SVG riêng (đầu, tóc, mắt 5 trạng thái, lông mày 6 kiểu, miệng 9 kiểu, thân polo, tay, cẳng tay, 5 bàn tay, quần, đùi, ống quần xắn gấu, giày, tư thế ngồi xếp bằng, vạch ngạc nhiên). Gốc toạ độ (0,0) của mỗi file là khớp xoay. Dùng để nhập vào Rive, After Effects, Lottie, Figma |
| `assets/character/parts-sheet.png` / `.html` | Bảng tất cả bộ phận, để đối chiếu với ảnh gốc |
| `assets/character/rig-poses.png` / `sheet.html` | Bảng tư thế dựng bằng chính rig (đứng, vẫy, ngạc nhiên, nghĩ, khoanh tay, đi, chạy, ngồi, xếp bằng, chỉ tay, bật) |
| `scripts/export-character.mjs` | Xuất lại các file SVG và bảng bộ phận sau khi sửa `avatar.js` |

Cần xem lại nhân vật sau khi sửa: mở `assets/character/sheet.html` trong trình duyệt (cùng thư mục với `avatar.js`).

## Dùng avatar.js

```js
mountAvatar(svgParent, 'hero');            // tạo nhân vật một lần
poseAvatar('hero', t, { x, y, scale, ex: 'calm', sit, run, phase, ... });   // mỗi khung
```

Gốc toạ độ của nhân vật là **điểm tiếp xúc với bề mặt** (bàn chân khi đứng, mông khi ngồi), nên "đặt nhân vật lên chữ" chỉ là đặt `y` = mặt trên chữ. Nhân vật cao khoảng 320 px ở `scale: 1`; trong khung 1080p thường dùng 1.2–1.5. Danh sách tham số đầy đủ nằm ở phần chú thích đầu `avatar.js`; các nhóm chính:

**Biểu cảm** (`ex`, trộn mượt sang `ex2` bằng `exk` 0..1): `calm` (mỉm cười nhìn lên), `happy` (cười mở miệng), `surprised` (kèm `fx: true` cho vạch), `thinking`, `content` (nhắm mắt cười), `worried`, `sure`, `neutral`. Chớp mắt tự động; `talk` 0..1 mở miệng theo từ đang nói (lấy từ `WORDS`); `look: [x, y]` hướng nhìn; `tilt` nghiêng đầu. Lông mày nội suy số học, mắt nhắm theo mức mí mắt nên đổi sắc thái rất mượt; miệng chuyển bằng cross-fade.

**Chân và thân**: `run` 0 đứng yên, ~0.5 đi bộ, 1 chạy; `phase = quãng đường / bước` để chân khớp đường đi (không trượt chân; bước chân luôn bám mặt đất vì rig tính chiều cao hông từ chân thấp nhất); `sit: 1` ngồi vắt chân trên mép (đặt `y` = mặt ghế); `sit: 1, seat: 'cross'` ngồi xếp bằng trên nền; `air` 0..1 co chân khi bay; `squash` 0..0.3 hạ người trước khi bật hoặc khi chạm đất; `lean` nghiêng thân; `face: -1` quay sang trái.

**Tay**: `armA` (không đồng hồ, phía sau) và `armB` (có đồng hồ, phía trước) nhận: tên có sẵn `'rest' | 'chin' | 'cross' | 'pocket' | 'hip'`, góc `{ s, e }` (vai, khuỷu), hoặc `{ reach: [wx, wy] }` để **bàn tay với tới một điểm trong khung hình** (IK hai đoạn, khuỷu tự chọn hướng hợp lý). `reach` là cách làm nhân vật chạm chữ, chỉ vào cột biểu đồ, đẩy một vật. `wave` 0..1 vẫy tay, `point` 0..1 chỉ tay. Bàn tay: `handA`, `handB` = `relaxed | fist | point | thumb | palm | none`. Khoanh tay cần `frontA: true` (hoặc `armA: 'cross'`) để tay A ra trước thân.

## Bộ động tác cơ bản

| Động tác | Cách làm bằng tham số |
|---|---|
| Idle: đứng, ngồi, nhìn | `sit` 0/1; chớp mắt và thở có sẵn; `look` đổi hướng nhìn |
| Walk / Run | `run` + `phase` |
| Jump / Land | chuẩn bị `squash` 0.14 (0,2–0,3 s); bay: parabol cho `x,y` và `air`; chạm đất: `squash` 0.2 tắt dần có dao động (~0,2 s) |
| Sit / Lean | `sit: 1` đặt `y` ở mặt ngồi; tựa vào vật: `lean` và `x` sát vật |
| Push / Pull | `armB: { reach: [vật.x, vật.y] }` và nhân vật di chuyển cùng vật |
| Point / React | `point` hoặc `armB: { reach }`; ngạc nhiên = `ex: 'surprised'` + `fx`; hoài nghi/nghĩ = `ex: 'thinking'` + `armB: 'chin'` |
| Transition | nhân vật rời cảnh hoặc dẫn sang cảnh mới bằng chính hành động (xem `smooth-transitions.md`) |

Cần động tác mới (ví dụ ngồi chồm hổm, quay lưng): thêm tham số trong `poseAvatar`, đừng làm nhân vật thứ hai.

## Đường đi của nhân vật

Trong trang, viết hàm `hero(t)` trả về đối tượng tư thế, chia thành **các đoạn nối nhau**, mỗi đoạn là một việc nhân vật làm và gắn với một từ trong lời dẫn (xem template: ngồi → nhìn → hạ người → bật → chạm → được chữ chở đi → chạy → dừng → chống cằm nghĩ). Quy tắc:

- Mỗi đoạn bắt đầu bằng **chuẩn bị** (lùi, nhìn, hạ người) và kết thúc bằng **tiếp nhận** (bẹp nhẹ, dừng, nhìn tiếp). Không dịch chuyển tức thời.
- Vị trí khi tiếp xúc phụ thuộc vào đạo cụ: dùng hàm `surfaceY(x)` trả về mặt phẳng tại `x` (mặt trên chữ, cột biểu đồ, bản đồ); khi đạo cụ đang trượt thì `x` nhân vật = `x` đạo cụ + độ lệch (nhân vật được chở đi).
- Nhân vật nhìn **trước** khi làm (đầu quay về chữ 0,3–0,5 s trước khi nhảy). Ánh nhìn dẫn mắt người xem.
- Tốc độ chạy/đi theo ý nghĩa: chạy khi nội dung dồn tới, đi chậm khi suy ngẫm. Đặt `phase` theo quãng đường đã đi chia cho độ dài bước (`≈ 70 × scale` px) để chân không trượt.
- Biểu cảm đổi **đúng lúc lời dẫn nhấn ý**, bằng `ex`/`ex2`/`exk`, không đổi liên tục.

## Giới hạn hiện tại (nói thật với người dùng)

- Rig dùng **một góc nhìn** (thân gần chính diện, đầu hơi nghiêng 3/4 về phía +x, chân nhìn nghiêng). Đủ cho đứng, ngồi, đi, chạy, nhảy, chỉ, chống cằm, khoanh tay. Quay lưng, nhìn thẳng vào người xem hoặc nhìn hẳn từ bên cạnh cần thêm bộ phận SVG cho góc đó.
- Nét vẽ phẳng, viền mảnh, đổ bóng đơn giản; chưa mềm như bản minh hoạ gốc (không có chuyển sắc, tóc ít chi tiết). Muốn sát hơn nữa thì thay các đoạn SVG trong `avatar.js` bằng bản người dùng vẽ, giữ nguyên tên lớp và khớp xoay.
- Ngón tay không cử động riêng; bàn tay đổi bằng cách thay kiểu (`handA`/`handB`).

## Tiết chế là cá tính

Không biến nhân vật thành hoạt náo viên. Có lúc nhân vật chỉ ngồi trên một từ, nhìn người xem, hoặc đứng im vài giây (idle: thở, chớp mắt). Quy tắc: **không có hành động nào nếu lời dẫn không cần**. Mật độ hành động theo nội dung nằm trong `editorial-explainer.md` và `philosophical-motion.md`.

## Nhân vật phụ và nhóm đông

Nhân vật phụ (người đi làm, chủ quán, học sinh) có thể là biểu tượng đơn giản hoặc dùng lại bộ phận của nhân vật chính đổi màu (`AVC`) và kiểu tóc; khác dáng, tuổi, tóc, không rập khuôn nhóm người nào. Không vẽ người thật; không dùng logo, huy hiệu, mẫu áo hay nhân vật có bản quyền của người khác.
