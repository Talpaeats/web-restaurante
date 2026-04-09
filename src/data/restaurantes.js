import { TELEFONO_PEDIDOS } from "./config"

export const restaurantesBase = [
  {
    id: "rest-1",
    nombre: "Burgers Extremas",
    descripcion: "Burgers artesanales, snacks y bebidas frías",
    telefono: TELEFONO_PEDIDOS,
    horario: { abierto: "11:00", cerrado: "22:30" },
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    categorias: ["Hamburguesas", "Papas y Snacks", "Refrescos", "Postres"],
    productos: [
      {
        id: "p-1",
        categoria: "Hamburguesas",
        nombre: "Hamburguesa Sencilla",
        descripcion: "Bollo de mantequilla, 150gr de carne de res, queso cheddar y Monterrey Jack.",
        imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
        variantes: [
          { id: "v-1", nombre: "Sencilla", precio: 170 },
          { id: "v-2", nombre: "Doble", precio: 210 }
        ],
        extras: [
          { id: "e-1", nombre: "Cebolla caramelizada", precio: 15 },
          { id: "e-2", nombre: "Aros de cebolla", precio: 15 }
        ]
      },
      {
        id: "p-2",
        categoria: "Hamburguesas",
        nombre: "Aguacate Lover",
        descripcion: "Medio aguacate, 150gr de carne, queso Monterrey Jack y cheddar.",
        imagen: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
        variantes: [
          { id: "v-3", nombre: "Sencilla", precio: 189 },
          { id: "v-4", nombre: "Doble", precio: 229 }
        ],
        extras: [
          { id: "e-3", nombre: "Tocino", precio: 20 },
          { id: "e-4", nombre: "Papas extra", precio: 25 }
        ]
      }
    ]
  },
  {
    id: "rest-2",
    nombre: "Pizza Town",
    descripcion: "Pizzas, complementos, bebidas y postres",
    telefono: TELEFONO_PEDIDOS,
    horario: { abierto: "11:00", cerrado: "23:30" },
    imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    categorias: ["Pizzas", "Complementos", "Refrescos", "Postres"],
    productos: [
      {
        id: "p-3",
        categoria: "Pizzas",
        nombre: "Pizza Pepperoni",
        descripcion: "Pizza clásica con pepperoni y queso mozzarella.",
        imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        variantes: [
          { id: "v-5", nombre: "Mediana", precio: 180 },
          { id: "v-6", nombre: "Grande", precio: 230 }
        ],
        extras: [
          { id: "e-5", nombre: "Queso extra", precio: 20 },
          { id: "e-6", nombre: "Orilla rellena", precio: 30 }
        ]
      },
      {
        id: "p-4",
        categoria: "Complementos",
        nombre: "Papas Gajo",
        descripcion: "Papas gajo crujientes con aderezo especial.",
        imagen: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80",
        variantes: [
          { id: "v-7", nombre: "Regular", precio: 90 },
          { id: "v-8", nombre: "Grande", precio: 120 }
        ],
        extras: [{ id: "e-7", nombre: "Cheddar extra", precio: 15 }]
      }
    ]
  },
  {
    id: "rest-3",
    nombre: "Tacos Don Chuy",
    descripcion: "Tacos, quesadillas, volcanes y aguas frescas",
    telefono: TELEFONO_PEDIDOS,
    horario: { abierto: "18:00", cerrado: "01:00" },
    imagen: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=80",
    categorias: ["Tacos", "Quesadillas", "Bebidas"],
    productos: [
      {
        id: "p-5",
        categoria: "Tacos",
        nombre: "Orden de Tacos al Pastor",
        descripcion: "Cinco tacos al pastor con cebolla, cilantro y salsa de la casa.",
        imagen: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80",
        variantes: [
          { id: "v-9", nombre: "5 tacos", precio: 95 },
          { id: "v-10", nombre: "10 tacos", precio: 180 }
        ],
        extras: [
          { id: "e-8", nombre: "Piña extra", precio: 10 },
          { id: "e-9", nombre: "Queso gratinado", precio: 20 }
        ]
      },
      {
        id: "p-6",
        categoria: "Bebidas",
        nombre: "Agua de Horchata",
        descripcion: "Agua fresca cremosa de horchata con canela.",
        imagen: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
        variantes: [
          { id: "v-11", nombre: "Medio litro", precio: 35 },
          { id: "v-12", nombre: "Litro", precio: 55 }
        ],
        extras: []
      }
    ]
  }
]
