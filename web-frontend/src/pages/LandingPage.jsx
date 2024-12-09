import React from 'react'
import { motion } from 'framer-motion'
import { Car, Users, Clock, Shield, ArrowRight } from 'lucide-react'

function Hero() {
  return (
    <section className="bg-gradient-to-b from-green-600 to-green-700 text-white py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Compartilhe caronas, economize e faça amigos
        </motion.h2>
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Unirides conecta estudantes universitários para viagens seguras e econômicas. Junte-se à nossa comunidade hoje!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="/cadastro"
            className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-100 transition-colors inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Comece Agora
            <ArrowRight className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

const features = [
  {
    icon: <Car className="w-12 h-12 text-green-600" />,
    title: "Caronas Confiáveis",
    description: "Conecte-se com motoristas verificados da sua universidade."
  },
  {
    icon: <Users className="w-12 h-12 text-green-600" />,
    title: "Comunidade Universitária",
    description: "Viaje com colegas que compartilham seu caminho."
  },
  {
    icon: <Clock className="w-12 h-12 text-green-600" />,
    title: "Flexibilidade de Horários",
    description: "Encontre caronas que se ajustem à sua agenda de aulas."
  },
  {
    icon: <Shield className="w-12 h-12 text-green-600" />,
    title: "Segurança Primeiro",
    description: "Viagens seguras com verificação de perfis e avaliações."
  }
]

function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Por que escolher Unirides?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    name: "Ana Silva",
    role: "Estudante de Engenharia",
    content: "Unirides transformou minha rotina universitária. Economizo tempo e dinheiro, além de fazer novas amizades!",
    avatar: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "Carlos Oliveira",
    role: "Estudante de Medicina",
    content: "A segurança e confiabilidade do Unirides me conquistaram. Recomendo a todos os colegas de faculdade!",
    avatar: "/placeholder.svg?height=80&width=80"
  }
]

function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">O que nossos usuários dizem</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-gray-600 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Unirides
          </motion.h1>
          <nav>
            <ul className="flex space-x-4">
              <motion.li
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <a href="/login" className="bg-white text-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-100 transition-colors">
                  Acessar Conta
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <a href="/cadastro" className="bg-green-700 text-white px-4 py-2 rounded-full font-medium hover:bg-green-800 transition-colors">
                  Registrar
                </a>
              </motion.li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Unirides. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
