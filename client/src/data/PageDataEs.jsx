const brandLogo = "/logo.svg";
export const generalData = {
  navbarContent: {
    brand: brandLogo,
    navItems: [
      { text: "Inicio", href: "/" },
      { text: "Características", href: "/features" },
      { text: "Acerca de", href: "/about" },
      { text: "Privacidad", href: "/privacy" },
    ],
  },
  heroes: [
    {
      title: "¿Dónde se almacena mi código?",
      description: "Todo su código se almacenará de forma segura en su repositorio de GitHub. Puede acceder y gestionar su código en cualquier momento.",
      image: "github.svg",
    },
    {
      title: "¿Acceso a todo su código?",
      description: "No, solo solicitamos acceso a sus repositorios públicos. Code Library solo creará repositorios públicos, asegurando que su código privado permanezca privado.",
      image: "access.png",
      reverse: true,
    },
    {
      title: "Selección de múltiples documentos",
      description: "Puede subir hasta 4 archivos de código a la vez, y nuestro sistema generará 4 archivos markdown con documentación. Los usuarios Pro pueden subir hasta 10 archivos al mismo tiempo para mayor conveniencia.",
      image: "doc.png",
    },
    {
      title: "Impulsado por OpenAI",
      description: "Con la ayuda de OpenAI, puede subir hasta 4 archivos de código a la vez, y nuestro sistema generará 4 archivos markdown con documentación detallada. Los usuarios Pro pueden subir hasta 10 archivos a la vez.",
      image: "gpt.png",
      reverse: true,
    },
  ],
  services: [
    {
      image: "logo.svg",
      title: "Organice su código",
      description: "Organice su código en un solo repositorio o en varios. Estructure su repositorio utilizando un diseño predeterminado o el suyo propio.",
    },
    {
      image: "logo.svg",
      title: "Transforme múltiples archivos",
      description: "Suba hasta 4 archivos a la vez. Los usuarios Pro pueden transformar hasta 10-20 archivos al mismo tiempo.",
    },
    {
      image: "logo.svg",
      title: "Personalice las instrucciones",
      description: "Personalice las instrucciones que aparecen en el archivo markdown. Agregue o elimine según sea necesario.",
    },
    {
      image: "logo.svg",
      title: "Multilingüe",
      description: "Escriba instrucciones en su idioma preferido (inglés, español, chino y más).",
    },
    {
      image: "logo.svg",
      title: "Juegue con su código",
      description: "Pruebe nuestro nuevo playground donde puede convertir código a diferentes lenguajes de programación, optimizarlo y más.",
    },
    {
      image: "logo.svg",
      title: "Descargue sus archivos",
      description: "Descargue su código, el directorio completo o su archivo markdown con toda la documentación que necesita.",
    },
  ],

  feature: {
    title: "¿Cómo funciona?",
    description: "Simplemente arrastre su código y, con la ayuda de la IA, obtendrá un archivo markdown con la documentación de su código.",
    backgroundColor: "bg-orange-50",
  },

  additionalSection: {
    title: "¿Por qué esperar? Pruébelo usted mismo",
    description: "Con Code Library, puede soltar su código fácilmente, crear documentación y construir su guía o biblioteca de componentes. Encuentre todos sus componentes en un solo lugar y nunca pierda su código.",
    buttonText: "Empieza ahora",
    buttonLink: "/auth/github",
  },

  footerData: {
    brand: brandLogo,
    sections: [
      {
        title: "Empresa",
        links: [
          { text: "Sobre nosotros", href: "#" },
          { text: "Carreras", href: "#" },
          { text: "Prensa", href: "#" },
          { text: "Noticias", href: "#" },
          { text: "Kit de medios", href: "#" },
          { text: "Contacto", href: "#" },
        ],
      },
      {
        title: "Soporte",
        links: [
          { text: "Centro de ayuda", href: "#" },
          { text: "Preguntas frecuentes", href: "#" },
          { text: "Contactar soporte", href: "#" },
          { text: "Estado", href: "#" },
        ],
      },
      {
        title: "Redes Sociales",
        links: [
          { text: "Facebook", href: "https://facebook.com" },
          { text: "Twitter", href: "https://twitter.com" },
          { text: "LinkedIn", href: "https://linkedin.com" },
          { text: "Instagram", href: "https://instagram.com" },
        ],
      },
    ],
  },
};

export const homePageData = {
  mainSection: {
    description: "Almacene su código, cree guías útiles, construya una biblioteca de componentes o documente su código. Nuestras herramientas de IA lo hacen fácil.",
    title: "Bienvenido a \n Code Library",
  },
  additionalSection: {
    title: "¿Por qué usar Code Library si puedo usar GitHub directamente?",
    description: "Con Code Library, puede soltar su código fácilmente, crear documentación y construir su guía o biblioteca de componentes. Encuentre todos sus componentes en un solo lugar y nunca pierda su código.",
    buttonText: "Empieza ahora",
    buttonLink: "/auth/github",
  },
};

export const aboutPageData = {
  featureTitle: "¿Por qué este proyecto?",
  featureDescription: "Mi motivación surge de crear muchos componentes en diferentes plantillas y proyectos. Cuando intentaba encontrarlos, era difícil buscar en todos los repositorios. Estaba perdiendo código, y entender para qué servía cada fragmento de código requería examinar el código en sí.",
  heroSections: [
    {
      title: "¿Por qué no un solo repositorio con todos los componentes?",
      image: "/code.png",
      description: "Intenté usar Storybook, pero terminé escribiendo más código del previsto. Gestionar diferentes versiones de un solo componente se volvió cada vez más difícil.",
    },
    {
      title: "La oportunidad de la IA",
      image: "/programing/11.svg",
      description: "La IA presenta la oportunidad de documentar, cambiar, optimizar o transformar el código fácilmente. La IA maneja el trabajo difícil, permitiéndome simplemente proporcionar el código.",
      reverse: true,
    },
    {
      title: "¿Por qué GitHub?",
      image: "/github.svg",
      description: "GitHub no solo ofrece almacenamiento gratuito, sino que también es un lugar ideal para almacenar todo su código.",
    },
    {
      title: "¿Por qué crear archivos markdown?",
      image: "/astro.png",
      description: "La documentación del código a menudo se escribe en archivos markdown, lo que permite una visión rápida de lo que trata el código sin necesidad de profundizar en el código en sí. Además, las funciones de markdown de Astro permiten crear páginas estáticas.",
      reverse: true,
    },
  ],
  additionalSection: {
    title: "¿Por qué usar Code Library en lugar de GitHub directamente?",
    description: "Con Code Library, puede soltar su código fácilmente, crear documentación y construir una biblioteca de componentes. Encuentre todos sus componentes en un solo lugar y nunca pierda su código.",
    buttonText: "Empieza ahora",
    buttonLink: "/auth/github",
  },
};


export const privacyPolicyPageData = {
    title: "Política de Privacidad",
    description: "En Code Library, nos tomamos tu privacidad en serio. Esta política describe qué información recopilamos y cómo la usamos.",
    sections: [
      {
        title: "No Recopilación de Datos de Usuario",
        content: "No recopilamos ningún dato de usuario. Esto incluye, pero no se limita a, tu información personal, credenciales de inicio de sesión, código u otros datos."
      },
      {
        title: "Inicio de Sesión en GitHub",
        content: "Solicitamos tu inicio de sesión en GitHub únicamente para gestionar y crear repositorios públicos en tu nombre. No accedemos a ninguno de tus repositorios privados ni a los repositorios de tu organización. Además, no realizamos ninguna acción para eliminar repositorios."
      },
      {
        title: "Gestión de Repositorios Públicos",
        content: "Nuestra aplicación solo interactúa con repositorios públicos. Esto asegura que tu código privado permanezca seguro e inaccesible para nuestra plataforma."
      },
      {
        title: "No Registro de Información",
        content: "No registramos ninguna información relacionada con tu inicio de sesión o código. Nuestro sistema está diseñado para operar sin almacenar ni rastrear tus datos."
      },
      {
        title: "Seguridad",
        content: "Estamos comprometidos a garantizar que tu información esté segura. Aunque no recopilamos ni almacenamos tus datos, utilizamos métodos seguros para interactuar con GitHub, asegurando que tus credenciales de inicio de sesión y repositorios se gestionen de forma segura."
      },
      {
        title: "Cambios en esta Política",
        content: "Podemos actualizar esta política de privacidad de vez en cuando. Cualquier cambio será publicado en esta página, y te animamos a revisar nuestra política periódicamente."
      },
      {
        content: "Al utilizar Code Library, aceptas esta política de privacidad. Si tienes alguna pregunta o inquietud, por favor contáctanos."
      }
    ]
  };