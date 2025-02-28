import React, { useEffect, useState } from 'react';
import { Camera, User, Mail, Lock, Phone, Users2 } from 'lucide-react';
import axios from 'axios';
import ProfessionForm from './Profession form/ProfessionForm';
import { motion } from 'framer-motion';
import { formStyles as styles } from '../../../styles/formStyles';
import { toast } from 'react-toastify';

const EmployeeForm = () => {
  const [preview, setPreview] = useState(null);
  const userID = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    manager_id: '',
  });
  const [showProfessionForm, setShowProfessionForm] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/routes/employee/view-employees/${userID}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        console.log(response.data);
        const managersData = response.data.data
          .filter(employee => employee.role.role_value === 'manager')
          .map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            email: employee.email,
            _id: employee._id,
          }));

        setManagers(managersData);
        console.log(managersData);

      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployee();
  }, [userID]);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password: newPassword });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
   
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3002/api/routes/employee/create-employee/${userID}`, formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNewEmployeeData(response.data);
      setShowProfessionForm(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Error adding employee');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.pageContainer}
    >
      {!showProfessionForm ? (
        <motion.div
          className={styles.formCard}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h2 className={styles.headerTitle}>Add New Employee</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.stepIndicator}>
              {[1, 2, 3].map((step) => (
                <motion.div
                  key={step}
                  className={styles.stepDot(step === 1)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.1 }}
                />
              ))}
            </div>

            <motion.div
              className={styles.inputGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* First Name */}
              <motion.div
                className={styles.inputWrapper}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="first_name" className={styles.label}>
                  <User className={styles.labelIcon} />
                  <span className={styles.labelText}>First Name</span>
                </label>
                <input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter first name"
                  required
                />
              </motion.div>

              {/* Last Name */}
              <motion.div
                className={styles.inputWrapper}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="last_name" className={styles.label}>
                  <User className={styles.labelIcon} />
                  <span className={styles.labelText}>Last Name</span>
                </label>
                <input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter last name"
                  required
                />
              </motion.div>

              {/* Email */}
              <motion.div
                className={styles.inputWrapper}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="email" className={styles.label}>
                  <Mail className={styles.labelIcon} />
                  <span className={styles.labelText}>Email</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter email address"
                  required
                />
              </motion.div>

              {/* Phone */}
              <motion.div
                className={styles.inputWrapper}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="phone" className={styles.label}>
                  <Phone className={styles.labelIcon} />
                  <span className={styles.labelText}>Phone</span>
                </label>
                <input
                  id="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter phone number"
                  required
                />
              </motion.div>

              {/* Role */}
              <motion.div
                className={styles.inputWrapper}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="role" className={styles.label}>
                  <Users2 className={styles.labelIcon} />
                  <span className={styles.labelText}>Role</span>
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </select>
              </motion.div>

              {/* Manager Selection */}
              <motion.div
                className={styles.inputWrapper}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="manager_id" className={styles.label}>
                  <Users2 className={styles.labelIcon} />
                  <span className={styles.labelText}>Select Manager</span>
                </label>
                <select
                  id="manager_id"
                  value={formData.manager_id}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Password */}
              <motion.div
                className={`${styles.inputWrapper} md:col-span-2`}
                whileHover={{ scale: 1.02 }}
              >
                <label htmlFor="password" className={styles.label}>
                  <Lock className={styles.labelIcon} />
                  <span className={styles.labelText}>Password</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={generatePassword}
                    className={`${styles.secondaryButton} whitespace-nowrap`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className={styles.buttonContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                type="button"
                className={styles.secondaryButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      ) : (
        <ProfessionForm 
          profileId={newEmployeeData?.user_id} 
          onBack={() => setShowProfessionForm(false)}
        />
      )}
    </motion.div>
  );
};

export default EmployeeForm;