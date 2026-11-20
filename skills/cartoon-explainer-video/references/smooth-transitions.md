# Smooth transitions: chuyển cảnh êm và có chủ đích

Người xem phải tập trung vào nội dung, không đuổi theo hiệu ứng. Chuyển cảnh là chỗ dễ lạm dụng nhất, nên có quy tắc chặt.

## Hạn chế

Mặc định **tránh**: zoom mạnh, rung giật, xoay, glitch, chữ bay liên tục, đổi khung hình dồn dập, chớp trắng. Camera gần như đứng yên (trôi rất chậm, zoom tổng ≤ 3–5% trong cả video, hoặc đẩy tối đa ~8% ở một khoảnh khắc nhấn mạnh duy nhất có lý do). Nếu thấy cần một hiệu ứng mạnh, tự hỏi câu chuyện cần gì ở đó; nếu không trả lời được thì bỏ.

## Chuyển cảnh bằng hành động

Hai cảnh được nối bằng **một hành động của nhân vật hoặc vật thể**, không phải bằng hiệu ứng phần mềm:

| Kiểu | Mô tả |
|---|---|
| Nhảy | nhân vật nhảy từ vật này sang vật kia; vật cũ lùi, vật mới trở thành trung tâm |
| Chở đi | nhân vật đứng trên chữ/vật, chữ trượt sang một bên mang theo nhân vật, cảnh mới mở ra phía sau |
| Chạy theo | nhân vật chạy theo dòng chữ hoặc đạo cụ đang rời đi, dừng bên chữ/vật tiếp theo |
| Kéo | nhân vật kéo một từ hoặc tấm biểu đồ vào khung, nó đẩy cảnh cũ ra |
| Chỉ | nhân vật chỉ về phía trước, nội dung mới trượt vào từ hướng đó |
| Bước ra | nhân vật rời khung, người xem nhìn thấy đạo cụ còn lại, rồi nhân vật quay lại ở cảnh mới |

Điểm quan trọng: **không cần thay toàn bộ nền.** Giữ lại một số vật thể, chữ hoặc nhân vật xuyên qua cảnh để mọi thứ thuộc cùng một thế giới. Chỉ thay phần đã hết vai trò, bằng cách trượt ra hoặc mờ dần (0,3–0,5 s).

Ví dụ với câu "The problem is not what we know. It's what we fail to question." (xem `assets/template.html`): nhân vật ngồi trên dấu hỏi → chữ KNOW hiện, nhân vật nhìn xuống → nhảy khỏi dấu hỏi, đáp xuống KNOW → KNOW trượt sang trái chở nhân vật, dấu hỏi lùi mờ, QUESTION trượt vào → nhân vật chạy theo chữ, dừng bên QUESTION → nghiêng đầu, khoảng lặng trước khi lời dẫn tiếp tục.

## Chuyển động mượt, có quán tính, có khoảng nghỉ

- Mọi thay đổi vị trí đi qua `spring` hoặc `ease` (0,4–1,0 s). Không đổi tức thời, không tuyến tính.
- Đạo cụ lớn (chữ, biểu đồ) trượt chậm hơn nhân vật một nhịp và dừng êm (`easeOut`); nhân vật có chuẩn bị trước và tiếp nhận sau.
- **Khoảng nghỉ**: sau một chuyển cảnh, giữ yên 0,8–1,5 s để người xem đọc và hiểu. Sau một ý quan trọng, nghỉ lâu hơn (2–3 s) với nhân vật idle. Đừng lấp đầy mọi giây bằng chuyển động.
- Nhịp thay đổi theo nội dung, không theo hiệu ứng (xem `editorial-explainer.md`, `philosophical-motion.md`).

## Kiểm tra

Xem lại video không tiếng: người xem vẫn theo kịp mạch không? Có chuyển động nào mà bỏ đi cũng không ai nhận ra không? Bỏ đi. Mỗi lần màn hình thay đổi lớn, có đúng một thứ để nhìn không?
