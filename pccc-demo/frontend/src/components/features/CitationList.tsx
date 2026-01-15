import { ArrowUpRight, CheckCircle2, FileText, Scale, BookMarked } from "lucide-react"
import { motion } from "framer-motion"

interface CitationListProps {
  citations: {
    source: string;
    text: string;
    url?: string | null;
    clause?: string;
    category?: string
  }[];
  activeTab: string;
}

// Mapping of common PCCC standards to their official URLs
const STANDARD_URL_MAP: Record<string, string> = {
  'QCVN 06:2022/BXD': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Quy-chuan-ky-thuat-quoc-gia-QCVN-06-2022-BXD-An-toan-chay-cho-nha-va-cong-trinh-536932.aspx',
  'QCVN 06:2022': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Quy-chuan-ky-thuat-quoc-gia-QCVN-06-2022-BXD-An-toan-chay-cho-nha-va-cong-trinh-536932.aspx',
  'TCVN 5738:2021': 'https://thuvienphapluat.vn/TCVN/Dien-dien-tu/TCVN-5738-2021-He-thong-bao-chay-tu-dong-Yeu-cau-ky-thuat-1062306.aspx',
  'TCVN 7336:2021': 'https://thuvienphapluat.vn/TCVN/Xay-dung/TCVN-7336-2021-Phong-chay-va-chua-chay-He-thong-sprinkler-tu-dong-1050587.aspx',
  'TCVN 3890:2023': 'https://thuvienphapluat.vn/TCVN/Xay-dung/TCVN-3890-2023-Phuong-tien-phong-chay-chua-chay-1165584.aspx',
  'Nghị định 136/2020/NĐ-CP': 'https://thuvienphapluat.vn/van-ban/Tai-nguyen-Moi-truong/Nghi-dinh-136-2020-ND-CP-huong-dan-Luat-Phong-chay-va-chua-chay-va-Luat-sua-doi-458478.aspx',
  'QCVN 01:2021/BXD': 'https://thuvienphapluat.vn/van-ban/Xay-dung-Do-thi/Quy-chuan-ky-thuat-quoc-gia-QCVN-01-2021-BXD-Quy-hoach-xay-dung-502879.aspx',
};

// Get URL for a standard (use mapped URL or fallback to provided URL)
const getStandardUrl = (source: string, providedUrl?: string | null): string | null => {
  // Check exact match first
  if (STANDARD_URL_MAP[source]) return STANDARD_URL_MAP[source];

  // Check partial match (e.g., "QCVN 06:2022/BXD" matches "QCVN 06:2022")
  for (const key of Object.keys(STANDARD_URL_MAP)) {
    if (source.includes(key) || key.includes(source)) {
      return STANDARD_URL_MAP[key];
    }
  }

  // Fallback to provided URL if valid
  if (providedUrl && providedUrl.startsWith('http')) {
    return providedUrl;
  }

  return null;
};

export function CitationList({ citations, activeTab }: CitationListProps) {
  // Map simplified tab names to full categories
  const filteredCitations = citations.filter(c => {
    if (!c.category) return true;
    const tabMap: Record<string, string> = {
      'escape': 'escape',
      'fire': 'fire',
      'traffic': 'traffic',
      'tech': 'tech'
    };
    return c.category === tabMap[activeTab];
  });

  return (
    <div className="space-y-4 mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-zinc-200/60">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/50 flex items-center justify-center shadow-sm">
            <Scale size={18} className="text-orange-600" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-zinc-800">Căn cứ pháp lý</h3>
            <p className="text-xs text-zinc-500">{filteredCitations.length} văn bản tham chiếu</p>
          </div>
        </div>
      </div>

      {filteredCitations.length === 0 ? (
        <div className="text-center p-8 text-zinc-400 text-sm bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
          <BookMarked size={32} className="mx-auto mb-2 opacity-30" />
          <p>Chưa có trích dẫn cụ thể cho phần này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredCitations.map((citation, index) => {
            const standardUrl = getStandardUrl(citation.source, citation.url);

            return (
              <motion.div
                key={`${citation.source}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                id={`citation-${citation.source.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`}
                className="
                  relative flex flex-col gap-3 p-4 rounded-xl 
                  bg-gradient-to-br from-white to-orange-50/30 
                  border border-orange-200/40 
                  hover:border-orange-300/60 hover:shadow-md 
                  transition-all group scroll-mt-20
                "
              >
                {/* Source badge row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="
                      text-[11px] font-mono font-bold text-orange-700 
                      px-2.5 py-1.5 rounded-lg 
                      bg-gradient-to-r from-orange-100 to-amber-100 
                      border border-orange-200/60 
                      inline-flex items-center gap-1.5 shadow-sm
                    ">
                      <FileText size={12} />
                      {citation.source}
                    </div>

                    {citation.clause && (
                      <div className="
                        text-[10px] font-medium text-zinc-500 
                        px-2 py-1 rounded-md 
                        bg-zinc-100 border border-zinc-200/50
                      ">
                        {citation.clause}
                      </div>
                    )}
                  </div>

                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Citation text */}
                <p className="text-sm text-zinc-600 leading-relaxed group-hover:text-zinc-800 line-clamp-3">
                  {citation.text}
                </p>

                {/* Link button */}
                {standardUrl && (
                  <a
                    href={standardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      self-start flex items-center gap-1.5 
                      px-3 py-1.5 text-xs font-medium 
                      text-blue-600 bg-blue-50 hover:bg-blue-100 
                      border border-blue-200/50 rounded-lg 
                      transition-all group/link
                      hover:shadow-sm hover:border-blue-300
                    "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Xem văn bản gốc</span>
                    <ArrowUpRight
                      size={14}
                      className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                    />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  )
}
