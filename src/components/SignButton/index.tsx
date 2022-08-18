import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styled from './styles.module.scss';
export function SignButton() {
    const isUserLoggedIn = true;
    return isUserLoggedIn ? (
        <button type="button" className={styled.signInButton}>
            <FaGithub color="#04d361" /> Guilherme Leoni <FiX color="#737380" className={styled.closeIcon} />
        </button>
    ) : (
        <button type="button" className={styled.signInButton}>
            <FaGithub color="#eba417" /> Sign in with Github
        </button>
    );
}
