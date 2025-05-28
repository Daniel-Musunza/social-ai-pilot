import type { SocialMediaPlatform } from "@/types";
import { Facebook, Instagram, Youtube, Twitter, MessageSquare } from "lucide-react"; // Using MessageSquare for TikTok as placeholder

interface PlatformIconProps {
  platform: SocialMediaPlatform;
  className?: string;
}

// Simple TikTok SVG Icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.47.02-4.8-.72-6.56-2.34-1.45-1.34-2.28-3.05-2.48-4.97-.01-.79-.01-1.59-.01-2.38 0-.19.02-.38.02-.57v.01c.28.01.56.02.83.03Z" />
  </svg>
);


export function PlatformIcon({ platform, className = "h-5 w-5" }: PlatformIconProps) {
  switch (platform) {
    case "facebook":
      return <Facebook className={className} style={{ color: "#1877F2" }} />;
    case "instagram":
      return <Instagram className={className} style={{ color: "#E4405F" }} />;
    case "twitter":
      return <Twitter className={className} style={{ color: "#1DA1F2" }} />;
    case "youtube":
      return <Youtube className={className} style={{ color: "#FF0000" }} />;
    case "tiktok":
      return <TikTokIcon className={className} />; // Using custom SVG or placeholder
    default:
      return <MessageSquare className={className} />; // Default icon
  }
}
