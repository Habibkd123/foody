import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserWalletCard from "../components/UserProfile/UserWalletCard";
import UserProgressCard from "../components/UserProfile/UserProgressCard";
import UserPaymentMethodsCard from "../components/UserProfile/UserPaymentMethodsCard";
import UserFriendsCard from "../components/UserProfile/UserFriendsCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useUsersService } from "../apiservices/useUserService";

function UserProfiles() {
  const { getUserById } = useUsersService();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMaps, setRecentMaps] = useState<any>([]);
  const [walletData, setWalletData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any>(null);
  const [friends, setFriends] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    // Replace '1' with the actual user ID you want to fetch
    getUserById(id as string).then((response) => {
      if (response?.user) {
        setUser(response.user);
        setRecentMaps(response.recentMaps);
        setWalletData(response.wallet[0]);
        setPaymentMethods(response.paymentMethods);
        setFriends(response.friends);
      } else {
        setError('User not found');
      }
      setLoading(false);
    })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError(err);
        setLoading(false);
      });
  }, [id, getUserById]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user: {error}</div>;

  return (
    <>
      <PageMeta
        title="User Profile | Pedometer"
        description="User profile management page"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

        <div className="space-y-6">
          <UserProgressCard user={user}   recentMaps={recentMaps} />
          <UserWalletCard user={user}  walletData={walletData}/>
          {paymentMethods && <UserPaymentMethodsCard paymentMethods={paymentMethods}/>}
          <UserFriendsCard friends={friends}/>
        </div>
      </div>
    </>
  );
}

export default UserProfiles;