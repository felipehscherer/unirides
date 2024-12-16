import React from 'react';
import {Bus, Calendar, Car, Clock, Hourglass, Search, User} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#e8f6e8]">
      <header className="bg-[#43A715] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Unirides</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="/perfil"
                  className="flex items-center hover:text-[#2e760f] transition-colors"
                >
                  <User className="w-5 h-5 mr-1" />
                  Meu Perfil
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Minhas Caronas"
            icon={<Calendar className="w-8 h-8 text-[#43A715]" />}
            description="Veja suas caronas agendadas e histórico."
            link="/minhas-caronas"
          />
          <Card
            title="Buscar Carona"
            icon={<Search className="w-8 h-8 text-[#43A715]" />}
            description="Encontre caronas para seu destino."
            link="/caronas"
          />
          <Card
            title="Oferecer Carona"
            icon={<Car className="w-8 h-8 text-[#43A715]" />}
            description="Ofereça uma carona e ajude a comunidade."
            link="/cadastro-carona"
          />
          <Card
              title="Horário de Ônibus"
              icon={<Clock className="w-8 h-8 text-[#43A715]" />}
              description="Consulte os horários de ônibus disponíveis."
              link="/onibus/horarios/alegrete"
          />
          <Card
              title="Rotas de Onibus"
              icon={<Bus className="w-8 h-8 text-[#43A715]" />}
              description="Consulte os ônibus necessários para seu trajeto."
              link="/rotas-onibus"
          />
        </div>
      </main>

      <footer className="bg-[#43A715] text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2023 RideShare. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

interface CardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  link: string;
}

function Card({ title, icon, description, link }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-[#d8f2d8] rounded-full mb-4 mx-auto">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-center">{description}</p>
      </div>
      <div className="bg-[#43A715] px-4 py-2">
        <a href={link} className="text-white text-center block hover:underline">
          Acessar
        </a>
      </div>
    </div>
  );
}
