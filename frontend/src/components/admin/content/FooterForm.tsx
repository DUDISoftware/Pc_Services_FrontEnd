// components/static-content/FooterForm.tsx
export default function FooterForm() {
  return (
    <div>
      <label className="block text-sm font-medium">Nội dung Footer</label>
      <textarea
        placeholder="Nhập nội dung footer..."
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
