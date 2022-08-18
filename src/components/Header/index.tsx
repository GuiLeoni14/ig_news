import { SignButton } from '../SignButton';
import styled from './styles.module.scss';

export function Header() {
    return (
        <header className={styled.headerContainer}>
            <div className={styled.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <a href="#" className={styled.active}>
                        home
                    </a>
                    <a href="#">posts</a>
                </nav>
                <SignButton />
            </div>
        </header>
    );
}
