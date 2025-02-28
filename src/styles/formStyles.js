export const formStyles = {
  pageContainer: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4",
  formCard: " mx-auto bg-white rounded-lg  shadow-xl overflow-hidden transform transition-all hover:shadow-2xl",
  header: "bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-8",
  headerContent: "flex items-center justify-between",
  headerTitle: "text-xl font-bold text-white tracking-tight",
  formContainer: "p-8",
  inputGrid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  inputWrapper: "space-y-2 group",
  label: "flex items-center space-x-2 text-gray-700 group-hover:text-indigo-600 transition-colors duration-200",
  labelIcon: "w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200",
  labelText: "font-medium",
  input: `w-full px-4 py-3 rounded-xl border border-gray-200 
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          hover:border-indigo-300 transition-all duration-200
          bg-white shadow-sm`,
  select: `w-full px-4 py-3 rounded-xl border border-gray-200 
           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
           hover:border-indigo-300 transition-all duration-200
           bg-white shadow-sm`,
  buttonContainer: "flex justify-end space-x-4 mt-8",
  secondaryButton: `px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium
                    hover:bg-violet-500 hover:border-indigo-300 hover:text-indigo-600 hover:text-white
                    transition-all duration-200 shadow-sm`,
  primaryButton: `px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white font-medium hover:from-indigo-700 hover:to-purple-700
                  transform hover:scale-105 transition-all duration-200 shadow-md
                  hover:shadow-xl`,
  stepIndicator: "flex justify-center space-x-2 mb-8",
  stepDot: (active) => `w-3 h-3 rounded-full transition-all duration-300 transform
                        ${active ? 'bg-indigo-600 scale-125' : 'bg-gray-300'}`,
  imageUpload: `relative group cursor-pointer rounded-2xl border-2 border-dashed
                border-gray-300 hover:border-indigo-400 transition-colors duration-200
                flex items-center justify-center bg-gray-50 hover:bg-gray-100`,
  imagePreview: "w-full h-full rounded-2xl object-cover",
  uploadIcon: "w-12 h-12 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200",
  uploadOverlay: `absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20
                  transition-opacity duration-200 rounded-2xl flex items-center
                  justify-center opacity-0 group-hover:opacity-100`,
  uploadText: "text-white font-medium",
}; 