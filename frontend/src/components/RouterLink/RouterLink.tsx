import Link from 'next/link'
import styles from './RouterLink.module.scss'

const RouterLink = ({ key, href = "#", children, onClick, hover }:
    { key?: any | undefined, hover?: string, href: string | undefined, children: React.ReactNode, onClick?: any }) => {

    return (
        <Link className={styles.routerLink} key={key} href={href} onClick={onClick}
            style={{
                textDecoration: hover ? hover : "none"
            }}
        >
            {children}
        </Link>
    )
}

export default RouterLink