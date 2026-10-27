// backend/scripts/seed-reviews.js
const prisma = require('../lib/prisma');
require('dotenv').config();

async function seedReviews() {
  console.log('🌟 Đang khởi tạo dữ liệu đánh giá mẫu cho Tour và Điểm đến...');

  // Lấy danh sách users
  const users = await prisma.user.findMany({ take: 5 });
  if (users.length === 0) {
    console.log('⚠️ Không tìm thấy người dùng nào trong cơ sở dữ liệu!');
    return;
  }

  // Lấy danh sách Tours
  const tours = await prisma.tour.findMany({ take: 10 });
  // Lấy danh sách Destinations
  const destinations = await prisma.destination.findMany({ take: 10 });

  const sampleTourReviews = [
    {
      rating: 5,
      comment: 'Chuyến đi tuyệt vời ngoài mong đợi! Hướng dẫn viên nhiệt tình, lịch trình khoa học, xe đưa đón mới và sạch sẽ. Đồ ăn các bữa đều rất ngon và hợp khẩu vị.',
      helpfulCount: 14,
    },
    {
      rating: 5,
      comment: 'Cảnh đẹp mê hồn, mọi dịch vụ từ khách sạn đến vé tham quan đều được chuẩn bị chu đáo trước. Rất đáng tiền, gia đình mình ai cũng hài lòng!',
      helpfulCount: 9,
    },
    {
      rating: 4,
      comment: 'Trải nghiệm rất tốt, hướng dẫn viên có kiến thức sâu rộng về văn hóa địa phương. Chỉ có ngày thứ 2 di chuyển hơi nhiều nên hơi mệt xíu nhưng bù lại cảnh chụp ảnh siêu đỉnh.',
      helpfulCount: 6,
    },
    {
      rating: 5,
      comment: 'Dịch vụ chuẩn 5 sao, hỗ trợ khách hàng qua Zalo/Website cực kỳ nhanh. Đã đặt tour lần 2 tại TravelGo và chắc chắn sẽ tiếp tục ủng hộ!',
      helpfulCount: 18,
    },
    {
      rating: 5,
      comment: 'Giá cả hợp lý nhất so với các bên khác mà chất lượng phục vụ lại vượt trội. Khách sạn view biển tuyệt đẹp, buffet sáng phong phú.',
      helpfulCount: 11,
    }
  ];

  const sampleDestReviews = [
    {
      rating: 5,
      comment: 'Khung cảnh thiên nhiên tráng lệ, không khí trong lành dễ chịu. Người dân địa phương thân thiện và hiếu khách.',
      helpfulCount: 12,
    },
    {
      rating: 5,
      comment: 'Một trong những điểm đến ấn tượng nhất mình từng đi. Đồ ăn đặc sản phong phú và giá cả rất phải chăng.',
      helpfulCount: 8,
    },
    {
      rating: 4,
      comment: 'Điểm check-in chụp hình cực kỳ lung linh. Nên đi vào buổi sáng sớm để tránh đông đúc và bắt được ánh sáng đẹp nhất.',
      helpfulCount: 5,
    },
    {
      rating: 5,
      comment: 'Hệ sinh thái và di tích văn hóa được bảo tồn rất tốt. Rất phù hợp cho cả đi du lịch nghỉ dưỡng gia đình lẫn khám phá.',
      helpfulCount: 15,
    }
  ];

  // Seed Tour Reviews
  let tourReviewCount = 0;
  for (const tour of tours) {
    const existing = await prisma.tourReview.count({ where: { tourId: tour.id } });
    if (existing === 0) {
      for (let i = 0; i < Math.min(3, users.length); i++) {
        const template = sampleTourReviews[i % sampleTourReviews.length];
        await prisma.tourReview.create({
          data: {
            tourId: tour.id,
            userId: users[i].id,
            rating: template.rating,
            comment: template.comment,
            approved: true,
            helpfulCount: template.helpfulCount,
          },
        });
        tourReviewCount++;
      }
      // Cập nhật rating trung bình và reviewCount cho Tour
      await prisma.tour.update({
        where: { id: tour.id },
        data: {
          rating: 4.9,
          reviewCount: 3,
        },
      });
    }
  }

  // Seed Destination Reviews
  let destReviewCount = 0;
  for (const dest of destinations) {
    const existing = await prisma.review.count({ where: { destinationId: dest.id } });
    if (existing === 0) {
      for (let i = 0; i < Math.min(2, users.length); i++) {
        const template = sampleDestReviews[i % sampleDestReviews.length];
        await prisma.review.create({
          data: {
            destinationId: dest.id,
            userId: users[i].id,
            rating: template.rating,
            comment: template.comment,
            approved: true,
            helpfulCount: template.helpfulCount,
          },
        });
        destReviewCount++;
      }
    }
  }

  console.log(`✅ Hoàn tất! Đã thêm ${tourReviewCount} đánh giá Tour và ${destReviewCount} đánh giá Điểm đến.`);
}

seedReviews()
  .catch((e) => {
    console.error('Lỗi khi seed review:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
