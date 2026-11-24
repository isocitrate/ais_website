import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <div className={styles.brandGroup}>
              <Link href="/" aria-label="AI Safety Group home">
                <Image
                  src="/lockup1_red.png"
                  alt="AI Safety Group at UChicago XLab"
                  width={1731}
                  height={380}
                  priority
                  className={styles.footerLockupLight}
                />
                <Image
                  src="/lockup1_white.png"
                  alt="AI Safety Group at UChicago XLab"
                  width={1731}
                  height={379}
                  priority
                  className={styles.footerLockupDark}
                />
              </Link>
            </div>
            <p className={styles.location}>University of Chicago · Chicago, IL</p>
          </div>

          <div className={styles.columns}>
            <div className={styles.column}>
              <p className={styles.columnTitle}>Explore</p>
              <Link href="/about-us">About Us</Link>
              <Link href="/research">Research</Link>
              <Link href="/fellowships">Fellowships</Link>
              <Link href="/events">Events</Link>
              <Link href="/leadership">Leadership</Link>
            </div>
            <div className={styles.column}>
              <p className={styles.columnTitle}>Connect</p>
              <Link href="/get-involved" className={styles.columnCta}>
                Get Involved <span aria-hidden="true">→</span>
              </Link>
              <a
                href="https://lists.uchicago.edu/web/info/aisafety"
                target="_blank"
                rel="noopener noreferrer">
                Mailing List
              </a>
              <a
                href="https://join.slack.com/t/xlab-uchicago/shared_invite/zt-47zdem4lv-vncDwWYv3WTBCHvK8ZgN8Q"
                target="_blank"
                rel="noopener noreferrer">
                Slack
              </a>
              <a href="https://xrisk.uchicago.edu/" target="_blank" rel="noopener noreferrer">
                XLab
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>
            &copy; {new Date().getFullYear()} AI Safety Group @ UChicago XLab. A program of the
            University of Chicago&apos;s Existential Risk Laboratory.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
