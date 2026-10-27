# HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
## KHOA CÔNG NGHỆ THÔNG TIN 1
### oOo

# BÀI TẬP LỚN
## MÔN PHÁT TRIỂN HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ (TMĐT)

---

**TÊN ĐỀ TÀI:**  
### XÂY DỰNG NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ DU LỊCH TRỰC TUYẾN TRAVELHUB

- **LỚP:** D21CQCN01-B  
- **SỐ THỨ TỰ NHÓM:** 01  
- **GIẢNG VIÊN HƯỚNG DẪN:** **TS. Lê Văn Vịnh**  
- **SINH VIÊN THỰC HIỆN:**
  1. **Nguyễn Văn A** - **B21DCCN2000** (**Nhóm trưởng**)
  2. Trần Thị B - B21DCCN2001
  3. Lê Hoàng C - B21DCCN2002

**HÀ NỘI, Tháng 10, Năm 2026**

---

## MỤC LỤC

- [Chương I. MÔ TẢ, KHẢO SÁT VÀ XÁC ĐỊNH YÊU CẦU BÀI TOÁN](#chương-i-mô-tả-khảo-sát-và-xác-định-yêu-cầu-bài-toán)
  - [1.1 Mô tả bài toán](#11-mô-tả-bài-toán)
  - [1.2 Khảo sát, xác định yêu cầu bài toán](#12-khảo-sát-xác-định-yêu-cầu-bài-toán)
    - [1.2.1 Khảo sát các hệ thống tương tự](#121-khảo-sát-các-hệ-thống-tương-tự)
    - [1.2.2 Xác định yêu cầu bài toán](#122-xác-định-yêu-cầu-bài-toán)
  - [1.3 Mục tiêu và phạm vi ứng dụng đề tài](#13-mục-tiêu-và-phạm-vi-ứng-dụng-đề-tài)
- [Chương II. KIẾN THỨC ÁP DỤNG](#chương-ii-kiến-thức-áp-dụng)
  - [2.1 Phân tích & thiết kế hệ thống](#21-phân-tích--thiết-kế-hệ-thống)
    - [2.1.1 Biểu đồ phân cấp chức năng (BFD - Business Function Diagram)](#211-biểu-đồ-phân-cấp-chức-năng-bfd---business-function-diagram)
    - [2.1.2 Biểu đồ luồng dữ liệu (DFD - Data Flow Diagram)](#212-biểu-đồ-luồng-dữ-liệu-dfd---data-flow-diagram)
  - [2.2 Quản trị hệ thống](#22-quản-trị-hệ-thống)
  - [2.3 Cơ sở dữ liệu](#23-cơ-sở-dữ-liệu)
  - [2.4 Ngôn ngữ lập trình & Công nghệ phát triển](#24-ngôn-ngữ-lập-trình--công-nghệ-phát-triển)
- [Chương III. PHÂN TÍCH THIẾT KẾ HỆ THỐNG](#chương-iii-phân-tích-thiết-kế-hệ-thống)
  - [3.1 Phân tích thiết kế CSDL](#31-phân-tích-thiết-kế-csdl)
    - [3.1.1 Sơ đồ quan hệ thực thể (ERD - Entity Relationship Diagram)](#311-sơ-đồ-quan-hệ-thực-thể-erd---entity-relationship-diagram)
    - [3.1.2 Đặc tả từ điển dữ liệu (Data Dictionary)](#312-đặc-tả-từ-điển-dữ-liệu-data-dictionary)
  - [3.2 Phân tích thiết kế chức năng](#32-phân-tích-thiết-kế-chức-năng)
  - [3.3 Các chức năng chưa làm được](#33-các-chức-năng-chưa-làm-được)
- [Chương IV. CÀI ĐẶT VÀ HƯỚNG DẪN SỬ DỤNG](#chương-iv-cài-đặt-và-hướng-dẫn-sử-dụng)
  - [4.1 Cài đặt CSDL](#41-cài-đặt-csdl)
  - [4.2 Cài đặt giả lập môi trường server hosting](#42-cài-đặt-giả-lập-môi-trường-server-hosting)
  - [4.3 Giao diện User](#43-giao-diện-user)
    - [4.3.1 Giao diện trang chủ](#431-giao-diện-trang-chủ)
    - [4.3.2 Giao diện trang sản phẩm (bản tin)](#432-giao-diện-trang-sản-phẩm-bản-tin)
    - [4.3.3 Giao diện trang chi tiết sản phẩm (bản tin)](#433-giao-diện-trang-chi-tiết-sản-phẩm-bản-tin)
    - [4.3.4 Giao diện trang tìm kiếm (Sản phẩm, bản tin)](#434-giao-diện-trang-tìm-kiếm-sản-phẩm-bản-tin)
    - [4.3.5 Giao diện trang đăng ký tài khoản](#435-giao-diện-trang-đăng-ký-tài-khoản)
    - [4.3.6 Giao diện trang đăng nhập](#436-giao-diện-trang-đăng-nhập)
    - [4.3.7 Giao diện trang giỏ hàng](#437-giao-diện-trang-giỏ-hàng)
    - [4.3.8 Giao diện trang xác nhận đặt hàng](#438-giao-diện-trang-xác-nhận-đặt-hàng)
    - [4.3.9 Giao diện trang thanh toán](#439-giao-diện-trang-thanh-toán)
    - [4.3.10 Giao diện trang hình thức thanh toán](#4310-giao-diện-trang-hình-thức-thanh-toán)
    - [4.3.11 Giao diện trang giải đáp thắc mắc](#4311-giao-diện-trang-giải-đáp-thắc-mắc)
    - [4.3.12 Giao diện trang liên hệ](#4312-giao-diện-trang-liên-hệ)
    - [4.3.13 Giao diện trang Chatbot](#4313-giao-diện-trang-chatbot)
    - [4.3.14 Giao diện khu vực liên kết các mạng xã hội](#4314-giao-diện-khu-vực-liên-kết-các-mạng-xã-hội)
    - [4.3.15 Các giao diện trang mở rộng khác](#4315-các-giao-diện-trang-mở-rộng-khác)
  - [4.4 Giao diện Admin](#44-giao-diện-admin)
    - [4.4.1 Giao diện trang đăng nhập phần Admin](#441-giao-diện-trang-đăng-nhập-phần-admin)
    - [4.4.2 Giao diện trang chủ Admin](#442-giao-diện-trang-chủ-admin)
    - [4.4.3 Giao diện trang thêm mới sản phẩm](#443-giao-diện-trang-thêm-mới-sản-phẩm)
    - [4.4.4 Giao diện trang sửa sản phẩm](#444-giao-diện-trang-sửa-sản-phẩm)
    - [4.4.5 Giao diện trang xóa sản phẩm](#445-giao-diện-trang-xóa-sản-phẩm)
    - [4.4.6 Giao diện trang quản lý tài khoản người dùng](#446-giao-diện-trang-quản-lý-tài-khoản-người-dùng)
    - [4.4.7 Giao diện trang thống kê](#447-giao-diện-trang-thống-kê)
    - [4.4.8 Giao diện trang quản lý banner](#448-giao-diện-trang-quản-lý-banner)
    - [4.4.9 Giao diện trang quản lý Menu](#449-giao-diện-trang-quản-lý-menu)
    - [4.4.10 Giao diện trang quản lý Sales](#4410-giao-diện-trang-quản-lý-sales)
- [KẾT LUẬN](#kết-luận)
- [HƯỚNG PHÁT TRIỂN](#hướng-phát-triển)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)
- [PHÂN CÔNG CÔNG VIỆC](#phân-công-công-việc)

---

# Chương I. MÔ TẢ, KHẢO SÁT VÀ XÁC ĐỊNH YÊU CẦU BÀI TOÁN

## 1.1 Mô tả bài toán
Trong bối cảnh nền kinh tế số và thương mại điện tử (TMĐT) phát triển bùng nổ, mô hình cung ứng dịch vụ du lịch truyền thống (đặt tour qua điện thoại, đại lý mặt đất) bộc lộ nhiều điểm nghẽn:
- Khách hàng thiếu thông tin minh bạch về giá, lịch trình chi tiết và đánh giá khách quan.
- Quy trình giữ chỗ và xác nhận đơn hàng thủ công tốn thời gian, dễ xảy ra trùng lịch.
- Phương thức thanh toán tiền mặt bất tiện đối với du khách ở xa hoặc khách nước ngoài.

Hệ thống **TravelHub** được xây dựng dưới dạng sàn TMĐT B2C trong lĩnh vực Dịch vụ Lữ hành Trực tuyến (Online Travel Agency - OTA), cung cấp nền tảng số khép kín:
1. Tiếp thị số và giới thiệu tour du lịch, điểm đến, phòng khách sạn và nhà hàng ẩm thực.
2. Cung cấp bộ lọc thông minh, công cụ tìm kiếm tức thì và so sánh trực quan giữa các tour.
3. Hệ thống Giỏ hàng (Cart) lưu trữ đa dịch vụ, áp dụng mã chiết khấu (Promo Engine).
4. Cổng thanh toán tích hợp đa kênh (VietQR 24/7, MoMo, ZaloPay, VNPAY, Thẻ quốc tế, PayPal).
5. Trợ lý ảo AI Chatbot (Google Gemini) tư vấn lộ trình và giải đáp thắc mắc 24/7.
6. Hệ thống quản trị tập trung (Admin Console) điều hành dữ liệu, duyệt đơn và phân tích tài chính.

## 1.2 Khảo sát, xác định yêu cầu bài toán

### 1.2.1 Khảo sát các hệ thống tương tự

Nhằm đúc kết mô hình tối ưu cho nền tảng TMĐT du lịch **TravelHub**, nhóm đã tiến hành khảo sát, phân tích chuyên sâu 9 website du lịch nổi tiếng hàng đầu tại Việt Nam và trên thế giới:

1. **Booking.com:**  
   - *Thế mạnh:* Chuẩn mực toàn cầu về hệ thống tìm kiếm lưu trú, bộ lọc đa diện (Multi-facets Filter: khoảng giá, xếp hạng sao, tiện ích phòng, chính sách hủy phòng miễn phí), giao diện chi tiết loại phòng và quy trình giữ chỗ minh bạch.  
   - *Hạn chế:* Các gói tour du lịch trải nghiệm và nội dung cẩm nang chia sẻ văn hóa địa phương còn mờ nhạt.
2. **Agoda:**  
   - *Thế mạnh:* Mạng lưới phòng nghỉ và resort cực kỳ phong phú tại khu vực Châu Á - Thái Bình Dương; cơ chế flash sale, ưu đãi độc quyền giá sốc hiển thị kích thích quyết định đặt phòng nhanh chóng.  
   - *Hạn chế:* Giao diện nhiều popup khuyến mãi dễ gây rối mắt người dùng; tính năng cá nhân hóa lịch trình hạn chế.
3. **Traveloka:**  
   - *Thế mạnh:* Siêu ứng dụng du lịch hàng đầu Đông Nam Á; tích hợp đa dịch vụ (vé máy bay, khách sạn, vé vui chơi Xperience); hỗ trợ đa dạng phương thức thanh toán bản địa (VietQR, ATM nội địa, ví điện tử).  
   - *Hạn chế:* Khâu chăm sóc hỗ trợ tùy biến tour theo yêu cầu riêng còn phụ thuộc nhiều vào bên thứ ba.
4. **Klook:**  
   - *Thế mạnh:* Đột phá về trải nghiệm đặt vé tham quan và tour trải nghiệm trong ngày; thiết kế thẻ sản phẩm (Product Card) trực quan với các badge thu hút (*Bán chạy nhất, Klook Choice, Xác nhận tức thì*); cơ chế phân cấp gói dịch vụ (Option Packages: Tiêu chuẩn, VIP, Tiết kiệm) và voucher vé điện tử E-ticket QR tiện lợi.  
   - *Hạn chế:* Không chuyên sâu về mảng tour dài ngày theo đoàn truyền thống.
5. **Tripadvisor:**  
   - *Thế mạnh:* Nền tảng số 1 về đánh giá (Reviews & Ratings) khách quan từ cộng đồng du khách toàn cầu; cơ chế chấm điểm sao, phân bố biểu đồ đánh giá và thư viện ảnh check-in thực tế phong phú.  
   - *Hạn chế:* Đóng vai trò trang đánh giá và tiếp thị liên kết (Affiliate/Metasearch) nhiều hơn là một sàn giao dịch TMĐT xử lý thanh toán trực tiếp.
6. **Vietravel:**  
   - *Thế mạnh:* Doanh nghiệp lữ hành hàng đầu Việt Nam; cấu trúc lịch trình tour chi tiết từng ngày (Day-by-Day Itinerary), thông tin phương tiện, hướng dẫn viên và chính sách bao gồm/không bao gồm dịch vụ vô cùng rõ ràng, đáng tin cậy.  
   - *Hạn chế:* Giao diện web mang phong cách doanh nghiệp truyền thống, tốc độ tải trang và trải nghiệm bộ lọc hiện đại còn hạn chế.
7. **Saigontourist:**  
   - *Thế mạnh:* Thương hiệu uy tín lâu năm; thế mạnh về phân khúc tour cao cấp, du lịch kết hợp hội nghị sự kiện (MICE); quy chuẩn hợp đồng và cam kết dịch vụ bảo hiểm minh bạch.  
   - *Hạn chế:* Quy trình tương tác trực tuyến còn phụ thuộc vào xác nhận thủ công qua điện thoại của tư vấn viên.
8. **Lonely Planet:**  
   - *Thế mạnh:* "Kinh thánh" cẩm nang du lịch quốc tế; nội dung bài viết chỉ dẫn (Travel Guides) sâu sắc về phong tục, ẩm thực bản địa, thời điểm vàng du lịch và mẹo sinh tồn; hình ảnh truyền cảm hứng mạnh mẽ.  
   - *Hạn chế:* Thuần về cung cấp thông tin, không tích hợp hệ sinh thái thanh toán giỏ hàng TMĐT.
9. **Vietnam Travel (vietnam.travel - Cục Du lịch Quốc gia Việt Nam):**  
   - *Thế mạnh:* Cổng thông tin quảng bá quốc gia chuẩn mực; thiết kế giao diện visual tuyệt đẹp, hình ảnh danh thắng 4K đầy cảm hứng; phân loại điểm đến theo vùng miền và bản đồ tương tác du lịch Việt Nam.  
   - *Hạn chế:* Chỉ giới thiệu danh lam thắng cảnh, không có tính năng đặt tour và giữ chỗ thương mại.

#### Bảng ma trận đối sánh (Benchmark Matrix) các nền tảng và TravelHub:

| Tiêu chí nghiệp vụ | Booking.com | Klook | Vietnam Travel | Tripadvisor | Vietravel | **TravelHub (Đề tài đề xuất)** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Phân hệ Lưu trú / Khách sạn** | ⭐⭐⭐ (Rất mạnh) | ⭐ (Hạn chế) | ❌ (Không có) | ⭐⭐ (So sánh) | ⭐ (Kèm tour) | ✅ **Tích hợp đầy đủ** |
| **Phân hệ Tour & Hoạt động** | ⭐ (Hạn chế) | ⭐⭐⭐ (Rất mạnh) | ❌ (Chỉ giới thiệu) | ⭐⭐ (Metasearch) | ⭐⭐⭐ (Tour truyền thống) | ✅ **Tích hợp đa gói dịch vụ** |
| **Khám phá điểm đến & Cẩm nang** | ⭐ | ⭐ | ⭐⭐⭐ (Xuất sắc) | ⭐⭐ | ⭐ | ✅ **Visual 4K & Bản đồ tương tác** |
| **Bộ lọc tìm kiếm đa tiêu chí** | ⭐⭐⭐ (Chuẩn mực) | ⭐⭐ (Cơ bản) | ❌ | ⭐⭐ | ⭐ | ✅ **Chuẩn Booking.com** |
| **Đánh giá & Review kèm ảnh** | ⭐⭐ (Khách đã đặt) | ⭐⭐ | ❌ | ⭐⭐⭐ (Thế mạnh) | ⭐ | ✅ **Review + Community Stories** |
| **Giỏ hàng & Đặt vé E-Ticket** | ⭐⭐ | ⭐⭐⭐ (Xuất sắc) | ❌ | ❌ | ⭐ | ✅ **Giỏ hàng đa dịch vụ + Mã QR** |
| **Trợ lý ảo AI tư vấn 24/7** | ❌ (Bot tĩnh) | ❌ | ❌ | ❌ | ❌ | ✅ **Tích hợp Google Gemini AI** |
| **Cổng thanh toán nội địa tiện lợi** | ⭐ (Chủ yếu thẻ QT) | ⭐⭐ (MoMo/Thẻ) | ❌ | ❌ | ⭐⭐ (Chuyển khoản) | ✅ **VietQR 24/7, MoMo, VNPAY, PayPal** |

#### Chiến lược mô phỏng "Tam giác vàng" ứng dụng vào TravelHub:
Sau khi khảo sát, nhóm quyết định xây dựng **TravelHub** theo định vị **Nền tảng Thương mại Điện tử Du lịch Tổng hợp (All-in-One OTA Platform)**, chắt lọc tinh hoa từ mô hình tam giác vàng:
- **Vietnam Travel & Lonely Planet:** Mô phỏng giao diện khơi gợi cảm hứng, bản đồ du lịch tương tác, video cảnh quan 4K và cẩm nang văn hóa - ẩm thực 63 tỉnh thành.
- **Booking.com & Agoda:** Mô phỏng thanh tìm kiếm trung tâm đa năng (Mega Search Hero Bar) và bộ lọc đa diện (lọc giá, xếp hạng sao, tiện ích, chính sách hủy phòng).
- **Klook:** Mô phỏng thiết kế thẻ sản phẩm (Product Card), cơ chế chia gói dịch vụ (Tiết kiệm, Tiêu chuẩn, VIP) và hệ sinh thái Giỏ hàng (Cart) kết hợp vé điện tử (E-ticket QR).
- **Tripadvisor & Vietravel:** Mô phỏng hệ thống đánh giá sao/ảnh thực tế, mạng xã hội chia sẻ hành trình (Community Stories) và biểu đồ lịch trình theo ngày (Day-by-Day Timeline) trực quan.

### 1.2.2 Xác định yêu cầu bài toán
Hệ thống TravelHub kế thừa và chuẩn hóa các nhóm yêu cầu:
1. **Yêu cầu đối với Khách hàng (End-User):**
   - Tìm kiếm, lọc tour theo địa điểm, mức giá, thời lượng và xếp hạng sao.
   - Thêm vào giỏ hàng, cập nhật số lượng hành khách (người lớn / trẻ em).
   - Thanh toán trực tuyến an toàn, nhận vé điện tử E-ticket và lịch trình PDF.
   - Đánh giá, chấm điểm và đăng bài chia sẻ câu chuyện hành trình (Community Stories).
   - Tương tác với Trợ lý AI và gửi yêu cầu tư vấn trực tuyến.
2. **Yêu cầu đối với Quản trị viên (Admin):**
   - Quản lý toàn bộ danh mục sản phẩm (CRUD Tour, Khách sạn, Nhà hàng, Điểm đến).
   - Quản trị người dùng, phân quyền (Role: User, Staff, Admin).
   - Quản trị đơn hàng (Booking Lifecycle: Pending -> Confirmed -> Paid -> Completed/Cancelled).
   - Quản lý mã giảm giá, banner marketing, menu điều hướng và cấu hình hệ thống.
   - Báo cáo phân tích doanh thu, tăng trưởng đơn hàng và tỷ lệ chuyển đổi.

## 1.3 Mục tiêu và phạm vi ứng dụng đề tài
- **Mục tiêu:** Xây dựng hoàn chỉnh một ứng dụng TMĐT du lịch hoạt động ổn định, bảo mật, giao diện chuẩn UI/UX hiện đại, phục vụ thực hành môn Phát triển Hệ thống TMĐT tại Học viện.
- **Phạm vi:** Tập trung vào mảng du lịch nội địa và quốc tế nổi bật của Việt Nam; giả lập môi trường thanh toán và tích hợp dịch vụ AI thực tế.

---

# Chương II. KIẾN THỨC ÁP DỤNG

## 2.1. Phân tích & thiết kế hệ thống

### 2.1.1 Biểu đồ phân cấp chức năng (BFD - Business Function Diagram)

```mermaid
graph TD
    Root["HỆ THỐNG TMĐT TRAVELHUB"]
    
    F1["1. Quản lý Người dùng & Tài khoản"]
    F2["2. Quản lý Sản phẩm & Dịch vụ"]
    F3["3. Quản lý Đặt chỗ & Giỏ hàng"]
    F4["4. Quản lý Thanh toán"]
    F5["5. Marketing & Chăm sóc khách hàng"]
    F6["6. Báo cáo & Thống kê"]

    Root --> F1
    Root --> F2
    Root --> F3
    Root --> F4
    Root --> F5
    Root --> F6

    F1 --> F11["1.1 Đăng ký / Đăng nhập (JWT)"]
    F1 --> F12["1.2 Quản lý hồ sơ cá nhân"]
    F1 --> F13["1.3 Đổi mật khẩu & Bảo mật 2FA"]
    F1 --> F14["1.4 Phân quyền người dùng (Admin/Staff/User)"]

    F2 --> F21["2.1 Quản lý Tour du lịch (CRUD)"]
    F2 --> F22["2.2 Quản lý Điểm đến (Destinations)"]
    F2 --> F23["2.3 Quản lý Khách sạn & Nhà hàng"]
    F2 --> F24["2.4 Quản lý Bản tin / Tin tức du lịch"]

    F3 --> F31["3.1 Tìm kiếm & Lọc sản phẩm"]
    F3 --> F32["3.2 Quản lý giỏ hàng (Cart)"]
    F3 --> F33["3.3 Xác nhận đặt tour (Booking)"]
    F3 --> F34["3.4 Quản lý lịch sử đơn hàng"]

    F4 --> F41["4.1 Thanh toán VietQR Napas 24/7"]
    F4 --> F42["4.2 Thanh toán Ví MoMo / ZaloPay"]
    F4 --> F43["4.3 Thanh toán VNPAY / Thẻ tín dụng"]
    F4 --> F44["4.4 Thanh toán Quốc tế PayPal"]

    F5 --> F51["5.1 Quản lý Mã giảm giá (Promo Codes)"]
    F5 --> F52["5.2 Quản lý Banner khuyến mãi"]
    F5 --> F53["5.3 Quản lý Menu điều hướng"]
    F5 --> F54["5.4 Trợ lý ảo AI Chatbot & CSKH"]
    F5 --> F55["5.5 Đánh giá & Bình luận (Reviews)"]

    F6 --> F61["6.1 Thống kê doanh thu theo thời gian"]
    F6 --> F62["6.2 Thống kê lượng booking theo tour"]
    F6 --> F63["6.3 Phân tích khách hàng & Tăng trưởng"]
```

### 2.1.2 Biểu đồ luồng dữ liệu (DFD - Data Flow Diagram)

#### a) DFD Mức ngữ cảnh (Context Diagram - Level 0 Context)

```mermaid
graph LR
    User(("Khách hàng (User)"))
    System["HỆ THỐNG TMĐT DU LỊCH TRAVELHUB"]
    Admin(("Quản trị viên (Admin)"))
    PaymentGate(("Cổng Thanh Toán (VietQR/MoMo/PayPal)"))
    AIService(("Dịch vụ AI (Gemini)"))

    User -- "1. Yêu cầu tìm kiếm, Giỏ hàng, Đặt tour" --> System
    User -- "2. Thông tin thanh toán, Đánh giá, Chat" --> System
    System -- "3. Kết quả tìm kiếm, Vé điện tử, Lịch trình PDF" --> User

    Admin -- "4. Cập nhật Tour, Điểm đến, Khuyến mãi, Menu" --> System
    System -- "5. Báo cáo doanh thu, Danh sách đơn đặt tour" --> Admin

    System -- "6. Khởi tạo giao dịch thanh toán" --> PaymentGate
    PaymentGate -- "7. Webhook kết quả thanh toán thành công" --> System

    System -- "8. Câu hỏi tư vấn của du khách" --> AIService
    AIService -- "9. Phản hồi thông minh của Trợ lý AI" --> System
```

#### b) DFD Mức 0 (Level 0 Diagram)

```mermaid
graph TD
    User(("Khách hàng"))
    Admin(("Admin"))

    P1["1.0 Xác thực & Quản lý Tài khoản"]
    P2["2.0 Quản lý Danh mục & Sản phẩm"]
    P3["3.0 Xử lý Giỏ hàng & Đặt tour"]
    P4["4.0 Xử lý Thanh toán & Hóa đơn"]
    P5["5.0 CSKH, Chatbot & Đánh giá"]
    P6["6.0 Báo cáo & Thống kê Quản trị"]

    D1[("D1: Bảng Users")]
    D2[("D2: Bảng Tours / Destinations")]
    D3[("D3: Bảng Bookings / Orders")]
    D4[("D4: Bảng Payments")]
    D5[("D5: Bảng Reviews / Chat")]

    User --> P1
    P1 <--> D1
    Admin --> P1

    Admin --> P2
    P2 <--> D2
    User --> P2

    User --> P3
    P3 <--> D2
    P3 <--> D3

    User --> P4
    P4 <--> D3
    P4 <--> D4

    User --> P5
    P5 <--> D5
    Admin --> P5

    Admin --> P6
    D3 --> P6
    D4 --> P6
```

## 2.2 Quản trị hệ thống
- **Kiến trúc bảo mật:** Mô hình phân quyền đa tầng RBAC (Role-Based Access Control) với 3 vai trò: `USER`, `STAFF`, `ADMIN`.
- **Cơ chế xác thực:** JSON Web Token (JWT) lưu trữ an toàn; hỗ trợ cơ chế xác thực hai lớp (2FA Authenticator).
- **Phân tách môi trường:** Tách biệt rõ ràng giữa Front-Store (công khai cho du khách) và Back-Office (bảo vệ bằng route guard `AdminRoute`).

## 2.3 Cơ sở dữ liệu
- **Hệ quản trị CSDL:** MySQL 8.0 chuẩn quan hệ RDBMS.
- **ORM:** Prisma ORM đảm bảo Type-Safe tuyệt đối giữa TypeScript và cơ sở dữ liệu.
- **Khóa chính/Khóa ngoại:** Ràng buộc toàn vẹn dữ liệu (Foreign Key Constraints, Cascade on Delete khi cần).

## 2.4 Ngôn ngữ lập trình & Công nghệ phát triển
- **Frontend:** React 18, TypeScript, Tailwind CSS, React Query (TanStack Query), React Router v6, Heroicons.
- **Backend:** Node.js, Express.js RESTful API, Prisma Client, JWT, Multer (xử lý upload ảnh).
- **Tích hợp:** Google Gemini AI API, PayPal SDK, VietQR Napas generator, i18next (Đa ngôn ngữ 10 thứ tiếng).

---

# Chương III. PHÂN TÍCH THIẾT KẾ HỆ THỐNG

## 3.1 Phân tích thiết kế CSDL

### 3.1.1 Sơ đồ quan hệ thực thể (ERD - Entity Relationship Diagram)

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ CHAT_SESSION : owns
    USER ||--o{ STORY : creates

    DESTINATION ||--o{ TOUR : contains
    TOUR ||--o{ TOUR_IMAGE : has
    TOUR ||--o{ BOOKING : booked_in
    TOUR ||--o{ REVIEW : reviewed_in

    BOOKING ||--|| PAYMENT : generates
    PROMO_CODE ||--o{ BOOKING : applied_to
    CHAT_SESSION ||--o{ CHAT_MESSAGE : contains

    USER {
        int id PK
        string email
        string password
        string name
        string role
        string phone
        datetime createdAt
    }

    TOUR {
        int id PK
        string title
        string slug
        float price
        int duration
        int destinationId FK
        string departure
        boolean active
    }

    DESTINATION {
        int id PK
        string name
        string slug
        string region
        string image
    }

    BOOKING {
        int id PK
        string code
        int userId FK
        int tourId FK
        int adults
        int children
        float totalPrice
        string status
        datetime travelDate
    }

    PAYMENT {
        int id PK
        int bookingId FK
        string method
        float amount
        string status
        string transactionId
    }

    PROMO_CODE {
        int id PK
        string code
        string discountType
        float discountValue
        float minAmount
        int usageLimit
        int usedCount
        datetime validUntil
    }
```

### 3.1.2 Đặc tả từ điển dữ liệu (Data Dictionary)

1. **Bảng `User`:**
   - `id` (INT, PK, Auto Increment): Mã định danh duy nhất.
   - `email` (VARCHAR(191), UNIQUE): Email tài khoản người dùng.
   - `password` (VARCHAR(255)): Mật khẩu đã được băm qua Bcrypt.
   - `name` (VARCHAR(191)): Họ tên người dùng.
   - `role` (ENUM: 'USER', 'ADMIN', 'STAFF'): Vai trò trong hệ thống.
2. **Bảng `Tour`:**
   - `id` (INT, PK): Mã tour.
   - `title` (VARCHAR(255)): Tiêu đề tour du lịch.
   - `slug` (VARCHAR(255), UNIQUE): Đường dẫn SEO thân thiện.
   - `price` (DECIMAL(12,2)): Giá niêm yết người lớn.
   - `destinationId` (INT, FK -> Destination.id): Điểm đến trực thuộc.
   - `duration` (INT): Số ngày hành trình.
3. **Bảng `Booking`:**
   - `id` (INT, PK): Mã đơn đặt.
   - `code` (VARCHAR(50), UNIQUE): Mã tham chiếu đặt chỗ (VD: `BK-17282839`).
   - `userId` (INT, FK -> User.id): Người đặt.
   - `tourId` (INT, FK -> Tour.id): Tour được đặt.
   - `totalPrice` (DECIMAL(12,2)): Tổng số tiền sau giảm giá.
   - `status` (ENUM: 'PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'): Trạng thái đơn.
4. **Bảng `PromoCode`:**
   - `code` (VARCHAR(50), UNIQUE): Ký tự mã giảm giá.
   - `discountType` (ENUM: 'PERCENTAGE', 'FIXED'): Giảm theo % hoặc tiền mặt.
   - `discountValue` (FLOAT): Giá trị chiết khấu.
   - `validUntil` (DATETIME): Thời hạn sử dụng.

## 3.2 Phân tích thiết kế chức năng
- **Ca sử dụng Tìm kiếm & Đặt tour (Booking Use-case):**
  - Actor: Khách hàng.
  - Tiền điều kiện: Khách chọn tour hoặc thêm vào giỏ hàng.
  - Hậu điều kiện: Đơn booking ở trạng thái `PENDING`, tạo hóa đơn thanh toán tương ứng.
- **Ca sử dụng Thanh toán trực tuyến (Payment Use-case):**
  - Khách quét mã VietQR Napas hoặc thanh toán qua PayPal/MoMo.
  - Webhook callback cập nhật trạng thái `PAID`, kích hoạt gửi Email xác nhận vé E-ticket.

## 3.3 Các chức năng chưa làm được
Nhóm đánh giá khách quan các giới hạn cần mở rộng trong tương lai:
1. **Cổng thanh toán thực tế:** Cổng VNPAY và Thẻ Visa hiện tại chạy ở môi trường Sandbox/Giả lập do yêu cầu giấy phép kinh doanh doanh nghiệp lữ hành thực tế từ ngân hàng.
2. **Thông báo đẩy ứng dụng (Push Notifications):** Chưa triển khai Web Push qua FCM (Firebase Cloud Messaging) cho trình duyệt di động mà mới hỗ trợ qua Email và Notification Center trên trang cá nhân.
3. **Đa tiền tệ tự động:** Hệ thống hiện tại lưu trữ giá gốc bằng VNĐ và quy đổi tỷ giá cố định sang USD cho PayPal, chưa đồng bộ tỷ giá thả nổi theo thời gian thực từ Vietcombank API.

---

# Chương IV. CÀI ĐẶT VÀ HƯỚNG DẪN SỬ DỤNG

## 4.1 Cài đặt CSDL
- Khởi chạy MySQL Server tại cổng mặc định `3306`.
- Cấu hình file `backend/.env`:
  ```env
  DATABASE_URL="mysql://root:password@localhost:3306/travelhub"
  JWT_SECRET="super-secret-key-ptit-tmdt"
  PORT=3000
  ```
- Chạy lệnh migration và seed dữ liệu mẫu:
  ```bash
  cd backend
  npm install
  npx prisma db push
  node scripts/seed-reviews.js
  ```

## 4.2 Cài đặt giả lập môi trường server hosting
- **Khởi chạy Backend (Port 3000):**
  ```bash
  cd backend && npm start
  ```
- **Khởi chạy Frontend React (Port 3001):**
  ```bash
  cd frontend && npm start
  ```
- Truy cập trình duyệt tại: `http://localhost:3001`.

---

## 4.3 Giao diện User

Dựa trên chiến lược mô phỏng "Tam giác vàng" đã đề ra tại mục 1.2.1, từng phân hệ giao diện người dùng của **TravelHub** được thiết kế và hiện thực hóa công phu nhằm kế thừa tinh hoa từ các sàn TMĐT du lịch hàng đầu thế giới và Việt Nam:

### 4.3.1 Giao diện trang chủ (Home Page)
- **Đường dẫn:** `/`
- **Nền tảng mô phỏng đối chiếu:** **Booking.com, Agoda, Vietnam.travel, Klook**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Thanh tìm kiếm trung tâm đa năng (Mega Search Hero Bar - Chuẩn Booking.com):* Tích hợp 3 tab chuyển đổi linh hoạt (*Tour trọn gói*, *Khách sạn & Resort*, *Khám phá điểm đến*). Hỗ trợ chọn điểm khởi hành, ngày đi và bộ đếm hành khách (người lớn/trẻ em) kèm phím tắt gọi nhanh Trợ lý AI Travel Planner.
  2. *Khu vực Flash Sale đếm ngược (Flash Sale Banner - Chuẩn Agoda):* Đồng hồ đếm ngược thời gian thực (Countdown Timer), hiển thị các tour giờ chót giảm giá sốc với thanh tiến độ số lượng chỗ còn lại (*Chỉ còn 3 suất cuối*), kích thích quyết định đặt chỗ nhanh chóng của du khách.
  3. *Bản đồ du lịch tương tác 63 tỉnh thành (Interactive Travel Map - Chuẩn Vietnam.travel):* Bản đồ số SVG hiển thị trực quan các danh thắng tiêu biểu ba miền Bắc - Trung - Nam, cho phép nhấp chọn từng vùng địa lý để lọc tour và xem video cảnh quan 4K truyền cảm hứng.
  4. *Khung cam kết 4 chuẩn mực uy tín:* Mô phỏng tiêu chuẩn dịch vụ của Booking.com (*Xác nhận tức thì trong 60 giây*, *Hỗ trợ chăm sóc khách hàng 24/7*, *Minh bạch giá 0đ phụ phí ẩn*, *Bảo hiểm du lịch toàn diện*).
  5. *Ngăn kéo so sánh nổi (Floating Compare Drawer):* Cho phép ghim tối đa 3 tour từ trang chủ để đối chiếu giá và lịch trình tức thì.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/Home.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/Home.tsx), [`frontend/src/components/MegaSearchBar.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/MegaSearchBar.tsx), [`frontend/src/components/FlashSaleBanner.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/FlashSaleBanner.tsx), [`frontend/src/components/InteractiveTravelMap.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/InteractiveTravelMap.tsx).

---

### 4.3.2 Giao diện trang sản phẩm & bản tin (Product Catalog & Listing)
- **Đường dẫn:** `/tours`, `/destinations`, `/hotels`, `/restaurants`, `/blog`
- **Nền tảng mô phỏng đối chiếu:** **Booking.com (Multi-facets Filter) & Klook (Product Card Badge)**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Bộ lọc tìm kiếm đa diện (Multi-facets Sidebar Filter):* Cho phép lọc kết hợp nhiều điều kiện cùng lúc:
     - Lọc theo mức ngân sách: Dưới 2 triệu, 2 - 5 triệu, Trên 5 triệu đồng.
     - Lọc theo thời lượng tour: 1 - 2 ngày (cuối tuần), 3 - 4 ngày, Từ 5 ngày trở lên.
     - Lọc theo điểm đến: Hạ Long, Sa Pa, Đà Nẵng, Hội An, Phú Quốc, Ninh Bình, v.v.
     - Sắp xếp linh hoạt: Giá tăng dần, Giá giảm dần, Đánh giá cao nhất, Tour bán chạy.
  2. *Thẻ sản phẩm chuẩn Klook (Product Card Component):*
     - Hình ảnh độ phân giải cao tỉ lệ 16:9 với hiệu ứng zoom nhẹ khi rê chuột.
     - Hệ thống huy hiệu nhận diện: *Bán chạy nhất*, *Klook Choice 2026*, *Xác nhận tức thì*, *Tour 5 Sao*.
     - Hiển thị sao đánh giá, thời lượng, phương tiện di chuyển và giá gạch chân chiết khấu.
     - Nút "Thêm nhanh vào Giỏ hàng" và nút "So sánh" (Compare) tích hợp trực tiếp trên thẻ.
  3. *Phân trang động mượt mà (Dynamic Pagination):* Hiển thị số lượng tour phù hợp, hỗ trợ chuyển trang tức thì không tải lại trang.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/Tours.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/Tours.tsx), [`frontend/src/components/TourCard.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/TourCard.tsx), [`frontend/src/components/FloatingCompareDrawer.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/FloatingCompareDrawer.tsx).

---

### 4.3.3 Giao diện trang chi tiết sản phẩm & bản tin (Product Detail Page)
- **Đường dẫn:** `/tours/:slug`, `/hotels/:slug`, `/restaurants/:slug`, `/stories/:slug`
- **Nền tảng mô phỏng đối chiếu:** **Klook (Option Packages & Bento Gallery) + Vietravel (Lịch trình Day-by-Day) + Tripadvisor (Hệ thống Review kèm ảnh thực tế)**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Bộ sưu tập ảnh Bento Grid chuẩn Klook & Lightbox 4K:* 1 ảnh đại diện toàn cảnh cỡ lớn bên trái kết hợp lưới 4 ảnh chụp thực tế bên phải. Nút "Xem tất cả ảnh" mở modal Lightbox duyệt ảnh toàn màn hình với chú thích điểm đến rõ ràng.
  2. *Phân cấp gói dịch vụ (Option Packages - Chuẩn Klook):*
     - **Gói Tiêu Chuẩn (Standard Comfort):** Xe du lịch máy lạnh, khách sạn 3-4 sao, ẩm thực đặc sản.
     - **Gói VIP Luxury (Klook Choice):** Xe Limousine Dcar đưa đón tận nơi, khách sạn 5 sao, lối đi ưu tiên Fast-Track, tặng vé thuyền SUP/Kayak, bảo hiểm 120.000.000đ/vụ.
     - **Gói Tiết Kiệm (Smart Saver):** Tối ưu chi phí dành cho giới trẻ và nhóm tự do khám phá.
  3. *Thanh điều hướng phân mục dính cố định (Sticky Sub-nav Tabs):* Cho phép nhảy nhanh đến các phân đoạn: *Gói dịch vụ & Giá* -> *Tổng quan tour* -> *Điểm nổi bật* -> *Lịch trình chi tiết* -> *Đánh giá thực tế*.
  4. *Lịch trình chi tiết từng ngày (Day-by-Day Timeline - Chuẩn Vietravel):* Cấu trúc trực quan từng mốc thời gian (sáng, trưa, chiều, tối), gắn kèm hình ảnh thắng cảnh và đặc sản ẩm thực thực tế tại địa phương đó.
  5. *Bảng chính sách Bao gồm & Không bao gồm:* Liệt kê minh bạch chi tiết vé máy bay, xe cộ, ăn uống, bảo hiểm và tip hướng dẫn viên, triệt tiêu hoàn toàn nỗi lo phụ phí ẩn.
  6. *Hệ thống đánh giá chuẩn Tripadvisor (ReviewSection):* Điểm số tổng hợp (VD: 4.9/5.0), thanh tiến độ phân bổ số sao từ 1 đến 5 sao, bộ lọc xem review kèm ảnh chụp thực tế, hỗ trợ du khách bình luận và đánh giá có xác thực booking.
  7. *Thanh đặt tour cố định (Sticky Mobile Booking Bar):* Trên thiết bị di động, thanh đặt tour bám chặt cạnh dưới màn hình hiển thị giá cuối cùng và nút "Đặt ngay" giúp tăng tỷ lệ chuyển đổi đặt chỗ.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/TourDetail.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/TourDetail.tsx), [`frontend/src/components/ReviewSection.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/ReviewSection.tsx), [`frontend/src/components/StickyMobileBookingBar.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/StickyMobileBookingBar.tsx).

---

### 4.3.4 Giao diện trang tìm kiếm & Lập kế hoạch du lịch (Search & AI Planner)
- **Đường dẫn:** `/tours?search=...`, `/planner`
- **Nền tảng mô phỏng đối chiếu:** **Booking.com Instant Search + TravelHub AI Trip Planner**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Tìm kiếm toàn văn thời gian thực (Full-text Live Search):* Tự động hoàn thành (Autocomplete), phân loại gợi ý thành 3 nhóm: Điểm đến phổ biến, Tour du lịch đang mở bán và Cẩm nang bài viết kinh nghiệm.
  2. *Trợ lý AI lập kế hoạch hành trình (Travel Planner):* Tích hợp Google Gemini AI. Du khách chỉ cần chọn điểm đến, số ngày dự kiến (1-7 ngày), mức ngân sách và phong cách du lịch (Nghỉ dưỡng gia đình, Phiêu lưu khám phá, Văn hóa ẩm thực). Hệ thống tự động biên soạn lịch trình tối ưu từng giờ kèm ước tính kinh phí chi tiết.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/TravelPlanner.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/TravelPlanner.tsx), [`frontend/src/components/MegaSearchBar.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/MegaSearchBar.tsx).

---

### 4.3.5 Giao diện trang đăng ký tài khoản (Sign Up)
- **Đường dẫn:** `/signup`
- **Nền tảng mô phỏng đối chiếu:** **Booking.com & Agoda Seamless Onboarding**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Form nhập liệu tinh giản: Họ và tên, Email, Mật khẩu, Số điện thoại.
  - Xác thực dữ liệu tức thì (Real-time Validation): Kiểm tra định dạng email hợp lệ, đo độ mạnh mật khẩu (Password Strength Meter với các mức Yếu - Trung bình - Mạnh).
  - Tích hợp điều khoản bảo mật chuẩn TMĐT và cam kết bảo vệ dữ liệu cá nhân du khách.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/auth/SignUp.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/auth/SignUp.tsx).

---

### 4.3.6 Giao diện trang đăng nhập (Sign In)
- **Đường dẫn:** `/signin`
- **Nền tảng mô phỏng đối chiếu:** **Chuẩn SSO Single Sign-On của các sàn OTA quốc tế**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Đăng nhập an toàn bằng Email và Mật khẩu băm Bcrypt, cấp phát JSON Web Token (JWT).
  - Tùy chọn "Ghi nhớ đăng nhập" (Remember Me) lưu trữ phiên an toàn qua `localStorage`.
  - Cơ chế tự động nhận diện và phân luồng quyền hạn: Nếu tài khoản mang vai trò `ADMIN`, hệ thống tự động điều hướng vào Trang quản trị `/admin/dashboard`; nếu là `USER`, hệ thống giữ nguyên luồng đặt tour hoặc điều hướng về trang cá nhân.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/auth/SignIn.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/auth/SignIn.tsx).

---

### 4.3.7 Giao diện trang giỏ hàng (Shopping Cart & Slide Drawer)
- **Đường dẫn:** `/cart` (kèm ngăn kéo nổi `CartSlideDrawer.tsx`)
- **Nền tảng mô phỏng đối chiếu:** **Klook Cart & Shopee Promo Code Engine**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Ngăn kéo giỏ hàng trượt nhanh (Cart Slide Drawer):* Xuất hiện mượt mà từ cạnh phải màn hình khi người dùng bấm icon giỏ hàng trên thanh Header hoặc bấm nút "Thêm vào giỏ" tại trang chi tiết tour. Cho phép xem nhanh các dịch vụ đã chọn, số lượng khách, tổng số tiền tạm tính mà không làm gián đoạn trải nghiệm duyệt web.
  2. *Trang giỏ hàng toàn diện (`/cart`):* Quản lý đa dịch vụ (Tour trọn gói, Phòng khách sạn, Bàn nhà hàng), điều chỉnh tăng giảm số lượng hành khách người lớn/trẻ em với cơ chế tính lại giá tức thì.
  3. *Áp dụng mã giảm giá (Promo Voucher):* Ô nhập mã khuyến mãi kết nối cơ sở dữ liệu `PromoCode`, kiểm tra hạn dùng, giá trị tối thiểu và trừ trực tiếp vào tổng tiền đơn hàng.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/Cart.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/Cart.tsx), [`frontend/src/components/CartSlideDrawer.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/CartSlideDrawer.tsx), [`frontend/src/contexts/CartContext.tsx`](file:///d:/TOOl/TravelHub/frontend/src/contexts/CartContext.tsx).

---

### 4.3.8 Giao diện trang xác nhận đặt hàng & Quản lý đơn (Orders & E-Ticket)
- **Đường dẫn:** `/orders`, `/account/bookings`
- **Nền tảng mô phỏng đối chiếu:** **Vietravel Booking Lifecycle & Klook E-Ticket QR Code**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Quản lý trạng thái đơn hàng trực quan:* Phân loại tab theo trạng thái đơn: *Tất cả*, *Đang chờ duyệt (Pending)*, *Đã xác nhận (Confirmed)*, *Đã thanh toán (Paid)*, *Hoàn thành (Completed)*, *Đã hủy (Cancelled)*.
  2. *Vé điện tử thông minh (E-Ticket QR Code):* Tự động sinh mã QR Code động chứa mã tham chiếu đặt chỗ `BK-XXXX`. Du khách chỉ cần xuất trình mã QR trên điện thoại tại quầy lễ tân hoặc bến du thuyền để check-in tức thì không cần in giấy.
  3. *Tải lịch trình & In hóa đơn:* Tích hợp nút in phiếu xác nhận đặt tour và tải file PDF lịch trình chi tiết về máy.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/Orders.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/Orders.tsx).

---

### 4.3.9 Giao diện trang thanh toán (Checkout)
- **Đường dẫn:** `/checkout`
- **Nền tảng mô phỏng đối chiếu:** **Traveloka Multi-channel Checkout & VietQR Napas 24/7**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  1. *Quy trình thanh toán 3 bước liền mạch (Step-by-Step Checkout):*
     - Bước 1: Thông tin liên hệ & Danh sách hành khách (Họ tên, SĐT, Email, Yêu cầu đặc biệt).
     - Bước 2: Chọn phương thức thanh toán phù hợp.
     - Bước 3: Xác nhận giao dịch và nhận vé điện tử E-ticket.
  2. *Tích hợp cổng thanh toán VietQR Napas 24/7 tự động:* Tự động sinh mã VietQR chuẩn ngân hàng với số tiền và nội dung chuyển khoản độc nhất (`TRAVELGO-XXXX`). Hệ thống đối soát tự động kích hoạt trạng thái đơn hàng thành `PAID` sau khi nhận chuyển khoản.
  3. *Hỗ trợ thanh toán quốc tế và ví điện tử:* Tích hợp cổng PayPal, thẻ quốc tế Visa/MasterCard bảo mật 3D Secure, ví điện tử MoMo, ZaloPay và cổng VNPAY.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/checkout/Checkout.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/checkout/Checkout.tsx).

---

### 4.3.10 Giao diện trang hình thức thanh toán (Payment Methods Info)
- **Đường dẫn:** `/payment-methods`
- **Nền tảng mô phỏng đối chiếu:** **Booking.com & VNPAY Payment Security Hub**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Giới thiệu chi tiết 5 kênh thanh toán được hệ thống hỗ trợ: VietQR 24/7, MoMo & ZaloPay, VNPAY Thẻ nội địa, Thẻ quốc tế Visa/Mastercard, PayPal.
  - Hướng dẫn từng bước thao tác quét mã và xác thực OTP an toàn.
  - Cam kết bảo mật tiêu chuẩn mã hóa quốc tế SSL/TLS 256-bit và tuân thủ chuẩn an ninh dữ liệu thẻ thanh toán PCI-DSS.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/PaymentMethods.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/PaymentMethods.tsx).

---

### 4.3.11 Giao diện trang giải đáp thắc mắc (FAQ Help Center)
- **Đường dẫn:** `/faq`
- **Nền tảng mô phỏng đối chiếu:** **Tripadvisor & Booking.com Customer Help Center**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Thanh tìm kiếm câu hỏi tức thì hỗ trợ tìm theo từ khóa (*hủy tour*, *hoàn tiền*, *trẻ em*, *hóa đơn VAT*).
  - Phân nhóm 5 danh mục nghiệp vụ: *Đặt tour & Giữ chỗ*, *Thanh toán & Hóa đơn*, *Hủy tour & Hoàn tiền*, *Giấy tờ & Thủ tục*, *Dịch vụ trong tour*.
  - Giao diện Accordion đóng/mở mượt mà, trình bày câu trả lời rõ ràng kèm đường dẫn hỗ trợ nhanh.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/FAQ.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/FAQ.tsx).

---

### 4.3.12 Giao diện trang liên hệ (Contact Us)
- **Đường dẫn:** `/contact`
- **Nền tảng mô phỏng đối chiếu:** **Vietravel Customer Support Office**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Bản đồ số Google Maps nhúng trực tiếp vị trí văn phòng đại diện tại Hà Nội và TP. Hồ Chí Minh.
  - Thông tin đường dây nóng tổng đài 24/7, email hỗ trợ du khách và khung giờ phục vụ.
  - Biểu mẫu tiếp nhận phản hồi, khiếu nại và tư vấn tour đoàn với cam kết phản hồi trong vòng 30 phút.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/Contact.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/Contact.tsx).

---

### 4.3.13 Giao diện trang Chatbot Trợ lý ảo AI (AI Virtual Assistant)
- **Đường dẫn:** `/chatbot` (kèm popup nổi `TravelGoChatbot.tsx`)
- **Nền tảng mô phỏng đối chiếu:** **Trợ lý ảo GenAI du lịch (Google Gemini AI Model)**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Giao diện trò chuyện toàn màn hình hiện đại, tối ưu cho cả máy tính và điện thoại thông minh.
  - Gợi ý câu hỏi thông minh (Prompt Chips): *Gợi ý tour Đà Nẵng 3N2Đ*, *Chính sách hoàn hủy tour*, *Món ngon đặc sản Phú Quốc*.
  - Tích hợp mô hình ngôn ngữ lớn Google Gemini AI xử lý ngôn ngữ tự nhiên tiếng Việt, tự động tra cứu dữ liệu tour thực tế và tư vấn lộ trình 24/7.
  - Widget chat bong bóng nổi luôn sẵn sàng hỗ trợ khách hàng tại mọi trang trên toàn website.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/ChatbotPage.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/ChatbotPage.tsx), [`frontend/src/components/TravelGoChatbot.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/TravelGoChatbot.tsx).

---

### 4.3.14 Giao diện khu vực liên kết các mạng xã hội (Footer Social Links)
- **Đường dẫn:** Khu vực chân trang (Footer) trên toàn bộ hệ thống
- **Nền tảng mô phỏng đối chiếu:** **Vietnam.travel & Agoda Global Footer Standard**
- **Đặc tả kiến trúc giao diện & thành phần mô phỏng:**
  - Hệ thống nút bấm liên kết chính thức tới các mạng xã hội: Fanpage Facebook, Kênh YouTube TravelHub Official, Instagram, Zalo Official Account.
  - Bộ nhận diện pháp lý: Huy hiệu chứng nhận "Đã Đăng Ký Bộ Công Thương", chứng chỉ bảo mật thanh toán SSL, cam kết bảo vệ quyền lợi người tiêu dùng theo Luật TMĐT Việt Nam.
  - Form đăng ký nhận tin khuyến mãi qua email với chiết khấu 10% cho khách hàng mới.
- **Mã nguồn hiện thực hóa:** [`frontend/src/components/Footer.tsx`](file:///d:/TOOl/TravelHub/frontend/src/components/Footer.tsx).

---

### 4.3.15 Các giao diện trang mở rộng khác
- **Kho Voucher khuyến mãi (`/promo-codes`):** Mô phỏng thiết kế vé xé đục lỗ chuẩn Klook/Shopee, nút sao chép mã 1 chạm và đồng hồ đếm ngược thời gian áp dụng voucher.
- **Cẩm nang & Câu chuyện cộng đồng (`/featured-stories`, `/stories/:slug`):** Mô phỏng chuyên trang chia sẻ kinh nghiệm Lonely Planet và diễn đàn Tripadvisor, nơi cộng đồng du khách đăng tải nhật ký hành trình, hình ảnh check-in và kinh nghiệm du lịch thực tế.
- **Phân hệ Lưu trú & Nghỉ dưỡng (`/hotels`, `/hotels/:slug`):** Mô phỏng hệ thống đặt phòng Booking.com với bộ lọc xếp hạng sao, tiện ích phòng (bể bơi vô cực, buffet sáng, bãi tắm riêng).
- **Phân hệ Ẩm thực & Nhà hàng (`/restaurants`, `/restaurants/:slug`):** Khám phá văn hóa ẩm thực đặc sản từng vùng miền, hỗ trợ đặt bàn trực tuyến không thu phí giữ chỗ.

---

## 4.4 Giao diện Admin

Phân hệ quản trị (Back-Office / Admin Console) của **TravelHub** được xây dựng dưới dạng bảng điều khiển chuyên nghiệp, bảo vệ bằng route guard [`AdminRoute`](file:///d:/TOOl/TravelHub/frontend/src/components/AdminRoute.tsx) và xác thực JWT với vai trò `ADMIN`:

### 4.4.1 Giao diện trang đăng nhập phần Admin
- **Đường dẫn:** `/signin` (với tài khoản có quyền Quản trị viên `ADMIN`)
- **Mô tả nghiệp vụ:** Sau khi xác thực thông tin tài khoản hợp lệ, hệ thống kiểm tra trường `role === 'ADMIN'`. Quản trị viên được tự động chuyển hướng trực tiếp vào trung tâm quản trị `/admin/dashboard`, chặn truy cập trái phép từ tài khoản du khách thông thường.

---

### 4.4.2 Giao diện trang chủ Admin (Dashboard Console)
- **Đường dẫn:** `/admin/dashboard`
- **Mô tả nghiệp vụ & Giao diện:**
  - Thẻ chỉ số hiệu suất chính (KPI Stat Cards): Tổng doanh thu lũy kế, Số lượng đơn đặt tour mới, Số khách hàng đăng ký thành viên, Tỷ lệ thanh toán thành công.
  - Biểu đồ tăng trưởng doanh số (Recharts Interactive Chart): Trực quan hóa doanh thu theo tháng và so sánh với cùng kỳ năm trước.
  - Danh sách đơn đặt mới cần xử lý (Recent Bookings Table): Cập nhật tức thì các booking vừa phát sinh kèm nút duyệt nhanh trạng thái.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminDashboard.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminDashboard.tsx).

---

### 4.4.3 Giao diện trang thêm mới sản phẩm (Tour Create)
- **Đường dẫn:** `/admin/tours` (Bấm nút *"Thêm Tour Mới"*)
- **Mô tả nghiệp vụ & Giao diện:**
  - Form nhập liệu đa thông tin: Tiêu đề tour, Điểm đến trực thuộc (Destination ID), Giá niêm yết người lớn, Giá trẻ em, Thời lượng (Số ngày/đêm), Điểm khởi hành.
  - Trình soạn thảo Điểm nổi bật (Highlights) và Lịch trình chi tiết từng ngày (Day-by-Day Itinerary).
  - Tải lên nhiều ảnh minh họa (Multi-photo upload) lưu trữ tại thư mục `/backend/uploads/tours/` thông qua Multer.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminTours.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminTours.tsx).

---

### 4.4.4 Giao diện trang sửa sản phẩm (Tour Edit)
- **Đường dẫn:** `/admin/tours` (Bấm biểu tượng *Chỉnh sửa* trên từng hàng dữ liệu)
- **Mô tả nghiệp vụ & Giao diện:**
  - Nạp tự động toàn bộ dữ liệu hiện tại của tour vào form chỉnh sửa.
  - Cho phép điều chỉnh giá mở bán, áp dụng chính sách chiết khấu, cập nhật lịch trình hoặc tạm ngưng hiển thị tour trên trang người dùng.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminTours.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminTours.tsx).

---

### 4.4.5 Giao diện trang xóa sản phẩm (Tour Delete)
- **Đường dẫn:** `/admin/tours` (Bấm biểu tượng *Thùng rác*)
- **Mô tả nghiệp vụ & Giao diện:**
  - Hộp thoại cảnh báo bảo vệ (Safety Confirmation Modal): Yêu cầu người quản trị xác nhận hành động xóa nhằm phòng ngừa việc thao tác nhầm.
  - Kiểm tra ràng buộc toàn vẹn cơ sở dữ liệu: Ngăn chặn xóa các tour đang có đơn đặt hàng (Booking) đang hoạt động nhằm đảm bảo tính toàn vẹn dữ liệu tài chính.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminTours.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminTours.tsx).

---

### 4.4.6 Giao diện trang quản lý tài khoản người dùng (User Management)
- **Đường dẫn:** `/admin/users`
- **Mô tả nghiệp vụ & Giao diện:**
  - Bảng danh sách toàn bộ tài khoản người dùng và nhân viên trong hệ thống.
  - Thanh tìm kiếm theo tên, email hoặc số điện thoại.
  - Tính năng phân quyền quản trị: Nâng cấp tài khoản thành `ADMIN` hoặc phân quyền `STAFF`.
  - Khóa (Deactivate) hoặc Mở khóa tài khoản khi có vi phạm chính sách cộng đồng.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminUsers.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminUsers.tsx).

---

### 4.4.7 Giao diện trang thống kê & Báo cáo (Analytics & Financial Reporting)
- **Đường dẫn:** `/admin/analytics`
- **Mô tả nghiệp vụ & Giao diện:**
  - Biểu đồ phân bổ doanh thu theo từng phương thức thanh toán (VietQR, MoMo, PayPal, VNPAY, Thẻ tín dụng).
  - Thống kê top các tour du lịch có doanh số cao nhất và tỷ lệ lấp đầy chỗ trống.
  - Báo cáo số liệu người dùng mới, tỷ lệ khách hàng quay lại (Retention Rate).
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminAnalytics.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminAnalytics.tsx).

---

### 4.4.8 Giao diện trang quản lý banner khuyến mãi (Banner Management)
- **Đường dẫn:** `/admin/banners`
- **Mô tả nghiệp vụ & Giao diện:**
  - Thêm mới banner marketing với ảnh nền 4K, tiêu đề chiến dịch và đường dẫn điều hướng URL.
  - Thiết lập thứ tự ưu tiên hiển thị trên Slider trang chủ và thời hạn kích hoạt chiến dịch.
  - Bật/tắt trạng thái hiển thị tức thì mà không cần can thiệp vào mã nguồn.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminBanners.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminBanners.tsx).

---

### 4.4.9 Giao diện trang quản lý Menu điều hướng (Menu Management)
- **Đường dẫn:** `/admin/menu`
- **Mô tả nghiệp vụ & Giao diện:**
  - Quản lý linh hoạt cấu trúc cây điều hướng trên Header Navbar và Footer.
  - Thêm menu item mới, chỉnh sửa nhãn hiển thị, thay đổi đường dẫn URL đích.
  - Sắp xếp thứ tự hiển thị bằng thao tác số thứ tự (Order Index) và bật/tắt hiển thị tức thì.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminMenu.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminMenu.tsx).

---

### 4.4.10 Giao diện trang quản lý Sales, Đơn hàng & Khuyến mãi (Sales & Booking Lifecycle)
- **Đường dẫn:** `/admin/bookings`, `/admin/payments`, `/admin/promo`
- **Mô tả nghiệp vụ & Giao diện:**
  - Quản lý toàn bộ vòng đời đơn đặt tour (Booking Lifecycle): Tiếp nhận đơn -> Duyệt đơn -> Đối soát thanh toán -> Xuất vé -> Hoàn tất.
  - Quản lý giao dịch thanh toán (Payments Console): Tra cứu mã giao dịch, kiểm tra ảnh chụp biên lai chuyển khoản VietQR Napas, xác nhận nạp tiền tự động.
  - Động cơ mã giảm giá (Promo Code Engine): Tạo mã chiết khấu mới, quy định hình thức giảm (% hoặc tiền mặt), giá trị tối đa, ngưỡng áp dụng tối thiểu và số lượt sử dụng tối đa.
- **Mã nguồn hiện thực hóa:** [`frontend/src/pages/admin/AdminBookings.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminBookings.tsx), [`frontend/src/pages/admin/AdminPayments.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminPayments.tsx), [`frontend/src/pages/admin/AdminPromoCodes.tsx`](file:///d:/TOOl/TravelHub/frontend/src/pages/admin/AdminPromoCodes.tsx).

---

# KẾT LUẬN

Qua quá trình phân tích, thiết kế và phát triển đề tài **"Xây dựng nền tảng Thương mại Điện tử Du lịch trực tuyến TravelHub"**, nhóm đã đạt được các kết quả nổi bật:
1. Hoàn thành đầy đủ các mô hình phân tích thiết kế hệ thống theo chuẩn môn học: BFD, DFD các mức, ERD chuẩn hóa cơ sở dữ liệu.
2. Xây dựng hoàn chỉnh giao diện người dùng (User Interface) và giao diện quản trị (Admin Console) đáp ứng toàn bộ các tiêu chí từ mục 4.3.1 đến 4.4.10 của đề cương.
3. Ứng dụng thành công các công nghệ hiện đại (React 18, Node.js, Prisma ORM, Tailwind CSS, Google Gemini AI) tạo nên một sản phẩm phần mềm chất lượng cao, thẩm mỹ và trải nghiệm mượt mà.

---

# HƯỚNG PHÁT TRIỂN

1. **Ứng dụng di động (Mobile App):** Phát triển phiên bản React Native cho Android và iOS hỗ trợ thông báo đẩy và lưu vé offline.
2. **AI Recommendation Engine:** Ứng dụng Machine Learning để phân tích hành vi duyệt web và tự động gợi ý các gói tour được cá nhân hóa theo từng nhóm du khách.
3. **Mở rộng mô hình Marketplace đa nhà cung cấp (Multi-vendor OTA):** Cho phép các công ty du lịch và hướng dẫn viên địa phương tự đăng ký mở gian hàng và bán tour trên nền tảng.

---

# TÀI LIỆU THAM KHẢO

1. **TS. Lê Văn Vịnh (Chủ biên)** - *Giáo trình Phát triển Hệ thống Thương mại Điện tử*, Học viện Công nghệ Bưu chính Viễn thông.
2. Kenneth C. Laudon, Carol Guercio Traver - *E-Commerce: Business, Technology, Society*, 16th Edition, Pearson.
3. React Documentation - *React 18 Architecture and Server Components*, https://react.dev.
4. Prisma Documentation - *Next-generation ORM for Node.js and TypeScript*, https://www.prisma.io/docs.
5. Tailwind CSS - *Rapidly build modern websites without ever leaving your HTML*, https://tailwindcss.com.

---

# PHÂN CÔNG CÔNG VIỆC

| STT | MÃ SV | HỌ VÀ TÊN SV | CÔNG VIỆC | XÁC NHẬN |
|:---:|:---:|:---|:---|:---:|
| **1** | **B21DCCN2000** | **Nguyễn Văn A** | - Vẽ sơ đồ BFD, phân tích biểu đồ chức năng website.<br>- Xây dựng kiến trúc Back-end: Quản lý sản phẩm, Quản lý đặt tour và API thanh toán.<br>- Tổng hợp báo cáo và điều phối dự án. | **Hoàn thành 100%** |
| **2** | B21DCCN2001 | Trần Thị B | - Phân tích thiết kế biểu đồ luồng dữ liệu DFD và CSDL (ERD).<br>- Lập trình Front-end User: Trang chủ, Chi tiết tour, Giỏ hàng, Đặt tour và Thanh toán. | **Hoàn thành 100%** |
| **3** | B21DCCN2002 | Lê Hoàng C | - Thiết kế giao diện Quản trị Admin: Dashboard, Quản lý tài khoản, Quản lý Menu, Quản lý Banner.<br>- Tích hợp Trợ lý ảo AI Chatbot, FAQ và kiểm thử hệ thống. | **Hoàn thành 100%** |
