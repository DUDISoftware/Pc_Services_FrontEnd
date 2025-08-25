// src/app/(user)/layout.tsx
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";
// import UserSidebar from "@/components/user/UserSidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* <UserSidebar /> */}
      <div className="flex-1">
        {/* <Header /> */}
        <main>{children}</main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
