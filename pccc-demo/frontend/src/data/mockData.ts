export const mockComplianceResponse = {
  escapeSolutions: [
    "Bố trí tối thiểu 2 cầu thang thoát nạn theo QCVN 06:2022 cho tòa nhà cao trên 15m",
    "Khoảng cách từ điểm xa nhất đến lối thoát nạn không quá 25m đối với phòng giữa hai lối thoát",
    "Chiều rộng cửa thoát nạn tối thiểu 1.2m cho khu vực có trên 50 người",
    "Hệ thống đèn chiếu sáng sự cố và biển chỉ dẫn thoát nạn được bố trí dọc theo hành lang",
    "Cửa thoát nạn phải mở theo chiều thoát nạn và không có chốt khóa"
  ],
  fireSpreadPrevention: [
    "Tường ngăn cháy giữa các khoang đệm có giới hạn chịu lửa REI 120",
    "Sử dụng vật liệu không cháy (loại A) cho kết cấu chịu lực chính",
    "Khoảng cách an toàn PCCC giữa các khối nhà tối thiểu 6m để chống cháy lan",
    "Lắp đặt màn ngăn cháy hoặc cửa ngăn cháy tự động tại các vị trí thông tầng",
    "Bọc bảo vệ kết cấu thép bằng vật liệu chống cháy đạt chuẩn"
  ],
  fireTraffic: [
    "Đường giao thông cho xe chữa cháy rộng tối thiểu 3.5m, cao thông thủy 4.5m",
    "Bãi đỗ xe chữa cháy được bố trí cách chân tòa nhà trong khoảng 8-10m",
    "Đảm bảo bán kính quay xe tối thiểu 12m cho xe thang chữa cháy",
    "Giao thông nội bộ phải thông thoáng, không có vật cản cố định",
    "Bố trí họng tiếp nước chữa cháy ở vị trí xe dễ tiếp cận"
  ],
  technicalSystems: [
    "Hệ thống báo cháy tự động địa chỉ theo TCVN 5738:2021",
    "Hệ thống chữa cháy sprinkler tự động bao phủ toàn bộ diện tích sàn",
    "Hệ thống hút khói hành lang và tăng áp cầu thang bộ",
    "Họng nước chữa cháy vách tường được bố trí tại sảnh thang máy mỗi tầng",
    "Máy bơm chữa cháy dự phòng diesel hoạt động độc lập với nguồn điện lưới"
  ],
  citations: [
    { source: "QCVN 06:2022/BXD", text: "Mục 3.2.5 - Yêu cầu về lối thoát nạn và đường thoát nạn" },
    { source: "QCVN 06:2022/BXD", text: "Mục 4.1.2 - Giới hạn chịu lửa của cấu kiện xây dựng" },
    { source: "TCVN 5738:2021", text: "Hệ thống báo cháy - Yêu cầu kỹ thuật chung" },
    { source: "TCVN 7336:2021", text: "Hệ thống chữa cháy tự động bằng nước, bọt" },
    { source: "QCVN 01:2021/BXD", text: "Quy chuẩn kỹ thuật quốc gia về Quy hoạch xây dựng" }
  ]
};

export const statsData = [
  { label: "Số tầng", value: "25", unit: "tầng" },
  { label: "Chiều cao", value: "85", unit: "mét" },
  { label: "Diện tích sàn", value: "1,000", unit: "m²" },
  { label: "Loại CT", value: "Chung cư", unit: "" },
  { label: "Cấp PCCC", value: "Cấp 1", unit: "" },
  { label: "Nhóm nguy hiểm", value: "F1.3", unit: "" },
];

// Compliance check items for Hợp chuẩn page
export interface ComplianceCheckItem {
  id: string;
  category: string;
  requirement: string;
  standard: string;
  status: 'pass' | 'fail' | 'warning' | 'unchecked';
  details?: string;
}

export const complianceCheckItems: ComplianceCheckItem[] = [
  {
    id: "1",
    category: "Lối thoát nạn",
    requirement: "Số lượng cầu thang thoát nạn",
    standard: "QCVN 06:2022/BXD - Mục 3.2.1",
    status: "pass",
    details: "Tòa nhà có 2 cầu thang thoát nạn, đáp ứng yêu cầu tối thiểu"
  },
  {
    id: "2",
    category: "Lối thoát nạn",
    requirement: "Chiều rộng cửa thoát nạn ≥ 1.2m",
    standard: "QCVN 06:2022/BXD - Mục 3.2.5",
    status: "pass",
    details: "Cửa thoát nạn rộng 1.4m"
  },
  {
    id: "3",
    category: "Lối thoát nạn",
    requirement: "Khoảng cách đến lối thoát ≤ 40m",
    standard: "QCVN 06:2022/BXD - Mục 3.2.8",
    status: "warning",
    details: "Khoảng cách xa nhất là 38m, gần giới hạn cho phép"
  },
  {
    id: "4",
    category: "Ngăn cháy lan",
    requirement: "Tường ngăn cháy REI 120",
    standard: "QCVN 06:2022/BXD - Mục 4.1.2",
    status: "pass",
    details: "Tường ngăn cháy đạt REI 150"
  },
  {
    id: "5",
    category: "Ngăn cháy lan",
    requirement: "Cửa ngăn cháy EI 60",
    standard: "QCVN 06:2022/BXD - Mục 4.2.3",
    status: "fail",
    details: "Cửa ngăn cháy tầng 5-10 chỉ đạt EI 45, cần nâng cấp"
  },
  {
    id: "6",
    category: "Giao thông chữa cháy",
    requirement: "Đường xe chữa cháy rộng ≥ 3.5m",
    standard: "QCVN 06:2022/BXD - Mục 6.1.1",
    status: "pass",
    details: "Đường nội bộ rộng 4m"
  },
  {
    id: "7",
    category: "Giao thông chữa cháy",
    requirement: "Bãi đỗ xe chữa cháy 15x15m",
    standard: "QCVN 06:2022/BXD - Mục 6.1.3",
    status: "pass",
    details: "Bãi đỗ kích thước 18x16m"
  },
  {
    id: "8",
    category: "Hệ thống kỹ thuật",
    requirement: "Hệ thống báo cháy tự động",
    standard: "TCVN 5738:2021",
    status: "pass",
    details: "Hệ thống báo cháy địa chỉ đầy đủ"
  },
  {
    id: "9",
    category: "Hệ thống kỹ thuật",
    requirement: "Hệ thống sprinkler",
    standard: "TCVN 7336:2021",
    status: "warning",
    details: "Sprinkler đã lắp đặt, cần kiểm tra áp lực nước"
  },
  {
    id: "10",
    category: "Hệ thống kỹ thuật",
    requirement: "Máy bơm chữa cháy dự phòng",
    standard: "TCVN 7336:2021 - Mục 8.3",
    status: "unchecked",
    details: "Chưa kiểm tra"
  }
];

// Regulations for Quy phạm pháp luật page
export interface Regulation {
  id: string;
  code: string;
  name: string;
  category: 'qcvn' | 'tcvn' | 'law' | 'decree';
  issuer: string;
  year: number;
  description: string;
  scope: string[];
  status: 'active' | 'superseded';
}

export const regulations: Regulation[] = [
  {
    id: "1",
    code: "QCVN 06:2022/BXD",
    name: "Quy chuẩn kỹ thuật quốc gia về An toàn cháy cho nhà và công trình",
    category: "qcvn",
    issuer: "Bộ Xây dựng",
    year: 2022,
    description: "Quy định các yêu cầu về an toàn cháy cho nhà và công trình xây dựng, bao gồm yêu cầu về lối thoát nạn, ngăn cháy lan, và hệ thống kỹ thuật PCCC.",
    scope: ["Nhà ở", "Công trình công cộng", "Nhà công nghiệp"],
    status: "active"
  },
  {
    id: "2",
    code: "TCVN 5738:2021",
    name: "Hệ thống báo cháy - Yêu cầu kỹ thuật",
    category: "tcvn",
    issuer: "Bộ Khoa học và Công nghệ",
    year: 2021,
    description: "Tiêu chuẩn quy định yêu cầu kỹ thuật về thiết kế, lắp đặt và vận hành hệ thống báo cháy tự động trong các công trình.",
    scope: ["Hệ thống báo cháy", "Đầu báo khói", "Đầu báo nhiệt"],
    status: "active"
  },
  {
    id: "3",
    code: "TCVN 7336:2021",
    name: "Phòng cháy chữa cháy - Hệ thống sprinkler tự động",
    category: "tcvn",
    issuer: "Bộ Khoa học và Công nghệ",
    year: 2021,
    description: "Tiêu chuẩn quy định yêu cầu thiết kế, lắp đặt và bảo dưỡng hệ thống chữa cháy tự động sprinkler.",
    scope: ["Hệ thống sprinkler", "Chữa cháy tự động", "Bể nước chữa cháy"],
    status: "active"
  },
  {
    id: "4",
    code: "Luật PCCC 2001",
    name: "Luật Phòng cháy và chữa cháy",
    category: "law",
    issuer: "Quốc hội",
    year: 2001,
    description: "Luật quy định về hoạt động phòng cháy và chữa cháy, trách nhiệm của cơ quan, tổ chức, cá nhân và lực lượng PCCC.",
    scope: ["Tất cả công trình", "Tổ chức", "Cá nhân"],
    status: "active"
  },
  {
    id: "5",
    code: "Nghị định 136/2020/NĐ-CP",
    name: "Quy định chi tiết thi hành Luật PCCC",
    category: "decree",
    issuer: "Chính phủ",
    year: 2020,
    description: "Nghị định quy định chi tiết một số điều của Luật Phòng cháy và chữa cháy, bao gồm thủ tục thẩm duyệt, nghiệm thu và xử phạt.",
    scope: ["Thẩm duyệt thiết kế", "Nghiệm thu", "Xử phạt vi phạm"],
    status: "active"
  },
  {
    id: "6",
    code: "QCVN 01:2021/BXD",
    name: "Quy chuẩn kỹ thuật quốc gia về Quy hoạch xây dựng",
    category: "qcvn",
    issuer: "Bộ Xây dựng",
    year: 2021,
    description: "Quy định về khoảng cách an toàn PCCC, đường giao thông cho xe chữa cháy trong quy hoạch đô thị.",
    scope: ["Quy hoạch đô thị", "Khoảng cách an toàn", "Giao thông PCCC"],
    status: "active"
  },
  {
    id: "7",
    code: "TCVN 3890:2023",
    name: "Phương tiện phòng cháy và chữa cháy - Bố trí, bảo quản, kiểm tra, bảo dưỡng",
    category: "tcvn",
    issuer: "Bộ Khoa học và Công nghệ",
    year: 2023,
    description: "Tiêu chuẩn quy định về bố trí, bảo quản, kiểm tra và bảo dưỡng các phương tiện PCCC như bình chữa cháy, họng nước.",
    scope: ["Bình chữa cháy", "Họng nước", "Phương tiện PCCC"],
    status: "active"
  },
  {
    id: "8",
    code: "TCVN 6160:1996",
    name: "Phòng cháy chữa cháy - Nhà cao tầng - Yêu cầu thiết kế",
    category: "tcvn",
    issuer: "Bộ Khoa học và Công nghệ",
    year: 1996,
    description: "Tiêu chuẩn cũ về yêu cầu thiết kế PCCC cho nhà cao tầng, đã được thay thế một phần bởi QCVN 06:2022.",
    scope: ["Nhà cao tầng"],
    status: "superseded"
  }
];
