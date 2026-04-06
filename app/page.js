import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}


// export default function Home() {
//   return (
//     <div className="flex items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold">
//         CRM App 🚀
//       </h1>
//     </div>
//   );
// }