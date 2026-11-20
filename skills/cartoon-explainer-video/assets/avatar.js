/* ===== AVATAR RIG v2: nhân vật dẫn chuyện theo ảnh tham chiếu của người dùng =====
   Một diễn viên 2D tách khớp, vẽ bằng SVG. Mặc định nhìn về phía +x (đổi bằng P.face = -1).
   Toạ độ riêng của nhân vật: gốc = điểm tiếp xúc mặt đất giữa hai bàn chân, y âm là hướng lên, cao khoảng 800 đơn vị.
   Cỡ hiển thị: P.scale (mặc định 1 = nhân vật cao khoảng 320 px, vì AV_BASE = 0.4).

   mountAvatar(svgParent, 'hero')              tạo một lần
   poseAvatar('hero', t, P)                    gọi mỗi khung trong seek(t)

   P (mọi trường đều tuỳ chọn):
     x, y       điểm tiếp xúc: bàn chân khi đứng/chạy, MẶT GHẾ khi ngồi
     scale, face  (face = 1 nhìn phải, -1 nhìn trái)
     sit        0 đứng .. 1 ngồi vắt chân trên mép (chân thõng); seat:'cross' ngồi xếp bằng trên nền
     run        0 đứng yên .. 0.5 đi bộ .. 1 chạy;  phase = pha chu kỳ chạy (bước chân khớp quãng đường)
     air        0..1 đang bay (co chân);  squash 0..0.3 hạ người chuẩn bị bật hoặc chạm đất; âm = kéo dài
     lean       nghiêng thân (độ, dương = về trước);  tilt nghiêng đầu (độ);  look [-1..1, -1..1] hướng nhìn
     ex         tên biểu cảm: calm happy surprised thinking content worried sure neutral
     ex2, exk   hoà trộn sang biểu cảm thứ hai (exk 0..1) để đổi sắc thái mượt
     talk       0..1 độ mở miệng khi nói (ghi đè miệng của biểu cảm);  blink tự động
     wave, point  0..1 (vẫy tay, chỉ tay bằng tay B)
     armA, armB   'rest' | 'chin' | 'cross' | 'pocket' | 'hip' | { s, e } góc vai/khuỷu | { reach:[wx,wy] } bàn tay với tới điểm thế giới
     handA, handB 'relaxed' | 'fist' | 'point' | 'thumb' | 'palm' | 'none'
     frontA     đưa tay A lên TRƯỚC thân (khoanh tay)
     fx         true: hiện vạch ngạc nhiên
   Quy ước góc: độ, dương = vung về phía trước (+x). Khuỷu: e dương = cẳng tay gập về trước. Gối: flex dương = cẳng chân gập ra sau.
   Tay B (phía +x trên màn hình) có đồng hồ. */
const AVC = {
  skin: '#F4C9A0', skinSh: '#E5AC80', skinLn: '#B98259', blush: '#F0A58A',
  hair: '#1d1c21', hairHi: '#4a4a56', ink: '#251a15',
  shirt: '#CFCCCA', shirtSh: '#B9B5B3', shirtLn: '#8A8582', collar: '#DAD7D5',
  jean: '#4D6F9E', jeanSh: '#3E5C87', jeanHi: '#7596C2', jeanLn: '#2C4466',
  shoe: '#C4B9A3', shoeSh: '#A99D86', shoeAcc: '#A8705A', sole: '#EAE4D8', tread: '#5D554D', shoeLn: '#6B6050',
  watch: '#1e1e23', lip: '#B6544B', mouthIn: '#7C2E2E', tongue: '#E3877F', teeth: '#FBF8F2'
};
const AV_BASE = 0.4, LT = 170, LS = 172, FH = 62, LU = 112, LF = 88;
const _avc = (a, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, a));
const _avl = (a, b, k) => a + (b - a) * k;

/* ---------- vẽ hợp nhất nét viền: vẽ viền (dày) trước, rồi lớp màu, nên chỗ chồng nhau không bị đường kẻ ---------- */
const _merge = (inner, fill, line, w = 2.4) =>
  `<g fill="${line}" stroke="${line}" stroke-width="${w * 2}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>` +
  `<g fill="${fill}" stroke="none">${inner}</g>`;

/* ---------- ĐẦU ---------- */
const FACE_D = 'M-40 -78 C-44 -108 -24 -131 6 -132 C38 -132 57 -108 56 -80 C55 -58 51 -36 38 -21 C30 -9 16 -3 4 -4 C-16 -5 -34 -18 -39 -42 C-41 -54 -40 -66 -40 -78 Z';
const HAIR_D = 'M -41 -84 L -44 -66 L -51 -58 C -57 -72 -59 -90 -58 -104 L -67 -112 L -55 -116.2 L -60 -127 L -43 -122.2 L -39 -136.6 L -24 -126.4 L -17 -142.6 L -6 -129.4 L 5 -146.2 L 14 -130.6 L 28 -145 L 32 -128.2 L 48 -140.2 L 50 -123.4 L 67 -129.4 L 58 -115.6 L 63 -103 C 52 -108 44 -105 32 -110 C 16 -113.2 -2 -110 -16 -104 C -28 -99 -36 -94 -41 -84 Z';
const headSkinSVG = () =>
  `<path d="${FACE_D}" fill="${AVC.skin}" stroke="${AVC.skinLn}" stroke-width="2.2" stroke-linejoin="round"/>` +
  `<path d="M26 -20 C38 -26 50 -42 52 -70 C48 -50 40 -34 24 -22 Z" fill="${AVC.skinSh}" opacity=".55"/>` +
  `<ellipse cx="-39" cy="-60" rx="12" ry="17" transform="rotate(-8 -39 -60)" fill="${AVC.skin}" stroke="${AVC.skinLn}" stroke-width="2.2"/>` +
  `<path d="M-42 -68 C-46 -62 -45 -54 -40 -50" fill="none" stroke="${AVC.skinLn}" stroke-width="2" stroke-linecap="round"/>` +
  `<ellipse cx="-36" cy="-58" rx="5" ry="8" fill="${AVC.skinSh}" opacity=".6"/>` +
  `<ellipse cx="42" cy="-52" rx="9" ry="5" fill="${AVC.blush}" opacity=".30"/>` +
  `<path d="M12 -78 C14 -70 18 -64 24 -62 C20 -60 15 -60 11 -62" fill="none" stroke="${AVC.skinLn}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<circle cx="50" cy="-46" r="1.8" fill="${AVC.ink}"/>`;                        // nốt ruồi theo ảnh
const hairSVG = () =>
  `<path d="${HAIR_D}" fill="${AVC.hair}" stroke="${AVC.hair}" stroke-width="4" stroke-linejoin="round"/>` +
  `<path d="M-34 -122 L-28 -134 M-12 -124 L-6 -140 M8 -126 L14 -142 M30 -124 L40 -136 M-50 -100 L-54 -112" stroke="${AVC.hairHi}" stroke-width="2.8" stroke-linecap="round" fill="none" opacity=".9"/><path d="M-52 -82 Q-56 -70 -50 -60" stroke="#33323a" stroke-width="3" fill="none" stroke-linecap="round"/>` +
  ``;                      // mai tóc cạo gần tai
const neckSVG = () =>
  `<path d="M-19 8 L-19 -30 Q0 -22 21 -30 L21 8 Z" fill="${AVC.skin}" stroke="${AVC.skinLn}" stroke-width="2.2" stroke-linejoin="round"/>` +
  `<path d="M-19 -26 Q0 -14 21 -26 L21 -12 Q0 0 -19 -12 Z" fill="${AVC.skinSh}" opacity=".65"/>`;

/* mắt: lid 0 mở .. 1 nhắm; wide 0..1 mở to; (lx,ly) hướng nhìn. uid để clipPath không trùng */
function eyeLid(lid) { const yE = -4 + 6 * lid, yC = -22 + 40 * lid; return { cover: `M-15 -17 L15 -17 L15 ${yE} Q0 ${yC} -15 ${yE} Z`, line: `M-12 ${yE} Q0 ${yC} 12 ${yE}` }; }
function eyeSVG(uid, lid = 0, wide = 0, lx = 0, ly = 0, s = 1, cls = '') {
  const L = eyeLid(lid), sc = s * (1 + .13 * wide), closed = lid > 0.9;
  if (closed) return `<g class="${cls}" transform="scale(${s})"><path d="M-12 -2 Q0 8 12 -2" fill="none" stroke="${AVC.ink}" stroke-width="3.2" stroke-linecap="round"/></g>`;
  return `<g class="${cls}" transform="scale(${sc})"><clipPath id="ec${uid}"><ellipse rx="11" ry="12.5"/></clipPath>` +
    `<ellipse rx="11" ry="12.5" fill="#fff" stroke="${AVC.ink}" stroke-width="1.6"/>` +
    `<g clip-path="url(#ec${uid})"><g transform="translate(${lx * 3.5} ${ly * 4})"><circle r="${7.6 - 1.2 * wide}" fill="#4a2e1f"/><circle r="${4.6 - .8 * wide}" fill="#150d0a"/><circle cx="2.4" cy="-2.8" r="2.1" fill="#fff"/></g>` +
    `<path d="${L.cover}" fill="${AVC.skin}"/></g>` +
    `<path d="${L.line}" fill="none" stroke="${AVC.ink}" stroke-width="3.4" stroke-linecap="round"/></g>`;
}
const EYE_POS = [[1, -82, 1.12], [38, -81, .96]];
/* lông mày: mỗi mày [x1,y1,cx,cy,x2,y2] để nội suy số học giữa các biểu cảm */
const BROW = {
  neutral: [[-9, -106, 5, -115, 19, -108], [26, -105, 38, -112, 49, -103]],
  raised:  [[-9, -112, 5, -123, 19, -115], [26, -112, 38, -119, 49, -108]],
  high:    [[-9, -117, 5, -130, 19, -120], [26, -117, 38, -126, 49, -112]],
  worried: [[-9, -101, 5, -108, 19, -117], [26, -117, 38, -109, 49, -101]],
  frown:   [[-9, -111, 5, -110, 19, -101], [26, -100, 38, -109, 49, -110]],
  think:   [[-9, -112, 5, -122, 19, -113], [26, -101, 38, -107, 49, -104]],
};
const browD = a => `M${a[0]} ${a[1]} Q${a[2]} ${a[3]} ${a[4]} ${a[5]}`;
const browMix = (n1, n2, k) => BROW[n1].map((b, i) => b.map((v, j) => _avl(v, BROW[n2][i][j], k)));
const browSVG = (arr, cls = '') => `<g class="${cls}" fill="none" stroke="${AVC.hair}" stroke-width="6.6" stroke-linecap="round">${arr.map(b => `<path d="${browD(b)}"/>`).join('')}</g>`;

const MOUTH = {
  smile: `<path d="M13 -47 Q28 -35 46 -49" fill="none" stroke="${AVC.ink}" stroke-width="3" stroke-linecap="round"/>`,
  smallsmile: `<path d="M17 -44 Q29 -38 42 -46" fill="none" stroke="${AVC.ink}" stroke-width="3" stroke-linecap="round"/>`,
  open: `<path d="M11 -51 Q28 -46 47 -53 Q46 -27 28 -27 Q12 -29 11 -51 Z" fill="${AVC.mouthIn}" stroke="${AVC.ink}" stroke-width="2.4" stroke-linejoin="round"/>` +
        `<path d="M13 -50 Q29 -46 46 -52 L45 -44 Q29 -41 14 -43 Z" fill="${AVC.teeth}"/><ellipse cx="29" cy="-32" rx="9" ry="4.4" fill="${AVC.tongue}"/>`,
  o: `<ellipse cx="29" cy="-38" rx="8.5" ry="11.5" fill="${AVC.mouthIn}" stroke="${AVC.ink}" stroke-width="2.4"/><ellipse cx="29" cy="-33" rx="5" ry="4.5" fill="${AVC.tongue}"/>`,
  flat: `<path d="M16 -42 Q30 -44 43 -43" fill="none" stroke="${AVC.ink}" stroke-width="3" stroke-linecap="round"/>`,
  sad: `<path d="M15 -37 Q29 -49 44 -39" fill="none" stroke="${AVC.ink}" stroke-width="3" stroke-linecap="round"/>`,
};
const mouthTalk = a => { const h = 4 + 20 * a; return `<path d="M13 -47 Q29 -51 46 -48 Q44 ${-48 + h} 29 ${-47 + h} Q15 ${-47 + h * .85} 13 -47 Z" fill="${AVC.mouthIn}" stroke="${AVC.ink}" stroke-width="2.4" stroke-linejoin="round"/>` + (h > 9 ? `<ellipse cx="29" cy="${-47 + h * .78}" rx="8" ry="${Math.min(4.5, h * .22)}" fill="${AVC.tongue}"/>` : '') + (h > 7 ? `<path d="M15 -47 Q29 -51 44 -48 L43 -44 Q29 -46 16 -43 Z" fill="${AVC.teeth}"/>` : ''); };
const fxSVG = () => `<g stroke="${AVC.ink}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M68 -142 L82 -156 M76 -126 L96 -132 M60 -156 L64 -172"/><path d="M-70 -96 L-84 -90 M-72 -116 L-88 -122"/></g>`;

const EXPR = {
  calm:      { lid: .08, wide: 0,   brow: 'neutral', mouth: 'smile',      tilt: -3, look: [.6, -.7] },
  happy:     { lid: 0,   wide: .15, brow: 'raised',  mouth: 'open',       tilt: -2, look: [.3, -.1] },
  surprised: { lid: 0,   wide: 1,   brow: 'high',    mouth: 'o',          tilt: 0,  look: [.4, -.1] },
  thinking:  { lid: .28, wide: 0,   brow: 'think',   mouth: 'flat',       tilt: 7,  look: [.6, -.8] },
  content:   { lid: 1,   wide: 0,   brow: 'raised',  mouth: 'smile',      tilt: -3, look: [0, 0] },
  worried:   { lid: .08, wide: .2,  brow: 'worried', mouth: 'sad',        tilt: 3,  look: [.2, .4] },
  sure:      { lid: .25, wide: 0,   brow: 'frown',   mouth: 'smile',      tilt: 0,  look: [.5, 0] },
  neutral:   { lid: 0,   wide: 0,   brow: 'neutral', mouth: 'smallsmile', tilt: 0,  look: [.3, 0] },
};

/* ---------- THÂN ÁO POLO (gốc = chân cổ, giữa vai; dài 196) ---------- */
const torsoSVG = () =>
  `<path d="M-24 0 Q-46 4 -64 20 Q-72 40 -64 84 L-62 192 Q2 202 64 194 L64 84 Q72 40 64 20 Q46 4 24 0 Q0 -8 -24 0 Z" fill="${AVC.shirt}" stroke="${AVC.shirtLn}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<path d="M38 40 Q52 80 48 194 L64 194 L64 84 Q70 50 62 26 Z" fill="${AVC.shirtSh}" opacity=".7"/>` +
  `<path d="M-40 110 Q-26 136 -34 190 M-12 150 Q-4 170 -8 196" fill="none" stroke="${AVC.shirtSh}" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M-22 0 Q0 -8 22 0 L2 52 Z" fill="${AVC.skin}" stroke="${AVC.skinLn}" stroke-width="2.2" stroke-linejoin="round"/>` +
  `<path d="M-30 -4 Q-16 -9 -4 -2 L6 30 L2 50 L-34 12 Q-38 2 -30 -4 Z" fill="${AVC.collar}" stroke="${AVC.shirtLn}" stroke-width="2.2" stroke-linejoin="round"/>` +
  `<path d="M32 -4 Q20 -9 8 -2 L0 30 L2 50 L38 12 Q42 2 32 -4 Z" fill="${AVC.collar}" stroke="${AVC.shirtLn}" stroke-width="2.2" stroke-linejoin="round"/>` +
  `<path d="M3 56 L5 120" stroke="${AVC.shirtLn}" stroke-width="2.4" stroke-linecap="round"/><circle cx="5" cy="74" r="3.2" fill="${AVC.shirtSh}" stroke="${AVC.shirtLn}" stroke-width="1.6"/><circle cx="5" cy="100" r="3.2" fill="${AVC.shirtSh}" stroke="${AVC.shirtLn}" stroke-width="1.6"/>`;

/* ---------- TAY ---------- */
const upperArmSVG = () =>
  _merge(`<rect x="-14" y="-8" width="28" height="${LU + 14}" rx="14"/>`, AVC.skin, AVC.skinLn, 2.2) +
  `<path d="M-14 60 Q-16 100 -10 118 L-4 118 Q-8 96 -6 60 Z" fill="${AVC.skinSh}" opacity=".35"/>` +
  `<path d="M-24 -24 Q0 -32 24 -24 Q32 6 29 46 Q0 54 -29 46 Q-32 6 -24 -24 Z" fill="${AVC.shirt}" stroke="${AVC.shirtLn}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<path d="M-29 46 Q0 54 29 46 L28 39 Q0 47 -28 39 Z" fill="${AVC.shirtSh}" opacity=".7"/>`;
const forearmSVG = (watch = false) =>
  _merge(`<path d="M-15 -4 L15 -4 L12 ${LF} L-12 ${LF} Z"/><circle cx="0" cy="-2" r="15"/><circle cx="0" cy="${LF}" r="12"/>`, AVC.skin, AVC.skinLn, 2.2) +
  `<path d="M8 6 Q9 40 6 80 L10 80 Q13 40 12 6 Z" fill="${AVC.skinSh}" opacity=".4"/>` +
  (watch ? `<rect x="-14" y="${LF - 24}" width="28" height="13" rx="3" fill="${AVC.watch}"/><rect x="-9" y="${LF - 22}" width="18" height="9" rx="2" fill="#3b3b45"/><circle cx="0" cy="${LF - 17.5}" r="1.6" fill="#9a9aa8"/>` : '');
const HANDS = {
  relaxed: () => _merge(`<path d="M-11 -4 Q-14 20 -10 36 Q-4 44 3 42 Q11 38 11 24 L10 -4 Z"/><path d="M8 6 Q19 14 16 28 Q11 28 8 18 Z"/>`, AVC.skin, AVC.skinLn, 2) +
    `<path d="M-5 26 L-4 40 M2 24 L3 40" stroke="${AVC.skinLn}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
  fist: () => _merge(`<rect x="-13" y="-2" width="26" height="34" rx="12"/><path d="M8 10 Q22 14 18 28 Q12 28 8 22 Z"/>`, AVC.skin, AVC.skinLn, 2) +
    `<path d="M-9 14 Q0 18 9 14 M-9 24 Q0 28 9 24" stroke="${AVC.skinLn}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
  point: () => _merge(`<rect x="-13" y="-2" width="26" height="30" rx="12"/><rect x="-5" y="22" width="10" height="46" rx="5"/><path d="M8 8 Q20 12 17 24 Q12 24 8 18 Z"/>`, AVC.skin, AVC.skinLn, 2) +
    `<path d="M-9 14 Q0 18 9 14" stroke="${AVC.skinLn}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
  thumb: () => _merge(`<rect x="-13" y="-2" width="26" height="34" rx="12"/><rect x="6" y="-4" width="11" height="34" rx="5.5" transform="rotate(-12 11 -4) translate(4 -28) rotate(90 11 8) translate(0 -2)"/>`, AVC.skin, AVC.skinLn, 2) +
    `<path d="M-9 14 Q0 18 9 14 M-9 24 Q0 28 9 24" stroke="${AVC.skinLn}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
  palm: () => _merge(`<rect x="-14" y="-2" width="28" height="30" rx="10"/><rect x="-13" y="22" width="8" height="30" rx="4" transform="rotate(8 -9 22)"/><rect x="-4" y="22" width="8" height="36" rx="4"/><rect x="5" y="22" width="8" height="32" rx="4" transform="rotate(-8 9 22)"/><rect x="12" y="6" width="9" height="26" rx="4.5" transform="rotate(-48 14 8)"/>`, AVC.skin, AVC.skinLn, 2) +
    `<path d="M-6 14 Q0 18 6 14" stroke="${AVC.skinLn}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  none: () => ''
};

/* ---------- CHÂN ---------- */
const pelvisSVG = () =>
  `<path d="M-60 -16 Q0 -24 60 -16 L64 22 Q40 50 0 48 Q-40 50 -64 22 Z" fill="${AVC.jean}" stroke="${AVC.jeanLn}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<path d="M1 -18 L2 30" stroke="${AVC.jeanLn}" stroke-width="2" fill="none"/><path d="M-50 -10 Q-34 12 -26 24 M50 -10 Q34 12 26 24" stroke="${AVC.jeanSh}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
const thighSVG = () =>
  `<path d="M-27 -2 Q-27 -16 0 -16 Q27 -16 27 -2 Q30 80 25 ${LT} L-25 ${LT} Q-30 80 -27 -2 Z" fill="${AVC.jean}" stroke="${AVC.jeanLn}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<path d="M12 10 Q22 80 18 ${LT - 4} L25 ${LT} Q30 80 27 -2 Z" fill="${AVC.jeanSh}" opacity=".7"/><path d="M-14 30 Q-6 50 -16 66 M-12 110 Q-2 124 -14 140" stroke="${AVC.jeanSh}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
const shinSVG = () =>
  `<path d="M-25 -2 Q-25 -14 0 -14 Q25 -14 25 -2 Q24 80 21 ${LS - 18} L-21 ${LS - 18} Q-24 80 -25 -2 Z" fill="${AVC.jean}" stroke="${AVC.jeanLn}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<path d="M10 4 Q19 80 15 ${LS - 20} L21 ${LS - 18} Q24 80 25 -2 Z" fill="${AVC.jeanSh}" opacity=".7"/>` +
  `<path d="M-22 ${LS - 22} L22 ${LS - 22} L24 ${LS + 2} L-24 ${LS + 2} Z" fill="${AVC.jeanHi}" stroke="${AVC.jeanLn}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-22 ${LS - 14} L23 ${LS - 14}" stroke="${AVC.jeanSh}" stroke-width="2" fill="none"/>`;
const shoeSVG = () =>
  `<path d="M-30 -4 Q-36 24 -34 46 L-34 56 Q-34 62 -28 62 L74 62 Q96 62 96 48 Q96 36 78 30 Q60 26 48 14 Q40 0 20 -4 Z" fill="${AVC.shoe}" stroke="${AVC.shoeLn}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<path d="M-33 50 L96 50 Q98 62 92 64 L-28 64 Q-36 64 -33 50 Z" fill="${AVC.sole}" stroke="${AVC.shoeLn}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-28 60 L90 60" stroke="${AVC.tread}" stroke-width="4" stroke-linecap="round"/>` +
  `<path d="M-6 28 Q14 18 36 28 L34 46 L-8 46 Z" fill="${AVC.shoeAcc}" opacity=".9"/><path d="M-28 -2 Q-4 -8 20 -4" fill="none" stroke="${AVC.tread}" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M26 6 L36 16 M34 2 L44 12 M44 -2 L54 8" stroke="${AVC.shoeLn}" stroke-width="2.4" stroke-linecap="round"/><path d="M60 30 Q76 34 86 42" fill="none" stroke="${AVC.shoeSh}" stroke-width="3"/>`;
const legsCrossSVG = () =>   /* ngồi xếp bằng trên nền: gốc = hông, mặt nền ở y = +40 */
  `<g>${_merge(`<rect x="-132" y="2" width="132" height="44" rx="22" transform="rotate(-6 -66 24)"/><rect x="0" y="2" width="132" height="44" rx="22" transform="rotate(6 66 24)"/>`, AVC.jean, AVC.jeanLn, 2.4)}</g>` +
  `<g transform="translate(-30 22)">${_merge(`<rect x="0" y="0" width="150" height="42" rx="21" transform="rotate(12)"/>`, AVC.jean, AVC.jeanLn, 2.4)}</g>` +
  `<g transform="translate(30 22) scale(-1 1)">${_merge(`<rect x="0" y="0" width="150" height="42" rx="21" transform="rotate(12)"/>`, AVC.jean, AVC.jeanLn, 2.4)}</g>` +
  `<g transform="translate(120 20) scale(.6)">${shoeSVG()}</g><g transform="translate(-120 20) scale(-.6 .6)">${shoeSVG()}</g>`;

/* ---------- RÁP NHÂN VẬT ---------- */
let _avUid = 0;
const _av = {};
function mountAvatar(parent, id) {
  const u = ++_avUid, arm = (k, front) => `<g class="arm${k}${front ? 'F' : ''}"><g class="ua">${upperArmSVG()}</g><g class="fa"><g class="fa-s">${forearmSVG(k === 'B')}</g><g class="hand"></g></g></g>`;
  const leg = k => `<g class="leg${k}"><g class="th">${thighSVG()}</g><g class="sh"><g class="sh-s">${shinSVG()}</g><g class="ft">${shoeSVG()}</g></g></g>`;
  const html = `<g id="${id}"><g class="root"><g class="face"><ellipse class="shadow" rx="150" ry="14" fill="#00000022"/>
    ${leg('A')}${leg('B')}<g class="pelvis">${pelvisSVG()}</g><g class="crossLegs">${legsCrossSVG()}</g>
    <g class="torsoG">${arm('A', 0)}<g class="torsoP"><g class="neck">${neckSVG()}</g>${torsoSVG()}</g>${arm('A', 1)}
      <g class="headG"><g class="headRot"><g class="headSkin">${headSkinSVG()}</g>
        <g class="feat"><g class="eyeA"></g><g class="eyeB"></g><g class="brows"></g><g class="mouth1"></g><g class="mouth2"></g></g>
        ${'' /* tóc phủ lên */}<g class="hair">${hairSVG()}</g><g class="fxg">${fxSVG()}</g></g></g>${arm('B', 0)}</g></g></g></g>`;
  parent.insertAdjacentHTML('beforeend', html);
  const r = parent.querySelector('#' + id), q = s => r.querySelector(s), all = s => [...r.querySelectorAll(s)];
  _av[id] = { r, q, all, u };
  return r;
}

const _R = (n, v = 0, x = 0, y = 0) => `translate(${x} ${y}) rotate(${-v})`;
function _ik(L1, L2, tx, ty, flip = 0) {
  if (!flip) flip = tx >= 0 ? 1 : -1;          /* trả về [s, e] độ (s vai, e khuỷu) để cổ tay chạm (tx,ty) tính từ vai; y dương = xuống */
  const d = Math.max(Math.min(Math.hypot(tx, ty), L1 + L2 - .5), Math.abs(L1 - L2) + .5), ph = Math.atan2(tx, ty);
  const a = Math.acos(_avc((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), s = ph - flip * a;
  const ex = L1 * Math.sin(s), ey = L1 * Math.cos(s), f2 = Math.atan2(tx - ex, ty - ey);
  return [s * 180 / Math.PI, (f2 - s) * 180 / Math.PI];
}
const SHOULDER = { A: [-54, 28], B: [54, 28] };
const ARM_PRESET = {
  rest: { s: 5, e: 8 },
  hip: { ik: [-38, 90] },
  chin: { ik: [-20, 6] },
  cross: { ik: [-46, 100] },
  pocket: { ik: [-40, 198] },
};

function poseAvatar(id, t, P = {}) {
  const { r, q, all } = _av[id], sc = (P.scale || 1) * AV_BASE, face = P.face || 1;
  const sit = _avc(P.sit || 0), run = P.run || 0, air = P.air || 0, ph = P.phase || 0, sq = P.squash || 0, cross = P.seat === 'cross' && sit > .5;
  // ---- biểu cảm (nội suy giữa hai biểu cảm) ----
  const E1 = EXPR[P.ex || 'neutral'], E2 = EXPR[P.ex2 || P.ex || 'neutral'], k = _avc(P.exk || 0);
  const lidBase = _avl(E1.lid, E2.lid, k), wide = _avl(E1.wide, E2.wide, k);
  const blink = ((t * 0.9) % 3.3) < 0.13 ? 1 : 0, lid = _avc(Math.max(lidBase, blink)), brow = browMix(P.ex ? E1.brow : 'neutral', E2.brow, k);
  const lk0 = P.look || [_avl(E1.look[0], E2.look[0], k), _avl(E1.look[1], E2.look[1], k)];
  const tilt = (P.tilt != null ? P.tilt : _avl(E1.tilt, E2.tilt, k));
  // ---- chân ----
  const crouch = Math.max(0, sq) * 3, stretch = Math.min(0, sq);
  const mv = run > 0.02, amp = 22 + 30 * run, flexMax = 14 + 66 * run;
  const legAng = kk => { const th = ph + Math.PI * kk; return { a: ((mv ? amp * Math.sin(th) : 0) * (1 - sit) + 90 * sit + 38 * air + 38 * crouch * (1 - sit)) + (kk ? -3 * sit : 0), f: ((mv ? flexMax * Math.max(0, Math.cos(th)) : 0) * (1 - sit) + 90 * sit + 62 * air + 80 * crouch * (1 - sit)) + (kk ? 6 * sit : 0) }; };
  const LA = legAng(0), LB = legAng(1), rad = Math.PI / 180;
  const low = L => LT * Math.cos(L.a * rad) + LS * Math.cos((L.a - L.f) * rad) + FH;
  const standY = -Math.max(low(LA), low(LB)), seatY = -(cross ? 40 : 46);
  const hipY = _avl(standY, seatY, sit);
  r.querySelector('.root').setAttribute('transform', `translate(${P.x || 0} ${P.y || 0}) scale(${sc * (1 - stretch * .25)} ${sc * (1 + stretch * .5)})`);
  q('.face').setAttribute('transform', `scale(${face} 1)`);
  q('.shadow').setAttribute('opacity', _avc(1 - air * 1.2));
  q('.shadow').setAttribute('transform', `translate(0 ${-hipY * 0 + 0}) scale(${1 - air * .4} 1)`);
  q('.pelvis').setAttribute('transform', `translate(0 ${hipY})`);
  const legOn = !cross;
  for (const [kk, L] of [['A', LA], ['B', LB]]) {
    const g = q('.leg' + kk), hx = kk === 'A' ? -16 : 16;
    g.setAttribute('display', legOn ? '' : 'none');
    g.setAttribute('transform', `translate(${hx} ${hipY}) rotate(${-L.a})`);
    g.querySelector('.sh').setAttribute('transform', `translate(0 ${LT}) rotate(${L.f})`);
    g.querySelector('.ft').setAttribute('transform', `translate(0 ${LS}) rotate(${(L.a - L.f) + (kk === 'B' && mv ? -14 * Math.max(0, -Math.cos(ph + Math.PI)) : 0)})`);
  }
  const cl = q('.crossLegs'); cl.setAttribute('display', cross ? '' : 'none'); cl.setAttribute('transform', `translate(0 ${hipY})`);
  q('.pelvis').setAttribute('display', '');
  // ---- thân, đầu ----
  const lean = (P.lean || 0) + 9 * run + 4 * sit * 0 + 14 * crouch * (1 - sit) - 6 * air, bob = mv ? Math.abs(Math.sin(ph)) * 0 : 0;
  q('.torsoG').setAttribute('transform', `translate(0 ${hipY - 8}) rotate(${-lean}) translate(0 -190)`);
  q('.torsoP').setAttribute('transform', `scale(1 ${1 + Math.sin(t * 2.3) * .008})`);
  q('.headG').setAttribute('transform', `translate(0 -26)`);
  const lkx = lk0[0], lky = lk0[1];
  q('.headRot').setAttribute('transform', `translate(${lkx * 3} 0) rotate(${-(tilt - lean * .35) + lkx * -2} 0 0)`);
  q('.feat').setAttribute('transform', `translate(${lkx * 5} ${lky * 3})`);
  const fx = q('.fxg'); fx.setAttribute('display', P.fx ? '' : 'none');
  q('.eyeA').innerHTML = `<g transform="translate(${EYE_POS[0][0]} ${EYE_POS[0][1]})">${eyeSVG(_av[id].u + 'a', lid, wide, lkx, lky, EYE_POS[0][2])}</g>`;
  q('.eyeB').innerHTML = `<g transform="translate(${EYE_POS[1][0]} ${EYE_POS[1][1]})">${eyeSVG(_av[id].u + 'b', lid, wide, lkx, lky, EYE_POS[1][2])}</g>`;
  q('.brows').innerHTML = browSVG(brow);
  const m1 = E1.mouth, m2 = E2.mouth, tk = _avc(P.talk || 0);
  q('.mouth1').innerHTML = tk > .04 ? mouthTalk(tk) : MOUTH[m1];
  q('.mouth2').innerHTML = tk > .04 || k < .01 ? '' : MOUTH[m2];
  q('.mouth1').setAttribute('opacity', tk > .04 ? 1 : 1 - k); q('.mouth2').setAttribute('opacity', k);
  // ---- tay ----
  const swing = (14 + 34 * run) * (mv ? 1 : 0), sw = Math.sin(ph);
  const resolve = (kk, spec) => {
    let a = typeof spec === 'string' ? ARM_PRESET[spec] || ARM_PRESET.rest : spec || ARM_PRESET.rest, s, e;
    if (a.reach) {                       // điểm thế giới → toạ độ nhân vật → so với vai
      const wx = (a.reach[0] - (P.x || 0)) / sc * face, wy = (a.reach[1] - (P.y || 0)) / sc;
      const cs = Math.cos(lean * rad), sn = Math.sin(lean * rad), ox = SHOULDER[kk][0], oy = SHOULDER[kk][1] + 190;
      const px = wx - 0, py = wy - (hipY - 8);                    // quanh khớp eo (không xoay lean đủ chính xác khi lean lớn)
      const rx = px * cs - (-py) * sn * -1, ry = py;               // gần đúng cho lean nhỏ
      [s, e] = _ik(LU, LF, (px) - ox, (py + 190) - oy + 0 * ry, 0);
    } else if (a.ik) { const ik = (kk === 'A' && a === ARM_PRESET.cross) ? [46, 98] : a.ik; [s, e] = _ik(LU, LF, ik[0] - SHOULDER[kk][0], ik[1] - SHOULDER[kk][1], a.flip || 0); }
    else { s = a.s; e = a.e; }
    return [s, e];
  };
  const armSpec = kk => {
    let sp = kk === 'A' ? P.armA : P.armB;
    if (sp == null) {
      const base = ARM_PRESET.rest; let s = base.s, e = base.e;
      if (mv) { s = (kk === 'A' ? -1 : 1) * swing * sw; e = 10 + 80 * run * (kk === 'A' ? Math.max(0, -sw) : Math.max(0, sw)) + 18 * run; }
      if (sit > .5) { s = 14; e = 12; }
      if (air) { s = _avl(s, 150, air); e = _avl(e, 30, air); }
      sp = { s, e };
    }
    if (kk === 'B') {
      if (P.wave) sp = { s: _avl(5, 158, P.wave), e: _avl(8, 32 + 24 * Math.sin(t * 9), P.wave) };
      if (P.point) sp = { s: _avl(5, 84, P.point), e: _avl(8, 6, P.point) };
    }
    return sp;
  };
  const handName = kk => (kk === 'A' ? P.handA : P.handB) || (kk === 'B' ? (P.wave ? 'palm' : P.point ? 'point' : 'relaxed') : (P.armA === 'pocket' ? 'none' : 'relaxed'));
  const frontA = !!P.frontA || P.armA === 'cross' || P.armA === 'chin';
  for (const sel of ['armA', 'armAF', 'armB']) {
    const kk = sel[3], g = q('.' + sel), [s, e] = resolve(kk, armSpec(kk));
    const on = sel === 'armA' ? !frontA : sel === 'armAF' ? frontA : true;
    g.setAttribute('display', on ? '' : 'none');
    if (!on) continue;
    g.setAttribute('transform', `translate(${SHOULDER[kk][0]} ${SHOULDER[kk][1]}) rotate(${-s})`);
    g.querySelector('.fa').setAttribute('transform', `translate(0 ${LU}) rotate(${-e})`);
    const hand = g.querySelector('.hand'); hand.setAttribute('transform', `translate(0 ${LF}) ${kk === 'A' ? 'scale(-1 1)' : ''}`);
    const hn = handName(kk); if (hand.dataset.h !== hn) { hand.innerHTML = HANDS[hn] ? HANDS[hn]() : ''; hand.dataset.h = hn; }
  }
}

/* xuất danh sách bộ phận dùng cho scripts/export-character.mjs (không đụng DOM) */
const AV_PARTS = () => {
  const o = {};
  o['head-skin'] = [headSkinSVG(), [-70, -140, 140, 150]]; o['hair'] = [hairSVG(), [-75, -175, 150, 130]]; o['neck'] = [neckSVG(), [-30, -40, 60, 56]];
  const eyes = { 'eye-open': [0, 0, 0, 0], 'eye-half': [.5, 0, 0, 0], 'eye-closed': [1, 0, 0, 0], 'eye-wide': [0, 1, 0, 0], 'eye-look-up': [0, 0, .6, -.8] };
  for (const [n, a] of Object.entries(eyes)) o[n] = [eyeSVG('x' + n, a[0], a[1], a[2], a[3]), [-20, -20, 40, 40]];
  for (const n of Object.keys(BROW)) o['brows-' + n] = [browSVG(BROW[n]), [-20, -135, 80, 40]];
  for (const n of Object.keys(MOUTH)) o['mouth-' + n] = [MOUTH[n], [0, -62, 60, 50]];
  o['mouth-talk-small'] = [mouthTalk(.3), [0, -62, 60, 50]]; o['mouth-talk-wide'] = [mouthTalk(.9), [0, -62, 60, 60]];
  o['fx-surprise'] = [fxSVG(), [-110, -190, 220, 120]];
  o['torso-polo'] = [torsoSVG(), [-90, -20, 180, 230]];
  o['upper-arm'] = [upperArmSVG(), [-44, -40, 88, 170]]; o['forearm'] = [forearmSVG(false), [-24, -24, 48, 140]]; o['forearm-watch'] = [forearmSVG(true), [-24, -24, 48, 140]];
  for (const n of Object.keys(HANDS)) if (n !== 'none') o['hand-' + n] = [HANDS[n](), [-30, -14, 60, 90]];
  o['pelvis-jeans'] = [pelvisSVG(), [-80, -40, 160, 110]]; o['thigh'] = [thighSVG(), [-40, -30, 80, 220]]; o['shin-cuff'] = [shinSVG(), [-40, -30, 80, 230]];
  o['shoe'] = [shoeSVG(), [-50, -20, 160, 100]]; o['legs-cross-legged'] = [legsCrossSVG(), [-170, -20, 340, 110]];
  return o;
};
