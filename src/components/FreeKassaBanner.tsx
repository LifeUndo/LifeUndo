export default function FreeKassaBanner() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <img 
            src="/brand/freekassa-badge.svg" 
            alt="FreeKassa" 
            className="h-8 w-auto"
          />
          <span className="text-white font-semibold text-lg">
            WE ACCEPT FREEKASSA
          </span>
        </div>
        <p className="text-red-100 text-sm mt-2">
          Безопасные платежи через проверенную систему
        </p>
      </div>
    </div>
  );
}
