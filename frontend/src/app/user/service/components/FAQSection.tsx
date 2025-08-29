const faqs = [
  { q: "Tôi nên chọn Hệ điều hành?", a: "..." },
  { q: "Máy tính xách tay nào phù hợp với việc học?", a: "..." },
  { q: "Làm thế nào để chọn được MacBook?", a: "..." },
];

export default function FAQSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Những câu hỏi thường gặp về Dịch vụ sửa chữa
      </h2>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details key={i} className="border rounded-lg p-4 bg-white shadow-sm">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-gray-600 text-sm">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
