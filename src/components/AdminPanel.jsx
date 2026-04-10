
import { useEffect, useMemo, useState } from "react"

function uid(prefijo = "id") {
  return `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor))
}

function leerArchivoComoBase64(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(archivo)
  })
}

function dinero(valor) {
  return `$${Number(valor || 0).toFixed(2)}`
}

function redondear(valor) {
  return Number(Number(valor || 0).toFixed(2))
}

function precioAppDesdeBase(precioBase) {
  return redondear(Number(precioBase || 0) * 1.06)
}

function precioBaseDesdeApp(precioApp) {
  return redondear(Number(precioApp || 0) / 1.06)
}

function inicioDelDia(fecha = new Date()) {
  const copia = new Date(fecha)
  copia.setHours(0, 0, 0, 0)
  return copia
}

function inicioDeSemana(fecha = new Date()) {
  const copia = inicioDelDia(fecha)
  const dia = copia.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  copia.setDate(copia.getDate() + diff)
  return copia
}

function estaEnRango(fechaIso, inicio, fin = null) {
  const fecha = new Date(fechaIso)
  if (Number.isNaN(fecha.getTime())) return false
  if (fin) return fecha >= inicio && fecha < fin
  return fecha >= inicio
}

function agruparPor(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item)
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {})
}

function crearRestauranteBase() {
  return {
    id: uid("rest"),
    nombre: "",
    descripcion: "",
    telefono: "523319944525",
    horario: { abierto: "09:00", cerrado: "18:00" },
    imagen: "",
    productos: []
  }
}

function crearProductoBase(categoria = "General") {
  return {
    id: uid("prod"),
    categoria,
    nombre: "",
    descripcion: "",
    imagen: "",
    variantes: [
      {
        id: uid("var"),
        nombre: "Única",
        precioBase: 0,
        precio: 0
      }
    ],
    extras: []
  }
}

function crearRepartidorBase() {
  return {
    id: uid("drv"),
    nombre: "",
    telefono: "",
    activo: true
  }
}

function normalizarRestaurante(restaurante) {
  return {
    ...restaurante,
    horario: {
      abierto: restaurante?.horario?.abierto || "09:00",
      cerrado: restaurante?.horario?.cerrado || "18:00"
    },
    productos: Array.isArray(restaurante?.productos)
      ? restaurante.productos.map((producto) => ({
          ...producto,
          categoria: producto?.categoria || "General",
          variantes: Array.isArray(producto?.variantes) && producto.variantes.length > 0
            ? producto.variantes.map((variante) => {
                const precioBase =
                  variante?.precioBase !== undefined && variante?.precioBase !== null
                    ? redondear(variante.precioBase)
                    : redondear(variante?.precio || 0)

                return {
                  ...variante,
                  precioBase,
                  precio: redondear(
                    variante?.precioBase !== undefined && variante?.precioBase !== null
                      ? variante?.precio ?? precioAppDesdeBase(precioBase)
                      : precioAppDesdeBase(precioBase)
                  )
                }
              })
            : [
                {
                  id: uid("var"),
                  nombre: "Única",
                  precioBase: 0,
                  precio: 0
                }
              ],
          extras: Array.isArray(producto?.extras)
            ? producto.extras.map((extra) => {
                const precioBase =
                  extra?.precioBase !== undefined && extra?.precioBase !== null
                    ? redondear(extra.precioBase)
                    : redondear(extra?.precio || 0)

                return {
                  ...extra,
                  precioBase,
                  precio: redondear(
                    extra?.precioBase !== undefined && extra?.precioBase !== null
                      ? extra?.precio ?? precioAppDesdeBase(precioBase)
                      : precioAppDesdeBase(precioBase)
                  )
                }
              })
            : []
        }))
      : []
  }
}

function obtenerCategorias(restaurante) {
  if (!restaurante?.productos) return []
  return [...new Set(restaurante.productos.map((producto) => producto.categoria || "General"))]
}

function tarjetaDato({ titulo, valor, subtitulo, tono = "default" }) {
  return (
    <div style={{ ...styles.metricCard, ...(styles[`metric_${tono}`] || {}) }}>
      <div style={styles.metricLabel}>{titulo}</div>
      <div style={styles.metricValue}>{valor}</div>
      {subtitulo ? <div style={styles.metricHint}>{subtitulo}</div> : null}
    </div>
  )
}

function BarraSimple({ titulo, items, valorFn, etiquetaFn, color = "#22c55e" }) {
  const max = Math.max(...items.map(valorFn), 1)

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{titulo}</div>
      <div style={styles.chartList}>
        {items.length === 0 ? (
          <div style={styles.emptyText}>Sin datos todavía.</div>
        ) : (
          items.map((item, index) => {
            const valor = valorFn(item)
            const ancho = `${Math.max((valor / max) * 100, 6)}%`
            return (
              <div key={`${etiquetaFn(item)}-${index}`} style={styles.chartRow}>
                <div style={styles.chartLabel}>{etiquetaFn(item)}</div>
                <div style={styles.chartTrack}>
                  <div style={{ ...styles.chartBar, width: ancho, background: color }} />
                </div>
                <div style={styles.chartValue}>{dinero(valor)}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function TablaCompacta({ titulo, columnas, filas, empty = "Sin registros." }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{titulo}</div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columnas.map((columna) => (
                <th key={columna.key} style={styles.th}>{columna.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={columnas.length}>{empty}</td>
              </tr>
            ) : (
              filas.map((fila, index) => (
                <tr key={fila.id || index} style={styles.tr}>
                  {columnas.map((columna) => (
                    <td key={columna.key} style={styles.td}>
                      {columna.render ? columna.render(fila) : fila[columna.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminPanel({
  restaurantes,
  pedidos = [],
  repartidores = [],
  onGuardar,
  onGuardarPedidos,
  onGuardarRepartidores,
  onSalirAdmin,
  onRestablecer
}) {
  const [vista, setVista] = useState("dashboard")
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [seleccionId, setSeleccionId] = useState(restaurantes[0]?.id ?? null)
  const [tabEditor, setTabEditor] = useState("general")
  const [borrador, setBorrador] = useState(null)
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroRestaurante, setFiltroRestaurante] = useState("todos")
  const [busquedaPedido, setBusquedaPedido] = useState("")
  const [repartidoresLocal, setRepartidoresLocal] = useState(repartidores)
  const [seleccionPedidoId, setSeleccionPedidoId] = useState(pedidos[0]?.id ?? null)

  useEffect(() => {
    setRepartidoresLocal(repartidores)
  }, [repartidores])

  useEffect(() => {
    if (!mensaje) return
    const timer = setTimeout(() => setMensaje(""), 2600)
    return () => clearTimeout(timer)
  }, [mensaje])

  const restauranteSeleccionado = useMemo(
    () => restaurantes.find((item) => item.id === seleccionId) || null,
    [restaurantes, seleccionId]
  )

  useEffect(() => {
    if (!restauranteSeleccionado) {
      setBorrador(null)
      return
    }

    const normalizado = normalizarRestaurante(clonar(restauranteSeleccionado))
    setBorrador(normalizado)
    setProductoSeleccionadoId(normalizado.productos?.[0]?.id ?? null)
  }, [restauranteSeleccionado])

  const categorias = useMemo(() => obtenerCategorias(borrador), [borrador])

  const productoSeleccionado = useMemo(
    () => borrador?.productos?.find((producto) => producto.id === productoSeleccionadoId) || null,
    [borrador, productoSeleccionadoId]
  )

  const hoy = useMemo(() => inicioDelDia(new Date()), [])
  const manana = useMemo(() => {
    const copia = inicioDelDia(new Date())
    copia.setDate(copia.getDate() + 1)
    return copia
  }, [])
  const semana = useMemo(() => inicioDeSemana(new Date()), [])

  const pedidosHoy = useMemo(
    () => pedidos.filter((pedido) => estaEnRango(pedido.createdAt, hoy, manana)),
    [pedidos, hoy, manana]
  )

  const pedidosSemana = useMemo(
    () => pedidos.filter((pedido) => estaEnRango(pedido.createdAt, semana)),
    [pedidos, semana]
  )

  const metricasHoy = useMemo(() => {
    const venta = pedidosHoy.reduce((acc, pedido) => acc + Number(pedido.totalCustomer || 0), 0)
    const utilidad = pedidosHoy.reduce((acc, pedido) => acc + Number(pedido.platformProfitTotal || 0), 0)
    const pagoRepartidores = pedidosHoy.reduce((acc, pedido) => acc + Number(pedido.driverPayment || 0), 0)
    const pagoRestaurantes = pedidosHoy.reduce((acc, pedido) => acc + Number(pedido.restaurantPayout || 0), 0)
    const ticket = pedidosHoy.length > 0 ? venta / pedidosHoy.length : 0
    return { venta, utilidad, pagoRepartidores, pagoRestaurantes, ticket }
  }, [pedidosHoy])

  const ventasPorRestauranteHoy = useMemo(() => {
    const agrupado = agruparPor(pedidosHoy, (pedido) => pedido.restauranteNombre || "Sin restaurante")
    return Object.entries(agrupado)
      .map(([nombre, lista]) => ({
        nombre,
        venta: lista.reduce((acc, pedido) => acc + Number(pedido.totalCustomer || 0), 0),
        utilidad: lista.reduce((acc, pedido) => acc + Number(pedido.platformProfitTotal || 0), 0),
        pedidos: lista.length
      }))
      .sort((a, b) => b.venta - a.venta)
  }, [pedidosHoy])

  const ventasPorRestauranteSemana = useMemo(() => {
    const agrupado = agruparPor(pedidosSemana, (pedido) => pedido.restauranteNombre || "Sin restaurante")
    return Object.entries(agrupado)
      .map(([nombre, lista]) => ({
        nombre,
        venta: lista.reduce((acc, pedido) => acc + Number(pedido.totalCustomer || 0), 0),
        utilidad: lista.reduce((acc, pedido) => acc + Number(pedido.platformProfitTotal || 0), 0),
        pedidos: lista.length
      }))
      .sort((a, b) => b.venta - a.venta)
  }, [pedidosSemana])

  const ventasPorHoraHoy = useMemo(() => {
    const base = Array.from({ length: 24 }, (_, hour) => ({ hora: `${String(hour).padStart(2, "0")}:00`, venta: 0 }))
    pedidosHoy.forEach((pedido) => {
      const fecha = new Date(pedido.createdAt)
      const hora = fecha.getHours()
      base[hora].venta += Number(pedido.totalCustomer || 0)
    })
    return base.filter((item) => item.venta > 0)
  }, [pedidosHoy])

  const pedidosPorStatusHoy = useMemo(() => {
    const agrupado = agruparPor(pedidosHoy, (pedido) => pedido.status || "nuevo")
    return Object.entries(agrupado).map(([status, lista]) => ({
      status,
      total: lista.length
    }))
  }, [pedidosHoy])

  const topRepartidoresHoy = useMemo(() => {
    const conRepartidor = pedidosHoy.filter((pedido) => pedido.driverNombre)
    const agrupado = agruparPor(conRepartidor, (pedido) => pedido.driverNombre)
    return Object.entries(agrupado)
      .map(([nombre, lista]) => ({
        nombre,
        entregas: lista.filter((pedido) => pedido.status === "entregado").length,
        asignados: lista.length,
        pago: lista.reduce((acc, pedido) => acc + Number(pedido.driverPayment || 0), 0)
      }))
      .sort((a, b) => b.asignados - a.asignados)
  }, [pedidosHoy])

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      const coincideStatus = filtroStatus === "todos" ? true : (pedido.status || "nuevo") === filtroStatus
      const coincideRestaurante = filtroRestaurante === "todos" ? true : (pedido.restaurantId || pedido.restauranteId) === filtroRestaurante
      const texto = `${pedido.folio || ""} ${pedido.restauranteNombre || ""} ${pedido.customer?.nombre || ""} ${pedido.customer?.telefono || ""}`.toLowerCase()
      const coincideBusqueda = busquedaPedido.trim()
        ? texto.includes(busquedaPedido.trim().toLowerCase())
        : true

      return coincideStatus && coincideRestaurante && coincideBusqueda
    })
  }, [pedidos, filtroStatus, filtroRestaurante, busquedaPedido])

  const pedidoSeleccionado = useMemo(
    () => pedidos.find((pedido) => pedido.id === seleccionPedidoId) || pedidosFiltrados[0] || null,
    [pedidos, pedidosFiltrados, seleccionPedidoId]
  )

  useEffect(() => {
    if (!pedidoSeleccionado && pedidosFiltrados[0]) {
      setSeleccionPedidoId(pedidosFiltrados[0].id)
    }
  }, [pedidoSeleccionado, pedidosFiltrados])

  async function guardarRestauranteActual() {
    if (!borrador) return
    if (!borrador.nombre.trim()) {
      alert("El restaurante necesita nombre.")
      return
    }

    setGuardando(true)
    try {
      const siguiente = restaurantes.map((restaurante) =>
        restaurante.id === borrador.id ? clonar(borrador) : restaurante
      )
      await onGuardar(siguiente)
      setMensaje("Restaurante guardado")
    } catch (error) {
      console.error(error)
      alert("No se pudo guardar el restaurante.")
    } finally {
      setGuardando(false)
    }
  }

  async function crearNuevoRestaurante() {
    const nuevo = crearRestauranteBase()
    setGuardando(true)
    try {
      await onGuardar([...restaurantes, nuevo])
      setSeleccionId(nuevo.id)
      setVista("restaurantes")
      setTabEditor("general")
      setMensaje("Restaurante creado")
    } catch (error) {
      console.error(error)
      alert("No se pudo crear el restaurante.")
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarRestauranteActual() {
    if (!borrador) return
    const confirmar = window.confirm(`¿Eliminar "${borrador.nombre || "este restaurante"}"?`)
    if (!confirmar) return

    setGuardando(true)
    try {
      const siguiente = restaurantes.filter((restaurante) => restaurante.id !== borrador.id)
      await onGuardar(siguiente)
      setSeleccionId(siguiente[0]?.id ?? null)
      setMensaje("Restaurante eliminado")
    } catch (error) {
      console.error(error)
      alert("No se pudo eliminar el restaurante.")
    } finally {
      setGuardando(false)
    }
  }

  function actualizarRestaurante(campo, valor) {
    setBorrador((prev) => ({
      ...prev,
      [campo]: valor
    }))
  }

  function actualizarHorario(campo, valor) {
    setBorrador((prev) => ({
      ...prev,
      horario: {
        ...prev.horario,
        [campo]: valor
      }
    }))
  }

  async function subirImagenRestaurante(archivo) {
    if (!archivo) return
    const base64 = await leerArchivoComoBase64(archivo)
    actualizarRestaurante("imagen", base64)
  }

  function agregarProducto() {
    const nuevo = crearProductoBase(categorias[0] || "General")
    setBorrador((prev) => ({
      ...prev,
      productos: [...prev.productos, nuevo]
    }))
    setProductoSeleccionadoId(nuevo.id)
    setTabEditor("productos")
  }

  function actualizarProducto(campo, valor) {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionadoId
          ? { ...producto, [campo]: valor }
          : producto
      )
    }))
  }

  async function subirImagenProducto(archivo) {
    if (!archivo || !productoSeleccionadoId) return
    const base64 = await leerArchivoComoBase64(archivo)
    actualizarProducto("imagen", base64)
  }

  function eliminarProducto() {
    if (!productoSeleccionado) return
    const confirmar = window.confirm(`¿Eliminar "${productoSeleccionado.nombre || "este producto"}"?`)
    if (!confirmar) return

    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.filter((producto) => producto.id !== productoSeleccionado.id)
    }))
    setProductoSeleccionadoId(
      borrador?.productos?.find((producto) => producto.id !== productoSeleccionado.id)?.id ?? null
    )
  }

  function agregarVariante() {
    if (!productoSeleccionado) return
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              variantes: [
                ...producto.variantes,
                {
                  id: uid("var"),
                  nombre: "",
                  precioBase: 0,
                  precio: 0
                }
              ]
            }
          : producto
      )
    }))
  }

  function actualizarVariante(varianteId, campo, valor) {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id !== productoSeleccionado.id
          ? producto
          : {
              ...producto,
              variantes: producto.variantes.map((variante) => {
                if (variante.id !== varianteId) return variante
                if (campo === "precioBase") {
                  const precioBase = redondear(valor)
                  return {
                    ...variante,
                    precioBase,
                    precio: precioAppDesdeBase(precioBase)
                  }
                }
                if (campo === "precio") {
                  const precio = redondear(valor)
                  return {
                    ...variante,
                    precio,
                    precioBase: precioBaseDesdeApp(precio)
                  }
                }
                return { ...variante, [campo]: valor }
              })
            }
      )
    }))
  }

  function eliminarVariante(varianteId) {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              variantes: producto.variantes.filter((variante) => variante.id !== varianteId)
            }
          : producto
      )
    }))
  }

  function agregarExtra() {
    if (!productoSeleccionado) return
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              extras: [
                ...(producto.extras || []),
                {
                  id: uid("ext"),
                  nombre: "",
                  precioBase: 0,
                  precio: 0
                }
              ]
            }
          : producto
      )
    }))
  }

  function actualizarExtra(extraId, campo, valor) {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id !== productoSeleccionado.id
          ? producto
          : {
              ...producto,
              extras: (producto.extras || []).map((extra) => {
                if (extra.id !== extraId) return extra
                if (campo === "precioBase") {
                  const precioBase = redondear(valor)
                  return {
                    ...extra,
                    precioBase,
                    precio: precioAppDesdeBase(precioBase)
                  }
                }
                if (campo === "precio") {
                  const precio = redondear(valor)
                  return {
                    ...extra,
                    precio,
                    precioBase: precioBaseDesdeApp(precio)
                  }
                }
                return { ...extra, [campo]: valor }
              })
            }
      )
    }))
  }

  function eliminarExtra(extraId) {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              extras: (producto.extras || []).filter((extra) => extra.id !== extraId)
            }
          : producto
      )
    }))
  }

  async function guardarPedidoActualizado(pedidoId, cambios) {
    try {
      const siguiente = pedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, ...cambios } : pedido
      )
      await onGuardarPedidos(siguiente)
      setMensaje("Pedido actualizado")
    } catch (error) {
      console.error(error)
      alert("No se pudo actualizar el pedido.")
    }
  }

  async function agregarRepartidor() {
    const nuevo = crearRepartidorBase()
    const siguiente = [...repartidoresLocal, nuevo]
    setRepartidoresLocal(siguiente)
    try {
      await onGuardarRepartidores(siguiente)
      setMensaje("Repartidor creado")
    } catch (error) {
      console.error(error)
      alert("No se pudo crear el repartidor.")
    }
  }

  async function guardarRepartidores() {
    try {
      await onGuardarRepartidores(repartidoresLocal)
      setMensaje("Repartidores guardados")
    } catch (error) {
      console.error(error)
      alert("No se pudieron guardar los repartidores.")
    }
  }

  async function eliminarRepartidor(repartidorId) {
    const enUso = pedidos.some((pedido) => pedido.driverId === repartidorId)
    if (enUso) {
      alert("Ese repartidor ya tiene pedidos asignados. Mejor desactívalo en lugar de eliminarlo.")
      return
    }

    const siguiente = repartidoresLocal.filter((item) => item.id !== repartidorId)
    setRepartidoresLocal(siguiente)
    try {
      await onGuardarRepartidores(siguiente)
      setMensaje("Repartidor eliminado")
    } catch (error) {
      console.error(error)
      alert("No se pudo eliminar el repartidor.")
    }
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "pedidos", label: "Pedidos" },
    { id: "repartidores", label: "Repartidores" },
    { id: "restaurantes", label: "Restaurantes" }
  ]

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Talpa Eats · Centro de mando</div>
            <h1 style={styles.title}>Panel administrativo</h1>
            <p style={styles.subtitle}>
              Dashboard de ventas, utilidad, pedidos y asignación de repartidores.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button style={styles.ghostButton} onClick={onRestablecer}>Restablecer base</button>
            <button style={styles.ghostButton} onClick={onSalirAdmin}>Salir</button>
          </div>
        </div>

        <div style={styles.mainTabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={vista === tab.id ? styles.mainTabActive : styles.mainTab}
              onClick={() => setVista(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mensaje ? <div style={styles.toast}>{mensaje}</div> : null}

        {vista === "dashboard" && (
          <div style={styles.stack16}>
            <div style={styles.gridMetrics}>
              {tarjetaDato({
                titulo: "Pedidos del día",
                valor: pedidosHoy.length,
                subtitulo: `${pedidosSemana.length} en la semana`,
                tono: "cyan"
              })}
              {tarjetaDato({
                titulo: "Venta del día",
                valor: dinero(metricasHoy.venta),
                subtitulo: `Ticket promedio ${dinero(metricasHoy.ticket)}`,
                tono: "green"
              })}
              {tarjetaDato({
                titulo: "Utilidad del día",
                valor: dinero(metricasHoy.utilidad),
                subtitulo: "10% + 6% + $5 de envío",
                tono: "violet"
              })}
              {tarjetaDato({
                titulo: "Pago a repartidores",
                valor: dinero(metricasHoy.pagoRepartidores),
                subtitulo: "$30 por envío asignado",
                tono: "amber"
              })}
              {tarjetaDato({
                titulo: "Pago a restaurantes",
                valor: dinero(metricasHoy.pagoRestaurantes),
                subtitulo: "Base - 10% de comisión",
                tono: "rose"
              })}
              {tarjetaDato({
                titulo: "Pedidos activos",
                valor: pedidos.filter((pedido) => !["entregado", "cancelado"].includes(pedido.status)).length,
                subtitulo: "Pendientes, en preparación o en camino",
                tono: "default"
              })}
            </div>

            <div style={styles.grid2}>
              <BarraSimple
                titulo="Ventas por hora · hoy"
                items={ventasPorHoraHoy}
                valorFn={(item) => item.venta}
                etiquetaFn={(item) => item.hora}
                color="linear-gradient(90deg, #22c55e, #06b6d4)"
              />

              <div style={styles.card}>
                <div style={styles.cardTitle}>Pedidos por estado · hoy</div>
                <div style={styles.badgeGrid}>
                  {pedidosPorStatusHoy.length === 0 ? (
                    <div style={styles.emptyText}>Todavía no hay pedidos hoy.</div>
                  ) : (
                    pedidosPorStatusHoy.map((item) => (
                      <div key={item.status} style={styles.statusCard}>
                        <div style={styles.statusTitle}>{item.status}</div>
                        <div style={styles.statusValue}>{item.total}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div style={styles.grid2}>
              <TablaCompacta
                titulo="Top restaurantes · hoy"
                filas={ventasPorRestauranteHoy}
                columnas={[
                  { key: "nombre", label: "Restaurante" },
                  { key: "pedidos", label: "Pedidos" },
                  { key: "venta", label: "Venta", render: (fila) => dinero(fila.venta) },
                  { key: "utilidad", label: "Tu utilidad", render: (fila) => dinero(fila.utilidad) }
                ]}
                empty="Sin ventas hoy."
              />

              <TablaCompacta
                titulo="Top restaurantes · semana"
                filas={ventasPorRestauranteSemana}
                columnas={[
                  { key: "nombre", label: "Restaurante" },
                  { key: "pedidos", label: "Pedidos" },
                  { key: "venta", label: "Venta", render: (fila) => dinero(fila.venta) },
                  { key: "utilidad", label: "Tu utilidad", render: (fila) => dinero(fila.utilidad) }
                ]}
                empty="Sin ventas esta semana."
              />
            </div>

            <div style={styles.grid2}>
              <TablaCompacta
                titulo="Top repartidores · hoy"
                filas={topRepartidoresHoy}
                columnas={[
                  { key: "nombre", label: "Repartidor" },
                  { key: "asignados", label: "Asignados" },
                  { key: "entregas", label: "Entregados" },
                  { key: "pago", label: "Pago", render: (fila) => dinero(fila.pago) }
                ]}
                empty="Todavía no hay repartidores asignados hoy."
              />

              <TablaCompacta
                titulo="Pedidos recientes"
                filas={pedidos.slice(0, 8)}
                columnas={[
                  { key: "folio", label: "Folio" },
                  { key: "restauranteNombre", label: "Restaurante" },
                  { key: "status", label: "Estado" },
                  { key: "totalCustomer", label: "Total", render: (fila) => dinero(fila.totalCustomer) }
                ]}
                empty="Todavía no hay pedidos."
              />
            </div>
          </div>
        )}

        {vista === "pedidos" && (
          <div style={styles.ordersLayout}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Filtros</div>

              <div style={styles.filterGrid}>
                <input
                  style={styles.input}
                  value={busquedaPedido}
                  onChange={(e) => setBusquedaPedido(e.target.value)}
                  placeholder="Buscar folio, cliente o teléfono"
                />

                <select style={styles.input} value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                  <option value="todos">Todos los estados</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="en_preparacion">En preparación</option>
                  <option value="listo">Listo</option>
                  <option value="asignado">Asignado</option>
                  <option value="en_camino">En camino</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>

                <select style={styles.input} value={filtroRestaurante} onChange={(e) => setFiltroRestaurante(e.target.value)}>
                  <option value="todos">Todos los restaurantes</option>
                  {restaurantes.map((restaurante) => (
                    <option key={restaurante.id} value={restaurante.id}>{restaurante.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={styles.orderList}>
                {pedidosFiltrados.length === 0 ? (
                  <div style={styles.emptyText}>No hay pedidos con esos filtros.</div>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <button
                      key={pedido.id}
                      style={{
                        ...styles.orderCard,
                        ...(pedidoSeleccionado?.id === pedido.id ? styles.orderCardActive : {})
                      }}
                      onClick={() => setSeleccionPedidoId(pedido.id)}
                    >
                      <div style={styles.rowBetween}>
                        <strong>{pedido.folio || pedido.id}</strong>
                        <span style={styles.orderStatus}>{pedido.status || "nuevo"}</span>
                      </div>
                      <div style={styles.orderMuted}>{pedido.restauranteNombre}</div>
                      <div style={styles.orderMuted}>{pedido.customer?.nombre || "Sin cliente"} · {pedido.customer?.telefono || "Sin teléfono"}</div>
                      <div style={styles.rowBetween}>
                        <span style={styles.orderTotal}>{dinero(pedido.totalCustomer)}</span>
                        <span style={styles.orderMuted}>
                          {new Date(pedido.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div style={styles.card}>
              {!pedidoSeleccionado ? (
                <div style={styles.emptyText}>Selecciona un pedido.</div>
              ) : (
                <>
                  <div style={styles.rowBetween}>
                    <div>
                      <div style={styles.cardTitle}>{pedidoSeleccionado.folio || pedidoSeleccionado.id}</div>
                      <div style={styles.smallMuted}>{pedidoSeleccionado.restauranteNombre}</div>
                    </div>
                    <div style={styles.kpiPill}>{pedidoSeleccionado.status || "nuevo"}</div>
                  </div>

                  <div style={styles.detailGrid}>
                    <div style={styles.detailBox}>
                      <div style={styles.detailLabel}>Cliente</div>
                      <div>{pedidoSeleccionado.customer?.nombre || "—"}</div>
                      <div style={styles.smallMuted}>{pedidoSeleccionado.customer?.telefono || "—"}</div>
                    </div>

                    <div style={styles.detailBox}>
                      <div style={styles.detailLabel}>Entrega</div>
                      <div>{pedidoSeleccionado.customer?.tipoEntrega === "recoger" ? "Recoger en local" : "A domicilio"}</div>
                      <div style={styles.smallMuted}>{pedidoSeleccionado.customer?.direccion || "Sin dirección"}</div>
                    </div>

                    <div style={styles.detailBox}>
                      <div style={styles.detailLabel}>Pago</div>
                      <div>{pedidoSeleccionado.customer?.metodoPago || "—"}</div>
                      <div style={styles.smallMuted}>
                        {pedidoSeleccionado.customer?.efectivoCon ? `Pagan con ${pedidoSeleccionado.customer.efectivoCon}` : "—"}
                      </div>
                    </div>

                    <div style={styles.detailBox}>
                      <div style={styles.detailLabel}>Repartidor</div>
                      <select
                        style={styles.input}
                        value={pedidoSeleccionado.driverId || ""}
                        onChange={(e) => {
                          const driverId = e.target.value
                          const driver = repartidores.find((item) => item.id === driverId) || null
                          guardarPedidoActualizado(pedidoSeleccionado.id, {
                            driverId,
                            driverNombre: driver?.nombre || "",
                            status: driverId && (pedidoSeleccionado.status === "nuevo" || pedidoSeleccionado.status === "listo")
                              ? "asignado"
                              : pedidoSeleccionado.status
                          })
                        }}
                      >
                        <option value="">Sin asignar</option>
                        {repartidores.filter((item) => item.activo !== false).map((repartidor) => (
                          <option key={repartidor.id} value={repartidor.id}>{repartidor.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <div style={styles.detailLabel}>Productos</div>
                    <div style={styles.stack12}>
                      {(pedidoSeleccionado.items || []).map((item) => (
                        <div key={item.id} style={styles.productLine}>
                          <div>
                            <strong>{item.nombre}</strong>
                            <div style={styles.smallMuted}>
                              Base {dinero(item.precioBase)} · App {dinero(item.precioApp)}
                            </div>
                          </div>
                          <div style={styles.alignRight}>
                            <div>x{item.quantity}</div>
                            <strong>{dinero(item.totalApp)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.summaryBox}>
                    <div style={styles.summaryRow}><span>Subtotal base</span><strong>{dinero(pedidoSeleccionado.subtotalBase)}</strong></div>
                    <div style={styles.summaryRow}><span>Subtotal app</span><strong>{dinero(pedidoSeleccionado.subtotalApp)}</strong></div>
                    <div style={styles.summaryRow}><span>Tu 10%</span><strong>{dinero(pedidoSeleccionado.platformCommission10)}</strong></div>
                    <div style={styles.summaryRow}><span>Tu 6%</span><strong>{dinero(pedidoSeleccionado.platformMarkup6)}</strong></div>
                    <div style={styles.summaryRow}><span>Envío cobrado</span><strong>{dinero(pedidoSeleccionado.deliveryFeeCharged)}</strong></div>
                    <div style={styles.summaryRow}><span>Pago repartidor</span><strong>{dinero(pedidoSeleccionado.driverPayment)}</strong></div>
                    <div style={styles.summaryRow}><span>Pago restaurante</span><strong>{dinero(pedidoSeleccionado.restaurantPayout)}</strong></div>
                    <div style={styles.summaryRowFinal}><span>Tu utilidad total</span><strong>{dinero(pedidoSeleccionado.platformProfitTotal)}</strong></div>
                  </div>

                  <div style={styles.statusActions}>
                    {["nuevo", "confirmado", "en_preparacion", "listo", "asignado", "en_camino", "entregado", "cancelado"].map((status) => (
                      <button
                        key={status}
                        style={pedidoSeleccionado.status === status ? styles.statusActionActive : styles.statusAction}
                        onClick={() => guardarPedidoActualizado(pedidoSeleccionado.id, { status })}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {vista === "repartidores" && (
          <div style={styles.stack16}>
            <div style={styles.rowBetween}>
              <div>
                <div style={styles.cardTitle}>Repartidores</div>
                <div style={styles.smallMuted}>Cada pedido asignado considera $30 para el repartidor.</div>
              </div>
              <div style={styles.rowButtons}>
                <button style={styles.secondaryButton} onClick={agregarRepartidor}>+ Repartidor</button>
                <button style={styles.primaryButton} onClick={guardarRepartidores}>Guardar repartidores</button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.stack12}>
                {repartidoresLocal.length === 0 ? (
                  <div style={styles.emptyText}>Todavía no has creado repartidores.</div>
                ) : (
                  repartidoresLocal.map((repartidor) => (
                    <div key={repartidor.id} style={styles.driverRow}>
                      <input
                        style={styles.input}
                        value={repartidor.nombre}
                        placeholder="Nombre"
                        onChange={(e) =>
                          setRepartidoresLocal((prev) =>
                            prev.map((item) =>
                              item.id === repartidor.id ? { ...item, nombre: e.target.value } : item
                            )
                          )
                        }
                      />
                      <input
                        style={styles.input}
                        value={repartidor.telefono}
                        placeholder="Teléfono"
                        onChange={(e) =>
                          setRepartidoresLocal((prev) =>
                            prev.map((item) =>
                              item.id === repartidor.id ? { ...item, telefono: e.target.value } : item
                            )
                          )
                        }
                      />
                      <select
                        style={styles.input}
                        value={repartidor.activo === false ? "no" : "si"}
                        onChange={(e) =>
                          setRepartidoresLocal((prev) =>
                            prev.map((item) =>
                              item.id === repartidor.id
                                ? { ...item, activo: e.target.value === "si" }
                                : item
                            )
                          )
                        }
                      >
                        <option value="si">Activo</option>
                        <option value="no">Inactivo</option>
                      </select>
                      <button style={styles.dangerButton} onClick={() => eliminarRepartidor(repartidor.id)}>
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {vista === "restaurantes" && (
          <div style={styles.editorLayout}>
            <aside style={styles.sidebar}>
              <button style={styles.primaryButton} onClick={crearNuevoRestaurante} disabled={guardando}>
                + Nuevo restaurante
              </button>

              <div style={styles.sidebarList}>
                {restaurantes.map((restaurante) => (
                  <button
                    key={restaurante.id}
                    style={{
                      ...styles.sidebarItem,
                      ...(seleccionId === restaurante.id ? styles.sidebarItemActive : {})
                    }}
                    onClick={() => setSeleccionId(restaurante.id)}
                  >
                    <strong>{restaurante.nombre || "Sin nombre"}</strong>
                    <span style={styles.smallMuted}>{restaurante.productos?.length || 0} productos</span>
                  </button>
                ))}
              </div>
            </aside>

            <main style={styles.main}>
              {!borrador ? (
                <div style={styles.card}>Selecciona un restaurante.</div>
              ) : (
                <>
                  <div style={styles.rowBetween}>
                    <div style={styles.subTabs}>
                      <button style={tabEditor === "general" ? styles.subTabActive : styles.subTab} onClick={() => setTabEditor("general")}>General</button>
                      <button style={tabEditor === "productos" ? styles.subTabActive : styles.subTab} onClick={() => setTabEditor("productos")}>Productos</button>
                    </div>

                    <div style={styles.rowButtons}>
                      <button style={styles.ghostButton} onClick={eliminarRestauranteActual}>Eliminar</button>
                      <button style={styles.primaryButton} onClick={guardarRestauranteActual} disabled={guardando}>
                        {guardando ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </div>

                  {tabEditor === "general" && (
                    <div style={styles.card}>
                      <div style={styles.formGrid}>
                        <div>
                          <label style={styles.label}>Nombre</label>
                          <input style={styles.input} value={borrador.nombre} onChange={(e) => actualizarRestaurante("nombre", e.target.value)} />
                        </div>
                        <div>
                          <label style={styles.label}>Teléfono</label>
                          <input style={styles.input} value={borrador.telefono} onChange={(e) => actualizarRestaurante("telefono", e.target.value)} />
                        </div>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <label style={styles.label}>Descripción</label>
                        <textarea style={styles.textarea} value={borrador.descripcion} onChange={(e) => actualizarRestaurante("descripcion", e.target.value)} />
                      </div>

                      <div style={styles.formGrid}>
                        <div>
                          <label style={styles.label}>Abre</label>
                          <input type="time" style={styles.input} value={borrador.horario?.abierto || ""} onChange={(e) => actualizarHorario("abierto", e.target.value)} />
                        </div>
                        <div>
                          <label style={styles.label}>Cierra</label>
                          <input type="time" style={styles.input} value={borrador.horario?.cerrado || ""} onChange={(e) => actualizarHorario("cerrado", e.target.value)} />
                        </div>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <label style={styles.label}>Imagen</label>
                        <input type="file" accept="image/*" onChange={(e) => subirImagenRestaurante(e.target.files?.[0])} />
                        {borrador.imagen ? <img src={borrador.imagen} alt={borrador.nombre} style={styles.preview} /> : null}
                      </div>
                    </div>
                  )}

                  {tabEditor === "productos" && (
                    <div style={styles.productsLayout}>
                      <div style={styles.card}>
                        <div style={styles.rowBetween}>
                          <div style={styles.cardTitle}>Productos</div>
                          <button style={styles.secondaryButton} onClick={agregarProducto}>+ Producto</button>
                        </div>

                        <div style={styles.sidebarList}>
                          {(borrador.productos || []).map((producto) => (
                            <button
                              key={producto.id}
                              style={{
                                ...styles.sidebarItem,
                                ...(productoSeleccionadoId === producto.id ? styles.sidebarItemActive : {})
                              }}
                              onClick={() => setProductoSeleccionadoId(producto.id)}
                            >
                              <strong>{producto.nombre || "Producto sin nombre"}</strong>
                              <span style={styles.smallMuted}>{producto.categoria || "General"}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={styles.card}>
                        {!productoSeleccionado ? (
                          <div style={styles.emptyText}>Selecciona un producto.</div>
                        ) : (
                          <>
                            <div style={styles.rowBetween}>
                              <div>
                                <div style={styles.cardTitle}>Editar producto</div>
                                <div style={styles.smallMuted}>El precio base es del restaurante. El precio app ya incluye el 6% disfrazado.</div>
                              </div>
                              <button style={styles.dangerButton} onClick={eliminarProducto}>Eliminar</button>
                            </div>

                            <div style={{ marginTop: 16 }}>
                              <label style={styles.label}>Nombre</label>
                              <input style={styles.input} value={productoSeleccionado.nombre} onChange={(e) => actualizarProducto("nombre", e.target.value)} />
                            </div>

                            <div style={{ marginTop: 16 }}>
                              <label style={styles.label}>Descripción</label>
                              <textarea style={styles.textarea} value={productoSeleccionado.descripcion} onChange={(e) => actualizarProducto("descripcion", e.target.value)} />
                            </div>

                            <div style={styles.formGrid}>
                              <div>
                                <label style={styles.label}>Categoría</label>
                                <input
                                  style={styles.input}
                                  list="categorias-disponibles"
                                  value={productoSeleccionado.categoria || "General"}
                                  onChange={(e) => actualizarProducto("categoria", e.target.value)}
                                />
                                <datalist id="categorias-disponibles">
                                  {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria} />
                                  ))}
                                </datalist>
                              </div>

                              <div>
                                <label style={styles.label}>Imagen</label>
                                <input type="file" accept="image/*" onChange={(e) => subirImagenProducto(e.target.files?.[0])} />
                              </div>
                            </div>

                            {productoSeleccionado.imagen ? <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} style={styles.previewSmall} /> : null}

                            <div style={{ marginTop: 24 }}>
                              <div style={styles.rowBetween}>
                                <div style={styles.cardTitle}>Variantes</div>
                                <button style={styles.secondaryButton} onClick={agregarVariante}>+ Variante</button>
                              </div>

                              <div style={styles.stack12}>
                                {productoSeleccionado.variantes.map((variante) => (
                                  <div key={variante.id} style={styles.priceRow}>
                                    <input
                                      style={styles.input}
                                      value={variante.nombre}
                                      placeholder="Nombre"
                                      onChange={(e) => actualizarVariante(variante.id, "nombre", e.target.value)}
                                    />
                                    <input
                                      style={styles.input}
                                      type="number"
                                      value={variante.precioBase}
                                      placeholder="Precio base"
                                      onChange={(e) => actualizarVariante(variante.id, "precioBase", e.target.value)}
                                    />
                                    <input
                                      style={{ ...styles.input, ...styles.readonlyInput }}
                                      type="number"
                                      value={variante.precio}
                                      placeholder="Precio app"
                                      readOnly
                                    />
                                    <button style={styles.dangerButton} onClick={() => eliminarVariante(variante.id)}>X</button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div style={{ marginTop: 24 }}>
                              <div style={styles.rowBetween}>
                                <div style={styles.cardTitle}>Extras</div>
                                <button style={styles.secondaryButton} onClick={agregarExtra}>+ Extra</button>
                              </div>

                              <div style={styles.stack12}>
                                {(productoSeleccionado.extras || []).map((extra) => (
                                  <div key={extra.id} style={styles.priceRow}>
                                    <input
                                      style={styles.input}
                                      value={extra.nombre}
                                      placeholder="Nombre"
                                      onChange={(e) => actualizarExtra(extra.id, "nombre", e.target.value)}
                                    />
                                    <input
                                      style={styles.input}
                                      type="number"
                                      value={extra.precioBase}
                                      placeholder="Precio base"
                                      onChange={(e) => actualizarExtra(extra.id, "precioBase", e.target.value)}
                                    />
                                    <input
                                      style={{ ...styles.input, ...styles.readonlyInput }}
                                      type="number"
                                      value={extra.precio}
                                      placeholder="Precio app"
                                      readOnly
                                    />
                                    <button style={styles.dangerButton} onClick={() => eliminarExtra(extra.id)}>X</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #07111f 0%, #0b172a 60%, #101828 100%)",
    color: "#f8fafc",
    padding: 24
  },
  container: {
    maxWidth: 1500,
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 20,
    flexWrap: "wrap"
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#67e8f9",
    marginBottom: 8
  },
  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 800
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    maxWidth: 700
  },
  headerActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap"
  },
  mainTabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18
  },
  mainTab: {
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(15, 23, 42, 0.8)",
    color: "#cbd5e1",
    padding: "12px 16px",
    borderRadius: 14,
    cursor: "pointer"
  },
  mainTabActive: {
    border: "1px solid rgba(34, 211, 238, 0.4)",
    background: "linear-gradient(135deg, rgba(8,145,178,0.28), rgba(14,165,233,0.18))",
    color: "#f8fafc",
    padding: "12px 16px",
    borderRadius: 14,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(14, 165, 233, 0.12)"
  },
  toast: {
    background: "rgba(16, 185, 129, 0.16)",
    border: "1px solid rgba(16, 185, 129, 0.28)",
    color: "#d1fae5",
    padding: "12px 14px",
    borderRadius: 14,
    marginBottom: 18
  },
  gridMetrics: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14
  },
  metricCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 18px 40px rgba(2, 6, 23, 0.24)"
  },
  metric_default: {},
  metric_green: {
    border: "1px solid rgba(34, 197, 94, 0.22)"
  },
  metric_cyan: {
    border: "1px solid rgba(34, 211, 238, 0.22)"
  },
  metric_violet: {
    border: "1px solid rgba(168, 85, 247, 0.22)"
  },
  metric_amber: {
    border: "1px solid rgba(245, 158, 11, 0.22)"
  },
  metric_rose: {
    border: "1px solid rgba(251, 113, 133, 0.22)"
  },
  metricLabel: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 8
  },
  metricValue: {
    fontSize: 30,
    fontWeight: 800
  },
  metricHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#67e8f9"
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 16
  },
  card: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 24,
    padding: 18,
    boxShadow: "0 18px 40px rgba(2, 6, 23, 0.22)"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14
  },
  chartList: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "92px 1fr 100px",
    gap: 10,
    alignItems: "center"
  },
  chartLabel: {
    color: "#cbd5e1",
    fontSize: 13
  },
  chartTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    background: "rgba(148, 163, 184, 0.14)"
  },
  chartBar: {
    height: "100%",
    borderRadius: 999,
    background: "#22c55e"
  },
  chartValue: {
    textAlign: "right",
    color: "#e2e8f0",
    fontWeight: 600
  },
  badgeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 12
  },
  statusCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(30, 41, 59, 0.86)",
    border: "1px solid rgba(148, 163, 184, 0.16)"
  },
  statusTitle: {
    textTransform: "capitalize",
    color: "#94a3b8",
    fontSize: 12
  },
  statusValue: {
    fontSize: 26,
    fontWeight: 800,
    marginTop: 8
  },
  tableWrap: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    textAlign: "left",
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: 12,
    padding: "0 0 12px"
  },
  tr: {
    borderTop: "1px solid rgba(148, 163, 184, 0.14)"
  },
  td: {
    padding: "12px 0",
    color: "#e2e8f0"
  },
  tdEmpty: {
    padding: "16px 0",
    color: "#94a3b8"
  },
  emptyText: {
    color: "#94a3b8"
  },
  stack16: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  stack12: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap"
  },
  rowButtons: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
    color: "#03111d",
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer"
  },
  secondaryButton: {
    border: "1px solid rgba(34, 211, 238, 0.28)",
    background: "rgba(8, 47, 73, 0.45)",
    color: "#cffafe",
    padding: "12px 16px",
    borderRadius: 14,
    cursor: "pointer"
  },
  ghostButton: {
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.85)",
    color: "#e2e8f0",
    padding: "12px 16px",
    borderRadius: 14,
    cursor: "pointer"
  },
  dangerButton: {
    border: "1px solid rgba(251, 113, 133, 0.28)",
    background: "rgba(127, 29, 29, 0.35)",
    color: "#fecdd3",
    padding: "10px 14px",
    borderRadius: 14,
    cursor: "pointer"
  },
  ordersLayout: {
    display: "grid",
    gridTemplateColumns: "420px minmax(0, 1fr)",
    gap: 16
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginBottom: 16
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#f8fafc",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 14,
    padding: "12px 14px",
    outline: "none"
  },
  readonlyInput: {
    opacity: 0.85,
    background: "rgba(30, 41, 59, 0.9)"
  },
  textarea: {
    width: "100%",
    minHeight: 92,
    boxSizing: "border-box",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#f8fafc",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 14,
    padding: "12px 14px",
    outline: "none"
  },
  label: {
    display: "block",
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 8
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxHeight: "70vh",
    overflowY: "auto"
  },
  orderCard: {
    textAlign: "left",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background: "rgba(15, 23, 42, 0.86)",
    color: "#f8fafc",
    borderRadius: 18,
    padding: 14,
    cursor: "pointer"
  },
  orderCardActive: {
    border: "1px solid rgba(34, 211, 238, 0.38)",
    boxShadow: "0 14px 30px rgba(14, 165, 233, 0.12)"
  },
  orderMuted: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 6
  },
  orderStatus: {
    textTransform: "capitalize",
    color: "#67e8f9",
    fontSize: 12
  },
  orderTotal: {
    fontWeight: 800
  },
  kpiPill: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(34, 211, 238, 0.12)",
    color: "#67e8f9",
    textTransform: "capitalize",
    fontSize: 13
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16
  },
  detailBox: {
    borderRadius: 18,
    padding: 14,
    background: "rgba(30, 41, 59, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.16)"
  },
  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  smallMuted: {
    color: "#94a3b8",
    fontSize: 12
  },
  productLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    background: "rgba(30, 41, 59, 0.52)"
  },
  alignRight: {
    textAlign: "right"
  },
  summaryBox: {
    marginTop: 16,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.88)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    padding: 14
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "#cbd5e1"
  },
  summaryRowFinal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0 4px",
    color: "#f8fafc",
    fontWeight: 800,
    borderTop: "1px solid rgba(148, 163, 184, 0.14)",
    marginTop: 8
  },
  statusActions: {
    marginTop: 16,
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  },
  statusAction: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.85)",
    color: "#e2e8f0",
    padding: "10px 12px",
    borderRadius: 999,
    cursor: "pointer",
    textTransform: "capitalize"
  },
  statusActionActive: {
    border: "1px solid rgba(34, 211, 238, 0.28)",
    background: "rgba(8, 145, 178, 0.22)",
    color: "#67e8f9",
    padding: "10px 12px",
    borderRadius: 999,
    cursor: "pointer",
    textTransform: "capitalize"
  },
  driverRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 0.8fr auto",
    gap: 12,
    alignItems: "center"
  },
  editorLayout: {
    display: "grid",
    gridTemplateColumns: "320px minmax(0, 1fr)",
    gap: 16
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  sidebarList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: "76vh",
    overflowY: "auto"
  },
  sidebarItem: {
    textAlign: "left",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#f8fafc",
    borderRadius: 18,
    padding: 14,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  sidebarItemActive: {
    border: "1px solid rgba(34, 211, 238, 0.35)",
    boxShadow: "0 14px 30px rgba(14, 165, 233, 0.12)"
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  subTabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  },
  subTab: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.88)",
    color: "#cbd5e1",
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer"
  },
  subTabActive: {
    border: "1px solid rgba(34, 211, 238, 0.3)",
    background: "rgba(8, 145, 178, 0.2)",
    color: "#67e8f9",
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginTop: 16
  },
  preview: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 18,
    objectFit: "cover",
    marginTop: 12
  },
  previewSmall: {
    width: 180,
    height: 120,
    borderRadius: 16,
    objectFit: "cover",
    marginTop: 12
  },
  productsLayout: {
    display: "grid",
    gridTemplateColumns: "320px minmax(0, 1fr)",
    gap: 16
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr 1fr auto",
    gap: 10,
    alignItems: "center"
  }
}
