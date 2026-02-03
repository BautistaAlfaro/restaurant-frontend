import { Component, type OnInit, type AfterViewInit, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { NavbarComponent } from "../navbar/navbar.component"
import { FooterComponent } from "../footer/footer/footer.component"


interface ServiceCard {
  title: string
  description: string
  icon: string
  color: string
  route: string
  features: string[]
}

interface FeatureCard {
  title: string
  description: string
  icon: string
  color: string
}

interface Testimonial {
  name: string
  role: string
  comment: string
  rating: number
  image: string
}

interface Stat {
  number: string
  label: string
  icon: string
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  // Servicios principales
  mainServices: ServiceCard[] = [
    {
      title: "Reserva tu Mesa",
      description: "Sistema inteligente de reservas online con confirmación instantánea",
      icon: "calendar-check",
      color: "from-blue-500 to-blue-600",
      route: "/reserva",
      features: ["Reserva inmediata", "Selección de mesa", "Confirmación por email", "Cancelación flexible"],
    },
    {
      title: "Delivery Premium",
      description: "Disfruta nuestros platos en casa con entrega rápida y segura",
      icon: "truck-fast",
      color: "from-green-500 to-green-600",
      route: "/delivery",
      features: ["Entrega en 30 min", "Empaque ecológico", "Seguimiento en tiempo real", "Zona de cobertura amplia"],
    },
    {
      title: "Carta Digital",
      description: "Explora nuestro menú completo con descripciones detalladas",
      icon: "utensils",
      color: "from-purple-500 to-purple-600",
      route: "/carta",
      features: ["Menú actualizado", "Filtros por categoría", "Información nutricional", "Opciones especiales"],
    },
    {
      title: "Eventos Privados",
      description: "Organiza celebraciones únicas en nuestros espacios exclusivos",
      icon: "party-horn",
      color: "from-orange-500 to-orange-600",
      route: "/eventos",
      features: ["Salones privados", "Menús personalizados", "Decoración incluida", "Servicio especializado"],
    },
  ]
  // Características del restaurante
  features: FeatureCard[] = [
    {
      title: "Cocina de Autor",
      description: "Platos únicos creados por nuestro chef ejecutivo con ingredientes de primera calidad",
      icon: "heart",
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Ambiente Único",
      description: "Diseño interior cuidadosamente pensado para crear la atmósfera perfecta",
      icon: "heart",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Servicio Excepcional",
      description: "Personal altamente capacitado para brindarte una experiencia memorable",
      icon: "heart",
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Tecnología Avanzada",
      description: "Sistema integrado para una experiencia fluida desde la reserva hasta el pago",
      icon: "heart",
      color: "from-indigo-500 to-indigo-600",
    },
  ]
  // Testimonios
  testimonials: Testimonial[] = [
    {
      name: "María González",
      role: "Food Blogger",
      comment: "Una experiencia gastronómica excepcional. Cada plato es una obra de arte y el servicio es impecable.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Carlos Mendoza",
      role: "Chef Consultor",
      comment: "La calidad de los ingredientes y la técnica culinaria están al nivel de los mejores restaurantes.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      name: "Ana Rodríguez",
      role: "Crítica Gastronómica",
      comment: "Un lugar que redefine la experiencia culinaria con innovación y tradición en perfecta armonía.",
      rating: 4,
      image:"https://randomuser.me/api/portraits/women/34.jpg",
    },
  ]
  // Estadísticas
  stats: Stat[] = [
    { number: "500+", label: "Clientes Satisfechos", icon: "users" },
    { number: "50+", label: "Platos Únicos", icon: "utensils" },
    { number: "5★", label: "Calificación Promedio", icon: "star" },
    { number: "3", label: "Años de Experiencia", icon: "calendar" },
  ]
  // Horarios
  businessHours = [
    { day: "Lunes - Jueves", hours: "12:00 - 23:00" },
    { day: "Viernes - Sábado", hours: "12:00 - 01:00" },
    { day: "Domingo", hours: "12:00 - 22:00" },
  ]

  constructor() {}

   ngOnInit(): void {

}


  ngAfterViewInit(): void {
    this.initializeAnimations()
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(): void {
    this.handleScrollAnimations()
  }

  private initializeAnimations(): void {
    // Inicializar animaciones de elementos flotantes
    this.animateFloatingElements()
  }

  private animateFloatingElements(): void {
    const shapes = document.querySelectorAll(".floating-shape")
    shapes.forEach((shape, index) => {
      const element = shape as HTMLElement
      element.style.animationDelay = `${index * 0.5}s`
    })
  }

  private handleScrollAnimations(): void {
    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isVisible) {
        element.classList.add("animated")
      }
    })
  }

  // Método para generar array de estrellas
  generateRatingArray(rating: number): number[] {
    return Array(rating).fill(0)
  }

  // Método para obtener rutas SVG según el icono
  getFeaturePath(icon: string): string {
    const iconPaths: { [key: string]: string } = {
      'heart': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      'utensils': 'M3 2v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V2M7 2v10m6 0v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V2M17 2v10',
      'star': 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
      'shield': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      'globe': 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
      'crown': 'M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2v11a2 2 0 002 2z'
    }
    return iconPaths[icon] || iconPaths['star']
  }

  // Método para scroll suave a secciones
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
}
