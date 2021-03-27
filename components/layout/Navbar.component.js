import React from 'react'
import { useRouter } from 'next/router';
import styles from '../../styles/navbar.module.css';

const Navbar = () => {
    const router = useRouter();
    return (
        <div className={styles.navbar}>
            <div className={styles.logo}><h1>BM_Blogs</h1></div>
            <ul className={styles.item_list}>
                <li className={styles.list_item}><a onClick={() => router.push('/')}>Home</a></li>
                <li className={styles.list_item}><a href="#">About</a></li>
                <li className={styles.list_item}><a href="#">Contact</a></li>
            </ul>
        </div>
    )
}

export default Navbar;
