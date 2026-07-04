'use client';

import { useAuth } from './AuthProvider';
import styles from './AuthStatus.module.scss';

interface AuthStatusProps {
  /** Open the sign-in modal (owned by the reading flow). */
  onSignIn: () => void;
  /** Open the seeker's profile (signed-in only; owned by the reading flow). */
  onOpenProfile: () => void;
}

/**
 * Quiet corner chip: who is signed in (name opens the profile, + sign out),
 * or a "Sign in" invite for guests. Hidden while the stored session is still
 * being restored.
 */
export function AuthStatus({ onSignIn, onOpenProfile }: AuthStatusProps) {
  const { status, user, signOut } = useAuth();

  if (status === 'loading') return null;

  return (
    <div className={styles.corner}>
      {status === 'authed' && user ? (
        <>
          <button
            type="button"
            className={styles.name}
            title="Your profile"
            onClick={onOpenProfile}
          >
            ☾ {user.name}
          </button>
          <button type="button" className={styles.action} onClick={signOut}>
            Sign out
          </button>
        </>
      ) : (
        <button type="button" className={styles.action} onClick={onSignIn}>
          Sign in
        </button>
      )}
    </div>
  );
}
