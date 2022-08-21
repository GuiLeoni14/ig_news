import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter();
    const className = asPath === rest.href ? activeClassName : '';
    // cloneElement clone o elemento vindo de children e adiciona á propriedade "className"
    return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
