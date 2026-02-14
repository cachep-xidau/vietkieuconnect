-- ============================================================
-- Seed 3 dental clinics: Teennie, Thế Giới Implant, San Dentist
-- Source: teennie.vn, thegioiimplant.com, sandentist.vn
-- ============================================================

INSERT INTO clinics (
  name, slug, description_en, description_vi,
  address, city, services, pricing,
  phone, email, website, logo_url, photos,
  verified, active, rating, review_count
) VALUES

-- 1. Teennie Clinic
(
  'Nha Khoa Teennie Clinic',
  'teennie-clinic',

  'Teennie Clinic is a leading orthodontic dental clinic in Ho Chi Minh City, specializing in effective braces treatment. Founded in December 2020, Teennie is committed to creating radiant smiles and paving the way for a brighter future. With 100% of dentists graduating from top medical universities and specialized orthodontic training, Teennie delivers standard treatment plans following Ministry of Health guidelines. The clinic applies the classic straight-wire metal bracket orthodontic technique to minimize treatment time, maximize safety, and keep costs affordable — especially for students. Notable doctors include Dr. Luu Ngoc Sang, Dr. Le Huy Tho, and Dr. Doan Thi Minh Tuyen.',

  'Teennie Clinic là nha khoa chuyên sâu niềng răng hiệu quả hàng đầu tại TP.HCM. Thành lập tháng 12/2020, Teennie mang sứ mệnh "Nụ cười rạng rỡ, mở lối tương lai". 100% Bác sĩ tốt nghiệp Đại học Y Dược có tiếng, được đào tạo chuyên sâu niềng răng. Lộ trình điều trị chuẩn y khoa theo Sở Y Tế. Teennie áp dụng phương pháp niềng răng dây thẳng mắc cài kim loại kinh điển — thời gian nhanh, an toàn, chi phí tiết kiệm. Đặc biệt hướng đến các bạn trẻ trong độ tuổi học đường. Bác sĩ tiêu biểu: BS Lưu Ngọc Sáng, BS Lê Huy Thọ, BS Đoàn Thị Minh Tuyền.',

  'TP. Hồ Chí Minh', -- address (exact street not listed on website)
  'Hồ Chí Minh',
  '["Niềng răng mắc cài kim loại", "Niềng răng dây thẳng", "Chỉnh nha chuyên sâu", "Tư vấn niềng răng học đường"]'::jsonb,
  '{"consultation": "Miễn phí", "braces": "Liên hệ"}'::jsonb,
  '0342 28 28 28',
  NULL,
  'https://teennie.vn',
  NULL,
  ARRAY[
    'https://teennie.vn/wp-content/uploads/2024/04/bac-si-teennie-03.webp',
    'https://teennie.vn/wp-content/uploads/2024/04/bac-si-teennie-05.webp'
  ],
  true,
  true,
  4.8,
  0
),

-- 2. Thế Giới Implant
(
  'Nha Khoa Thế Giới Implant',
  'the-gioi-implant',

  'The Gioi Implant is a specialized dental implant clinic focused on safe and effective tooth replacement. The clinic restores chewing function and aesthetics for patients who have lost teeth — from simple single-tooth cases to complex full-arch rehabilitations. Led by Dr. Vo Ta Dung, who has successfully performed over 5,000 implant cases and trained internationally in the USA, India, Thailand, and South Korea. The clinic utilizes DSG guided surgery technology for minimally invasive implant placement — only 5 minutes per implant, with teeth available within 48 hours. Specialized in zygomatic implants and pterygoid implants for the most challenging bone-loss cases.',

  'Nha Khoa Chuyên Sâu Trồng Răng An Toàn – Thế Giới Implant chuyên phục hồi chức năng ăn nhai cho người mất răng. Bác sĩ Võ Tá Dũng — Giám đốc chuyên môn — đã thực hiện thành công hơn 5000+ ca trồng răng, tu nghiệp tại Mỹ, Ấn Độ, Thái Lan, Hàn Quốc. Tốt nghiệp BS Răng Hàm Mặt ĐH Y Dược Huế, CCHN 007936/ĐNA-CCHN. Nha khoa áp dụng công nghệ máng định vị DSG: an toàn, ít xâm lấn, thời gian cắm chỉ 5 phút/trụ, có răng ngay sau 48h. Chuyên trị Implant gò má, Implant chân bướm cho ca khó nhất. 99.6% bệnh nhân hài lòng.',

  'Số 5 Kỳ Đồng, Phường Nhiêu Lộc, TP. Hồ Chí Minh',
  'Hồ Chí Minh',
  '["Trồng răng Implant toàn hàm", "Implant thay thế 1 răng", "Implant thay thế nhiều răng", "Implant phục hình tức thì", "Implant gò má", "Implant chân bướm"]'::jsonb,
  '{"consultation": "Miễn phí", "implant": "Liên hệ báo giá"}'::jsonb,
  '0978 28 28 28',
  NULL,
  'https://thegioiimplant.com',
  NULL,
  ARRAY[]::text[],
  true,
  true,
  4.9,
  0
),

-- 3. San Dentist
(
  'Nha Khoa San Dentist',
  'san-dentist',

  'San Dentist is a premium cosmetic dental clinic specializing in porcelain crowns, veneers, and aesthetic smile makeovers. Founded in 2020 by Vietnamese celebrities Ngo Kien Huy, Huynh Phuong, and Tien Luat. The clinic''s professional director is Dr. Vo Ta Dung (License No. 007936/ĐNA-CCHN), who graduated from Hue University of Medicine and Pharmacy and has trained in the USA, India, Thailand, and South Korea. With over 5,000 successful cases in porcelain restoration, dental implants, and All-on-4/All-on-6 full-arch rehabilitation. San Dentist only accepts cases that meet strict clinical criteria — ensuring safety and lasting aesthetics for every patient.',

  'Nha Khoa Chuyên Sâu Răng Sứ Thẩm Mỹ San Dentist — "An toàn đẹp mãi về sau". Thành lập năm 2020 bởi Ngô Kiến Huy, Huỳnh Phương, Tiến Luật. Giám đốc chuyên môn: BS Võ Tá Dũng (CCHN 007936/ĐNA-CCHN), tốt nghiệp ĐH Y Dược Huế, tu nghiệp tại Mỹ, Ấn Độ, Thái Lan, Hàn Quốc. Hơn 5000+ ca phục hình răng sứ, trồng Implant, All-on-4/All-on-6 thành công. Chỉ thực hiện phủ sứ/dán sứ khi đủ chỉ định lâm sàng. Mỗi ca được thăm khám kỹ lưỡng, chụp phim đánh giá chính xác tình trạng răng.',

  'TP. Hồ Chí Minh',
  'Hồ Chí Minh',
  '["Phủ sứ thẩm mỹ", "Dán sứ Veneer", "Trồng răng Implant", "All-on-4", "All-on-6", "Nhổ răng số 8 Piezotome", "Điều trị cười hở lợi"]'::jsonb,
  '{"consultation": "Miễn phí", "veneer": "Liên hệ báo giá"}'::jsonb,
  NULL,
  NULL,
  'https://sandentist.vn',
  NULL,
  ARRAY[]::text[],
  true,
  true,
  4.7,
  0
);
