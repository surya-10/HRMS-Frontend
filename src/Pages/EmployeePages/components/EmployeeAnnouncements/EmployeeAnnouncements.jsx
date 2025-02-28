import React, { useState, useEffect } from "react";
import { Search, X, CheckCircle, Bell, Filter, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EmployeeDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    updateStats();
  }, [announcements]);

  const updateStats = () => {
    setStats({
      total: announcements.length,
      unread: announcements.filter(a => !a.read).length,
    });
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/announcements");
      const data = await response.json();
      setAnnouncements(data);
      updateStats(); // Update stats after fetching announcements
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    filterAnnouncements();
  }, [filter, searchQuery, announcements]);

  const filterAnnouncements = () => {
    let filtered = announcements;

    if (filter === "Unread") {
      filtered = announcements.filter((a) => !a.read);
    } else if (filter === "Read") {
      filtered = announcements.filter((a) => a.read);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const handleAnnouncementClick = async (announcement) => {
    if (!announcement.read) {
      await markAsRead(announcement._id);
    }
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  const markAsRead = async (id) => {
    const employeeId = "YOUR_EMPLOYEE_ID"; // Replace with the actual employee ID (you may need to get this from context or props)

    try {
      await fetch(`http://localhost:3002/api/announcements/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }), // Send the employee ID in the request body
      });
      setAnnouncements((prev) =>
        prev.map((a) => (a._id === id ? { ...a, read: true } : a))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F4FF] to-[#E9E4FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header and Stats */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-[#2B3674] mb-6">Announcements</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6C5DD3]/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-[#6C5DD3]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Messages</p>
                  <p className="text-2xl font-semibold text-[#2B3674]">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6C5DD3]/10 rounded-lg">
                  <Bell className="w-6 h-6 text-[#6C5DD3]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unread Messages</p>
                  <p className="text-2xl font-semibold text-[#2B3674]">{stats.unread}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent outline-none transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-4 border-4 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent outline-none transition-all duration-300 appearance-none bg-white"
          >
            <option value="All">All Messages</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
          
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No announcements found.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white flex justify-between items-center cursor-pointer`}
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-[#2B3674]">
                      {announcement.title}
                    </h2>
                    {!announcement.read && (
                      <span className="px-3 py-1 rounded-full bg-[#6C5DD3] text-white text-sm">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{announcement.description}</p>
                  <p className="text-sm text-gray-400 mt-3">
                    {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                    {new Date(announcement.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {announcement.read && (
                  <CheckCircle className="w-6 h-6 text-[#6C5DD3]" />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedAnnouncement && (
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
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
              <h2 className="text-2xl font-bold text-[#2B3674] mb-4">{selectedAnnouncement.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{selectedAnnouncement.description}</p>
              <p className="text-sm text-gray-400">
                Posted on: {new Date(selectedAnnouncement.createdAt).toLocaleString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeDashboard;