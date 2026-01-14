/**
 * Valid URLs for Vietnamese Fire Safety Standards (TCVN/QCVN)
 * Mapped manually to ensure accuracy and prevent AI hallucinations.
 */

const BASE_URLS: Record<string, string> = {
    // QCVN
    'QCVN 06:2022/BXD': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Thong-tu-06-2022-TT-BXD-QCVN-06-2022-BXD-quy-chuan-ky-thuat-quoc-gia-an-toan-chay-cho-nha-va-cong-trinh-547038.aspx',
    'QCVN 06:2021/BXD': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Thong-tu-02-2021-TT-BXD-QCVN-06-2021-BXD-Quy-chuan-ky-thuat-quoc-gia-ve-an-toan-chay-cho-nha-va-cong-trinh-473950.aspx',
    'QCVN 01:2021/BXD': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Thong-tu-01-2021-TT-BXD-QCVN-01-2021-BXD-Quy-chuan-ky-thuat-quoc-gia-ve-quy-hoach-xay-dung-473949.aspx',

    // TCVN
    // TCVN 3890:2023 (Link to decision/text mostly, direct standard ID might vary)
    'TCVN 3890:2023': 'https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Tieu-chuan-quoc-gia-TCVN-3890-2023-ve-Phong-chay-chua-chay-Phuong-tien-phong-chay-va-chua-chay-cho-nha-va-cong-trinh-558237.aspx',
    'TCVN 5738:2021': 'https://thuvienphapluat.vn/tieu-chuan/tcvn-5738-2021-he-thong-bao-chay-tu-dong-yeu-cau-ky-thuat-466318.aspx',
    'TCVN 7336:2021': 'https://thuvienphapluat.vn/tieu-chuan/tcvn-7336-2021-he-thong-chua-chay-tu-dong-bang-nuoc-yeu-cau-ky-thuat-466321.aspx',
    'TCVN 2622:1995': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Tieu-chuan-Viet-Nam-TCVN-2622-1995-Phong-chay-chong-chay-cho-nha-va-cong-trinh-Yeu-cau-thiet-ke-19129.aspx',

    // Nghi dinh
    'Nghị định 136/2020/NĐ-CP': 'https://thuvienphapluat.vn/van-ban/Tai-nguyen-Moi-truong/Nghi-dinh-136-2020-ND-CP-huong-dan-Luat-Phong-chay-va-chua-chay-453000.aspx',
};

/**
 * Finds the most relevant URL for a given citation source string.
 * Uses loose matching to handle variations like "TCVN 5738" vs "TCVN 5738:2021".
 */
export function getLawUrl(source: string): string | null {
    if (!source) return null;
    const cleanSource = source.trim().toUpperCase();

    // 1. Direct match
    if (BASE_URLS[cleanSource]) {
        return BASE_URLS[cleanSource];
    }

    // 2. Partial match (e.g. "TCVN 3890" for "TCVN 3890:2023")
    const entries = Object.entries(BASE_URLS);
    for (const [key, url] of entries) {
        // If the known key contains the cleaned source (e.g. source="3890")
        if (key.includes(cleanSource) || cleanSource.includes(key.split(':')[0])) {
            return url;
        }
    }

    // 3. Fallback for common patterns
    if (source.includes("3890")) return BASE_URLS['TCVN 3890:2023'];
    if (source.includes("06:2022") || source.includes("06/2022")) return BASE_URLS['QCVN 06:2022/BXD'];
    if (source.includes("5738")) return BASE_URLS['TCVN 5738:2021'];
    if (source.includes("7336")) return BASE_URLS['TCVN 7336:2021'];
    if (source.includes("136/2020")) return BASE_URLS['Nghị định 136/2020/NĐ-CP'];

    return null;
}
