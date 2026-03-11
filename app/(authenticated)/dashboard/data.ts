import { Package, Clock, TrendingUp, AlertCircle } from "lucide-react"

export const statCards = [
  {
    label: "Total Permintaan",
    value: "24",
    sub: "8.5% dibanding bulan lalu",
    subUp: true as boolean | null,
    icon: Package,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    label: "Dalam Proses",
    value: "10",
    sub: "Aktif",
    subUp: null as boolean | null,
    icon: Clock,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
  },
  {
    label: "Selesai",
    value: "8",
    sub: "20% dibanding bulan lalu",
    subUp: false as boolean | null,
    icon: TrendingUp,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    label: "Perlu Revisi",
    value: "6",
    sub: "Deadline mepet!",
    subUp: null as boolean | null,
    subDanger: true,
    icon: AlertCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
  },
]

export const recentRequests = [
  {
    pemda: "Pemda Kota Bandung",
    aplikasi: "E-Budgeting",
    menu: "Dashboard",
    deadline: "6 Juni 2026",
    status: "Selesai",
    statusColor: "bg-teal-500",
  },
  {
    pemda: "Pemda Kota Surabaya",
    aplikasi: "E-Absensi",
    menu: "Laporan Kinerja",
    deadline: "9 Juli 2026",
    status: "Dalam Proses",
    statusColor: "bg-orange-400",
  },
  {
    pemda: "Pemda Kabupaten Sragen",
    aplikasi: "E-Planning",
    menu: "Pohon Kinerja",
    deadline: "8 Agustus 2026",
    status: "Revisi",
    statusColor: "bg-red-500",
  },
]

export const activities = [
  {
    name: "Maura",
    desc: "menyelesaikan tugas untuk Pemda Kota Bandung...",
    time: "Hari ini, 11.30 WIB",
    avatar: "",
  },
  {
    name: "Daniel",
    desc: "menambah permintaan klien baru dari Pemda Kota...",
    time: "Kemarin, 15.45 WIB",
    avatar: "",
  },
  {
    name: "Admin",
    desc: "menambahkan user baru Programmer Myko",
    time: "20 Apr, 09.12 WIB",
    avatar: "",
  },
  {
    name: "Zul",
    desc: "menyelesaikan tugas untuk Pemda Kota Surabaya - Das...",
    time: "03 Feb, 17.00 WIB",
    avatar: "",
  },
]
