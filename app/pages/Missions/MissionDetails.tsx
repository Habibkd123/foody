import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from 'react-router';
import { MissionsService } from '../../apiservices/useMissionsService';
import { UserCircle2Icon } from 'lucide-react';


const API_BASE_URL = import.meta.env.VITE_API_URL
interface Mission {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  duration: string;
  map_id: any;
  location: string;
  joinFee: number;
  members: { fullname: string; avatar: string }[];
}
const MissionDetails: React.FC = () => {
  const { missionId } = useParams();

  const [mission, setMission] = useState<Mission>({} as Mission);

  useEffect(() => {
    (async () => {
      try {
        const missionList = await MissionsService.getInstance().getMission(missionId as string);
        console.log("Missions Data:", missionList);
        if (missionList) {
          setMission(missionList as any);
        }
      } catch (err) {
        console.error("Error loading missions", err);
      }
    })();
  }, []);

  return (
    <>
      <PageMeta
        title={`${mission.title} | Pedometer`}
        description="Mission details"
      />
      <PageBreadcrumb pageTitle={mission.title} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <img
            src={API_BASE_URL + mission.image}
            alt={mission.title}
            className="w-full lg:w-80 h-48 object-cover rounded-xl border"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{mission.title}</h1>
            <div className="text-gray-500 dark:text-gray-400 mb-4">{mission.description}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Start Date & Time</div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {new Date(mission.startDate).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Duration</div>
                <div className="font-medium text-gray-800 dark:text-white">{mission.duration}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Location</div>
                <div className="font-medium text-gray-800 dark:text-white">{mission.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Join Fee</div>
                <div className="font-semibold text-orange-600">${mission.joinFee}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">Map</div>
          <img
            src={API_BASE_URL + "upload/maps/" + mission.map_id?.thumbnail}
            alt="Mission Map"
            className="w-full h-64 object-cover rounded-xl border"
          />
        </div>
        <div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">Members Joined ({mission.members ? mission.members?.length : "0"})</div>
          <div className="flex -space-x-2">
            {Array.isArray(mission.members) && mission.members.map((m: any, idx: number) => (
              <div key={idx} className="w-10 h-10 rounded-full overflow-hidden border border-white dark:border-gray-800">
                {m.avatar && !m.avatar.endsWith("default-avatar.jpg") ? (
                  <img
                    width={40}
                    height={40}
                    src={API_BASE_URL + "uploads/profile/" + m.avatar}
                    alt={m.User}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2Icon className="text-blue-600 size-4 dark:text-blue-400 w-full h-full" />
                )}
              </div>
            ))}
            {Array.isArray(mission.members) && mission.members.length === 0 && (
              <div className="flex flex-col items-center w-16">
                <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-1 text-gray-400">?</span>
                <span className="text-xs text-gray-400 text-center">No members</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionDetails; 