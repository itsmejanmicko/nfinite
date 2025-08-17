import LoginForm from "./(auth)/login"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L100 100M100 0L200 100M200 0L300 100M300 0L400 100M400 0L500 100M500 0L600 100M600 0L700 100M700 0L800 100"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
          />
          <path
            d="M0 100L100 200M100 100L200 200M200 100L300 200M300 100L400 200M400 100L500 200M500 100L600 200M600 100L700 200M700 100L800 200"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
          />
          <path
            d="M0 200L100 300M100 200L200 300M200 200L300 300M300 200L400 300M400 200L500 300M500 200L600 300M600 200L700 300M700 200L800 300"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
          />
          <path
            d="M0 300L100 400M100 300L200 400M200 300L300 400M300 300L400 400M400 300L500 400M500 300L600 400M600 300L700 400M700 300L800 400"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
          />
          <path
            d="M0 400L100 500M100 400L200 500M200 400L300 500M300 400L400 500M400 400L500 500M500 400L600 500M600 400L700 500M700 400L800 500"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
          />
          <path
            d="M0 500L100 600M100 500L200 600M200 500L300 600M300 500L400 600M400 500L500 600M500 500L600 600M600 500L700 600M700 500L800 600"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
          />

          {/* Corner geometric elements */}
          <path d="M0 0L50 0L50 50L0 50Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600" />
          <path
            d="M750 0L800 0L800 50L750 50Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-600"
          />
          <path
            d="M0 550L50 550L50 600L0 600Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-600"
          />
          <path
            d="M750 550L800 550L800 600L750 600Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-600"
          />
        </svg>
      </div>

      {/* Login form container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <LoginForm />
      </div>
    </div>
  )
}
