"use client"
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/navbar/navbar";
import Event from '@/components/event/event';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { useUser } from "../context/userContext"; 

import styles from './page.module.css';

interface Event {
    id: number;
    name: string;
    category: string;
    event_time: string;
    location: string;
    contact_phone: string;
    contact_email: string;
    rso?: string;
}

export default function Dashboard() {

    const { user } = useUser();

    console.log("User in Dashboard:", user);

    // fetch events from the server
    const [events, setEvents] = useState<Event[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(5);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const dummyEvents: Event[] = [
                    {
                        id: 1,
                        name: "Tech Conference 2023",
                        category: "public",
                        event_time: "2023-10-15 10:00",
                        location: "Main Auditorium, Tech University",
                        contact_phone: "123-456-7890",
                        contact_email: "testing@ucf.edu",
                    },
                    {
                        id: 2,
                        name: "Art Exhibition",
                        category: "private",
                        event_time: "2023-10-20 18:00",
                        location: "Art Gallery, Downtown",
                        contact_phone: "987-654-3210",
                        contact_email: "testing2@ucf.edu",
                    },
                    {
                        id: 3,
                        name: "Community Cleanup",
                        category: "rso",
                        event_time: "2023-10-22 09:00",
                        location: "City Park, Main Entrance",
                        contact_phone: "555-123-4567",
                        contact_email: "testing3@ucf.edu",
                        rso: "Eco Warriors"
                    },
                    {
                        id: 4,
                        name: "Community Cleanup",
                        category: "rso",
                        event_time: "2023-10-22 09:00",
                        location: "City Park, Main Entrance",
                        contact_phone: "555-123-4567",
                        contact_email: "testing3@ucf.edu",
                        rso: "Eco Warriors"
                    },
                    {
                        id: 5,
                        name: "Tech Conference 2023",
                        category: "public",
                        event_time: "2023-10-15 10:00",
                        location: "Main Auditorium, Tech University",
                        contact_phone: "123-456-7890",
                        contact_email: "testing@ucf.edu",
                    },
                    {
                        id: 6,
                        name: "Art Exhibition",
                        category: "private",
                        event_time: "2023-10-20 18:00",
                        location: "Art Gallery, Downtown",
                        contact_phone: "987-654-3210",
                        contact_email: "testing2@ucf.edu",
                    },
                    {
                        id: 7,
                        name: "Community Cleanup",
                        category: "rso",
                        event_time: "2023-10-22 09:00",
                        location: "City Park, Main Entrance",
                        contact_phone: "555-123-4567",
                        contact_email: "testing3@ucf.edu",
                        rso: "Eco Warriors"
                    },
                    {
                        id: 8,
                        name: "Community Cleanup",
                        category: "rso",
                        event_time: "2023-10-22 09:00",
                        location: "City Park, Main Entrance",
                        contact_phone: "555-123-4567",
                        contact_email: "testing3@ucf.edu",
                        rso: "Eco Warriors"
                    }
                ]
                setEvents(dummyEvents);
                //const response = await fetch(`http://localhost:3000/api/events?role=${user?.role}&rso=${user?.rso}&university=${user?.university}`, {
                //    method: 'GET',
                //    headers: {
                //        'Content-Type': 'application/json',
                //    },
                //});
                //const data = await response.json();
                //setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };
        fetchEvents();
    }, []);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <h1 className={styles.headerText}>Events</h1>
                <div className={styles.eventsContainer}>
                    {events.length > 0 ? (
                        currentEvents.map((event: any) => (
                            <Event
                                key={event.id}
                                id={event.id}
                                name={event.name}
                                category={event.category}
                                event_time={event.event_time}
                                location={event.location}
                                contact_phone={event.contact_phone}
                                contact_email={event.contact_email}
                                rso={event.rso}
                            />
                        ))
                    ) : (
                        <p className={styles.noEventsText}>No events found.</p>
                    )}
                </div>
                {events.length > eventsPerPage && (
                    <Pagination className={styles.pagination}>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? styles.disabled : ''}
                                />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(page)}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                                <PaginationNext 
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? styles.disabled : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}