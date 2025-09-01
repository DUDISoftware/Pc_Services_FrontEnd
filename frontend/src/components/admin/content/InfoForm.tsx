// components/static-content/InfoForm.tsx
export default function InfoForm() {
  return (
    <div>
      <label className="block text-sm font-medium">Thông tin giới thiệu</label>
      <textarea
        placeholder="Nhập thông tin..."
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
