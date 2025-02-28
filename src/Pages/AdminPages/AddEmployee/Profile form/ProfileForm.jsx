import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Calendar, User, Briefcase, Flag, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formStyles as styles } from '../../../../styles/formStyles';
import DotsLoader from '../../../../Components/Layout/animations/dotAnimations';
import NotifyForm from '../Notify user/NotifyUser';

const ProfileForm = ({ profileId, onBack }) => {
  const [loading, setLoading] = useState(false)
  const userID = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false)
  const [profileData, setProfileData] = useState({
    date_of_birth: '',
    gender: '',
    joining_date: '',
    marital_status: '',
    nationality: '',
  });

  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const nationalities = ['Indian', 'American', 'British', 'Canadian', 'Australian'];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:3002/api/routes/employee/add-employee-details-hr/${profileId}/${userID}`,
        profileData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Raw Response:', response);
      setShowNotify(true)
      if (response.data) {
        setShowNotify(true);
        // toast.success('Profile updated successfully!');
        // 
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
    }
    finally{
      setLoading(false)
    }
  };
  if(showNotify){
    return <NotifyForm/>
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
            <h2 className={styles.headerTitle}>Complete Profile Details</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className={styles.stepDot(step === 3)}
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
            {/* Date of Birth */}
            <motion.div 
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="date_of_birth" className={styles.label}>
                <Calendar className={styles.labelIcon} />
                <span className={styles.labelText}>Date of Birth</span>
              </label>
              <input
                type="date"
                id="date_of_birth"
                value={profileData.date_of_birth}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </motion.div>

            {/* Joining Date */}
            <motion.div 
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="joining_date" className={styles.label}>
                <Briefcase className={styles.labelIcon} />
                <span className={styles.labelText}>Joining Date</span>
              </label>
              <input
                type="date"
                id="joining_date"
                value={profileData.joining_date}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </motion.div>

            {/* Gender */}
            <motion.div 
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="gender" className={styles.label}>
                <User className={styles.labelIcon} />
                <span className={styles.labelText}>Gender</span>
              </label>
              <select
                id="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                <option value="">Select Gender</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Marital Status */}
            <motion.div 
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="marital_status" className={styles.label}>
                <Heart className={styles.labelIcon} />
                <span className={styles.labelText}>Marital Status</span>
              </label>
              <select
                id="marital_status"
                value={profileData.marital_status}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                <option value="">Select Marital Status</option>
                {maritalStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Nationality */}
            <motion.div 
              className={styles.inputWrapper}
              whileHover={{ scale: 1.02 }}
            >
              <label htmlFor="nationality" className={styles.label}>
                <Flag className={styles.labelIcon} />
                <span className={styles.labelText}>Nationality</span>
              </label>
              <select
                id="nationality"
                value={profileData.nationality}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                <option value="">Select Nationality</option>
                {nationalities.map((nationality) => (
                  <option key={nationality} value={nationality}>
                    {nationality}
                  </option>
                ))}
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
              {loading ? <DotsLoader/>:"Complete Profile"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfileForm; 