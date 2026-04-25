import styles from './Footer.module.scss';

import Logo from '@components/common/Logo/Logo';
import Button from '@components/common/Button/Button';
import Icon from '@components/common/Icon/Icon';

function Footer() {
  return (
    <footer className={styles.footerArea}>
      <div className={styles.footer}>
        <Logo size="sm" />

        <ul className={styles.links}>
          <li>
            <Button
              className={styles.button}
              href="https://github.com/VegaKunn/projeto-barbearia-univesp"
              size="md"
              color="animated" //
            >
              <Icon name="github" size={'md'} />
            </Button>
          </li>

          <li>
            <Button
              className={styles.button}
              href="https://github.com/VegaKunn/projeto-barbearia-univesp/tree/master/docs"
              size="md"
              color="animated"
            >
              <Icon name="docs" size={'md'} />
            </Button>
          </li>

          <li>
            <Button
              className={styles.button}
              href="https://github.com/VegaKunn/projeto-barbearia-univesp/issues/new"
              size="md"
              color="animated"
            >
              <Icon name="bug" size={'md'} />
            </Button>
          </li>
        </ul>

        <div style={{ color: '#fff' }}>&copy; {new Date().getFullYear()} DRP01 - Grupo 12.</div>
      </div>
    </footer>
  );
}

export default Footer;
