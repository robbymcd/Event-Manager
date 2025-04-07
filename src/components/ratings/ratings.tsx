import Image from 'next/image';

import star from '../../../public/star.png';
import styles from './ratings.module.css';

export default function Ratings() {
    return (
        <div className={styles.ratingsContainer}>
            <Image src={star} alt="Star" height={30} width={30} />
            <Image src={star} alt="Star" height={30} width={30} />
            <Image src={star} alt="Star" height={30} width={30} />
            <Image src={star} alt="Star" height={30} width={30} />
            <Image src={star} alt="Star" height={30} width={30} />
        </div>
    )
}