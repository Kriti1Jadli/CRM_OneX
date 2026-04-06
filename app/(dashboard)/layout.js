import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
}