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
              href="https://github.com/"
              size="md"
              color="animated" //
            >
              <Icon name="github" size={'md'} />
            </Button>
          </li>

          <li>
            <Button className={styles.button} href="https://github.com/" size="md" color="animated">
              <Icon name="docs" size={'md'} />
            </Button>
          </li>

          <li>
            <Button className={styles.button} href="https://github.com/" size="md" color="animated">
              <Icon name="bug" size={'md'} />
            </Button>
          </li>
        </ul>

        <div className={styles.copyright}> Projeto Univesp 2026.</div>
      </div>
    </footer>
  );
}

export default Footer;
