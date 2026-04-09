import { useEffect, useMemo, useRef, useState } from "react"
import logo from "./assets/Logo-Talpaeats.png"
import AdminPanel from "./components/AdminPanel"

const ENVIO_FIJO = 35
const TELEFONO_PEDIDOS = "523319944525"
const TARJETA_TRANSFERENCIA = "5428 7806 6554 2756"
const NOMBRE_TRANSFERENCIA = "Paulo Cesar Barba Gradilla"
const BANCO_TRANSFERENCIA = "Mercado Pago"

const STORAGE_KEYS = {
  carrito: "talpaEatsCarrito",
  datosCliente: "talpaEatsDatosCliente",
  restaurantes: "talpaEatsRestaurantesAdminV1",
  adminAuth: "talpaEatsAdminAuthV1"
}

const ADMIN_QUERY_KEY = "admin"
const ADMIN_QUERY_VALUE = "1"
const ADMIN_PASSWORD = "talpa2026"


const RESTAURANTES_BASE = [
  {
    "id": 1,
    "nombre": "Burgers Extremas",
    "descripcion": "Burgers artesanales, snacks y bebidas frías",
    "telefono": TELEFONO_PEDIDOS,
    "horario": {
      "abierto": "11:00",
      "cerrado": "22:30"
    },
    "imagen": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    "productos": [
      {
        "id": 1,
        "categoria": "Hamburguesas",
        "nombre": "Hamburguesa Sencilla",
        "descripcion": "Bollo de mantequilla, 150gr de carne de res, queso cheddar y Monterrey Jack.",
        "imagen": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "sencilla",
            "nombre": "Sencilla",
            "precio": 170
          },
          {
            "id": "doble",
            "nombre": "Doble",
            "precio": 210
          }
        ],
        "extras": [
          {
            "id": "cebolla",
            "nombre": "Cebolla caramelizada",
            "precio": 15
          },
          {
            "id": "aros",
            "nombre": "Aros de cebolla",
            "precio": 15
          },
          {
            "id": "bbq",
            "nombre": "Salsa BBQ",
            "precio": 15
          }
        ]
      },
      {
        "id": 2,
        "categoria": "Hamburguesas",
        "nombre": "Aguacate Lover",
        "descripcion": "Medio aguacate, 150gr de carne, queso Monterrey Jack y cheddar.",
        "imagen": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "sencilla",
            "nombre": "Sencilla",
            "precio": 189
          },
          {
            "id": "doble",
            "nombre": "Doble",
            "precio": 229
          }
        ],
        "extras": [
          {
            "id": "tocino",
            "nombre": "Tocino",
            "precio": 20
          },
          {
            "id": "papas",
            "nombre": "Papas extra",
            "precio": 25
          }
        ]
      },
      {
        "id": 3,
        "categoria": "Hamburguesas",
        "nombre": "Jalapeño Poppers",
        "descripcion": "Burger con jalapeños poppers jumbo, queso cheddar, vegetales y sweet sriracha.",
        "imagen": "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "sencilla",
            "nombre": "Sencilla",
            "precio": 190
          },
          {
            "id": "doble",
            "nombre": "Doble",
            "precio": 230
          }
        ],
        "extras": [
          {
            "id": "jalapenos",
            "nombre": "Jalapeños extra",
            "precio": 15
          },
          {
            "id": "queso",
            "nombre": "Queso extra",
            "precio": 20
          }
        ]
      },
      {
        "id": 4,
        "categoria": "Hamburguesas",
        "nombre": "Bone-less Burger",
        "descripcion": "Hamburguesa con boneless bañados en tu salsa favorita, blue cheese y tocino.",
        "imagen": "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "clasica",
            "nombre": "Clásica",
            "precio": 189
          },
          {
            "id": "doble",
            "nombre": "Doble carne",
            "precio": 239
          }
        ],
        "extras": [
          {
            "id": "ranch",
            "nombre": "Aderezo ranch",
            "precio": 12
          },
          {
            "id": "pepperjack",
            "nombre": "Queso pepper jack",
            "precio": 18
          }
        ]
      },
      {
        "id": 5,
        "categoria": "Hamburguesas",
        "nombre": "Mr. Fring",
        "descripcion": "Pechuga de pollo cajún, queso cheddar, vegetales y salsa especial FE.",
        "imagen": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "crispy",
            "nombre": "Crispy",
            "precio": 179
          },
          {
            "id": "doble",
            "nombre": "Doble pollo",
            "precio": 219
          }
        ],
        "extras": [
          {
            "id": "jalapeno",
            "nombre": "Jalapeño fresco",
            "precio": 10
          },
          {
            "id": "tocino",
            "nombre": "Tocino",
            "precio": 20
          }
        ]
      },
      {
        "id": 6,
        "categoria": "Papas y Snacks",
        "nombre": "Papas Trufa Parmesano",
        "descripcion": "Papas a la francesa con aceite de trufa, parmesano y perejil.",
        "imagen": "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "regular",
            "nombre": "Regular",
            "precio": 95
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 130
          }
        ],
        "extras": [
          {
            "id": "cheddar",
            "nombre": "Cheddar",
            "precio": 15
          },
          {
            "id": "tocino",
            "nombre": "Tocino crujiente",
            "precio": 20
          }
        ]
      },
      {
        "id": 7,
        "categoria": "Papas y Snacks",
        "nombre": "Boneless Buffalo",
        "descripcion": "Boneless crujientes bañados en salsa buffalo con apio y aderezo ranch.",
        "imagen": "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "8pz",
            "nombre": "8 piezas",
            "precio": 145
          },
          {
            "id": "12pz",
            "nombre": "12 piezas",
            "precio": 199
          }
        ],
        "extras": [
          {
            "id": "extra-ranch",
            "nombre": "Ranch extra",
            "precio": 12
          },
          {
            "id": "papas",
            "nombre": "Cama de papas",
            "precio": 25
          }
        ]
      },
      {
        "id": 8,
        "categoria": "Refrescos",
        "nombre": "Coca-Cola Original",
        "descripcion": "Refresco bien frío para acompañar tu burger.",
        "imagen": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "355ml",
            "nombre": "355 ml",
            "precio": 35
          },
          {
            "id": "600ml",
            "nombre": "600 ml",
            "precio": 42
          }
        ],
        "extras": [
          {
            "id": "hielo",
            "nombre": "Vaso con hielo",
            "precio": 5
          }
        ]
      },
      {
        "id": 9,
        "categoria": "Refrescos",
        "nombre": "Limonada Mineral",
        "descripcion": "Limonada preparada al momento con agua mineral y hielo.",
        "imagen": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "chica",
            "nombre": "Chica",
            "precio": 45
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 60
          }
        ],
        "extras": [
          {
            "id": "hierbabuena",
            "nombre": "Hierbabuena",
            "precio": 8
          },
          {
            "id": "gomita",
            "nombre": "Escarchado de chamoy",
            "precio": 10
          }
        ]
      },
      {
        "id": 10,
        "categoria": "Postres",
        "nombre": "Cheesecake de Lotus",
        "descripcion": "Rebanada cremosa de cheesecake con galleta caramelizada Lotus.",
        "imagen": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "rebanada",
            "nombre": "Rebanada",
            "precio": 85
          },
          {
            "id": "combo",
            "nombre": "Con café",
            "precio": 110
          }
        ],
        "extras": [
          {
            "id": "helado",
            "nombre": "Bola de vainilla",
            "precio": 20
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "nombre": "Pizza Town",
    "descripcion": "Pizzas, complementos, bebidas y postres",
    "telefono": TELEFONO_PEDIDOS,
    "horario": {
      "abierto": "11:00",
      "cerrado": "23:30"
    },
    "imagen": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    "productos": [
      {
        "id": 1,
        "categoria": "Pizzas",
        "nombre": "Pizza Pepperoni",
        "descripcion": "Pizza clásica con pepperoni y queso mozzarella.",
        "imagen": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "mediana",
            "nombre": "Mediana",
            "precio": 180
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 230
          }
        ],
        "extras": [
          {
            "id": "queso",
            "nombre": "Queso extra",
            "precio": 20
          },
          {
            "id": "orilla",
            "nombre": "Orilla rellena",
            "precio": 30
          }
        ]
      },
      {
        "id": 2,
        "categoria": "Pizzas",
        "nombre": "Pizza Hawaiana",
        "descripcion": "Jamón, piña, salsa de tomate y mucho queso mozzarella.",
        "imagen": "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "mediana",
            "nombre": "Mediana",
            "precio": 190
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 245
          }
        ],
        "extras": [
          {
            "id": "tocino",
            "nombre": "Tocino",
            "precio": 25
          },
          {
            "id": "extra-pina",
            "nombre": "Piña extra",
            "precio": 15
          }
        ]
      },
      {
        "id": 3,
        "categoria": "Pizzas",
        "nombre": "Pizza Meat Lovers",
        "descripcion": "Pepperoni, salchicha italiana, tocino y carne molida.",
        "imagen": "https://images.unsplash.com/photo-1548365328-9f547fb0953b?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "mediana",
            "nombre": "Mediana",
            "precio": 220
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 285
          }
        ],
        "extras": [
          {
            "id": "jalapeno",
            "nombre": "Jalapeño",
            "precio": 12
          },
          {
            "id": "queso",
            "nombre": "Queso extra",
            "precio": 20
          }
        ]
      },
      {
        "id": 4,
        "categoria": "Pizzas",
        "nombre": "Pizza Vegetariana",
        "descripcion": "Pimiento, champiñón, cebolla morada, aceitunas y jitomate cherry.",
        "imagen": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "mediana",
            "nombre": "Mediana",
            "precio": 205
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 265
          }
        ],
        "extras": [
          {
            "id": "queso-cabra",
            "nombre": "Queso de cabra",
            "precio": 30
          },
          {
            "id": "pesto",
            "nombre": "Toque de pesto",
            "precio": 18
          }
        ]
      },
      {
        "id": 5,
        "categoria": "Complementos",
        "nombre": "Papas Gajo",
        "descripcion": "Papas gajo crujientes con aderezo especial.",
        "imagen": "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "regular",
            "nombre": "Regular",
            "precio": 90
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 120
          }
        ],
        "extras": [
          {
            "id": "cheddar",
            "nombre": "Cheddar extra",
            "precio": 15
          },
          {
            "id": "tocino",
            "nombre": "Tocino",
            "precio": 20
          }
        ]
      },
      {
        "id": 6,
        "categoria": "Complementos",
        "nombre": "Boneless BBQ",
        "descripcion": "Boneless bañados en BBQ ahumada con dip ranch.",
        "imagen": "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "8pz",
            "nombre": "8 piezas",
            "precio": 149
          },
          {
            "id": "12pz",
            "nombre": "12 piezas",
            "precio": 205
          }
        ],
        "extras": [
          {
            "id": "salsa-buffalo",
            "nombre": "Cámbiala a Buffalo",
            "precio": 0
          },
          {
            "id": "papas",
            "nombre": "Con papas",
            "precio": 25
          }
        ]
      },
      {
        "id": 7,
        "categoria": "Complementos",
        "nombre": "Pan de Ajo Gratinado",
        "descripcion": "Pan crujiente con mantequilla de ajo y gratinado de mozzarella.",
        "imagen": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "4pz",
            "nombre": "4 piezas",
            "precio": 75
          },
          {
            "id": "8pz",
            "nombre": "8 piezas",
            "precio": 120
          }
        ],
        "extras": [
          {
            "id": "marinara",
            "nombre": "Dip marinara",
            "precio": 15
          }
        ]
      },
      {
        "id": 8,
        "categoria": "Refrescos",
        "nombre": "Sprite",
        "descripcion": "Refresco frío ideal para acompañar tu pizza.",
        "imagen": "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "355ml",
            "nombre": "355 ml",
            "precio": 35
          },
          {
            "id": "600ml",
            "nombre": "600 ml",
            "precio": 42
          }
        ],
        "extras": [
          {
            "id": "hielo",
            "nombre": "Vaso con hielo",
            "precio": 5
          }
        ]
      },
      {
        "id": 9,
        "categoria": "Refrescos",
        "nombre": "Té Helado de Durazno",
        "descripcion": "Té helado refrescante con toque de durazno.",
        "imagen": "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "chico",
            "nombre": "Chico",
            "precio": 40
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 55
          }
        ],
        "extras": [
          {
            "id": "limon",
            "nombre": "Rodajas de limón",
            "precio": 6
          }
        ]
      },
      {
        "id": 10,
        "categoria": "Postres",
        "nombre": "Churro Bites",
        "descripcion": "Bocados de churro espolvoreados con azúcar y canela.",
        "imagen": "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "6pz",
            "nombre": "6 piezas",
            "precio": 79
          },
          {
            "id": "12pz",
            "nombre": "12 piezas",
            "precio": 125
          }
        ],
        "extras": [
          {
            "id": "cajeta",
            "nombre": "Dip de cajeta",
            "precio": 12
          },
          {
            "id": "nutella",
            "nombre": "Dip de Nutella",
            "precio": 18
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "nombre": "Tacos Don Chuy",
    "descripcion": "Tacos, quesadillas, volcanes y aguas frescas",
    "telefono": TELEFONO_PEDIDOS,
    "horario": {
      "abierto": "18:00",
      "cerrado": "01:00"
    },
    "imagen": "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=80",
    "productos": [
      {
        "id": 1,
        "categoria": "Tacos",
        "nombre": "Orden de Tacos al Pastor",
        "descripcion": "Cinco tacos al pastor con cebolla, cilantro y salsa de la casa.",
        "imagen": "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "5tacos",
            "nombre": "5 tacos",
            "precio": 95
          },
          {
            "id": "10tacos",
            "nombre": "10 tacos",
            "precio": 180
          }
        ],
        "extras": [
          {
            "id": "pina",
            "nombre": "Piña extra",
            "precio": 10
          },
          {
            "id": "queso",
            "nombre": "Queso gratinado",
            "precio": 20
          }
        ]
      },
      {
        "id": 2,
        "categoria": "Tacos",
        "nombre": "Tacos de Asada",
        "descripcion": "Tacos de bistec asado con cebolla asada y guacamole.",
        "imagen": "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "5tacos",
            "nombre": "5 tacos",
            "precio": 110
          },
          {
            "id": "10tacos",
            "nombre": "10 tacos",
            "precio": 205
          }
        ],
        "extras": [
          {
            "id": "nopales",
            "nombre": "Nopales",
            "precio": 12
          },
          {
            "id": "queso",
            "nombre": "Queso gratinado",
            "precio": 20
          }
        ]
      },
      {
        "id": 3,
        "categoria": "Tacos",
        "nombre": "Tacos de Birria",
        "descripcion": "Tacos doraditos con consomé especiado y cebolla.",
        "imagen": "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "3tacos",
            "nombre": "3 tacos",
            "precio": 105
          },
          {
            "id": "5tacos",
            "nombre": "5 tacos",
            "precio": 165
          }
        ],
        "extras": [
          {
            "id": "consome",
            "nombre": "Consomé extra",
            "precio": 18
          }
        ]
      },
      {
        "id": 4,
        "categoria": "Quesadillas",
        "nombre": "Quesadilla Grande",
        "descripcion": "Quesadilla grande de maíz con carne a elegir y queso derretido.",
        "imagen": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "pastor",
            "nombre": "Pastor",
            "precio": 65
          },
          {
            "id": "asada",
            "nombre": "Asada",
            "precio": 75
          }
        ],
        "extras": [
          {
            "id": "guacamole",
            "nombre": "Guacamole",
            "precio": 15
          },
          {
            "id": "frijoles",
            "nombre": "Frijoles charros",
            "precio": 20
          }
        ]
      },
      {
        "id": 5,
        "categoria": "Quesadillas",
        "nombre": "Mulita Especial",
        "descripcion": "Tortilla doble con carne, queso, cebolla y salsa tatemada.",
        "imagen": "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "pastor",
            "nombre": "Pastor",
            "precio": 72
          },
          {
            "id": "chorizo",
            "nombre": "Chorizo",
            "precio": 78
          }
        ],
        "extras": [
          {
            "id": "aguacate",
            "nombre": "Aguacate",
            "precio": 15
          }
        ]
      },
      {
        "id": 6,
        "categoria": "Especialidades",
        "nombre": "Volcán de Pastor",
        "descripcion": "Tostada crujiente con pastor, queso fundido y cebolla.",
        "imagen": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "1pz",
            "nombre": "1 pieza",
            "precio": 55
          },
          {
            "id": "3pz",
            "nombre": "3 piezas",
            "precio": 150
          }
        ],
        "extras": [
          {
            "id": "pinia",
            "nombre": "Piña",
            "precio": 8
          }
        ]
      },
      {
        "id": 7,
        "categoria": "Especialidades",
        "nombre": "Gringa Norteña",
        "descripcion": "Tortilla de harina con pastor, queso y adobo especial.",
        "imagen": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "individual",
            "nombre": "Individual",
            "precio": 85
          },
          {
            "id": "doble",
            "nombre": "Doble",
            "precio": 125
          }
        ],
        "extras": [
          {
            "id": "tocino",
            "nombre": "Tocino",
            "precio": 20
          }
        ]
      },
      {
        "id": 8,
        "categoria": "Especialidades",
        "nombre": "Papa Asada con Carne",
        "descripcion": "Papa asada rellena de carne, queso, crema y mantequilla.",
        "imagen": "https://images.unsplash.com/photo-1603046891744-0e1a4f5910f3?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "regular",
            "nombre": "Regular",
            "precio": 95
          },
          {
            "id": "especial",
            "nombre": "Especial",
            "precio": 125
          }
        ],
        "extras": [
          {
            "id": "extra-carne",
            "nombre": "Extra carne",
            "precio": 28
          }
        ]
      },
      {
        "id": 9,
        "categoria": "Bebidas",
        "nombre": "Agua de Horchata",
        "descripcion": "Agua fresca cremosa de horchata con canela.",
        "imagen": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "medio",
            "nombre": "Medio litro",
            "precio": 35
          },
          {
            "id": "litro",
            "nombre": "Litro",
            "precio": 55
          }
        ],
        "extras": [
          {
            "id": "hielo",
            "nombre": "Más hielo",
            "precio": 0
          }
        ]
      },
      {
        "id": 10,
        "categoria": "Bebidas",
        "nombre": "Agua de Jamaica",
        "descripcion": "Jamaica natural bien fría y ligeramente ácida.",
        "imagen": "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "medio",
            "nombre": "Medio litro",
            "precio": 35
          },
          {
            "id": "litro",
            "nombre": "Litro",
            "precio": 55
          }
        ],
        "extras": [
          {
            "id": "limon",
            "nombre": "Toque de limón",
            "precio": 5
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "nombre": "Sushi Nori",
    "descripcion": "Rollos, bowls, entradas y bebidas orientales",
    "telefono": TELEFONO_PEDIDOS,
    "horario": {
      "abierto": "14:00",
      "cerrado": "21:30"
    },
    "imagen": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    "productos": [
      {
        "id": 1,
        "categoria": "Rollos",
        "nombre": "California Roll",
        "descripcion": "Rollo clásico con pepino, aguacate, queso crema y surimi.",
        "imagen": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "natural",
            "nombre": "Natural",
            "precio": 135
          },
          {
            "id": "empanizado",
            "nombre": "Empanizado",
            "precio": 155
          }
        ],
        "extras": [
          {
            "id": "chipotle",
            "nombre": "Aderezo chipotle",
            "precio": 12
          },
          {
            "id": "camaron",
            "nombre": "Camarón extra",
            "precio": 25
          }
        ]
      },
      {
        "id": 2,
        "categoria": "Rollos",
        "nombre": "Spicy Tuna Roll",
        "descripcion": "Atún picante, pepino y ajonjolí con topping de sriracha.",
        "imagen": "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "natural",
            "nombre": "Natural",
            "precio": 155
          },
          {
            "id": "horneado",
            "nombre": "Horneado",
            "precio": 175
          }
        ],
        "extras": [
          {
            "id": "masago",
            "nombre": "Masago",
            "precio": 18
          },
          {
            "id": "aguacate",
            "nombre": "Aguacate",
            "precio": 15
          }
        ]
      },
      {
        "id": 3,
        "categoria": "Rollos",
        "nombre": "Mango Roll",
        "descripcion": "Rollo fresco con camarón, mango y queso crema.",
        "imagen": "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "natural",
            "nombre": "Natural",
            "precio": 149
          },
          {
            "id": "empanizado",
            "nombre": "Empanizado",
            "precio": 169
          }
        ],
        "extras": [
          {
            "id": "anguila",
            "nombre": "Salsa de anguila",
            "precio": 10
          }
        ]
      },
      {
        "id": 4,
        "categoria": "Bowls",
        "nombre": "Yakimeshi Especial",
        "descripcion": "Arroz frito con verduras, res, pollo y camarón.",
        "imagen": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "regular",
            "nombre": "Regular",
            "precio": 145
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 185
          }
        ],
        "extras": [
          {
            "id": "siracha",
            "nombre": "Sriracha",
            "precio": 10
          },
          {
            "id": "queso",
            "nombre": "Queso crema",
            "precio": 15
          }
        ]
      },
      {
        "id": 5,
        "categoria": "Bowls",
        "nombre": "Poke de Salmón",
        "descripcion": "Base de arroz, salmón fresco, pepino, edamame y ajonjolí.",
        "imagen": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "regular",
            "nombre": "Regular",
            "precio": 175
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 215
          }
        ],
        "extras": [
          {
            "id": "aguacate",
            "nombre": "Aguacate",
            "precio": 18
          },
          {
            "id": "wakame",
            "nombre": "Wakame",
            "precio": 20
          }
        ]
      },
      {
        "id": 6,
        "categoria": "Entradas",
        "nombre": "Kushiagues de Queso",
        "descripcion": "Brochetas empanizadas de queso crema con dip especial.",
        "imagen": "https://images.unsplash.com/photo-1604908554165-ea92712c0d0a?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "3pz",
            "nombre": "3 piezas",
            "precio": 95
          },
          {
            "id": "5pz",
            "nombre": "5 piezas",
            "precio": 145
          }
        ],
        "extras": [
          {
            "id": "chipotle",
            "nombre": "Dip chipotle",
            "precio": 12
          }
        ]
      },
      {
        "id": 7,
        "categoria": "Entradas",
        "nombre": "Gyozas de Cerdo",
        "descripcion": "Empanaditas japonesas al vapor y doradas.",
        "imagen": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "6pz",
            "nombre": "6 piezas",
            "precio": 110
          },
          {
            "id": "10pz",
            "nombre": "10 piezas",
            "precio": 165
          }
        ],
        "extras": [
          {
            "id": "ponzu",
            "nombre": "Salsa ponzu",
            "precio": 10
          }
        ]
      },
      {
        "id": 8,
        "categoria": "Entradas",
        "nombre": "Edamames Picantes",
        "descripcion": "Vainas de soya al vapor con sal de chile y limón.",
        "imagen": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "regular",
            "nombre": "Regular",
            "precio": 75
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 105
          }
        ],
        "extras": [
          {
            "id": "tajin",
            "nombre": "Extra tajín",
            "precio": 5
          }
        ]
      },
      {
        "id": 9,
        "categoria": "Bebidas",
        "nombre": "Té Helado Japonés",
        "descripcion": "Té helado ligeramente dulce servido bien frío.",
        "imagen": "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "chico",
            "nombre": "Chico",
            "precio": 42
          },
          {
            "id": "grande",
            "nombre": "Grande",
            "precio": 58
          }
        ],
        "extras": [
          {
            "id": "lychee",
            "nombre": "Toque de lychee",
            "precio": 10
          }
        ]
      },
      {
        "id": 10,
        "categoria": "Postres",
        "nombre": "Mochis de Helado",
        "descripcion": "Mochis rellenos de helado surtido.",
        "imagen": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
        "variantes": [
          {
            "id": "2pz",
            "nombre": "2 piezas",
            "precio": 85
          },
          {
            "id": "4pz",
            "nombre": "4 piezas",
            "precio": 150
          }
        ],
        "extras": [
          {
            "id": "salsa-frutos",
            "nombre": "Salsa de frutos rojos",
            "precio": 15
          }
        ]
      }
    ]
  }
]

function convertirHoraAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number)
  return h * 60 + m
}

function obtenerEstadoRestaurante(horario) {
  const ahora = new Date()
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes()
  const apertura = convertirHoraAMinutos(horario.abierto)
  const cierre = convertirHoraAMinutos(horario.cerrado)

  let abierto = false

  if (cierre > apertura) {
    abierto = minutosActuales >= apertura && minutosActuales < cierre
  } else {
    abierto = minutosActuales >= apertura || minutosActuales < cierre
  }

  let faltanMinutos = 9999
  if (abierto) {
    if (cierre > apertura) {
      faltanMinutos = cierre - minutosActuales
    } else {
      faltanMinutos =
        minutosActuales < cierre
          ? cierre - minutosActuales
          : 24 * 60 - minutosActuales + cierre
    }
  }

  const cierraPronto = abierto && faltanMinutos <= 60

  let texto = "Cerrado"
  if (abierto && cierraPronto) texto = "Cierra pronto"
  if (abierto && !cierraPronto) texto = "Abierto"

  return {
    abierto,
    cierraPronto,
    texto
  }
}

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toFixed(2)}`
}

function clonarProfundo(valor) {
  return JSON.parse(JSON.stringify(valor))
}

function normalizarRestauranteAdmin(restaurante, index = 0) {
  const idBase = restaurante?.id ?? `rest-${Date.now()}-${index}`
  return {
    id: idBase,
    nombre: restaurante?.nombre || "",
    descripcion: restaurante?.descripcion || "",
    telefono: restaurante?.telefono || TELEFONO_PEDIDOS,
    horario: {
      abierto: restaurante?.horario?.abierto || "09:00",
      cerrado: restaurante?.horario?.cerrado || "18:00"
    },
    imagen: restaurante?.imagen || "",
    productos: Array.isArray(restaurante?.productos)
      ? restaurante.productos.map((producto, productoIndex) => ({
          id: producto?.id ?? `${idBase}-prod-${productoIndex + 1}`,
          categoria: producto?.categoria || "General",
          nombre: producto?.nombre || "",
          descripcion: producto?.descripcion || "",
          imagen: producto?.imagen || "",
          variantes: Array.isArray(producto?.variantes) && producto.variantes.length > 0
            ? producto.variantes.map((variante, varianteIndex) => ({
                id: variante?.id ?? `${idBase}-var-${productoIndex + 1}-${varianteIndex + 1}`,
                nombre: variante?.nombre || `Opción ${varianteIndex + 1}`,
                precio: Number(variante?.precio || 0)
              }))
            : [
                {
                  id: `${idBase}-var-${productoIndex + 1}-1`,
                  nombre: "Única",
                  precio: 0
                }
              ],
          extras: Array.isArray(producto?.extras)
            ? producto.extras.map((extra, extraIndex) => ({
                id: extra?.id ?? `${idBase}-ext-${productoIndex + 1}-${extraIndex + 1}`,
                nombre: extra?.nombre || "",
                precio: Number(extra?.precio || 0)
              }))
            : []
        }))
      : []
  }
}

function obtenerRestaurantesBase() {
  return RESTAURANTES_BASE.map((restaurante, index) =>
    normalizarRestauranteAdmin(restaurante, index)
  )
}

function cargarRestaurantes() {
  try {
    const guardados = localStorage.getItem(STORAGE_KEYS.restaurantes)
    if (!guardados) {
      return obtenerRestaurantesBase()
    }

    const parseados = JSON.parse(guardados)
    if (!Array.isArray(parseados) || parseados.length === 0) {
      return obtenerRestaurantesBase()
    }

    return parseados.map((restaurante, index) =>
      normalizarRestauranteAdmin(restaurante, index)
    )
  } catch {
    return obtenerRestaurantesBase()
  }
}

function guardarRestaurantesStorage(restaurantes) {
  localStorage.setItem(
    STORAGE_KEYS.restaurantes,
    JSON.stringify(
      restaurantes.map((restaurante, index) =>
        normalizarRestauranteAdmin(restaurante, index)
      )
    )
  )
}

function urlTieneAccesoAdmin() {
  const params = new URLSearchParams(window.location.search)
  return params.get(ADMIN_QUERY_KEY) === ADMIN_QUERY_VALUE
}

function limpiarAccesoAdminUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete(ADMIN_QUERY_KEY)
  const query = url.search ? url.search : ""
  window.history.replaceState({}, "", `${url.pathname}${query}${url.hash}`)
}

function App() {
  const [pantalla, setPantalla] = useState("inicio")
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null)
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([])
  const [cantidadDetalle, setCantidadDetalle] = useState(1)
  const [copiado, setCopiado] = useState(false)
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768)
  const [categoriaActiva, setCategoriaActiva] = useState("")
  const [restaurantes, setRestaurantes] = useState(() => cargarRestaurantes())
  const [adminAutorizado, setAdminAutorizado] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.adminAuth) === "ok"
    } catch {
      return false
    }
  })
  const [adminRevisado, setAdminRevisado] = useState(() => !urlTieneAccesoAdmin())

  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.carrito)
      return guardado
        ? JSON.parse(guardado)
        : {
            restauranteId: null,
            restauranteNombre: "",
            items: []
          }
    } catch {
      return {
        restauranteId: null,
        restauranteNombre: "",
        items: []
      }
    }
  })

  const [datosCliente, setDatosCliente] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.datosCliente)
      return guardado
        ? JSON.parse(guardado)
        : {
            nombre: "",
            telefono: "",
            direccion: "",
            notas: "",
            tipoEntrega: "domicilio",
            metodoPago: "efectivo",
            efectivoCon: ""
          }
    } catch {
      return {
        nombre: "",
        telefono: "",
        direccion: "",
        notas: "",
        tipoEntrega: "domicilio",
        metodoPago: "efectivo",
        efectivoCon: ""
      }
    }
  })

  const [erroresCheckout, setErroresCheckout] = useState({})
  const [mostrarErroresCheckout, setMostrarErroresCheckout] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.carrito, JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.datosCliente, JSON.stringify(datosCliente))
  }, [datosCliente])

  useEffect(() => {
    guardarRestaurantesStorage(restaurantes)
  }, [restaurantes])

  useEffect(() => {
    if (!urlTieneAccesoAdmin()) {
      setAdminRevisado(true)
      return
    }

    if (localStorage.getItem(STORAGE_KEYS.adminAuth) === "ok") {
      setAdminAutorizado(true)
      setAdminRevisado(true)
      return
    }

    const entrada = window.prompt("Contraseña de administrador")
    if (entrada === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEYS.adminAuth, "ok")
      setAdminAutorizado(true)
    } else {
      alert("Contraseña incorrecta")
      limpiarAccesoAdminUrl()
      setAdminAutorizado(false)
    }
    setAdminRevisado(true)
  }, [])

  useEffect(() => {
    if (!restauranteSeleccionado) return

    const actualizado = restaurantes.find(
      (restaurante) => restaurante.id === restauranteSeleccionado.id
    )

    if (!actualizado) {
      setRestauranteSeleccionado(null)
      setPantalla("inicio")
      return
    }

    if (actualizado !== restauranteSeleccionado) {
      setRestauranteSeleccionado(actualizado)
    }
  }, [restaurantes, restauranteSeleccionado])

  useEffect(() => {
    const manejarResize = () => setEsMovil(window.innerWidth <= 768)
    window.addEventListener("resize", manejarResize)
    return () => window.removeEventListener("resize", manejarResize)
  }, [])


  const restauranteDelCarrito = useMemo(
    () => restaurantes.find((r) => r.id === carrito.restauranteId),
    [carrito.restauranteId]
  )

  const totalProductos = carrito.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  const subtotal = carrito.items.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  )

  const envio = datosCliente.tipoEntrega === "domicilio" ? ENVIO_FIJO : 0
  const total = subtotal + envio

  const refsCategorias = useRef({})

  const normalizarCategoria = (texto) =>
    String(texto || "General")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")

  const categoriasMenu = useMemo(() => {
    if (!restauranteSeleccionado?.productos) return []

    return [
      ...new Set(
        restauranteSeleccionado.productos.map(
          (producto) => producto.categoria || "General"
        )
      )
    ]
  }, [restauranteSeleccionado])

  const productosAgrupados = useMemo(() => {
    if (!restauranteSeleccionado?.productos) return {}

    return restauranteSeleccionado.productos.reduce((acc, producto) => {
      const categoria = producto.categoria || "General"

      if (!acc[categoria]) {
        acc[categoria] = []
      }

      acc[categoria].push(producto)
      return acc
    }, {})
  }, [restauranteSeleccionado])

  const irACategoria = (categoria) => {
    setCategoriaActiva(categoria)

    const clave = normalizarCategoria(categoria)
    const elemento = refsCategorias.current[clave]

    if (elemento) {
      const offset = esMovil ? 145 : 160
      const top = elemento.getBoundingClientRect().top + window.scrollY - offset

      window.scrollTo({
        top,
        behavior: "smooth"
      })
    }
  }



  useEffect(() => {
    if (pantalla === "menu") {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  }, [pantalla, restauranteSeleccionado])

  useEffect(() => {
    refsCategorias.current = {}

    if (categoriasMenu.length > 0) {
      setCategoriaActiva(categoriasMenu[0])
    } else {
      setCategoriaActiva("")
    }
  }, [restauranteSeleccionado, categoriasMenu])

  useEffect(() => {
    if (pantalla !== "menu" || !restauranteSeleccionado || categoriasMenu.length === 0) {
      return
    }

    const detectarCategoriaActiva = () => {
      const offset = esMovil ? 170 : 190
      let categoriaVisible = categoriasMenu[0]

      for (const categoria of categoriasMenu) {
        const clave = normalizarCategoria(categoria)
        const elemento = refsCategorias.current[clave]

        if (!elemento) continue

        const top = elemento.getBoundingClientRect().top

        if (top - offset <= 0) {
          categoriaVisible = categoria
        }
      }

      setCategoriaActiva(categoriaVisible)
    }

    detectarCategoriaActiva()
    window.addEventListener("scroll", detectarCategoriaActiva, { passive: true })

    return () => window.removeEventListener("scroll", detectarCategoriaActiva)
  }, [pantalla, restauranteSeleccionado, categoriasMenu, esMovil])

  const abrirProducto = (producto) => {
    if (!restauranteSeleccionado) return

    const estado = obtenerEstadoRestaurante(restauranteSeleccionado.horario)

    if (!estado.abierto) {
      alert(
        `${restauranteSeleccionado.nombre} está cerrado. Abre a las ${restauranteSeleccionado.horario.abierto}.`
      )
      return
    }

    setProductoSeleccionado(producto)
    setVarianteSeleccionada(producto.variantes?.[0] || null)
    setExtrasSeleccionados([])
    setCantidadDetalle(1)
    setPantalla("detalle")
  }

  const toggleExtra = (extraId) => {
    setExtrasSeleccionados((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    )
  }

  const agregarConfiguradoAlCarrito = () => {
    if (!productoSeleccionado || !restauranteSeleccionado || !varianteSeleccionada) {
      return
    }

    const estado = obtenerEstadoRestaurante(restauranteSeleccionado.horario)

    if (!estado.abierto) {
      alert(
        `${restauranteSeleccionado.nombre} está cerrado. Abre a las ${restauranteSeleccionado.horario.abierto}.`
      )
      return
    }

    const extras = (productoSeleccionado.extras || []).filter((extra) =>
      extrasSeleccionados.includes(extra.id)
    )

    const precioUnitario =
      varianteSeleccionada.precio +
      extras.reduce((acc, extra) => acc + extra.precio, 0)

    const nombreFinal =
      extras.length > 0
        ? `${productoSeleccionado.nombre} | ${varianteSeleccionada.nombre} + ${extras
            .map((e) => e.nombre)
            .join(", ")}`
        : `${productoSeleccionado.nombre} | ${varianteSeleccionada.nombre}`

    const uniqueId = `${productoSeleccionado.id}-${varianteSeleccionada.id}-${extras
      .map((e) => e.id)
      .sort()
      .join("-")}`

    setCarrito((prev) => {
      if (!prev.restauranteId) {
        return {
          restauranteId: restauranteSeleccionado.id,
          restauranteNombre: restauranteSeleccionado.nombre,
          items: [
            {
              id: uniqueId,
              baseId: productoSeleccionado.id,
              nombre: nombreFinal,
              precio: precioUnitario,
              quantity: cantidadDetalle,
              imagen: productoSeleccionado.imagen
            }
          ]
        }
      }

      if (prev.restauranteId !== restauranteSeleccionado.id) {
        alert(
          `Tu carrito ya tiene productos de ${prev.restauranteNombre}. Vacíalo primero para pedir en ${restauranteSeleccionado.nombre}.`
        )
        return prev
      }

      const existente = prev.items.find((item) => item.id === uniqueId)

      if (existente) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === uniqueId
              ? { ...item, quantity: item.quantity + cantidadDetalle }
              : item
          )
        }
      }

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id: uniqueId,
            baseId: productoSeleccionado.id,
            nombre: nombreFinal,
            precio: precioUnitario,
            quantity: cantidadDetalle,
            imagen: productoSeleccionado.imagen
          }
        ]
      }
    })

    setPantalla("menu")
    setProductoSeleccionado(null)
  }

  const aumentarCantidad = (productoId) => {
    setCarrito((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === productoId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    }))
  }

  const disminuirCantidad = (productoId) => {
    setCarrito((prev) => {
      const itemsActualizados = prev.items
        .map((item) =>
          item.id === productoId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)

      if (itemsActualizados.length === 0) {
        return {
          restauranteId: null,
          restauranteNombre: "",
          items: []
        }
      }

      return {
        ...prev,
        items: itemsActualizados
      }
    })
  }

  const eliminarProducto = (productoId) => {
    setCarrito((prev) => {
      const itemsActualizados = prev.items.filter((item) => item.id !== productoId)

      if (itemsActualizados.length === 0) {
        return {
          restauranteId: null,
          restauranteNombre: "",
          items: []
        }
      }

      return {
        ...prev,
        items: itemsActualizados
      }
    })
  }

  const vaciarCarrito = () => {
    setCarrito({
      restauranteId: null,
      restauranteNombre: "",
      items: []
    })
    setDatosCliente({
      nombre: "",
      telefono: "",
      direccion: "",
      notas: "",
      tipoEntrega: "domicilio",
      metodoPago: "efectivo",
      efectivoCon: ""
    })
  }

  const copiarTarjeta = async () => {
    try {
      await navigator.clipboard.writeText(TARJETA_TRANSFERENCIA.replace(/\s/g, ""))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      alert("No se pudo copiar el número.")
    }
  }

  const limpiarErrorCheckout = (campo) => {
    setErroresCheckout((prev) => {
      if (!prev[campo]) return prev
      const siguiente = { ...prev }
      delete siguiente[campo]
      return siguiente
    })
  }

  const obtenerEstiloCampoCheckout = (campo) => ({
    ...estilos.input,
    ...(mostrarErroresCheckout && erroresCheckout[campo] ? estilos.inputError : {})
  })

  const validarCheckout = () => {
    if (carrito.items.length === 0) {
      alert("Tu carrito está vacío.")
      return false
    }

    const nuevosErrores = {}

    if (!datosCliente.nombre.trim()) {
      nuevosErrores.nombre = "Escribe tu nombre."
    }

    if (!datosCliente.telefono.trim()) {
      nuevosErrores.telefono = "Escribe tu teléfono."
    }

    if (
      datosCliente.tipoEntrega === "domicilio" &&
      !datosCliente.direccion.trim()
    ) {
      nuevosErrores.direccion = "Escribe tu dirección."
    }

    if (!datosCliente.metodoPago) {
      nuevosErrores.metodoPago = "Selecciona un método de pago."
    }

    if (
      datosCliente.metodoPago === "efectivo" &&
      !datosCliente.efectivoCon.trim()
    ) {
      nuevosErrores.efectivoCon = "Escribe con cuánto pagas."
    }

    setErroresCheckout(nuevosErrores)
    setMostrarErroresCheckout(true)

    if (Object.keys(nuevosErrores).length > 0) {
      alert("Completa los campos obligatorios marcados en rojo.")
      return false
    }

    return true
  }

  const obtenerTextoMetodoPago = () => {
    switch (datosCliente.metodoPago) {
      case "efectivo":
        return `Efectivo (pagan con ${datosCliente.efectivoCon})`
      case "terminal":
        return "Tarjeta (Terminal)"
      case "transferencia":
        return `Transferencia a ${BANCO_TRANSFERENCIA} - ${TARJETA_TRANSFERENCIA}`
      default:
        return "No definido"
    }
  }

  const enviarPedidoPorWhatsApp = () => {
    if (!validarCheckout()) return

    setErroresCheckout({})

    const detalleProductos = carrito.items
      .map(
        (item) =>
          `• ${item.nombre} x${item.quantity} = ${formatearMoneda(item.precio * item.quantity)}`
      )
      .join("\n")

    const mensaje = `Hola, quiero hacer este pedido en ${carrito.restauranteNombre}:

${detalleProductos}

Subtotal: ${formatearMoneda(subtotal)}
Envío: ${formatearMoneda(envio)}
Total: ${formatearMoneda(total)}

Datos del cliente:
Nombre: ${datosCliente.nombre}
Teléfono: ${datosCliente.telefono}
Tipo de entrega: ${
      datosCliente.tipoEntrega === "domicilio" ? "A domicilio" : "Recoger en local"
    }
Dirección: ${
      datosCliente.tipoEntrega === "domicilio"
        ? datosCliente.direccion
        : "No aplica"
    }
Método de pago: ${obtenerTextoMetodoPago()}
Notas: ${datosCliente.notas || "Sin notas"}`

    const telefonoDestino = String(
      restauranteDelCarrito?.telefono || TELEFONO_PEDIDOS || ""
    ).replace(/\D/g, "")

    if (!telefonoDestino) {
      alert("No se encontró un número válido para enviar el pedido.")
      return
    }

    const url = `https://api.whatsapp.com/send?phone=${telefonoDestino}&text=${encodeURIComponent(mensaje)}`

    try {
      const enlace = document.createElement("a")
      enlace.href = url
      enlace.target = "_blank"
      enlace.rel = "noopener noreferrer"
      enlace.style.display = "none"
      document.body.appendChild(enlace)
      enlace.click()
      document.body.removeChild(enlace)

      setTimeout(() => {
        vaciarCarrito()
        setPantalla("inicio")
      }, 700)
    } catch (error) {
      console.error("No se pudo abrir WhatsApp:", error)
      window.location.href = url
      setTimeout(() => {
        vaciarCarrito()
        setPantalla("inicio")
      }, 700)
    }
  }


  const guardarRestaurantesDesdeAdmin = (nuevosRestaurantes) => {
    setRestaurantes(
      nuevosRestaurantes.map((restaurante, index) =>
        normalizarRestauranteAdmin(restaurante, index)
      )
    )
  }

  const salirAdmin = () => {
    localStorage.removeItem(STORAGE_KEYS.adminAuth)
    setAdminAutorizado(false)
    limpiarAccesoAdminUrl()
  }

  const restablecerRestaurantesBase = () => {
    const confirmar = window.confirm(
      "Esto borrará los cambios guardados en este navegador y restaurará la base original. ¿Continuar?"
    )

    if (!confirmar) return

    const base = obtenerRestaurantesBase()
    setRestaurantes(base)
    guardarRestaurantesStorage(base)
    setRestauranteSeleccionado(null)
    setPantalla("inicio")
  }


  const extrasActivos = productoSeleccionado
    ? (productoSeleccionado.extras || []).filter((extra) =>
        extrasSeleccionados.includes(extra.id)
      )
    : []

  const precioUnitarioDetalle =
    (varianteSeleccionada?.precio || 0) +
    extrasActivos.reduce((acc, extra) => acc + extra.precio, 0)

  const precioDetalle = precioUnitarioDetalle * cantidadDetalle

  const BarraFlotanteGlobal =
    carrito.items.length > 0 ? (
      <button
        style={estilos.barraGlobal}
        onClick={() => setPantalla("carrito")}
      >
        <div style={estilos.barraGlobalIzquierda}>
          <span style={estilos.iconoCarritoGrande}>🛒</span>
          <div style={estilos.barraGlobalTextoWrap}>
            <strong style={estilos.barraGlobalTitulo}>
              {totalProductos} producto{totalProductos !== 1 ? "s" : ""}
            </strong>
            <span style={estilos.barraGlobalSubtitulo}>
              {carrito.restauranteNombre}
            </span>
          </div>
        </div>

        <div style={estilos.barraGlobalDerecha}>
          <strong>{formatearMoneda(total)}</strong>
          <span>Ver carrito</span>
        </div>
      </button>
    ) : null

  if (urlTieneAccesoAdmin()) {
    if (!adminRevisado) {
      return null
    }

    if (adminAutorizado) {
      return (
        <AdminPanel
          restaurantes={restaurantes}
          onGuardar={guardarRestaurantesDesdeAdmin}
          onSalirAdmin={salirAdmin}
          onRestablecer={restablecerRestaurantesBase}
        />
      )
    }
  }

  if (pantalla === "carrito") {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.contenedorSm}>
          <button
            style={estilos.botonVolver}
            onClick={() => setPantalla("menu")}
          >
            ← Regresar
          </button>

          <div style={estilos.cardGrande}>
            <div style={estilos.tituloConIcono}>
              <span>🛒</span>
              <h2 style={estilos.seccionTituloLeft}>Productos agregados</h2>
            </div>

            {carrito.items.length === 0 ? (
              <p style={estilos.textoSuave}>Tu carrito está vacío.</p>
            ) : (
              <>
                <div style={estilos.carritoEncabezado}>
                  <div style={{ flex: 1 }}>Producto</div>
                  <div style={{ width: 165, textAlign: "right" }}>Acciones</div>
                </div>

                {carrito.items.map((producto) => (
                  <div key={producto.id} style={estilos.itemCarritoNuevo}>
                    <div style={estilos.itemCarritoContenido}>
                      <div style={estilos.itemCantidadLado}>{producto.quantity}</div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={estilos.itemTitulo}>{producto.nombre}</div>
                        <div style={estilos.itemPrecio}>
                          {formatearMoneda(producto.precio)}
                        </div>
                      </div>
                    </div>

                    <div style={estilos.itemAcciones}>
                      <div style={estilos.controlesCantidadModernos}>
                        <button
                          style={estilos.botonCantidadModerno}
                          onClick={() => disminuirCantidad(producto.id)}
                        >
                          −
                        </button>
                        <span style={estilos.cantidadTextoModerna}>
                          {producto.quantity}
                        </span>
                        <button
                          style={estilos.botonCantidadModerno}
                          onClick={() => aumentarCantidad(producto.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        style={estilos.botonEliminar}
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

                <div style={estilos.resumenTotalesNuevo}>
                  <div style={estilos.lineaTotal}>
                    <span>Subtotal del pedido</span>
                    <strong>{formatearMoneda(subtotal)}</strong>
                  </div>
                  <div style={estilos.lineaTotal}>
                    <span>Costo del envío</span>
                    <strong>{formatearMoneda(envio)}</strong>
                  </div>
                  <div style={estilos.lineaTotalFinal}>
                    <span>Total a pagar</span>
                    <strong>{formatearMoneda(total)}</strong>
                  </div>
                </div>

                <div style={estilos.bloqueBotonesFinales}>
                  <button
                    style={estilos.botonContinuarNuevo}
                    onClick={() => setPantalla("checkout")}
                  >
                    Continuar
                  </button>

                  <button style={estilos.botonVaciar} onClick={vaciarCarrito}>
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (pantalla === "checkout") {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.contenedorSm}>
          <button
            style={estilos.botonVolver}
            onClick={() => setPantalla("carrito")}
          >
            ← Regresar
          </button>

          <div style={estilos.tituloConIcono}>
            <span>👤</span>
            <h2 style={estilos.seccionTituloLeft}>Paso final</h2>
          </div>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }}
>
            <div style={estilos.columnaCheckout}>
              <div style={estilos.cardFormulario}>
                <h3 style={estilos.subtituloCard}>Datos personales</h3>
                <p style={estilos.textoCamposObligatorios}>Los campos marcados con * son obligatorios.</p>

                <div style={estilos.campo}>
                  <label style={estilos.label}>Nombre *</label>
                  <input
                    style={obtenerEstiloCampoCheckout("nombre")}
                    type="text"
                    value={datosCliente.nombre}
                    onChange={(e) => {
                      setDatosCliente({ ...datosCliente, nombre: e.target.value })
                      limpiarErrorCheckout("nombre")
                    }}
                    placeholder="Ingresa tu nombre"
                  />
                  {mostrarErroresCheckout && erroresCheckout.nombre && (
                    <span style={estilos.textoErrorCampo}>{erroresCheckout.nombre}</span>
                  )}
                </div>

                <div
                  style={{
                    ...estilos.filaDosColumnas,
                    gridTemplateColumns: esMovil ? "1fr" : "180px 1fr"
                  }}
                >
                  <div style={estilos.campo}>
                    <label style={estilos.label}>Código de país</label>
                    <div style={estilos.inputDisabled}>🇲🇽 +52</div>
                  </div>

                  <div style={estilos.campo}>
                    <label style={estilos.label}>Número de celular *</label>
                    <input
                      style={obtenerEstiloCampoCheckout("telefono")}
                      type="text"
                      value={datosCliente.telefono}
                      onChange={(e) => {
                        setDatosCliente({
                          ...datosCliente,
                          telefono: e.target.value
                        })
                        limpiarErrorCheckout("telefono")
                      }}
                      placeholder="0000000000"
                    />
                    {mostrarErroresCheckout && erroresCheckout.telefono && (
                      <span style={estilos.textoErrorCampo}>{erroresCheckout.telefono}</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={estilos.cardFormulario}>
                <h3 style={estilos.subtituloCard}>Entrega</h3>

                <div
                  style={{
                    ...estilos.selectorEntrega,
                    gridTemplateColumns: esMovil ? "1fr" : "repeat(2, max-content)"
                  }}
                >
                  <button
                    style={{
                      ...estilos.opcionEntrega,
                      ...(datosCliente.tipoEntrega === "domicilio"
                        ? estilos.opcionEntregaActiva
                        : {})
                    }}
                    onClick={() =>
                      setDatosCliente({
                        ...datosCliente,
                        tipoEntrega: "domicilio"
                      })
                    }
                  >
                    A domicilio
                  </button>

                  <button
                    style={{
                      ...estilos.opcionEntrega,
                      ...(datosCliente.tipoEntrega === "recoger"
                        ? estilos.opcionEntregaActiva
                        : {})
                    }}
                    onClick={() =>
                      setDatosCliente({
                        ...datosCliente,
                        tipoEntrega: "recoger"
                      })
                    }
                  >
                    Recoger en local
                  </button>
                </div>

                {datosCliente.tipoEntrega === "domicilio" && (
                  <div style={estilos.campo}>
                    <label style={estilos.label}>Dirección *</label>
                    <input
                      style={obtenerEstiloCampoCheckout("direccion")}
                      type="text"
                      value={datosCliente.direccion}
                      onChange={(e) => {
                        setDatosCliente({
                          ...datosCliente,
                          direccion: e.target.value
                        })
                        limpiarErrorCheckout("direccion")
                      }}
                      placeholder="Calle, número y referencias"
                    />
                    {mostrarErroresCheckout && erroresCheckout.direccion && (
                      <span style={estilos.textoErrorCampo}>{erroresCheckout.direccion}</span>
                    )}
                  </div>
                )}
              </div>

              <div style={estilos.cardFormulario}>
                <h3 style={estilos.subtituloCard}>Método de pago *</h3>
                <p style={estilos.textoAyuda}>Selecciona el de tu preferencia</p>

                <div
                  style={{
                    ...estilos.listaMetodosPago,
                    ...(mostrarErroresCheckout && erroresCheckout.metodoPago
                      ? estilos.bloqueErrorCheckout
                      : {})
                  }}
                >
                  <button
                    style={{
                      ...estilos.metodoPagoCard,
                      ...(datosCliente.metodoPago === "efectivo"
                        ? estilos.metodoPagoCardActivo
                        : {})
                    }}
                    onClick={() => {
                      setDatosCliente({
                        ...datosCliente,
                        metodoPago: "efectivo"
                      })
                      limpiarErrorCheckout("metodoPago")
                    }}
                  >
                    <div>
                      <div style={estilos.metodoPagoTitulo}>Efectivo</div>
                      <div style={estilos.metodoPagoDescripcion}>
                        Pago contra entrega
                      </div>
                    </div>
                    <div style={estilos.radioFake}>
                      {datosCliente.metodoPago === "efectivo" ? "●" : ""}
                    </div>
                  </button>

                  {datosCliente.metodoPago === "efectivo" && (
                    <div style={estilos.campo}>
                      <label style={estilos.label}>¿Con cuánto pagas? *</label>
                      <input
                        style={obtenerEstiloCampoCheckout("efectivoCon")}
                        type="text"
                        value={datosCliente.efectivoCon}
                        onChange={(e) => {
                          setDatosCliente({
                            ...datosCliente,
                            efectivoCon: e.target.value
                          })
                          limpiarErrorCheckout("efectivoCon")
                        }}
                        placeholder="¿Con cuánto pagas?"
                      />
                      {mostrarErroresCheckout && erroresCheckout.efectivoCon && (
                        <span style={estilos.textoErrorCampo}>{erroresCheckout.efectivoCon}</span>
                      )}
                    </div>
                  )}

                  <button
                    style={{
                      ...estilos.metodoPagoCard,
                      ...(datosCliente.metodoPago === "terminal"
                        ? estilos.metodoPagoCardActivo
                        : {})
                    }}
                    onClick={() => {
                      setDatosCliente({
                        ...datosCliente,
                        metodoPago: "terminal"
                      })
                      limpiarErrorCheckout("metodoPago")
                    }}
                  >
                    <div>
                      <div style={estilos.metodoPagoTitulo}>Tarjeta (Terminal)</div>
                      <div style={estilos.metodoPagoDescripcion}>
                        Llevar terminal para cobrar al entregar
                      </div>
                    </div>
                    <div style={estilos.radioFake}>
                      {datosCliente.metodoPago === "terminal" ? "●" : ""}
                    </div>
                  </button>

                  <button
                    style={{
                      ...estilos.metodoPagoCard,
                      ...(datosCliente.metodoPago === "transferencia"
                        ? estilos.metodoPagoCardActivo
                        : {})
                    }}
                    onClick={() => {
                      setDatosCliente({
                        ...datosCliente,
                        metodoPago: "transferencia"
                      })
                      limpiarErrorCheckout("metodoPago")
                    }}
                  >
                    <div>
                      <div style={estilos.metodoPagoTitulo}>Transferencia</div>
                      <div style={estilos.metodoPagoDescripcion}>
                        Ver datos bancarios
                      </div>
                    </div>
                    <div style={estilos.radioFake}>
                      {datosCliente.metodoPago === "transferencia" ? "●" : ""}
                    </div>
                  </button>

                  {datosCliente.metodoPago === "transferencia" && (
                    <div style={estilos.cardTransferencia}>
                      <div style={estilos.datoTransferencia}>
                        <span style={estilos.datoTransferenciaLabel}>Nombre</span>
                        <strong>{NOMBRE_TRANSFERENCIA}</strong>
                      </div>
                      <div style={estilos.datoTransferencia}>
                        <span style={estilos.datoTransferenciaLabel}>Banco</span>
                        <strong>{BANCO_TRANSFERENCIA}</strong>
                      </div>
                      <div style={estilos.datoTransferencia}>
                        <span style={estilos.datoTransferenciaLabel}>Tarjeta</span>
                        <strong>{TARJETA_TRANSFERENCIA}</strong>
                      </div>

                      <button style={estilos.botonCopiar} onClick={copiarTarjeta}>
                        {copiado ? "Número copiado" : "Copiar número"}
                      </button>
                    </div>
                  )}
                </div>
                {mostrarErroresCheckout && erroresCheckout.metodoPago && (
                  <span style={estilos.textoErrorCampo}>{erroresCheckout.metodoPago}</span>
                )}
              </div>

              <div style={estilos.cardFormulario}>
                <h3 style={estilos.subtituloCard}>Comentarios</h3>
                <textarea
                  style={estilos.textarea}
                  value={datosCliente.notas}
                  onChange={(e) =>
                    setDatosCliente({ ...datosCliente, notas: e.target.value })
                  }
                  placeholder="Ejemplo: por favor agregar cubiertos"
                />
              </div>
            </div>

           <div
  style={{
    ...estilos.columnaCheckoutResumen,
    order: 2
  }}
>
              <div
  style={{
    ...estilos.cardResumenSticky,
    position: "static",
    top: "auto"
  }}
>
                <h3 style={estilos.subtituloCard}>Detalle del pedido</h3>

                <div style={estilos.resumenCheckout}>
                  <div style={estilos.lineaTotal}>
                    <span>Total del pedido</span>
                    <strong>{formatearMoneda(subtotal)}</strong>
                  </div>
                  <div style={estilos.lineaTotal}>
                    <span>Costo del envío</span>
                    <strong>{formatearMoneda(envio)}</strong>
                  </div>
                  <div style={estilos.lineaTotalFinal}>
                    <span>Total a pagar</span>
                    <strong>{formatearMoneda(total)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  style={estilos.botonWhatsApp}
                  onClick={enviarPedidoPorWhatsApp}
                >
                  Enviar pedido por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (pantalla === "detalle" && productoSeleccionado) {
    return (
      <div style={estilos.paginaDetalleConBarra}>
        <div style={estilos.contenedorDetalle}>
          <button
            style={estilos.botonVolver}
            onClick={() => setPantalla("menu")}
          >
            ← Menú completo
          </button>

          <div style={estilos.detalleHeader}>
            <div style={estilos.detalleImagenWrap}>
              <img
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
                style={estilos.detalleImagen}
              />
            </div>
          </div>

          <div style={estilos.detalleContenido}>
            <h1 style={estilos.detalleTitulo}>{productoSeleccionado.nombre}</h1>
            <p style={estilos.detalleDescripcion}>
              {productoSeleccionado.descripcion}
            </p>

            <div style={estilos.bloqueOpciones}>
              <div style={estilos.bloqueTitulo}>Selecciona tu variante</div>

              <div style={estilos.variantesGrid}>
                {productoSeleccionado.variantes.map((variante) => {
                  const activa = varianteSeleccionada?.id === variante.id

                  return (
                    <button
                      key={variante.id}
                      style={{
                        ...estilos.tarjetaVariante,
                        borderColor: activa ? "#243b53" : "#d7e0e7",
                        backgroundColor: activa ? "#eff5f9" : "#fff"
                      }}
                      onClick={() => setVarianteSeleccionada(variante)}
                    >
                      <div style={{ textAlign: "left" }}>
                        <div style={estilos.varianteNombre}>{variante.nombre}</div>
                        <div style={estilos.variantePrecio}>
                          {formatearMoneda(variante.precio)}
                        </div>
                      </div>

                      <div
                        style={{
                          ...estilos.radioCircular,
                          backgroundColor: activa ? "#243b53" : "#fff"
                        }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {productoSeleccionado.extras?.length > 0 && (
              <div style={estilos.bloqueOpciones}>
                <div style={estilos.bloqueTitulo}>Personaliza tu producto</div>

                {productoSeleccionado.extras.map((extra) => {
                  const activo = extrasSeleccionados.includes(extra.id)

                  return (
                    <button
                      key={extra.id}
                      style={estilos.extraFila}
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <span style={estilos.extraNombre}>{extra.nombre}</span>

                      <div style={estilos.extraDerecha}>
                        <span style={estilos.extraPrecio}>
                          + {formatearMoneda(extra.precio)}
                        </span>
                        <div
                          style={{
                            ...estilos.checkboxFake,
                            backgroundColor: activo ? "#243b53" : "#edf2f7",
                            color: activo ? "#fff" : "transparent"
                          }}
                        >
                          ✓
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div style={estilos.barraFlotanteDetalle}>
          <div style={estilos.contadorFlotante}>
            <button
              style={estilos.botonMenosMasDetalle}
              onClick={() =>
                setCantidadDetalle((prev) => (prev > 1 ? prev - 1 : 1))
              }
            >
              −
            </button>
            <span style={estilos.numeroDetalle}>{cantidadDetalle}</span>
            <button
              style={estilos.botonMenosMasDetalle}
              onClick={() => setCantidadDetalle((prev) => prev + 1)}
            >
              +
            </button>
          </div>

          <button
            style={estilos.botonAgregarFlotante}
            onClick={agregarConfiguradoAlCarrito}
          >
            <span style={estilos.iconoCanasta}>🛒</span>
            <span style={estilos.precioBarraDetalle}>
              {formatearMoneda(precioDetalle)}
            </span>
            <span style={estilos.separadorBarra}>|</span>
            <span>AGREGAR</span>
          </button>
        </div>
      </div>
    )
  }

  if (pantalla === "menu" && restauranteSeleccionado) {
    const estado = obtenerEstadoRestaurante(restauranteSeleccionado.horario)

    return (
      <div style={estilos.paginaMenu}>
        <div style={estilos.contenedor}>
          <button
            style={estilos.botonVolver}
            onClick={() => {
              setPantalla("inicio")
              setRestauranteSeleccionado(null)
            }}
          >
            ← Volver
          </button>

          <div style={estilos.portadaRestaurante}>
            <img
              src={restauranteSeleccionado.imagen}
              alt={restauranteSeleccionado.nombre}
              style={estilos.imagenPortada}
            />
            <div style={estilos.portadaTexto}>
              <h1 style={estilos.tituloMenu}>{restauranteSeleccionado.nombre}</h1>
              <p style={estilos.textoSuave}>
                {restauranteSeleccionado.descripcion}
              </p>

              <div style={estilos.infoHorarioWrap}>
                <div
                  style={{
                    ...estilos.estadoBadge,
                    backgroundColor: estado.abierto
                      ? estado.cierraPronto
                        ? "#fff4e5"
                        : "#e8f7ee"
                      : "#fdecec",
                    color: estado.abierto
                      ? estado.cierraPronto
                        ? "#b54708"
                        : "#1f7a45"
                      : "#b42318"
                  }}
                >
                  <span style={estilos.iconoEstado}>
                    {estado.abierto
                      ? estado.cierraPronto
                        ? "🟠"
                        : "🟢"
                      : "🔴"}
                  </span>
                  {estado.texto}
                </div>

                <div style={estilos.horarioTexto}>
                  <span style={estilos.iconoHorario}>🕒</span>
                  {restauranteSeleccionado.horario.abierto} -{" "}
                  {restauranteSeleccionado.horario.cerrado}
                </div>
              </div>

              {!estado.abierto && (
                <div style={estilos.avisoCerrado}>
                  <span style={estilos.iconoAviso}>⛔</span>
                  Este restaurante está cerrado. Podrás seleccionar productos a
                  partir de las {restauranteSeleccionado.horario.abierto}.
                </div>
              )}

              {estado.abierto && estado.cierraPronto && (
                <div style={estilos.avisoPronto}>
                  <span style={estilos.iconoAviso}>⚠️</span>
                  Este restaurante cierra pronto a las{" "}
                  {restauranteSeleccionado.horario.cerrado}.
                </div>
              )}
            </div>
          </div>

          <h2 style={estilos.seccionTituloLeft}>Menú completo</h2>

          <div
            style={{
              ...estilos.categoriasStickyWrap,
              top: esMovil ? 0 : estilos.categoriasStickyWrap.top,
              padding: esMovil ? "8px 0 10px" : estilos.categoriasStickyWrap.padding,
              marginBottom: esMovil ? "14px" : estilos.categoriasStickyWrap.marginBottom
            }}
          >
            <div style={estilos.categoriasScroll}>
              {categoriasMenu.map((categoria) => (
                <button
                  key={categoria}
                  style={{
                    ...estilos.botonCategoriaMenu,
                    ...(esMovil
                      ? {
                          padding: "10px 14px",
                          fontSize: "13px",
                          borderRadius: "999px"
                        }
                      : {}),
                    ...(categoriaActiva === categoria
                      ? estilos.botonCategoriaMenuActivo
                      : {})
                  }}
                  onClick={() => irACategoria(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {categoriasMenu.map((categoria) => {
            const claveCategoria = normalizarCategoria(categoria)
            const productos = productosAgrupados[categoria] || []

            return (
              <div
                key={categoria}
                ref={(el) => {
                  refsCategorias.current[claveCategoria] = el
                }}
                style={estilos.bloqueCategoriaMenu}
              >
                <h3
                  style={{
                    ...estilos.tituloCategoriaMenu,
                    ...(esMovil ? { fontSize: "22px", margin: "0 0 12px" } : {})
                  }}
                >
                  {categoria}
                </h3>

                {productos.map((producto) => (
                  <button
                    key={producto.id}
                    style={{
                      ...estilos.productoFilaClickable,
                      opacity: estado.abierto ? 1 : 0.65,
                      cursor: estado.abierto ? "pointer" : "not-allowed"
                    }}
                    onClick={() => abrirProducto(producto)}
                  >
                    <div style={estilos.productoTexto}>
                      <h3 style={estilos.productoNombre}>{producto.nombre}</h3>
                      <p style={estilos.productoDescripcion}>{producto.descripcion}</p>
                      <p style={estilos.productoPrecio}>
                        Desde MXN {formatearMoneda(producto.variantes[0].precio)}
                      </p>
                    </div>

                    <div style={estilos.productoImagenWrap}>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={estilos.productoImagen}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )
          })}
        </div>

        {carrito.items.length > 0 &&
          carrito.restauranteId === restauranteSeleccionado.id && (
            <button
              style={estilos.barraCarrito}
              onClick={() => setPantalla("carrito")}
            >
              <div style={estilos.barraTexto}>
                <span style={estilos.iconoCanasta}>🛒</span>
                <strong>{totalProductos}</strong> producto
                {totalProductos !== 1 ? "s" : ""} en carrito
              </div>
              <div style={estilos.botonFooterCarrito}>
                {formatearMoneda(total)}
              </div>
            </button>
          )}
      </div>
    )
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.contenedor}>
        <div style={estilos.encabezado}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={logo}
              alt="Talpa Eats"
              style={{ width: 150, objectFit: "contain" }}
            />
          </div>

          <p style={estilos.textoSuave}>
            Elige tu restaurante favorito y haz tu pedido
          </p>
        </div>

        <div style={estilos.grid}>
          {restaurantes.map((restaurante) => {
            const estado = obtenerEstadoRestaurante(restaurante.horario)

            return (
              <button
                key={restaurante.id}
                style={estilos.tarjeta}
                onClick={() => {
                  setRestauranteSeleccionado(restaurante)
                  setPantalla("menu")
                }}
              >
                <img
                  src={restaurante.imagen}
                  alt={restaurante.nombre}
                  style={estilos.imagenCard}
                />
                <div style={estilos.tarjetaContenido}>
                  <div style={estilos.filaNombreEstado}>
                    <h3 style={estilos.nombreRestaurante}>{restaurante.nombre}</h3>

                    <div
                      style={{
                        ...estilos.estadoMini,
                        backgroundColor: estado.abierto
                          ? estado.cierraPronto
                            ? "#fff4e5"
                            : "#e8f7ee"
                          : "#fdecec",
                        color: estado.abierto
                          ? estado.cierraPronto
                            ? "#b54708"
                            : "#1f7a45"
                          : "#b42318"
                      }}
                    >
                      <span style={estilos.iconoMini}>
                        {estado.abierto
                          ? estado.cierraPronto
                            ? "🟠"
                            : "🟢"
                          : "🔴"}
                      </span>
                      {estado.texto}
                    </div>
                  </div>

                  <p style={estilos.descripcion}>{restaurante.descripcion}</p>

                  <div style={estilos.horarioCard}>
                    <span style={estilos.iconoHorario}>🕒</span>
                    {restaurante.horario.abierto} - {restaurante.horario.cerrado}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {BarraFlotanteGlobal}
    </div>
  )
}

const estilos = {
  pagina: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Arial, sans-serif",
    padding: "16px",
    paddingBottom: "96px"
  },
  paginaMenu: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Arial, sans-serif",
    padding: "16px",
    paddingBottom: "100px"
  },
  paginaDetalleConBarra: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Arial, sans-serif",
    padding: "16px",
    paddingBottom: "120px"
  },
  contenedor: {
    maxWidth: "1100px",
    margin: "0 auto"
  },
  contenedorSm: {
    maxWidth: "1080px",
    margin: "0 auto"
  },
  encabezado: {
    marginBottom: "24px",
    textAlign: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px"
  },
  tarjeta: {
    border: "1px solid #dde5eb",
    borderRadius: "18px",
    backgroundColor: "#fff",
    overflow: "hidden",
    padding: 0,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)"
  },
  imagenCard: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    display: "block"
  },
  tarjetaContenido: {
    padding: "16px"
  },
  filaNombreEstado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "8px"
  },
  nombreRestaurante: {
    margin: 0,
    fontSize: "20px",
    color: "#102a43"
  },
  descripcion: {
    margin: "0 0 12px 0",
    color: "#52606d",
    lineHeight: 1.5
  },
  horarioCard: {
    color: "#334e68",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  iconoHorario: {
    fontSize: "14px"
  },
  estadoMini: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  iconoMini: {
    fontSize: "11px"
  },
  botonVolver: {
    background: "transparent",
    border: "none",
    color: "#243b53",
    fontSize: "18px",
    fontWeight: 700,
    padding: 0,
    marginBottom: "18px",
    cursor: "pointer"
  },
  portadaRestaurante: {
    backgroundColor: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)"
  },
  imagenPortada: {
    width: "100%",
    height: "290px",
    objectFit: "cover",
    display: "block"
  },
  portadaTexto: {
    padding: "20px"
  },
  tituloMenu: {
    margin: "0 0 22px 0",
    color: "#102a43"
  },
textoSuave: {
  color: "#52606d",
  lineHeight: 1.5,
  margin: "1",
  textAlign: "center"
},
  infoHorarioWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
    marginBottom: "14px"
  },
  estadoBadge: {
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px"
  },
  iconoEstado: {
    fontSize: "12px"
  },
  horarioTexto: {
    padding: "9px 14px",
    borderRadius: "999px",
    backgroundColor: "#eef2f6",
    color: "#243b53",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px"
  },
  avisoCerrado: {
    marginTop: "12px",
    backgroundColor: "#fdecec",
    color: "#b42318",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 700
  },
  avisoPronto: {
    marginTop: "12px",
    backgroundColor: "#fff4e5",
    color: "#b54708",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 700
  },
  iconoAviso: {
    marginRight: "8px"
  },
  seccionTituloLeft: {
    margin: 0,
    color: "#102a43",
    fontSize: "22px",
    textAlign: "left"
  },
  productoFilaClickable: {
    width: "100%",
    border: "1px solid #dde5eb",
    borderRadius: "18px",
    backgroundColor: "#fff",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "14px",
    textAlign: "left",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)"
  },
  productoTexto: {
    flex: 1,
    minWidth: 0,
    textAlign: "left"
  },
productoNombre: {
  margin: "0 0 10px 0",
  color: "#102a43",
  lineHeight: 1.1,
  textAlign: "center"
},
  productoDescripcion: {
    margin: "0 0 10px 0",
    color: "#52606d",
    lineHeight: 1.5
  },
  productoPrecio: {
    margin: 0,
    color: "#243b53",
    fontWeight: 700
  },
  productoImagenWrap: {
    width: "112px",
    height: "112px",
    flexShrink: 0,
    borderRadius: "16px",
    overflow: "hidden"
  },
  productoImagen: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  barraCarrito: {
    position: "fixed",
    left: "16px",
    right: "16px",
    bottom: "16px",
    backgroundColor: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1100px",
    margin: "0 auto",
    cursor: "pointer",
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.2)"
  },
  barraTexto: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px"
  },
  botonFooterCarrito: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 700
  },
  barraGlobal: {
    position: "fixed",
    left: "16px",
    right: "16px",
    bottom: "16px",
    width: "calc(100% - 32px)",
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.22)"
  },
  barraGlobalIzquierda: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0
  },
  barraGlobalTextoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  barraGlobalTitulo: {
    fontSize: "16px"
  },
  barraGlobalSubtitulo: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)"
  },
  barraGlobalDerecha: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: "14px"
  },
  iconoCarritoGrande: {
    fontSize: "24px"
  },
  cardGrande: {
    backgroundColor: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)"
  },
  tituloConIcono: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px"
  },
  carritoEncabezado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#3e8bb4",
    fontWeight: 700,
    borderBottom: "1px solid #dce6ed",
    paddingBottom: "12px",
    marginBottom: "8px",
    textAlign: "left"
  },
  itemCarritoNuevo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid #e8eef3",
    padding: "18px 0",
    flexWrap: "wrap"
  },
  itemCarritoContenido: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: 1,
    minWidth: "260px",
    textAlign: "left"
  },
  itemCantidadLado: {
    width: "28px",
    textAlign: "left",
    fontWeight: 700,
    color: "#102a43",
    fontSize: "22px"
  },
  itemTitulo: {
    color: "#102a43",
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: 1.25,
    textAlign: "left"
  },
  itemPrecio: {
    marginTop: "6px",
    color: "#102a43",
    fontWeight: 700,
    fontSize: "20px",
    textAlign: "left"
  },
  itemAcciones: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginLeft: "auto"
  },
  controlesCantidadModernos: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#eef3f7",
    padding: "6px",
    borderRadius: "14px"
  },
  botonCantidadModerno: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    color: "#243b53",
    fontWeight: 700
  },
  cantidadTextoModerna: {
    minWidth: "24px",
    textAlign: "center",
    fontWeight: 700,
    color: "#102a43"
  },
  botonEliminar: {
    border: "1px solid #f3b0b0",
    color: "#d64545",
    backgroundColor: "#fff5f5",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700
  },
  resumenTotalesNuevo: {
    marginTop: "18px",
    backgroundColor: "#f7fafc",
    borderRadius: "18px",
    padding: "16px"
  },
  lineaTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    color: "#243b53"
  },
  lineaTotalFinal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #dce6ed",
    fontSize: "20px",
    color: "#102a43"
  },
  bloqueBotonesFinales: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px"
  },
  botonContinuarNuevo: {
    backgroundColor: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    fontWeight: 700,
    cursor: "pointer"
  },
  botonVaciar: {
    backgroundColor: "#fff",
    color: "#b42318",
    border: "1px solid #f2c4c4",
    borderRadius: "14px",
    padding: "14px 18px",
    fontWeight: 700,
    cursor: "pointer"
  },
  checkoutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "18px",
    alignItems: "start"
  },
  columnaCheckout: {
    display: "grid",
    gap: "16px"
  },
  columnaCheckoutResumen: {
    position: "relative"
  },
  cardFormulario: {
    backgroundColor: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)"
  },
cardResumenSticky: {
  position: "static",
  top: "auto",
    backgroundColor: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)"
  },
  subtituloCard: {
    margin: "0 0 14px 0",
    color: "#102a43",
    fontSize: "20px"
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "14px"
  },
  label: {
    color: "#243b53",
    fontWeight: 700,
    textAlign: "left"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5df",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "16px",
    outline: "none"
  },
  inputError: {
    border: "1px solid #dc2626",
    boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
    backgroundColor: "#fff5f5"
  },
  textoCamposObligatorios: {
    margin: "-4px 0 14px 0",
    color: "#64748b",
    fontSize: "14px",
    textAlign: "left"
  },
  textoErrorCampo: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: 700,
    marginTop: "6px",
    textAlign: "left",
    display: "block"
  },
  bloqueErrorCheckout: {
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "10px",
    backgroundColor: "#fff5f5"
  },
  inputDisabled: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5df",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "16px",
    backgroundColor: "#f8fafc",
    color: "#243b53"
  },
  filaDosColumnas: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: "14px"
  },
  selectorEntrega: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px"
  },
  opcionEntrega: {
    border: "1px solid #cfd8e3",
    backgroundColor: "#fff",
    color: "#243b53",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer"
  },
  opcionEntregaActiva: {
    backgroundColor: "#243b53",
    color: "#fff",
    borderColor: "#243b53"
  },
  listaMetodosPago: {
    display: "grid",
    gap: "10px"
  },
  textoAyuda: {
    margin: "-4px 0 12px 0",
    color: "#3e8bb4",
    fontWeight: 700
  },
  metodoPagoCard: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    border: "1px solid #d6e0e8",
    borderRadius: "14px",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left"
  },
  metodoPagoCardActivo: {
    borderColor: "#243b53",
    backgroundColor: "#f1f6fa"
  },
  metodoPagoTitulo: {
    color: "#102a43",
    fontWeight: 700,
    marginBottom: "4px"
  },
  metodoPagoDescripcion: {
    color: "#52606d",
    fontSize: "14px"
  },
  radioFake: {
    width: "24px",
    height: "24px",
    borderRadius: "999px",
    border: "2px solid #243b53",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#243b53",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0
  },
  cardTransferencia: {
    backgroundColor: "#f8fafc",
    border: "1px solid #dce6ed",
    borderRadius: "14px",
    padding: "14px"
  },
  datoTransferencia: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "10px",
    textAlign: "left"
  },
  datoTransferenciaLabel: {
    color: "#7b8794",
    fontSize: "13px"
  },
  botonCopiar: {
    backgroundColor: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 700
  },
  botonMercadoPago: {
    backgroundColor: "#009ee3",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px"
  },
  textarea: {
    width: "100%",
    minHeight: "92px",
    boxSizing: "border-box",
    border: "1px solid #cbd5df",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "16px",
    resize: "vertical",
    outline: "none"
  },
  resumenCheckout: {
    backgroundColor: "#f7fafc",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px"
  },
  botonWhatsApp: {
    width: "100%",
    backgroundColor: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "16px"
  },
  contenedorDetalle: {
    maxWidth: "900px",
    margin: "0 auto"
  },
  detalleHeader: {
    marginBottom: "18px"
  },
  detalleImagenWrap: {
    width: "100%",
    borderRadius: "22px",
    overflow: "hidden",
    backgroundColor: "#fff",
    border: "1px solid #dde5eb"
  },
  detalleImagen: {
    width: "100%",
    height: "360px",
    objectFit: "cover",
    display: "block"
  },
  detalleContenido: {
    backgroundColor: "#fff",
    border: "1px solid #dde5eb",
    borderRadius: "20px",
    padding: "22px"
  },
  detalleTitulo: {
    margin: "0 0 30px 0",
    color: "#102a43"
  },
  detalleDescripcion: {
    margin: "0 0 20px 0",
    color: "#52606d",
    lineHeight: 1.6
  },
  bloqueOpciones: {
    marginBottom: "20px"
  },
  bloqueTitulo: {
    color: "#102a43",
    fontWeight: 700,
    marginBottom: "12px",
    textAlign: "left"
  },
  variantesGrid: {
    display: "grid",
    gap: "10px"
  },
  tarjetaVariante: {
    width: "100%",
    border: "1px solid #d7e0e7",
    borderRadius: "14px",
    backgroundColor: "#fff",
    padding: "16px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  varianteNombre: {
    color: "#102a43",
    fontWeight: 700,
    marginBottom: "4px"
  },
  variantePrecio: {
    color: "#52606d"
  },
  radioCircular: {
    width: "20px",
    height: "20px",
    borderRadius: "999px",
    border: "2px solid #243b53",
    flexShrink: 0
  },
  extraFila: {
    width: "100%",
    border: "1px solid #d7e0e7",
    borderRadius: "14px",
    backgroundColor: "#fff",
    padding: "14px 16px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    textAlign: "left"
  },
  extraNombre: {
    color: "#102a43",
    fontWeight: 700
  },
  extraDerecha: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  extraPrecio: {
    color: "#52606d"
  },
  checkboxFake: {
    width: "22px",
    height: "22px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700
  },
  barraFlotanteDetalle: {
    position: "fixed",
    left: "16px",
    right: "16px",
    bottom: "16px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    maxWidth: "900px",
    margin: "0 auto"
  },
  contadorFlotante: {
    backgroundColor: "#e7eef3",
    padding: "8px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  botonMenosMasDetalle: {
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: "22px",
    cursor: "pointer",
    color: "#243b53"
  },
  numeroDetalle: {
    minWidth: "20px",
    textAlign: "center",
    fontWeight: 700,
    color: "#102a43"
  },
  botonAgregarFlotante: {
    flex: 1,
    backgroundColor: "#243b53",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "16px 18px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.22)"
  },
  iconoCanasta: {
    fontSize: "22px"
  },
  precioBarraDetalle: {
    fontSize: "18px"
  },
  separadorBarra: {
    opacity: 0.45
  },

  categoriasStickyWrap: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    backgroundColor: "#f5f7fa",
    padding: "10px 0 14px",
    marginBottom: "18px",
    borderBottom: "1px solid #e6ecf2"
  },
  categoriasScroll: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "4px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch"
  },
  botonCategoriaMenu: {
    flex: "0 0 auto",
    border: "1px solid #d9e2ec",
    backgroundColor: "#fff",
    color: "#102a43",
    borderRadius: "999px",
    padding: "13px 18px",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.06)",
    transition: "all 0.2s ease"
  },
  botonCategoriaMenuActivo: {
    backgroundColor: "#243b53",
    color: "#fff",
    borderColor: "#243b53",
    boxShadow: "0 10px 24px rgba(36, 59, 83, 0.18)",
    transform: "translateY(-1px)"
  },
  bloqueCategoriaMenu: {
    marginBottom: "30px",
    scrollMarginTop: "170px"
  },
  tituloCategoriaMenu: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#102a43",
    margin: "0 0 14px"
  },
}

export default App