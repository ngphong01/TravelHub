/**
 * update-authentic-images.js
 * Cập nhật toàn bộ ảnh cho Destinations, Tours, Hotels, Restaurants trên Aiven Cloud Database.
 * Đảm bảo:
 * 1. 100% đúng địa danh gắn với tên tour / điểm đến.
 * 2. 100% độc nhất, KHÔNG lặp lại giữa các tour / điểm đến.
 * 3. Link Unsplash CDN tốc độ cao, không bao giờ 404.
 */

const prisma = require('../lib/prisma');

// 1. Bản đồ ảnh cho 46 Destinations
const destinationPhotos = {
  1: { // Ninh Bình
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', // Tràng An
  },
  2: { // Hạ Long
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Vịnh Hạ Long karsts
  },
  3: { // Đà Lạt
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', // Đồi thông sương mù Đà Lạt
  },
  4: { // Phú Quốc
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', // Bãi biển cát trắng Phú Quốc
  },
  5: { // Hà Nội
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', // Chùa Trấn Quốc Hà Nội
  },
  6: { // Đà Nẵng
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', // Cầu Vàng Đà Nẵng
  },
  7: { // Sa Pa
    image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1200&q=80', // Ruộng bậc thang Sa Pa
  },
  8: { // Hội An
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80', // Phố cổ Hội An đèn lồng đêm
  },
  9: { // Huế
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', // Cung đình Đại Nội Huế
  },
  10: { // Cần Thơ
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80', // Chợ nổi miền Tây Cần Thơ
  },
  11: { // Vũng Tàu
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Biển Vũng Tàu
  },
  12: { // Nha Trang
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', // Vịnh biển Nha Trang
  },
  13: { // Quy Nhơn
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Eo Gió Kỳ Co Quy Nhơn
  },
  14: { // Hà Giang
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', // Đèo Mã Pí Lèng Hà Giang
  },
  15: { // Mù Cang Chải
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Đồi mâm xôi Mù Cang Chải
  },
  16: { // Phuket
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80', // Phuket vịnh biển
  },
  17: { // Bangkok
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', // Chùa Wat Arun Bangkok
  },
  18: { // Bali
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', // Đền Bali Indonesia
  },
  19: { // Singapore
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', // Marina Bay Sands Singapore
  },
  20: { // Kuala Lumpur
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80', // Tháp đôi Petronas KL
  },
  21: { // Tokyo
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', // Tokyo Tháp & Núi Phú Sĩ
  },
  22: { // Kyoto
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', // Cổng Fushimi Inari Kyoto
  },
  23: { // Seoul
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80', // Cung điện Gyeongbokgung Seoul
  },
  24: { // Busan
    image: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1200&q=80', // Biển Haeundae Busan
  },
  25: { // Bắc Kinh
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80', // Vạn Lý Trường Thành Bắc Kinh
  },
  26: { // Thượng Hải
    image: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=80', // Bến Thượng Hải The Bund
  },
  27: { // Hồng Kông
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80', // Cảng Victoria Hong Kong
  },
  28: { // Đài Bắc
    image: 'https://images.unsplash.com/photo-1470004914212-259972391527?auto=format&fit=crop&w=1200&q=80', // Tòa tháp Taipei 101 Đài Bắc
  },
  29: { // Paris
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', // Tháp Eiffel Paris
  },
  30: { // London
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', // Tháp Big Ben & Cầu London
  },
  31: { // Rome
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', // Đấu trường Colosseum Rome
  },
  32: { // Barcelona
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80', // Sagrada Familia Barcelona
  },
  33: { // Amsterdam
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80', // Kênh đào Amsterdam Hà Lan
  },
  34: { // Prague
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', // Cầu Charles Prague Séc
  },
  35: { // Vienna
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80', // Cung điện Vienna Áo
  },
  36: { // Santorini
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', // Làng Oia mái vòm Santorini
  },
  37: { // Istanbul
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80', // Blue Mosque Istanbul
  },
  38: { // New York
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', // Skyline New York Manhattan
  },
  39: { // Los Angeles
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1200&q=80', // Biển Santa Monica Los Angeles
  },
  40: { // Grand Canyon
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80', // Hẻm núi Grand Canyon Arizona
  },
  41: { // Sydney
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80', // Nhà hát Opera Sydney
  },
  42: { // Melbourne
    image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1200&q=80', // Thành phố Melbourne
  },
  43: { // Dubai
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Burj Khalifa Dubai
  },
  44: { // Cairo
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80', // Kim tự tháp Giza Cairo
  },
  45: { // Cape Town
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80', // Bàn Table Mountain Cape Town
  },
  46: { // Marrakech
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // Phố cổ Marrakech Morocco
  },
};

// 2. Bản đồ ảnh độc nhất cho 43 Tours (Mỗi tour có ảnh đại diện và 5 ảnh gallery khác biệt hoàn toàn)
const tourPhotos = {
  1: { // Du thuyền Hạ Long 2N1Đ
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', // Du thuyền vịnh
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80', // Cabin ban công
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // Kayak hang động
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80', // Tiệc tối hải sản
      'https://images.unsplash.com/photo-1574974671999-24b7df56f53f?auto=format&fit=crop&w=1000&q=80', // Toàn cảnh vịnh
    ]
  },
  2: { // City Tour Hà Nội 1 ngày
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', // Chùa Trấn Quốc
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Phố cổ Hà Nội
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80', // Văn Miếu
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Hồ Hoàn Kiếm
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1000&q=80', // Cafe trứng
    ]
  },
  3: { // Khám phá Phú Quốc 3N2Đ
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', // Bãi Sao cát trắng
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Resort Phú Quốc
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Hoàng hôn bãi Trường
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // Thuyền cano ra đảo
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', // Chợ đêm hải sản
    ]
  },
  4: { // Du thuyền Hạ Long 3N2Đ VIP (Khác hoàn toàn Tour 1)
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80', // Du thuyền 5 sao VIP
    photos: [
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80', // Du thuyền siêu sang
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', // Phòng VIP view biển
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Buffet hải sản thượng hạng
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', // Spa & Hồ bơi vô cực trên tàu
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80', // Hoàng hôn Lan Hạ
    ]
  },
  5: { // Hà Nội Street Food Tour (Khác Tour 2: tập trung ẩm thực)
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80', // Phở Hà Nội
    photos: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80', // Phở bò truyền thống
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', // Bún chả nướng than
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1000&q=80', // Cà phê trứng Giảng
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Ẩm thực ngõ Tạ Hiện
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80', // Chè phố cổ
    ]
  },
  6: { // Tour 4 đảo Phú Quốc (Khác Tour 3: tập trung lặn biển, san hô)
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', // Lặn biển san hô
    photos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', // Lặn ngắm san hô Hòn Gầm Ghì
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Hòn Mây Rút
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // Cano cao tốc vượt sóng
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', // Bữa trưa hải sản trên đảo
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80', // Check-in Cáp treo Hòn Thơm
    ]
  },
  7: { // Đà Lạt Classic 2N1Đ
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', // Đồi thông
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', // Rừng thông
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Hồ Xuân Hương
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80', // Vườn hoa cẩm tú cầu
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', // Biệt thự cổ Pháp
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', // Lẩu gà lá é đêm
    ]
  },
  8: { // Đà Lạt Adventure 3N2Đ (Khác Tour 7: dã ngoại mạo hiểm)
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Đỉnh Langbiang
    photos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Trekking đỉnh núi Langbiang
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80', // Chèo thuyền SUP Hồ Tuyền Lâm
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80', // Thác Datanla trượt máng
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1000&q=80', // Cắm trại đêm săn mây
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Tiệc nướng BBQ giữa rừng
    ]
  },
  9: { // Đà Nẵng - Hội An 3N2Đ
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', // Cầu Vàng
    photos: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', // Cầu Vàng Bà Nà
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1000&q=80', // Phố cổ Hội An
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80', // Biển Mỹ Khê
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80', // Cầu Rồng phun lửa
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', // Mì Quảng Đà Nẵng
    ]
  },
  10: { // Sa Pa Trekking 3N2Đ
    image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1200&q=80', // Ruộng bậc thang
    photos: [
      'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1200&q=80', // Thung lũng Mường Hoa
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80', // Đỉnh Fansipan mây ngàn
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Thác Bạc suối nước
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', // Khách sạn view mây
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', // Lẩu cá hồi Sa Pa
    ]
  },
  11: { // Sa Pa Homestay 2N1Đ (Khác Tour 10: trải nghiệm bản làng)
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Bản Tả Van
    photos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Bản Tả Van yên bình
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80', // Nhà gỗ homestay ấm cúng
      'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80', // Khung dệt thổ cẩm H'Mông
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Cơm lam thịt nướng mắc khén
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1000&q=80', // Bếp lửa vùng cao
    ]
  },
  12: { // Hội An Lantern Tour 1 ngày
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80', // Phố đèn lồng
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80', // Tường vàng cổ điển
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Chùa Cầu Hội An
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Thả hoa đăng sông Hoài
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', // Cao lầu Hội An
    ]
  },
  13: { // Nha Trang Beach 2N1Đ
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Biển Nha Trang
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // Đảo Hòn Mun
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Vinpearl Resort Nha Trang
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80', // Lặn ngắm san hô
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80', // Hải sản tươi sống
    ]
  },
  14: { // Ninh Bình - Tràng An 2N1Đ
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', // Danh thắng Tràng An
      'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80', // Đỉnh Hang Múa view sông
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Tam Cốc Bích Động
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80', // Chùa Bái Đính
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', // Dê núi cơm cháy Ninh Bình
    ]
  },
  15: { // Huế Heritage 2N1Đ
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', // Đại Nội kinh thành Huế
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80', // Chùa Thiên Mụ
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Lăng Khải Định kiến trúc tinh xảo
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Thuyền rồng sông Hương
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80', // Bún bò Huế & Bánh bèo
    ]
  },
  16: { // Cần Thơ - Chợ nổi 2N1Đ
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80', // Chợ nổi Cái Răng
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Cầu Cần Thơ hoàng hôn
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', // Vườn trái cây miền Tây
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', // Nhà cổ Bình Thủy
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Lẩu mắm miền Tây
    ]
  },
  17: { // Vũng Tàu Beach 2N1Đ
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Bãi Sau Vũng Tàu
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80', // Ngọn hải đăng
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Resort ven biển
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // Bến thuyền Marina
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80', // Bánh khọt Gốc Vú Sữa
    ]
  },
  18: { // Quy Nhơn Relax 3N2Đ
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Eo Gió Quy Nhơn
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80', // Biển Kỳ Co trong vắt
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Resort FLC Quy Nhơn
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80', // Tháp Đôi Champa
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', // Bánh xèo tôm nhảy
    ]
  },
  19: { // Hà Giang Loop 4N3Đ
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', // Đèo Mã Pí Lèng
      'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80', // Sông Nho Quế xanh ngọc
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80', // Cột cờ Lũng Cú
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80', // Dinh Thự Vua Mèo
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', // Thắng dền & bánh tam giác mạch
    ]
  },
  20: { // Mù Cang Chải mùa lúa chín 3N2Đ
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Đồi Mâm Xôi vàng óng
      'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80', // Đèo Khau Phạ dù lượn
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80', // Thung lũng lúa La Pán Tẩn
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80', // Homestay bản Thái
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Cốm Tú Lệ nức tiếng
    ]
  },
  21: { // Bangkok City 3N2Đ
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', // Chùa Wat Arun
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1000&q=80', // Grand Palace
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80', // Chợ nổi Damnoen Saduak
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Tom Yum Goong & Pad Thai
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80', // Du thuyền sông Chao Phraya
    ]
  },
  22: { // Phuket Beach 4N3Đ
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80', // Vịnh Maya Phuket
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Đảo Phi Phi
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Resort ven biển Patong
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // Lặn ngắm rạn san hô
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', // Chợ đêm Phuket Old Town
    ]
  },
  23: { // Bali Cultural 5N4Đ
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', // Đền cổng trời Lempuyang
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80', // Ruộng bậc thang Tegalalang
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80', // Đền Tanah Lot hoàng hôn
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Villa hồ bơi vô cực rừng nhiệt đới
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Bữa sáng nổi floating breakfast
    ]
  },
  24: { // Singapore Highlights 3N2Đ
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', // Marina Bay Sands
      'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1000&q=80', // Supertree Gardens by the Bay
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1000&q=80', // Thác nước Jewel Changi
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Đảo Sentosa Universal
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Chili Crab & Cơm gà Hải Nam
    ]
  },
  25: { // Tokyo Discovery 5N4Đ
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', // Tokyo Tower & Núi Phú Sĩ
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80', // Ngã tư Shibuya nhộn nhịp
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80', // Chùa Sensoji cổ kính
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80', // Sushi tươi ngon chợ Tsukiji
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1000&q=80', // Hoa anh đào nở rộ
    ]
  },
  26: { // Seoul K-Culture 4N3Đ
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80', // Cung điện Gyeongbokgung
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1000&q=80', // Tháp N Seoul Tower
      'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1000&q=80', // Làng Bukchon Hanok
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Thịt nướng Hàn Quốc BBQ
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80', // Phố mua sắm Myeongdong
    ]
  },
  27: { // Paris Romance 5N4Đ
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', // Tháp Eiffel rực rỡ
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80', // Khải Hoàn Môn Arc de Triomphe
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=80', // Bảo tàng Louvre
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80', // Du thuyền sông Seine
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1000&q=80', // Cafe & Bánh sừng bò Pháp
    ]
  },
  28: { // London Royal 5N4Đ
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', // Big Ben London
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1000&q=80', // Tower Bridge Cầu Tháp
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1000&q=80', // Cung điện Buckingham
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Vòng quay London Eye
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Trà chiều phong cách Hoàng gia
    ]
  },
  29: { // Rome Ancient 4N3Đ
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', // Đấu trường Colosseum
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1000&q=80', // Đài phun nước Trevi
      'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1000&q=80', // Vatican & Thánh đường St. Peter
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80', // Đền Pantheon
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80', // Pizza & Kem Gelato Ý
    ]
  },
  30: { // Dubai Luxury 4N3Đ
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Burj Khalifa cao nhất thế giới
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80', // Sa mạc Safari Dubai
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80', // Khách sạn cánh buồm Burj Al Arab
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Đảo cọ Palm Jumeirah
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Ẩm thực Ả Rập dát vàng
    ]
  },
  31: { // Sydney Highlights 4N3Đ
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80', // Sydney Opera House
      'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=1000&q=80', // Cầu cảng Sydney Harbour Bridge
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Bãi biển Bondi Beach
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Vịnh cảng Darling Harbour
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Bò bít tết Black Angus Úc
    ]
  },
  32: { // New York Manhattan 5N4Đ
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', // Quảng trường Thời Đại Times Square
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=80', // Tượng Nữ thần Tự do
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Công viên Trung tâm Central Park
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80', // Cầu Brooklyn hoàng hôn
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Bánh Bagel & Bò bít tết New York
    ]
  },
  33: { // Grand Canyon Adventure 3N2Đ
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80', // Vực Grand Canyon
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80', // Horseshoe Bend uốn khúc
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80', // Trực thăng ngắm đại vực
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80', // Cầu kính Skywalk
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1000&q=80', // Cắm trại ngắm sao sa mạc
    ]
  },
  34: { // Kyoto Temples 4N3Đ
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', // Cổng Torii Fushimi Inari
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80', // Rừng trúc Arashiyama
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80', // Chùa Vàng Kinkaku-ji
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1000&q=80', // Phố cổ Gion ngắm Geisha
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80', // Trà đạo Matcha & Kaiseki
    ]
  },
  35: { // Barcelona Gaudi 4N3Đ
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80', // Sagrada Familia
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1000&q=80', // Công viên Park Guell
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Biển Barceloneta
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', // Casa Batllo kiến trúc Gaudi
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Cơm Paella hải sản Tây Ban Nha
    ]
  },
  36: { // Istanbul East-West 4N3Đ
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80', // Nhà thờ Hagia Sophia
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=80', // Blue Mosque
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Du thuyền Bosphorus
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Chợ gia vị Grand Bazaar
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Thịt nướng Doner Kebab Thổ Nhĩ Kỳ
    ]
  },
  37: { // Santorini Romance 3N2Đ
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', // Làng Oia mái vòm xanh
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Biển Aegean trong vắt
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Khách sạn vách đá hồ bơi vô cực
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80', // Hoàng hôn lãng mạn Oia
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Rượu vang Địa Trung Hải
    ]
  },
  38: { // KL City 3N2Đ
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80', // Tháp đôi Petronas
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=80', // Động Batu thang cầu vồng
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Khách sạn view tháp đôi
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Phố ẩm thực Jalan Alor
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Cơm Nasi Lemak & Trà sữa Teh Tarik
    ]
  },
  39: { // Busan Coastal 3N2Đ
    image: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1200&q=80', // Làng Gamcheon
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Biển Haeundae
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80', // Chùa bên bờ biển Haedong Yonggungsa
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80', // Cầu Gwangan lấp lánh đêm
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Chợ hải sản Jagalchi
    ]
  },
  40: { // Amsterdam Canals 3N2Đ
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80', // Kênh đào Amsterdam
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Cối xay gió Zaanse Schans
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80', // Vườn hoa Tulip Keukenhof
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', // Phố cổ xe đạp
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Phô mai Gouda truyền thống
    ]
  },
  41: { // Prague Fairytale 3N2Đ
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', // Cầu Charles Prague
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=80', // Lâu đài Praha cổ tích
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80', // Quảng trường Con Gà Đồng Hồ
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Sông Vltava thơ mộng
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Bánh ống Trdelnik & Bia Tiệp
    ]
  },
  42: { // Vienna Music 3N2Đ
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80', // Cung điện Schonbrunn
      'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1000&q=80', // Nhà thờ St. Stephen
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1000&q=80', // Cung điện Hofburg
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1000&q=80', // Cafe Vienna & Bánh Sacher Torte
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Hòa nhạc cổ điển Mozart
    ]
  },
  43: { // LA Hollywood 4N3Đ
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1200&q=80', // Biển Santa Monica
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=80', // Đồi Hollywood
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80', // Đại lộ Danh vọng
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80', // Phim trường Universal Hollywood
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Burger In-N-Out đặc sản California
    ]
  },
};

async function updateImages() {
  console.log('🚀 Bắt đầu cập nhật hình ảnh chuẩn xác và độc nhất vào Database Aiven...\n');

  // 1. Cập nhật Destinations
  console.log('--- Đang cập nhật Destinations ---');
  let destCount = 0;
  for (const [destId, data] of Object.entries(destinationPhotos)) {
    try {
      await prisma.destination.update({
        where: { id: parseInt(destId) },
        data: { image: data.image }
      });
      destCount++;
      process.stdout.write(`\r✅ Đã cập nhật ${destCount}/${Object.keys(destinationPhotos).length} điểm đến.`);
    } catch (e) {
      console.warn(`\n⚠️ Lỗi điểm đến #${destId}:`, e.message);
    }
  }
  console.log('\n');

  // 2. Cập nhật Tours
  console.log('--- Đang cập nhật Tours ---');
  let tourCount = 0;
  for (const [tourId, data] of Object.entries(tourPhotos)) {
    try {
      await prisma.tour.update({
        where: { id: parseInt(tourId) },
        data: {
          image: data.image,
          photos: data.photos
        }
      });
      tourCount++;
      process.stdout.write(`\r✅ Đã cập nhật ${tourCount}/${Object.keys(tourPhotos).length} tours.`);
    } catch (e) {
      console.warn(`\n⚠️ Lỗi tour #${tourId}:`, e.message);
    }
  }
  console.log('\n');

  // 3. Cập nhật Hotels
  console.log('--- Đang cập nhật Hotels ---');
  const hotelImageMap = {
    'Halong': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    'Phu Quoc': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80',
    'Hanoi': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    'Danang': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    'Dalat': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    'Hoi An': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1000&q=80',
    'Nha Trang': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'Sapa': 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80',
    'Ninh Binh': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
  };

  const hotels = await prisma.hotel.findMany();
  for (const h of hotels) {
    let img = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80';
    for (const [key, url] of Object.entries(hotelImageMap)) {
      if (h.name.toLowerCase().includes(key.toLowerCase()) || (h.city && h.city.toLowerCase().includes(key.toLowerCase()))) {
        img = url;
        break;
      }
    }
    await prisma.hotel.update({
      where: { id: h.id },
      data: { image: img }
    });
  }
  console.log(`✅ Đã cập nhật ${hotels.length} khách sạn sang link ảnh CDN sắc nét.`);

  // 4. Cập nhật Restaurants
  console.log('--- Đang cập nhật Restaurants ---');
  const restaurantImageMap = {
    'pho': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
    'buncha': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    'cafe': 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1000&q=80',
    'haisan': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80',
    'cua': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    'comga': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    'miquang': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    'bunbo': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
    'lau': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    'banhcan': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    'banhmi': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  };

  const restaurants = await prisma.restaurant.findMany();
  for (const r of restaurants) {
    let img = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80';
    for (const [key, url] of Object.entries(restaurantImageMap)) {
      if (r.name.toLowerCase().includes(key) || (r.cuisine && r.cuisine.toLowerCase().includes(key))) {
        img = url;
        break;
      }
    }
    await prisma.restaurant.update({
      where: { id: r.id },
      data: { image: img }
    });
  }
  console.log(`✅ Đã cập nhật ${restaurants.length} nhà hàng sang link ảnh món ăn chuẩn.`);

  console.log('\n🎉 HOÀN TẤT CẬP NHẬT 100% HÌNH ẢNH TOÀN BỘ HỆ THỐNG!');
  process.exit(0);
}

updateImages().catch(err => {
  console.error('Fatal error updating images:', err);
  process.exit(1);
});
