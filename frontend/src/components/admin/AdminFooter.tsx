export default function AdminFooter() {
  return (
    <footer className="bg-white border-t p-6 mt-6 text-sm text-gray-600">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="font-bold">abc..........</p>
          <p>Số điện thoại: +84 20 123 4567</p>
          <p>Email: support@notpik.com</p>
        </div>
        <div>
          <p className="font-bold">Thời gian làm việc</p>
          <p>Thứ 2 đến Thứ 7: 09:00 - 18:00</p>
          <p>Chủ nhật: 10:00 - 16:00</p>
        </div>
        <div>
          <p className="font-bold">Về chúng tôi</p>
          <p>Giới thiệu</p>
          <p>Trung tâm trợ giúp</p>
          <p>Ưu đãi độc quyền</p>
          <p>Chăm sóc</p>
        </div>
        <div>
          <p className="font-bold">Đăng ký nhận ưu đãi</p>
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2 w-full mt-2"
          />
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-4">
        © 2024 DUDA. All Rights Reserved.
      </div>
    </footer>
  );
}
