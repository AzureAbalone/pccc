import { Injectable } from '@nestjs/common';
import type { ComplianceRequest, ComplianceResponse } from '@pccc/shared';

@Injectable()
export class ComplianceService {
  /**
   * Analyze building description and return fire safety compliance recommendations.
   * Currently returns mock data - will integrate with AI service later.
   */
  async analyze(request: ComplianceRequest): Promise<ComplianceResponse> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response based on building type
    const isHighRise = (request.height && request.height > 25) || (request.floors && request.floors > 8);
    
    return {
      escapeSolutions: [
        'Bố trí tối thiểu 2 lối thoát nạn cho mỗi tầng',
        'Chiều rộng cửa thoát nạn tối thiểu 1.2m',
        'Khoảng cách từ điểm xa nhất đến lối thoát nạn không quá 40m',
        ...(isHighRise ? [
          'Cầu thang thoát nạn phải có buồng đệm ngăn khói',
          'Lắp đặt thang máy chữa cháy cho tòa nhà cao tầng'
        ] : [])
      ],
      fireSpreadPrevention: [
        'Tường ngăn cháy có giới hạn chịu lửa REI 120',
        'Cửa ngăn cháy có giới hạn chịu lửa EI 60',
        'Khoảng cách an toàn PCCC giữa các công trình tối thiểu 6m',
        'Sử dụng vật liệu không cháy hoặc khó cháy cho kết cấu chịu lực'
      ],
      fireTraffic: [
        'Đường giao thông cho xe chữa cháy rộng tối thiểu 3.5m',
        'Bãi đỗ xe chữa cháy có kích thước tối thiểu 15m x 15m',
        'Khoảng cách từ bãi đỗ đến công trình không quá 10m',
        'Độ dốc đường không quá 10%'
      ],
      technicalSystems: [
        'Hệ thống báo cháy tự động theo TCVN 5738:2021',
        'Hệ thống chữa cháy tự động sprinkler',
        'Họng nước chữa cháy trong nhà mỗi tầng',
        'Hệ thống hút khói hành lang và cầu thang',
        ...(isHighRise ? [
          'Máy phát điện dự phòng cho hệ thống PCCC',
          'Trung tâm điều khiển PCCC tập trung'
        ] : [])
      ],
      citations: [
        {
          source: 'QCVN 06:2022/BXD',
          text: 'Quy chuẩn kỹ thuật quốc gia về An toàn cháy cho nhà và công trình'
        },
        {
          source: 'TCVN 5738:2021',
          text: 'Hệ thống báo cháy - Yêu cầu kỹ thuật'
        },
        {
          source: 'TCVN 7336:2021',
          text: 'Phòng cháy chữa cháy - Hệ thống sprinkler tự động'
        },
        {
          source: 'Nghị định 136/2020/NĐ-CP',
          text: 'Quy định chi tiết một số điều và biện pháp thi hành Luật Phòng cháy và chữa cháy'
        }
      ]
    };
  }
}
