import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Building2, Briefcase, Users, BadgeCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formStyles as styles } from '../../../../styles/formStyles';
import ProfileForm from '../Profile form/ProfileForm';
import DotsLoader from '../../../../Components/Layout/animations/dotAnimations';

const ProfessionForm = ({ profileId, onBack }) => {
  console.log(profileId);
  const [professionData, setProfessionData] = useState({
    department: '',
    designation: '',
    employee_type: '',
    current_employment: 'Active'
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userId');

  const departments = ['IT', 'Finance'];
  const designations = [
    'JSA',
    'Developer',
    'AI/DS',
    'Prompt Engineer',
    'Senior Developer',
    'Manager'
  ];
  const employeeTypes = ['full-time', 'part-time', 'intern'];

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfessionData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    console.log(professionData);
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:3002/api/routes/employee/update-profession/${profileId}/${userID}`,
        professionData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if(response.data) {
        toast.success('Professional details added successfully!');
        setShowProfileForm(true);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Error adding professional details');
    }
    finally{
      setLoading(false)
    }
  };

  if (showProfileForm) {
    return <ProfileForm profileId={profileId} onBack={() => setShowProfileForm(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.pageContainer}
    >
      <motion.div
        className={styles.formCard}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {/* <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button> */}
            <h2 className={styles.headerTitle}>Professional Information</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className={styles.stepDot(step === 2)}
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
            <motion.div
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="department" className={styles.label}>
                <Building2 className={styles.labelIcon} />
                <span className={styles.labelText}>Department</span>
              </label>
              <select
                id="department"
                value={professionData.department}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="designation" className={styles.label}>
                <BadgeCheck className={styles.labelIcon} />
                <span className={styles.labelText}>Designation</span>
              </label>
              <select
                id="designation"
                value={professionData.designation}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Select Designation</option>
                {designations.map((designation) => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="employee_type" className={styles.label}>
                <Users className={styles.labelIcon} />
                <span className={styles.labelText}>Employee Type</span>
              </label>
              <select
                id="employee_type"
                value={professionData.employee_type}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Select Employee Type</option>
                {employeeTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="current_employment" className={styles.label}>
                <Briefcase className={styles.labelIcon} />
                <span className={styles.labelText}>Employment Status</span>
              </label>
              <select
                id="current_employment"
                value={professionData.current_employment}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.buttonContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* <motion.button
              type="button"
              onClick={onBack}
              className={styles.secondaryButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button> */}
            <motion.button
              type="submit"
              className={styles.primaryButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <DotsLoader/>:"Continue"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfessionForm; 