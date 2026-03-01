import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Permintaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-2">
              +4 bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Dalam Proses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">10</div>
            <p className="text-xs text-muted-foreground mt-2">
              Aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground mt-2">
              ↑ 20%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Perlu Revisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">6</div>
            <p className="text-xs text-muted-foreground mt-2">
              Deadline mepet
            </p>
          </CardContent>
        </Card>

      </div>


      {/* ===== TABLE ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Permintaan Terbaru</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2">Pemda</th>
                  <th>Aplikasi</th>
                  <th>Menu</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-3">BPKAD</td>
                  <td>SIMDA</td>
                  <td>Aktivasi User</td>
                  <td>28 Feb 2026</td>
                  <td>
                    <Badge variant="secondary">50%</Badge>
                  </td>
                </tr>

                <tr>
                  <td className="py-3">Bappeda</td>
                  <td>E-Planning</td>
                  <td>Report</td>
                  <td>21 Feb 2026</td>
                  <td>
                    <Badge className="bg-green-600 text-white">
                      100%
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}