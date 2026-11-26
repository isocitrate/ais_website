import Link from "next/link";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";

export const metadata = {
  title: "Coming soon - AI Safety Group @ UChicago XLab",
};

export default function ComingSoon() {
  return (
    <PageLayout
      stuckBall
      title="This page doesn't exist yet."
      lede={
        <p>
          You&apos;ve found a local minimum. We&apos;re still working on it, so please check back soon (or
          click anywhere above to try another descent).
        </p>
      }>
      <Link href="/" className={styles.homeLink}>
        Back to home
      </Link>
    </PageLayout>
  );
}
