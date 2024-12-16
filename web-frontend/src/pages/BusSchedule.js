import React, {useEffect, useRef, useState} from 'react';
import axios from '../services/axiosConfig';
import {Messages} from 'primereact/messages';
import {Accordion, AccordionTab} from 'primereact/accordion';
import './styles/BusSchedule.css';
import {HomeIcon, User} from "lucide-react";

const categoryMapByTitle = {
    "Favila / Terminal": {
        1: "Terminal",
        2: "Pça. Getúlio Vargas – Fávila",
        3: "Fávila via Boa Vista",
        4: "Fávila",
    },
    "Ibirapuitã / Polivalente": {
        1: "Nova Brasília – Polivalente",
        2: "Polivalente",
        3: "Ibirapuitã",
        4: "Pedreiras – Ibirapuitã",
    },
    "Ibirapuitã / Prado": {
        1: "Prado",
        2: "Ibirapuitã",
    },
    "João XXIII / Nova Brasília": {
        1: "Medianeira – Nova Brasília",
        2: "Nova Brasília",
        3: "Nova Brasília até Balneário Caverá",
        4: "João XXIII até Medianeira",
        5: "João XXIII",
        6: "João XXIII até Medianeira via Santa Casa",
        7: "Balneário Caverá – João XXIII até Medianeira",
    },
    "Nova Brasília / Terminal": {
        1: "Terminal / UPA",
        2: "Balneário Caverá – Terminal / UPA",
        3: "Balneário Caverá",
        4: "Nova Brasília",
    },
    "Piola / Vila Nova": {
        1: "Vila Nova via Renascer",
        2: "Vila Nova",
        3: "Piola",
    },
    "Prado / Santa Casa": {
        1: "Loja Schein – Santa Casa / UPA",
        2: "Santa Casa / UPA",
        3: "Prado via Loja Schein",
        4: "Prado",
    },
    "Vera Cruz / Dr Romário": {
        1: "Dr. Romário",
        2: "Vera Cruz",
    },
    "Vera Cruz / Santos Dumont": {
        1: "Santos Dumont",
        2: "Vera Cruz",
    },
};

const BusSchedule = () => {
    const [url] = useState('https://onibus.online/empresas/expresso-fronteira-doeste-alegrete/');
    const [data, setData] = useState(null);
    const messagesRef = useRef(null);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`/bus/schedules/alegrete?url=${encodeURIComponent(url)}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            setData(response.data);
        } catch (error) {
            const errorMsg =
                error.response && error.response.status === 400
                    ? error.response.data
                    : 'Erro ao buscar horários';
            showError('error', 'Erro:', errorMsg);
        }
    };

    const showError = (severity, summary, detail) => {
        if (messagesRef.current) {
            messagesRef.current.clear();
            messagesRef.current.show({severity, summary, detail, life: 5000});
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const groupSchedulesByLocation = (title, schedules) => {
        const categoryMap = categoryMapByTitle[title] || {};
        const groupedSchedules = {};

        schedules.forEach((time) => {
            const lastDigit = parseInt(time.slice(-1), 10);
            const location = categoryMap[lastDigit] || "Desconhecido";
            if (!groupedSchedules[location]) {
                groupedSchedules[location] = [];
            }
            groupedSchedules[location].push(time);
        });

        return groupedSchedules;
    };

    const renderSchedules = () => {
        if (!data) return null;

        return (
            <Accordion multiple>
                {Object.entries(data).map(([title, locations]) => (
                    <AccordionTab key={title} header={<span className="title-header">{title}</span>}>
                        {Object.entries(locations).map(([location, dailySchedules]) => {
                            const groupedSchedules = {
                                "Dias Úteis": groupSchedulesByLocation(title, dailySchedules["Dias Úteis"] || []),
                                "Sábados": groupSchedulesByLocation(title, dailySchedules["Sábados"] || []),
                            };

                            return (
                                <div key={location} className="location-box">
                                    <h3>{location}</h3>
                                    <div className="day-group-container">
                                        {Object.entries(groupedSchedules).map(([dayType, locations]) => (
                                            <div key={dayType}
                                                 className={`day-type-box ${dayType === "Sábados" ? 'saturday-box' : 'weekday-box'}`}>
                                                <h4 className="day-title">{dayType}</h4>
                                                <div className="location-box-container">
                                                    {dayType === "Sábados" && Object.keys(locations).length === 0 ? (
                                                        <span className="no-schedule">Horários não encontrados para Sábados</span>
                                                    ) : (
                                                        Object.entries(locations).map(([group, times]) => (
                                                            <div key={group} className="location-group-box">
                                                                <h5 className="location-title">{group}</h5>
                                                                <div className="time-list">
                                                                    {times.length > 0 ? (
                                                                        times.map((time, index) => {
                                                                            const timeWithoutCategory = time.slice(0, -1);
                                                                            return (
                                                                                <span key={index} className="time-box">{timeWithoutCategory}</span>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <span className="no-schedule">Sem horários disponíveis</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </AccordionTab>
                ))}
            </Accordion>
        );
    };

    return (
        <div className="flex-col min-h-screen bg-[#e8f6e8]">
            <header className="bg-[#43A715] text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Unirides</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <a
                                    href="/home"
                                    className="flex items-center hover:text-[#2e760f] transition-colors"
                                >
                                    <HomeIcon className="w-5 h-5 mr-1"/>
                                    Home
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <div className="schedule-container">
                <div id="results">{renderSchedules()}</div>
                <Messages className="custom-toast" ref={messagesRef}/>
            </div>
            <footer className="bg-[#43A715] text-white py-4 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2023 RideShare. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default BusSchedule;
