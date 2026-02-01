// import Profile from '@/components/Profile';
// import NotificationBanner from '@/components/NotificationBanner';

// const page = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
//         <div>
//           <NotificationBanner location="profile" />
//         </div>
//         <div className="bg-white rounded-lg shadow-sm">
//           <Profile />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;



import Profile from "@/components/Profile";
import NotificationBanner from "@/components/NotificationBanner";

export default function Page() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto md:px-4 md:px-6 lg:px-8  md:py-6 lg:py-8 space-y-4 md:space-y-6">
        <NotificationBanner location="profile" />

        <div className="dark:bg-gray-800">
          <Profile />
        </div>
      </div>
    </div>
  );
}
