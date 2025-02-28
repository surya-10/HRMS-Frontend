import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ options, selectedValue, onChange }) => {
    console.log(selectedValue)
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (value) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative w-48">
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="border border-violet-300 rounded-md px-3 py-2 bg-white text-sm text-gray-600 cursor-pointer flex justify-between items-center"
            >
                <span>{selectedValue}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-violet-300 hover:text-white ${
                                selectedValue === option.value ? "bg-violet-400 font-medium text-white" : ""
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
