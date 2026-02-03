import { Component, OnInit } from "@angular/core"
import { NavbarComponent } from "../navbar/navbar.component"
import { FooterComponent } from "../footer/footer/footer.component"
import { MenuItemComponent } from "../menu-item/menu-item.component"
import { MenuItemModalComponent } from "../menu-item-modal/menu-item-modal.component"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ProductServiceService } from "../../services/product-service.service"
import { CartServiceService } from "../../services/cart-service.service"
import { AuthService } from "../../core/services/auth.service"
import { NotificationService } from "../../services/notification.service"
import { MenuReviewModalComponent } from "../menu-review-modal/menu-review-modal.component"
interface Product {
  id: string
  name: string
  imageUrl: string
  price: number
  category: {
    name: string
  }
  featured?: boolean
  description?: string
}

@Component({
  selector: "app-carta",
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, MenuItemComponent, MenuItemModalComponent, MenuReviewModalComponent],
  templateUrl: "./carta.component.html",
  styleUrl: "./carta.component.css",
})
export class CartaComponent implements OnInit {
  // Propiedades del modal
  isModalOpen = false
  selectedItemTitle = ""
  selectedImageUrl = ""
  selectedProductId = ""
  selectedPrice = 0
  isReviewModalOpen = false
  selectedProductIdForReview = ""
  selectedProductNameForReview = ""
  selectedImageUrlForReview = ""

  // Propiedades de productos
  products: Product[] = []
  filteredProducts: Product[] = []
  categories: string[] = []
  activeCategory = "all"
  searchTerm = ""

  // Estados de UI
  isLoading = true
  loadingError = false
  showSearchSuggestions = false
  popularSearches = ["Pizza", "Pasta", "Ensalada", "Postre", "Bebida"]

  // Datos del pedido
  orderData: { itemTitle: string; price: number; quantity: number; comment: string }

  // Animaciones
  animationDelay = 0.1

  constructor(
    private productService: ProductServiceService,
    private cartService: CartServiceService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadProducts()
    this.initializeAnimations()
  }

  loadProducts() {
    this.isLoading = true
    this.loadingError = false

    this.productService.findAll().subscribe({
      next: (res: any) => {
        this.products = res.data || []

        // Extraer categorías únicas
        const categorySet = new Set<string>()
        this.products.forEach((product) => {
          if (product.category && product.category.name) {
            categorySet.add(product.category.name)
          }
        })
        this.categories = Array.from(categorySet)

        // Aplicar filtros iniciales
        this.filterProducts()
        this.isLoading = false
      },
      error: (err) => {
        console.error("Error cargando productos:", err)
        this.loadingError = true
        this.isLoading = false
        this.notificationService.error("Error al cargar el menú. Por favor, intenta nuevamente.")
      },
    })
  }

  filterProducts() {
    // Filtrar por categoría
    let filtered =
      this.activeCategory === "all"
        ? [...this.products]
        : this.products.filter((p) => p.category.name === this.activeCategory)

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)),
      )
    }

    this.filteredProducts = filtered
  }

  setActiveCategory(category: string) {
    this.activeCategory = category
    this.filterProducts()
    this.animateProducts()
  }

  clearSearch() {
    this.searchTerm = ""
    this.filterProducts()
    this.showSearchSuggestions = false
  }

  openModal(itemTitle: string, imageUrl: string, productId: string, price: number) {
    this.selectedItemTitle = itemTitle
    this.selectedImageUrl = imageUrl
    this.selectedProductId = productId
    this.selectedPrice = price
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
  }

  handleOrderAdded(order: { itemTitle: string; price: number; quantity: number; comment: string }) {
    this.orderData = order
  }

  // Método para agregar rápidamente al carrito sin abrir el modal
  quickAddToCart(productId: string, productName: string, price: number) {
    const userId = this.authService.getId()
    if (!userId) {
      this.notificationService.error("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    // Crear el objeto de pedido con valores predeterminados
    const orderData = {
      productName: productName,
      quantity: "1", // Cantidad predeterminada
      subtotal: price,
      comment: undefined, // Sin comentarios
      product: productId,
    }

    // Usar el método del servicio
    this.cartService.addOrderToCart(orderData).subscribe({
      next: (response: any) => {
        if (response.error) {
          this.notificationService.error("Error: " + response.error)
        } else {
          this.notificationService.success(`¡${productName} agregado al carrito!`)
        }
      },
      error: (err: any) => {
        console.error("Error adding order", err)
        this.notificationService.error("Error al agregar el producto al carrito")
      },
    })
  }

  // Método para aplicar sugerencia de búsqueda
  applySearchSuggestion(suggestion: string) {
    this.searchTerm = suggestion
    this.filterProducts()
    this.showSearchSuggestions = false
  }

  // Método para mostrar/ocultar sugerencias
  toggleSearchSuggestions() {
    this.showSearchSuggestions = !this.showSearchSuggestions
  }

  // Método para inicializar animaciones
  initializeAnimations() {
    setTimeout(() => {
      this.animateProducts()
    }, 100)
  }

  // Método para animar productos al cargar o filtrar
  animateProducts() {
    const productCards = document.querySelectorAll(".menu-item-card")
    productCards.forEach((card, index) => {
      const element = card as HTMLElement
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"

      setTimeout(() => {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, index * 50)
    })
  }

  // Método para obtener el color de categoría
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Entradas: "category-entradas",
      "Platos Principales": "category-principales",
      Postres: "category-postres",
      Bebidas: "category-bebidas",
      Pizzas: "category-pizzas",
      Pastas: "category-pastas",
      Ensaladas: "category-ensaladas",
    }

    return colors[category] || "category-default"
  }

  // Método para obtener el ícono de categoría
  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Entradas: "utensils",
      "Platos Principales": "drumstick-bite",
      Postres: "ice-cream",
      Bebidas: "glass-martini-alt",
      Pizzas: "pizza-slice",
      Pastas: "bread-slice",
      Ensaladas: "leaf",
    }

    return icons[category] || "utensils"
  }

  // Método para obtener rutas SVG según la categoría
  getCategoryPath(category: string): string {
    const categoryPaths: { [key: string]: string } = {
      'Entradas': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      'Platos Principales': 'M3 2v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V2M7 2v10m6 0v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V2M17 2v10',
      'Postres': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'Bebidas': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      'Pizzas': 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4.764 2.382a1 1 0 00.894 0l4.764-2.382a1 1 0 00.553-.894V9.236a1 1 0 00-.553-.894l-4.764-2.382a1 1 0 00-.894 0z',
      'Pastas': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      'Ensaladas': 'M13 10V3L4 14h7v7l9-11h-7z'
    }
    return categoryPaths[category] || categoryPaths['Platos Principales']
  }

  // Método para obtener el delay de animación
  getAnimationDelay(index: number): string {
    return `${index * 0.05}s`
  }
  VerResenas(productId: string) {
  const product = this.products.find((p) => p.id === productId)
  if (!product) return

  this.selectedProductIdForReview = product.id
  this.selectedProductNameForReview = product.name
  this.selectedImageUrlForReview = product.imageUrl
  this.isReviewModalOpen = true
}
  closeReviewModal() {
  this.isReviewModalOpen = false
}

}
