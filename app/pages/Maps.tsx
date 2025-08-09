import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import Button from "../components/ui/button/Button";
import { HorizontaLDots, PlusIcon, MapPinIcon, ClockIcon, EyeIcon, PencilIcon, TrashIcon } from "../icons";
// @ts-expect-error
import MapService from "../apiservices/MapService";

interface Map {
  _id: string;
  id: number;
  price: number;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailPreview: string;
  video: string;
  videoPreview: string;
  duration: string;
  distance: string;
  location: string;
  status: string;
  createdAt: string;
  views: number;
}

export default function Maps() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddMapOpen, setIsAddMapOpen] = useState(false);
  const [mapsData, setMapsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMap, setEditingMap] = useState<Map | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    duration: "",
    distance: "",
    thumbnail: null as File | null,
    thumbnailPreview: null as string | null,
    video: null as File | null,
    videoPreview: null as string | null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    MapService.getMaps()
      .then((data: any) => {
        setMapsData(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load maps");
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge color="success">Active</Badge>;
      case "draft":
        return <Badge color="warning">Draft</Badge>;
      case "archived":
        return <Badge color="error">Archived</Badge>;
      default:
        return <Badge color="primary">{status}</Badge>;
    }
  };

  const handleActionClick = (mapId: number) => {
    setOpenDropdown(openDropdown === mapId ? null : mapId);
  };

  const handleEdit = (mapId: number) => {
    const mapToEdit = mapsData.find((map: any) => map._id === mapId);
    if (mapToEdit) {
      setEditingMap(mapToEdit);
      setForm({
        title: mapToEdit.title,
        description: mapToEdit.description,
        price: mapToEdit.price,
        location: mapToEdit.location,
        duration: mapToEdit.duration,
        distance: mapToEdit.distance,
        thumbnail: mapToEdit.thumbnail, // Reset file inputs
        thumbnailPreview: mapToEdit.thumbnail,
        video: mapToEdit.video,
        videoPreview: mapToEdit.video,
      });
      setIsAddMapOpen(true);
    }
    setOpenDropdown(null);
  };

  const handleView = (mapId: number) => {
    console.log("View map:", mapId);
    setOpenDropdown(null);
  };

  const handleDelete = async (mapId: number) => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      try {
        await MapService.deleteMap(mapId);
        setMapsData((prev: any) => prev.filter((map: any) => map._id !== mapId));
      } catch (err) {
        alert("Failed to delete map");
      }
    }
    setOpenDropdown(null);
  };

  const handleAddMap = () => {
    setEditingMap(null);
    setForm({
      title: "",
      description: "",
      price: "",
      location: "",
      duration: "",
      distance: "",
      thumbnail: null,
      thumbnailPreview: null,
      video: null,
      videoPreview: null,
    });
    setIsAddMapOpen(true);
  };

  const handleCloseAddMap = () => {
    setIsAddMapOpen(false);
    setEditingMap(null);
    setForm({
      title: "",
      description: "",
      price: "",
      location: "",
      duration: "",
      distance: "",
      thumbnail: null,
      thumbnailPreview: null,
      video: null,
      videoPreview: null,
    });
  };

  const handleSaveMap = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("location", form.location);
      formData.append("duration", form.duration);
      formData.append("distance", form.distance);
      if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
      if (form.video) formData.append("video", form.video);

      if (editingMap) {
        // Update existing map
        const response = await MapService.updateMap(editingMap._id, formData);
        setMapsData((prev: any) =>
          prev.map((map: any) =>
            map._id === editingMap._id ? response.data : map
          )
        );
      } else {
        // Create new map
        const response = await MapService.addMap(formData);
        setMapsData((prev: any) => [response.data, ...prev]);
      }

      setIsAddMapOpen(false);
      setEditingMap(null);
      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        duration: "",
        distance: "",
        thumbnail: null,
        thumbnailPreview: null,
        video: null,
        videoPreview: null,
      });
    } catch (err) {
      alert(editingMap ? "Failed to update map" : "Failed to save map");
    } finally {
      setSaving(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("form.thumbnailPreview",form)
  return (
    <>
      <PageMeta
        title="Maps | React.js Admin Dashboard"
        description="Manage video running routes and maps"
      />
      <PageBreadcrumb pageTitle="Maps" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Running Routes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage video routes and running maps for your community
            </p>
          </div>
          <Button
            onClick={handleAddMap}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Map
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading maps...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white/90">
                      Route
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                      Location
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                      Duration
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                      Distance
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                      Status
                    </TableCell>
                 
                    <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {mapsData.map((map: any, idx: number) => {
                    return (
                      <TableRow key={idx}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                              <img
                                width={64}
                                height={48}
                                src={`${API_BASE_URL}upload/maps/${map.thumbnail}`}
                                alt={map.title}
                                className="w-full h-full object-cover"
                              />
                              {/* <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                                <PlayIcon className="w-4 h-4 text-white" />
                              </div> */}
                            </div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-medium text-gray-800 dark:text-white/90">
                                {map.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">
                                {map.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <ClockIcon className="w-3 h-3" />
                                {new Date(map.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPinIcon className="w-3 h-3" />
                            {map.location}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {map.duration}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {map.distance}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          {getStatusBadge(map.status)}
                        </TableCell>
                       
                        <TableCell className="px-4 py-3 text-start">
                          <div className="relative">
                            <button
                              onClick={() => handleActionClick(map._id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                              <HorizontaLDots className="w-4 h-4 text-gray-500" />
                            </button>
                            {openDropdown === map._id && (
                              <Dropdown isOpen={openDropdown === map._id} onClose={() => setOpenDropdown(null)} className="absolute right-0 top-full z-10 min-w-[120px]">
                                <DropdownItem onClick={() => handleView(map._id)}>
                                  <EyeIcon className="w-4 h-4 mr-2" />
                                  View Route
                                </DropdownItem>
                                <DropdownItem onClick={() => handleEdit(map._id)}>
                                  <PencilIcon className="w-4 h-4 mr-2" />
                                  Edit Map
                                </DropdownItem>
                                <DropdownItem onClick={() => handleDelete(map._id)}>
                                  <TrashIcon className="w-4 h-4 mr-2" />
                                  Delete Map
                                </DropdownItem>
                              </Dropdown>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {mapsData.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <MapPinIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No running routes found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get started by creating your first running route with video!
                </p>
                <Button
                  onClick={handleAddMap}
                  className="mt-4 flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Your First Route
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Map Slide-out Popup */}
      {isAddMapOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={handleCloseAddMap}
          />

          {/* Slide-out Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {editingMap ? "Edit Route" : "Add New Route"}
                </h2>
                <button
                  onClick={handleCloseAddMap}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route Title
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="Enter route title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <textarea
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="Enter price..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="Describe the route..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={form.duration}
                        onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="e.g., 25:30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Distance
                      </label>
                      <input
                        type="text"
                        value={form.distance}
                        onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="e.g., 5.2 km"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thumbnail {editingMap && "(Leave empty to keep current)"}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center dark:border-gray-700">
                      {editingMap && form.thumbnailPreview && (
                        <div className="mb-4">
                          <img
                            src={
                              form.thumbnailPreview.startsWith("data:")
                                ? form.thumbnailPreview
                                : `${API_BASE_URL}upload/maps/${form.thumbnailPreview}`
                            }
                            alt="Current thumbnail"
                            className="w-20 h-15 mx-auto rounded-lg object-cover"
                          />
                          <p className="text-xs text-gray-500 mt-2">Current thumbnail</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-brand-600 hover:text-brand-500">
                            <span>{editingMap ? "Upload new file" : "Upload a file"}</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    const result = e.target?.result as string;
                                    setForm(prev => ({
                                      ...prev,
                                      thumbnail: file,
                                      thumbnailPreview: result,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="sr-only"
                            />
                          </label>
                          <p>or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video File {editingMap && "(Leave empty to keep current)"}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center dark:border-gray-700">
                      {editingMap && form.videoPreview && (
                        <div className="mb-4">
                          <video
                            controls
                            width="200"
                            src={
                              form.videoPreview.startsWith("data:")
                                ? form.videoPreview
                                : `${API_BASE_URL}upload/maps/${form.videoPreview}`
                            }
                          />
                          <p className="text-xs text-gray-500 mt-2">Current video</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="video-upload" className="relative cursor-pointer rounded-md font-medium text-brand-600 hover:text-brand-500">
                            <span>{editingMap ? "Upload new video" : "Upload video"}</span>
                            <input
                              id="video-upload"
                              name="video-upload"
                              type="file"
                              accept="video/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    const result = e.target?.result as string;
                                    setForm(prev => ({
                                      ...prev,
                                      video: file,
                                      videoPreview: result,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="sr-only"
                            />
                          </label>
                          <p>or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MOV up to 100MB</p>
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                  onClick={handleCloseAddMap}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveMap}
                  className="px-4 py-2"
                  disabled={saving}
                >
                  {saving ? (editingMap ? "Updating..." : "Saving...") : (editingMap ? "Update Route" : "Save Route")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}