import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
      {/* Icon button */}
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
          {icon ? (
            <img src={icon} alt="Icon" className="w-8 h-8 md:w-12 md:h-12" />
          ) : (
            <LuImage />
          )}
        </div>
        <p className="text-sm md:text-base">
          {icon ? "Change Icon" : "Pick Icon"}
        </p>
      </div>

      {/* Emoji Picker */}
      {isOpen && (
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          {/* Close button */}
          <button
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LuX />
          </button>

          {/* Wrapper to control width & prevent scroll */}
          <div className="w-full max-h-[60vh] overflow-y-auto rounded-lg shadow-md border border-gray-200">
            <EmojiPicker
              open={isOpen}
              onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
              width="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
