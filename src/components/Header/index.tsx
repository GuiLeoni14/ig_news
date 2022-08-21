import { useRouter } from 'next/router';
import { ActiveLink } from '../ActiveLink';
import { SignButton } from '../SignButton';
import styles from './styles.module.scss';

export function Header() {
    const { asPath } = useRouter();
    console.log(asPath === '/');
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SignButton />
            </div>
        </header>
    );
}
