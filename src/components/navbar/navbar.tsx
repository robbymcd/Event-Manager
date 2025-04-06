import React, { Fragment } from "react";
import pfpIcon from "../../../public/pfp.png"
import { useUser } from "@/app/context/userContext";
import Image from "next/image";
import ApproveEventsBtn from "../approveEventsBtn/approveEventsBtn";
import CreateEventBtn from "../createEventBtn/createEventBtn";
import JoinRSOBtn from "../joinRSOBtn/joinRSOBtn";
import { useRouter } from "next/navigation";

import styles from './navbar.module.css';

export default function Navbar() {

    const router = useRouter();
    const { user, logout } = useUser();

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    return (
        <div className={styles.navbar}>
            { user?.role === "student" && (
                <JoinRSOBtn />
            )}

            { user?.role === "admin" && (
                <div className="flex gap-4">
                    <JoinRSOBtn />
                    <CreateEventBtn />
                </div>
            )}

            { user?.role === "super-admin" && (
                <ApproveEventsBtn />
            )}
            <div className={styles.navbarRight}>
                <p className={styles.logout} onClick={handleLogout}>Logout</p>
                <Image src={pfpIcon} alt="Profile Picture" className={styles.profilePicture} width={40} height={40} />
            </div>
        </div>
    )
}