
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

function crearRestauranteBase() {
  return {
    id: uid("rest"),
    nombre: "",
    descripcion: "",
    telefono: "523319944525",
    horario: {
      abierto: "09:00",
      cerrado: "18:00"
    },
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
        precio: 0
      }
    ],
    extras: []
  }
}

function obtenerCategorias(restaurante) {
  if (!restaurante?.productos) return []
  return [...new Set(restaurante.productos.map((producto) => producto.categoria || "General"))]
}

export default function AdminPanel({
  restaurantes,
  onGuardar,
  onSalirAdmin,
  onRestablecer
}) {
  const [seleccionId, setSeleccionId] = useState(restaurantes[0]?.id ?? null)
  const [borrador, setBorrador] = useState(null)
  const [tab, setTab] = useState("general")
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null)
  const [mensaje, setMensaje] = useState("")

  const restauranteSeleccionado = useMemo(
    () => restaurantes.find((restaurante) => restaurante.id === seleccionId) || null,
    [restaurantes, seleccionId]
  )

  const categorias = useMemo(
    () => obtenerCategorias(borrador),
    [borrador]
  )

  const productoSeleccionado = useMemo(
    () => borrador?.productos?.find((producto) => producto.id === productoSeleccionadoId) || null,
    [borrador, productoSeleccionadoId]
  )

  useEffect(() => {
    if (!restauranteSeleccionado) {
      setBorrador(null)
      return
    }

    setBorrador(clonar(restauranteSeleccionado))
    setProductoSeleccionadoId(restauranteSeleccionado.productos?.[0]?.id ?? null)
  }, [restauranteSeleccionado])

  useEffect(() => {
    if (!mensaje) return
    const timeout = setTimeout(() => setMensaje(""), 2200)
    return () => clearTimeout(timeout)
  }, [mensaje])

  const actualizarRestaurante = (campo, valor) => {
    setBorrador((prev) => ({
      ...prev,
      [campo]: valor
    }))
  }

  const actualizarHorario = (campo, valor) => {
    setBorrador((prev) => ({
      ...prev,
      horario: {
        ...prev.horario,
        [campo]: valor
      }
    }))
  }

  const guardarRestauranteActual = () => {
    if (!borrador) return

    if (!borrador.nombre.trim()) {
      alert("El restaurante necesita nombre.")
      return
    }

    const siguiente = restaurantes.map((restaurante) =>
      restaurante.id === borrador.id ? clonar(borrador) : restaurante
    )

    onGuardar(siguiente)
    setMensaje("Cambios guardados")
  }

  const crearNuevoRestaurante = () => {
    const nuevo = crearRestauranteBase()
    const siguiente = [...restaurantes, nuevo]
    onGuardar(siguiente)
    setSeleccionId(nuevo.id)
    setTab("general")
    setMensaje("Restaurante creado")
  }

  const eliminarRestaurante = () => {
    if (!borrador) return
    const confirmar = window.confirm(`¿Eliminar "${borrador.nombre || "este restaurante"}"?`)
    if (!confirmar) return

    const siguiente = restaurantes.filter((restaurante) => restaurante.id !== borrador.id)
    onGuardar(siguiente)
    setSeleccionId(siguiente[0]?.id ?? null)
    setMensaje("Restaurante eliminado")
  }

  const subirImagenRestaurante = async (archivo) => {
    if (!archivo) return
    const base64 = await leerArchivoComoBase64(archivo)
    actualizarRestaurante("imagen", base64)
  }

  const agregarProducto = () => {
    const categoriaInicial = categorias[0] || "General"
    const nuevo = crearProductoBase(categoriaInicial)
    setBorrador((prev) => ({
      ...prev,
      productos: [...prev.productos, nuevo]
    }))
    setProductoSeleccionadoId(nuevo.id)
    setTab("productos")
  }

  const eliminarProducto = () => {
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

  const actualizarProducto = (campo, valor) => {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionadoId
          ? { ...producto, [campo]: valor }
          : producto
      )
    }))
  }

  const subirImagenProducto = async (archivo) => {
    if (!archivo || !productoSeleccionadoId) return
    const base64 = await leerArchivoComoBase64(archivo)
    actualizarProducto("imagen", base64)
  }

  const agregarCategoria = () => {
    if (!borrador) return
    const nombre = window.prompt("Nombre de la nueva categoría")
    if (!nombre?.trim()) return

    const categoriaNueva = nombre.trim()
    if (categorias.includes(categoriaNueva)) {
      alert("Esa categoría ya existe.")
      return
    }

    const productoDummy = crearProductoBase(categoriaNueva)
    productoDummy.nombre = ""
    productoDummy.descripcion = ""
    productoDummy.variantes = [{ id: uid("var"), nombre: "Única", precio: 0 }]
    setBorrador((prev) => ({
      ...prev,
      productos: [
        ...prev.productos,
        {
          ...productoDummy,
          id: uid("cat"),
          nombre: "__categoria_oculta__",
          descripcion: "__categoria_oculta__",
          imagen: "",
          variantes: [{ id: uid("var"), nombre: "__oculta__", precio: 0 }],
          extras: []
        }
      ]
    }))
    setMensaje("Categoría creada")
  }

  const obtenerProductosVisibles = (productos = []) =>
    productos.filter((producto) => producto.nombre !== "__categoria_oculta__")

  const categoriasVisibles = useMemo(() => {
    if (!borrador) return []
    const productos = obtenerProductosVisibles(borrador.productos)
    return [...new Set(productos.map((producto) => producto.categoria || "General"))]
  }, [borrador])

  const renombrarCategoria = (categoriaActual) => {
    const nuevoNombre = window.prompt("Nuevo nombre de la categoría", categoriaActual)
    if (!nuevoNombre?.trim()) return

    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.categoria === categoriaActual
          ? { ...producto, categoria: nuevoNombre.trim() }
          : producto
      )
    }))
  }

  const eliminarCategoria = (categoriaActual) => {
    const visiblesEnCategoria = obtenerProductosVisibles(borrador?.productos || []).filter(
      (producto) => (producto.categoria || "General") === categoriaActual
    )

    if (visiblesEnCategoria.length > 0) {
      alert("Primero elimina o cambia de categoría esos productos.")
      return
    }

    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.filter(
        (producto) => (producto.categoria || "General") !== categoriaActual
      )
    }))
  }

  const agregarVariante = () => {
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
                  precio: 0
                }
              ]
            }
          : producto
      )
    }))
  }

  const actualizarVariante = (varianteId, campo, valor) => {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              variantes: producto.variantes.map((variante) =>
                variante.id === varianteId
                  ? {
                      ...variante,
                      [campo]: campo === "precio" ? Number(valor) : valor
                    }
                  : variante
              )
            }
          : producto
      )
    }))
  }

  const eliminarVariante = (varianteId) => {
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

  const agregarExtra = () => {
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
                  precio: 0
                }
              ]
            }
          : producto
      )
    }))
  }

  const actualizarExtra = (extraId, campo, valor) => {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              extras: (producto.extras || []).map((extra) =>
                extra.id === extraId
                  ? {
                      ...extra,
                      [campo]: campo === "precio" ? Number(valor) : valor
                    }
                  : extra
              )
            }
          : producto
      )
    }))
  }

  const eliminarExtra = (extraId) => {
    setBorrador((prev) => ({
      ...prev,
      productos: prev.products?.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              extras: (producto.extras || []).filter((extra) => extra.id !== extraId)
            }
          : producto
      ) || prev.productos.map((producto) =>
        producto.id === productoSeleccionado.id
          ? {
              ...producto,
              extras: (producto.extras || []).filter((extra) => extra.id !== extraId)
            }
          : producto
      )
    }))
  }

  const productosVisibles = obtenerProductosVisibles(borrador?.productos || [])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Administrador Talpa Eats</h1>
            <p style={styles.subtitle}>El diseño público no se toca. Aquí administras restaurantes, categorías, productos, precios, variantes y extras.</p>
          </div>
          <div style={styles.topActions}>
            <button style={styles.secondaryBtn} onClick={onRestablecer}>Restablecer base</button>
            <button style={styles.secondaryBtn} onClick={onSalirAdmin}>Salir admin</button>
            <button style={styles.primaryBtn} onClick={guardarRestauranteActual}>Guardar cambios</button>
          </div>
        </div>

        {mensaje ? <div style={styles.toast}>{mensaje}</div> : null}

        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <button style={{ ...styles.primaryBtn, width: "100%" }} onClick={crearNuevoRestaurante}>
              + Nuevo restaurante
            </button>

            <div style={styles.restaurantList}>
              {restaurantes.map((restaurante) => (
                <button
                  key={restaurante.id}
                  style={{
                    ...styles.restaurantItem,
                    ...(seleccionId === restaurante.id ? styles.restaurantItemActive : {})
                  }}
                  onClick={() => setSeleccionId(restaurante.id)}
                >
                  <strong>{restaurante.nombre || "Sin nombre"}</strong>
                  <span style={styles.smallMuted}>{obtenerProductosVisibles(restaurante.productos || []).length} productos</span>
                </button>
              ))}
            </div>
          </aside>

          <main style={styles.main}>
            {!borrador ? (
              <div style={styles.card}>Selecciona un restaurante.</div>
            ) : (
              <>
                <div style={styles.tabBar}>
                  <button style={tab === "general" ? styles.tabActive : styles.tabBtn} onClick={() => setTab("general")}>General</button>
                  <button style={tab === "categorias" ? styles.tabActive : styles.tabBtn} onClick={() => setTab("categorias")}>Categorías</button>
                  <button style={tab === "productos" ? styles.tabActive : styles.tabBtn} onClick={() => setTab("productos")}>Productos</button>
                </div>

                {tab === "general" && (
                  <div style={styles.card}>
                    <div style={styles.grid2}>
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

                    <div style={{ ...styles.grid2, marginTop: 16 }}>
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
                      <label style={styles.label}>Foto del restaurante</label>
                      <input type="file" accept="image/*" onChange={(e) => subirImagenRestaurante(e.target.files?.[0])} />
                      {borrador.imagen ? <img src={borrador.imagen} alt={borrador.nombre} style={styles.preview} /> : null}
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <button style={styles.dangerBtn} onClick={eliminarRestaurante}>Eliminar restaurante</button>
                    </div>
                  </div>
                )}

                {tab === "categorias" && (
                  <div style={styles.card}>
                    <div style={styles.rowBetween}>
                      <h3 style={styles.sectionTitle}>Categorías</h3>
                      <button style={styles.primaryBtn} onClick={agregarCategoria}>+ Agregar categoría</button>
                    </div>

                    <div style={styles.simpleList}>
                      {categoriasVisibles.map((categoria) => (
                        <div key={categoria} style={styles.simpleRow}>
                          <strong>{categoria}</strong>
                          <div style={styles.rowButtons}>
                            <button style={styles.secondaryBtn} onClick={() => renombrarCategoria(categoria)}>Editar</button>
                            <button style={styles.dangerBtnSmall} onClick={() => eliminarCategoria(categoria)}>Eliminar</button>
                          </div>
                        </div>
                      ))}

                      {categoriasVisibles.length === 0 && (
                        <p style={styles.smallMuted}>Aún no hay categorías.</p>
                      )}
                    </div>
                  </div>
                )}

                {tab === "productos" && (
                  <div style={styles.productsLayout}>
                    <div style={styles.card}>
                      <div style={styles.rowBetween}>
                        <h3 style={styles.sectionTitle}>Productos</h3>
                        <button style={styles.primaryBtn} onClick={agregarProducto}>+ Agregar producto</button>
                      </div>

                      <div style={styles.restaurantList}>
                        {productosVisibles.map((producto) => (
                          <button
                            key={producto.id}
                            style={{
                              ...styles.restaurantItem,
                              ...(productoSeleccionadoId === producto.id ? styles.restaurantItemActive : {})
                            }}
                            onClick={() => setProductoSeleccionadoId(producto.id)}
                          >
                            <strong>{producto.nombre || "Producto sin nombre"}</strong>
                            <span style={styles.smallMuted}>{producto.categoria || "General"}</span>
                          </button>
                        ))}

                        {productosVisibles.length === 0 && (
                          <p style={styles.smallMuted}>Aún no hay productos.</p>
                        )}
                      </div>
                    </div>

                    <div style={styles.card}>
                      {!productoSeleccionado ? (
                        <p style={styles.smallMuted}>Selecciona un producto.</p>
                      ) : (
                        <>
                          <div style={styles.rowBetween}>
                            <h3 style={styles.sectionTitle}>Editar producto</h3>
                            <button style={styles.dangerBtnSmall} onClick={eliminarProducto}>Eliminar</button>
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <label style={styles.label}>Nombre</label>
                            <input style={styles.input} value={productoSeleccionado.nombre} onChange={(e) => actualizarProducto("nombre", e.target.value)} />
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <label style={styles.label}>Descripción</label>
                            <textarea style={styles.textarea} value={productoSeleccionado.descripcion} onChange={(e) => actualizarProducto("descripcion", e.target.value)} />
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <label style={styles.label}>Categoría</label>
                            <select style={styles.input} value={productoSeleccionado.categoria || "General"} onChange={(e) => actualizarProducto("categoria", e.target.value)}>
                              {categoriasVisibles.length === 0 ? <option value="General">General</option> : null}
                              {categoriasVisibles.map((categoria) => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                              ))}
                            </select>
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <label style={styles.label}>Foto del producto</label>
                            <input type="file" accept="image/*" onChange={(e) => subirImagenProducto(e.target.files?.[0])} />
                            {productoSeleccionado.imagen ? <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} style={styles.previewSmall} /> : null}
                          </div>

                          <div style={{ marginTop: 24 }}>
                            <div style={styles.rowBetween}>
                              <h4 style={styles.subTitle}>Variantes</h4>
                              <button style={styles.secondaryBtn} onClick={agregarVariante}>+ Variante</button>
                            </div>

                            <div style={styles.stack}>
                              {productoSeleccionado.variantes.map((variante) => (
                                <div key={variante.id} style={styles.variantRow}>
                                  <input style={styles.input} value={variante.nombre} placeholder="Nombre" onChange={(e) => actualizarVariante(variante.id, "nombre", e.target.value)} />
                                  <input style={styles.input} type="number" value={variante.precio} placeholder="Precio" onChange={(e) => actualizarVariante(variante.id, "precio", e.target.value)} />
                                  <button style={styles.dangerBtnSmall} onClick={() => eliminarVariante(variante.id)}>X</button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ marginTop: 24 }}>
                            <div style={styles.rowBetween}>
                              <h4 style={styles.subTitle}>Extras</h4>
                              <button style={styles.secondaryBtn} onClick={agregarExtra}>+ Extra</button>
                            </div>

                            <div style={styles.stack}>
                              {(productoSeleccionado.extras || []).map((extra) => (
                                <div key={extra.id} style={styles.variantRow}>
                                  <input style={styles.input} value={extra.nombre} placeholder="Nombre" onChange={(e) => actualizarExtra(extra.id, "nombre", e.target.value)} />
                                  <input style={styles.input} type="number" value={extra.precio} placeholder="Precio" onChange={(e) => actualizarExtra(extra.id, "precio", e.target.value)} />
                                  <button style={styles.dangerBtnSmall} onClick={() => eliminarExtra(extra.id)}>X</button>
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
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif"
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18
  },
  title: {
    margin: 0,
    fontSize: 32,
    color: "#102a43"
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#52606d",
    maxWidth: 760,
    lineHeight: 1.45
  },
  topActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 20
  },
  sidebar: {
    background: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: 22,
    padding: 16,
    alignSelf: "start",
    position: "sticky",
    top: 24
  },
  main: {
    minWidth: 0
  },
  card: {
    background: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: 22,
    padding: 18
  },
  restaurantList: {
    display: "grid",
    gap: 10,
    marginTop: 16
  },
  restaurantItem: {
    width: "100%",
    textAlign: "left",
    background: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: 16,
    padding: 12,
    cursor: "pointer",
    display: "grid",
    gap: 4
  },
  restaurantItemActive: {
    borderColor: "#243b53",
    background: "#f0f5fa"
  },
  smallMuted: {
    color: "#52606d",
    fontSize: 13,
    margin: 0
  },
  tabBar: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap"
  },
  tabBtn: {
    background: "#eef3f7",
    color: "#102a43",
    border: "1px solid #d6e1ea",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700
  },
  tabActive: {
    background: "#243b53",
    color: "#fff",
    border: "1px solid #243b53",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700
  },
  primaryBtn: {
    background: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700
  },
  secondaryBtn: {
    background: "#eef3f7",
    color: "#102a43",
    border: "1px solid #d6e1ea",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700
  },
  dangerBtn: {
    background: "#b42318",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700
  },
  dangerBtnSmall: {
    background: "#fff1f1",
    color: "#b42318",
    border: "1px solid #f3b6b6",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700
  },
  label: {
    display: "block",
    marginBottom: 8,
    color: "#102a43",
    fontWeight: 700
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #c9d6e2",
    boxSizing: "border-box",
    fontSize: 15
  },
  textarea: {
    width: "100%",
    minHeight: 96,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #c9d6e2",
    boxSizing: "border-box",
    fontSize: 15,
    resize: "vertical"
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16
  },
  preview: {
    display: "block",
    width: 240,
    maxWidth: "100%",
    borderRadius: 16,
    marginTop: 12,
    border: "1px solid #dde5eb"
  },
  previewSmall: {
    display: "block",
    width: 170,
    maxWidth: "100%",
    borderRadius: 14,
    marginTop: 12,
    border: "1px solid #dde5eb"
  },
  sectionTitle: {
    margin: 0,
    color: "#102a43"
  },
  subTitle: {
    margin: 0,
    color: "#102a43"
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
  simpleList: {
    display: "grid",
    gap: 10,
    marginTop: 16
  },
  simpleRow: {
    border: "1px solid #dde5eb",
    borderRadius: 16,
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap"
  },
  productsLayout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 16
  },
  stack: {
    display: "grid",
    gap: 10,
    marginTop: 12
  },
  variantRow: {
    display: "grid",
    gridTemplateColumns: "1fr 150px 60px",
    gap: 10,
    alignItems: "center"
  },
  toast: {
    background: "#e9f7ef",
    border: "1px solid #b7e4c7",
    color: "#1f6f43",
    padding: "12px 14px",
    borderRadius: 12,
    marginBottom: 16
  }
}
