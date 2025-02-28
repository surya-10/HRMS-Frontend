import React, { useState, useEffect } from "react";
import { Plus, Trash, X, Bell, PieChart, Users, MessageSquare, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    target: "All",
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    employee: 0,
    manager: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    updateStats();
  }, [announcements]);

  const updateStats = () => {
    setStats({
      total: announcements.length,
      employee: announcements.filter(a => a.target === "Employee").length,
      manager: announcements.filter(a => a.target === "Admin").length,
    });
  };
  

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/announcements");
      const data = await response.json();
      console.log(response)
      setAnnouncements(data);
      updateStats(data); // Update stats after fetching announcements
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  
  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.target) {
      alert("Please fill all required fields!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3002/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          description: newAnnouncement.description,
          target: newAnnouncement.target,
          priority: newAnnouncement.priority || "Low",
        }),
      });
  
      if (!response.ok) throw new Error("Failed to add announcement");
  
      const addedAnnouncement = await response.json();
      setAnnouncements((prev) => {
        const updatedAnnouncements = [addedAnnouncement, ...prev];
        updateStats(updatedAnnouncements); // Update stats after setting announcements
        return updatedAnnouncements;
      });
  
      setShowModal(false);
      setNewAnnouncement({ title: "", description: "", target: "All", priority: "Low" });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add announcement. Please try again.");
    }
  };
  

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === "all") return true;
    return announcement.target.toLowerCase() === filter;
  });

  const handleDeleteAnnouncement = async (id) => {
    setAnnouncementToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteAnnouncement = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/announcements/${announcementToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a._id !== announcementToDelete));
      } else {
        alert("Failed to delete announcement.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F4FF] to-[#E9E4FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-5 right-5 bg-[#6C5DD3] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Announcement published successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header and Stats */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-[#2B3674]">Admin Dashboard</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#6C5DD3] text-white px-8 py-4 rounded-xl flex items-center gap-2 shadow-lg hover:bg-[#5B4CB3] transition-all duration-300 font-medium"
            >
              <Plus className="w-5 h-5" /> New Announcement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6C5DD3]/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-[#6C5DD3]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Announcements</p>
                  <p className="text-2xl font-semibold text-[#2B3674]">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6C5DD3]/10 rounded-lg">
                  <Users className="w-6 h-6 text-[#6C5DD3]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee Announcements</p>
                  <p className="text-2xl font-semibold text-[#2B3674]">{stats.employee}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6C5DD3]/10 rounded-lg">
                  <PieChart className="w-6 h-6 text-[#6C5DD3]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manager Announcements</p>
                  <p className="text-2xl font-semibold text-[#2B3674]">{stats.manager}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center  gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="relative ">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border-4 w-60 border-violet-200 rounded-lg focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent outline-none transition-all duration-300 appearance-none bg-white"
            >
              <option value="all">All Announcements</option>
              <option value="employee">Employee Only</option>
              <option value="manager">Manager Only</option>
            </select>
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </span>
                      </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No announcements yet.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300 flex justify-between items-center cursor-pointer`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-[#2B3674]">{announcement.title}</h2>
                    <span className={`px-3 py-1 rounded-full ${
                      announcement.target === 'Admin' 
                        ? 'bg-[#6C5DD3]/10 text-[#6C5DD3]' 
                        : 'bg-green-100 text-green-600'
                    } text-sm`}>
                      {announcement.target === 'Admin' ? 'Manager' : announcement.target}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{announcement.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                    {new Date(announcement.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAnnouncement(announcement._id);
                  }}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors duration-300"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Announcement Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 w-full max-w-lg relative shadow-xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
              <h2 className="text-2xl font-bold text-[#2B3674] mb-6">New Announcement</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent outline-none transition-all duration-300 min-h-[120px]"
                  placeholder="Description"
                  value={newAnnouncement.description}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Target Audience</label>
                    <div className="relative">
                      <select
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent outline-none transition-all duration-300 appearance-none bg-white"
                        value={newAnnouncement.target}
                        onChange={(e) =>
                          setNewAnnouncement({ ...newAnnouncement, target: e.target.value })
                        }
                      >
                        <option value="All">All Users</option>
                        <option value="Admin">Managers Only</option>
                        <option value="Employee">Employees Only</option>
                      </select>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAnnouncement}
                    className="bg-[#6C5DD3] text-white px-6 py-2 rounded-xl shadow-lg hover:bg-[#5B4CB3] transition-all duration-300"
                  >
                    Add Announcement
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 w-full max-w-lg relative shadow-xl"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
              <h2 className="text-2xl font-bold text-[#2B3674] mb-6">Delete Announcement</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this announcement?</p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAnnouncement}
                  className="bg-red-500 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnnouncement;