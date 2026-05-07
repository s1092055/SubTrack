import { getAvatarColor } from "@/constants/brandColors";

export default function SubServiceMark({ sub }) {
  const color = sub.avatarColor || getAvatarColor(sub.name);

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {sub.name.charAt(0).toUpperCase()}
    </div>
  );
}
