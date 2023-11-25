export default function Logo({ className, imagePath }: { className?: string, imagePath: string }) {
  return (
    <img
      className={className}
      src={imagePath}
      alt="Logo Broadcast"
    />
  );
}
