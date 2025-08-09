import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import { HorizontaLDots } from "../icons";
import { MissionsService } from "../apiservices/useMissionsService";
import { UserCircle2Icon } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL

export default function Missions() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);


  const [missions, setMissions] = useState([]);
  // const getStatusBadge = () => <Badge color="success">Upcoming</Badge>;

  const handleActionClick = (missionId: number) => {
    setOpenDropdown(openDropdown === missionId ? null : missionId);
  };

  const handleView = async (missionId: number) => {
    try {
      console.log("Mission ID:", missionId);
      // const data = await getMission(missionId.toString());
      // console.log("Mission Data:", data);
      navigate(`/missions/${missionId}`);
    } catch (err) {
      console.error("Failed to load mission:", err);
    } finally {
      setOpenDropdown(null);
    }
  };


  useEffect(() => {
    (async () => {
      try {
        const missionList = await MissionsService.getInstance().getMissions();
        console.log("Missions Data:", missionList);
        if (missionList) {
          setMissions(missionList as any);
        }
      } catch (err) {
        console.error("Error loading missions", err);
      }
    })();
  }, []);
  const handleDelete = () => {
    setOpenDropdown(null);
  };
  console.log("Missions:", missions);
  return (
    <>
      <PageMeta
        title="Missions | Pedometer"
        description="Manage all missions"
      />
      <PageBreadcrumb pageTitle="Missions" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Missions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white/90">
                  Mission
                </TableCell>
                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  Start Date
                </TableCell>
                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  Duration
                </TableCell>
                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  Location
                </TableCell>
                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  Join Fee
                </TableCell>
                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  Members
                </TableCell>
                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {missions.map((mission: any, index: number) => {
                console.log("Mission:", mission);
                return (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        {mission.image && !mission.image.endsWith("default.jpg") ? <img src={API_BASE_URL + mission.image} alt={mission.title} className="w-16 h-12 object-cover rounded-lg border" /> : <img src="./../../public/images/mission.webp" alt={mission.title} className="w-16 h-12 object-contain rounded-lg border" />}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{mission.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {mission.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {new Date(mission.startDate).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">{mission.duration}</TableCell>
                    <TableCell className="px-4 py-3 text-start">{mission.location}</TableCell>
                    <TableCell className="px-4 py-3 text-start">${mission.joinFee}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex -space-x-2">
                        {mission.members.map((m: any, idx: number) => (
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
                      </div>

                      <div className="text-xs text-gray-500 mt-1">{mission.members.length} joined</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="relative">
                        <button
                          onClick={() => handleActionClick(mission._id)}
                          className="dropdown-toggle flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                        >
                          <HorizontaLDots className="h-4 w-4" />
                        </button>
                        <Dropdown
                          isOpen={openDropdown === mission._id}
                          onClose={() => setOpenDropdown(null)}
                          className="min-w-[120px]"
                        >
                          <DropdownItem
                            onClick={() => handleView(mission._id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                          >
                            View
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete()}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            Delete
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
} 