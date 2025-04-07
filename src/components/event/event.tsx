"use client"
import Link from 'next/link';

import { Badge } from '../ui/badge';

import styles from './event.module.css'
import { EventType } from '@/app/interfaces/event';

export default function Event({ id, name, category, event_time, location, contact_phone, contact_email, rso }: EventType) {
    
    const formatEventTime = (timestamp: string) => {
        const date = new Date(timestamp);
        
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        
        // Safe way to parse the formatted date
        const monthDayRegex = /([A-Za-z]+\s\d+),\s(\d{4}),\s(.+)/;
        const match = formattedDate.match(monthDayRegex);
        
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
        } else {
            // Fallback approach if regex doesn't match
            const dateParts = formattedDate.split(',').map(part => part.trim());
            const monthDay = dateParts[0];
            const year = dateParts.length > 1 ? dateParts[1] : '';
            const time = dateParts.length > 2 ? dateParts[2] : '';
            
            return `${monthDay} ${year} ${time}`;
        }
    };
    
    return (
        <div className={styles.event}>
            <div className="flex flex-row gap-5 items-center">
                <Link href={`/event/${id}`} className={styles.eventLink}>{name}</Link>
                {category === 'rso' ? (
                    <Badge variant="outline" className={styles.badge}>{rso}</Badge>
                ) : (
                    <Badge variant="outline" className={styles.badge}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
                )}
            </div>
            <h2 className={styles.eventTime}>{formatEventTime(event_time)}</h2>
            <h3 className={styles.eventLocation}>{location}</h3>
            <div className={styles.eventContact}>
                <h2>Contact Info:</h2>
                <p>{contact_email}</p>
                <p>{contact_phone}</p>
            </div>
        </div>
    )
}