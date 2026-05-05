import { useMemo } from 'react'
import { useAppStore } from '../../../shared/store/useStore'
import { VENTAS_MENSUALES } from '../../../shared/data/mockData'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const GOLD_COLORS = ['#d4af37', '#e8c23a', '#b8960c', '#9a7a09', '#7a5f07']

function StatCard({ icon, label, value, sub, trend }) {
  return (
    <div className="card-dark">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-dark-300 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-bold font-serif">{value}</p>
      {sub && <p className="text-dark-400 text-xs mt-1">{sub}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 shadow-xl text-sm">
      <p className="text-dark-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 1000
            ? `$${p.value.toLocaleString('es-CO')}`
            : p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { ventas, productos, categorias, usuarios } = useAppStore()

  const stats = useMemo(() => {
    const totalVentas = ventas.reduce((s, v) => s + v.total, 0)
    const productosActivos = productos.filter(p => p.activo).length
    const sinStock = productos.filter(p => p.activo && p.stock === 0).length
    const usuariosActivos = usuarios.filter(u => u.activo).length
    return { totalVentas, productosActivos, sinStock, usuariosActivos }
  }, [ventas, productos, usuarios])

  const ventasPorCategoria = useMemo(() => {
    const map = {}
    ventas.forEach(v => {
      v.productos.forEach(({ productoId, precio, cantidad }) => {
        const prod = productos.find(p => p.id === productoId)
        if (!prod) return
        const cat = categorias.find(c => c.id === prod.categoriaId)
        const name = cat?.nombre || 'Sin categoría'
        map[name] = (map[name] || 0) + precio * cantidad
      })
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [ventas, productos, categorias])

  const topProductos = useMemo(() => {
    const map = {}
    ventas.forEach(v => {
      v.productos.forEach(({ productoId, cantidad }) => {
        map[productoId] = (map[productoId] || 0) + cantidad
      })
    })
    return Object.entries(map)
      .map(([id, cantidad]) => ({
        nombre: productos.find(p => p.id === +id)?.nombre || '?',
        cantidad
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [ventas, productos])

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-dark-300 text-sm mt-1">Resumen general del negocio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Ventas Totales"
          value={`$${stats.totalVentas.toLocaleString('es-CO')}`}
          sub={`${ventas.length} transacciones`}
          trend={12}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          label="Productos Activos"
          value={stats.productosActivos}
          sub={`${stats.sinStock} sin stock`}
          trend={5}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
          label="Categorías"
          value={categorias.filter(c => c.activo).length}
          sub="categorías activas"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          label="Usuarios Activos"
          value={stats.usuariosActivos}
          sub="de la plataforma"
          trend={0}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Ventas mensuales */}
        <div className="xl:col-span-2 card-dark">
          <h3 className="font-semibold text-white mb-6">Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={VENTAS_MENSUALES} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="mes" tick={{ fill: '#9e9e9e', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9e9e9e', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#d4af37" strokeWidth={2.5}
                fill="url(#goldArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por categoría */}
        <div className="card-dark">
          <h3 className="font-semibold text-white mb-6">Por Categoría</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={ventasPorCategoria} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value">
                {ventasPorCategoria.map((_, i) => (
                  <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ color: '#9e9e9e', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top productos */}
        <div className="card-dark">
          <h3 className="font-semibold text-white mb-6">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProductos} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#9e9e9e', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="nombre" type="category" tick={{ fill: '#9e9e9e', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cantidad" name="Unidades" radius={[0, 4, 4, 0]}>
                {topProductos.map((_, i) => <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transacciones mensuales */}
        <div className="card-dark">
          <h3 className="font-semibold text-white mb-6">Transacciones Mensuales</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VENTAS_MENSUALES} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="mes" tick={{ fill: '#9e9e9e', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9e9e9e', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="transacciones" name="Transacciones" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
