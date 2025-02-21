const RequirementCard = ({
  title,
  level,
  duration,
  role,
  mustHaveSkills,
  goodToHaveSkills,
}) => (
  <div className="bg-[#1E1E1E] rounded-xl p-6">
    <div className="flex items-start gap-3 mb-4">
      <img
        src="/Avatar 37.png"
        alt="Profile"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex-1">
        <h3 className="text-white text-xl mb-3">{title}</h3>
        <div className="flex gap-2">
          <span className="px-4 py-1 text-sm text-white rounded-full bg-[#4A3F78]">
            {level}
          </span>
          <span className="px-4 py-1 text-sm text-white rounded-full bg-[#8B4513]">
            {duration}
          </span>
        </div>
      </div>
    </div>

    <div className="space-y-4 text-[15px]">
      <div>
        <span className="text-white font-medium">Role: </span>
        <span className="text-gray-400">{role}</span>
      </div>

      <div>
        <span className="text-white font-medium">Must-Have Skills: </span>
        <span className="text-gray-400">{mustHaveSkills}</span>
      </div>

      <div>
        <span className="text-white font-medium">Good-to-Have Skills: </span>
        <span className="text-gray-400">{goodToHaveSkills}</span>
      </div>
    </div>
  </div>
);

export default RequirementCard;
