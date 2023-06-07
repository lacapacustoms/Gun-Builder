import React from 'react';
import styles from './loader.module.css';

const Loader = ({ isSun }) => {
    return (
        <div className={styles.loader}>
            <div className={`${styles.circle} ${isSun ? styles['circle--sun'] : ''}`}></div>
        </div>

    );
};

export default Loader;
