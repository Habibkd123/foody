import Profile from '@/components/Profile';
import NotificationBanner from '@/components/NotificationBanner';

const page = () => {

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <NotificationBanner location="profile" />
      </div>
      <Profile />
    </>
  );
};

export default page;

