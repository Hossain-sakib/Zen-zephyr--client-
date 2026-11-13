import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { FiArrowUpRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../Hooks/useAuth';
import { useCommunity, errorMessage } from './core-context';
export function AuthPage({ signup = false }) {
  const { signInUser, signUpUser, googleSignIn, updateUser } = useAuth();
  const { api, toast } = useCommunity();
  const navigate = useNavigate();
  const cache = useQueryClient();
  const location = useLocation();
  const from = location.state?.from;
  const destination =
    from?.pathname?.startsWith('/') && !from.pathname.startsWith('//')
      ? from.pathname + (from.search || '')
      : '/';
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function handle(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      if (signup) {
        const result = await signUpUser(data.get('email'), data.get('password'));
        await updateUser(data.get('name'), result.user.photoURL || null);
        await api.post('/users', { name: data.get('name'), userImage: '' });
        await api.patch('/community/me', { name: data.get('name'), bio: '', location: '' });
      } else await signInUser(data.get('email'), data.get('password'));
      cache.invalidateQueries({ queryKey: ['community'] });
      navigate(destination);
      toast(signup ? 'You belong here. Welcome to Zen Zephyr.' : 'Good to have you back.');
    } catch (e) {
      setError(
        e.code === 'auth/email-already-in-use'
          ? 'That email already has a home here. Try logging in.'
          : e.code?.startsWith('auth/')
            ? 'We couldn’t sign you in. Check your details and try again.'
            : signup
              ? 'Your account may have been created, but we couldn’t finish your profile. Try logging in.'
              : errorMessage(e),
      );
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setBusy(true);
    setError('');
    try {
      const result = await googleSignIn();
      await api.post('/users', { name: result.user.displayName, userImage: result.user.photoURL });
      cache.invalidateQueries({ queryKey: ['community'] });
      navigate(destination);
    } catch {
      setError('Google sign-in could not finish. Please try again or use email.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="cz-auth-page">
      <div className="cz-auth-intro">
        <span className="cz-eyebrow">A LITTLE MORE HUMAN</span>
        <h1>{signup ? 'Your people are out there.' : 'Good to have you back.'}</h1>
        <p>
          {signup
            ? 'Find them here. Share your world, follow your curiosity, and make a few good connections along the way.'
            : 'Your conversations, your connections, your little corner of the internet.'}
        </p>
        <div className="cz-auth-art" aria-hidden="true">
          ✳
          <span>
            you belong
            <br />
            here.
          </span>
          <i>✦</i>
        </div>
      </div>
      <section className="cz-card cz-auth-form">
        <h2>{signup ? 'Make yourself at home.' : 'Welcome home.'}</h2>
        <p>
          {signup ? 'Create your free community account.' : 'Log in to your Zen Zephyr account.'}
        </p>
        <button className="cz-button google" onClick={google} disabled={busy}>
          <FcGoogle />
          Continue with Google
        </button>
        <div className="cz-auth-divider">
          <span>or use your email</span>
        </div>
        <form onSubmit={handle}>
          {signup && (
            <label>
              Your name
              <input
                name="name"
                placeholder="What should we call you?"
                autoComplete="name"
                required
                maxLength={120}
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <div className="cz-password">
              <input
                name="password"
                type={show ? 'text' : 'password'}
                placeholder={signup ? 'At least 8 characters' : 'Your password'}
                minLength={signup ? 8 : undefined}
                autoComplete={signup ? 'new-password' : 'current-password'}
                required
              />
              <button
                type="button"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow(!show)}
              >
                {show ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
          {error && (
            <p className="cz-inline-error" role="alert">
              {error}
            </p>
          )}
          <button className="cz-button primary" disabled={busy}>
            {busy ? 'One moment…' : signup ? 'Join the community' : 'Log in'}
            <FiArrowUpRight />
          </button>
        </form>
        <p className="cz-auth-switch">
          {signup ? 'Already found your place?' : 'New around here?'}{' '}
          <Link to={signup ? '/signin' : '/signup'}>{signup ? 'Log in' : 'Join us'}</Link>
        </p>
        {signup && (
          <small className="cz-auth-terms">
            By joining, you agree to follow our <Link to="/guidelines">community guidelines</Link>.
          </small>
        )}
      </section>
    </div>
  );
}
AuthPage.propTypes = { signup: PropTypes.bool };
