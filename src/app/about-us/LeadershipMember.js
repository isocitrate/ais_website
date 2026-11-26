import Image from "next/image";
import styles from "./LeadershipMember.module.css";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Long emails wrap after "@" (not mid-word) on narrow screens.
export function Email({ address }) {
  const [user, domain] = address.split("@");
  return (
    <>
      {user}@<wbr />
      {domain}
    </>
  );
}

export default function LeadershipMember({ imgUrl, memberName, memberRole, memberEmail, bookingUrl, objectPosition = "center top" }) {
  return (
    <div className={styles.leaderContainer}>
      {imgUrl ? (
        <div className={styles.photo}>
          <Image
            src={imgUrl}
            alt={`${memberName} profile`}
            fill
            sizes="(max-width: 800px) 90vw, 30vw"
            className={styles.profileImg}
            style={{ objectPosition }}
          />
        </div>
      ) : (
        <div className={styles.initialsPlaceholder}>{getInitials(memberName)}</div>
      )}
      <h3 className={styles.memberName}>{memberName}</h3>
      <p className={styles.memberRole}>{memberRole}</p>
      {memberEmail && (
        <a href={`mailto:${memberEmail}`} className={styles.memberEmail}>
          <Email address={memberEmail} />
        </a>
      )}
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.bookingLink}
        >
          Book a meeting
        </a>
      )}
    </div>
  );
}
