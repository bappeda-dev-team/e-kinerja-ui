'use client'

import LoginLeftPanel from "./LoginLeftPanel"
import LoginHeader from "./LoginHeader"
import LoginForm from "./LoginForm"
import WaveSeparator from "./WaveSeparator"

const LoginClient = () => (
  <div className="flex h-screen overflow-hidden bg-white">
    <LoginLeftPanel />
    <WaveSeparator />

    {/* Right panel — blue */}
    <div
      className="flex flex-col items-center justify-center flex-1 px-8 md:px-16 relative"
      style={{ background: "#4880FF" }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-white/10" />
      <div className="absolute bottom-[-60px] right-[20%] w-[200px] h-[200px] rounded-full bg-white/10" />

      {/* Title */}
      <div className="text-center mb-6 z-10">
        <h1 className="text-4xl font-bold text-white">E-Kinerja</h1>
        <p className="text-blue-200 text-sm mt-1">Sistem Manajemen Kinerja</p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl px-8 py-10 z-10">
        <LoginForm />
      </div>

      <footer className="absolute bottom-6 text-xs text-blue-200 text-center px-4">
        © 2026 E-Kinerja. All Rights Reserved. Designed, Built & Maintained by Dev Team
      </footer>
    </div>
  </div>
)

export default LoginClient
