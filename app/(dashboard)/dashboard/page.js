export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          Total Customers: 0
        </div>

        <div className="bg-white p-4 shadow rounded">
          Pending Approvals: 0
        </div>

        <div className="bg-white p-4 shadow rounded">
          Approved: 0
        </div>
      </div>
    </div>
  );
}