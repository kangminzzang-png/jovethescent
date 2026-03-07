/* JOVE THE SCENT — Auth System (Supabase) */
(function() {
  'use strict';

  let supabase = null;

  function init() {
    if (typeof window.supabase === 'undefined' && typeof window.Supabase === 'undefined') {
      console.warn('[JOVE Auth] Supabase SDK not loaded');
      return;
    }

    const cfg = window.JOVE_CONFIG;
    if (!cfg || cfg.SUPABASE_URL === 'YOUR_SUPABASE_URL') {
      console.warn('[JOVE Auth] Supabase not configured yet');
      updateNavUI(null);
      return;
    }

    const createClient = (window.supabase && window.supabase.createClient) || 
                         (window.Supabase && window.Supabase.createClient);
    if (!createClient) {
      console.warn('[JOVE Auth] createClient not found');
      return;
    }

    supabase = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      updateNavUI(session?.user || null);
      if (event === 'SIGNED_IN' && window.JoveCart) {
        // Link cart to user
        localStorage.setItem('jove_user_id', session.user.id);
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('jove_user_id');
      }
    });

    // Initial check
    supabase.auth.getUser().then(({ data }) => {
      updateNavUI(data?.user || null);
    });
  }

  /* ── Auth Functions ── */
  async function signUp(email, password, name) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    return { data, error };
  }

  async function signIn(email, password) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signOut() {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async function getUser() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  }

  async function getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  }

  async function updateProfile(updates) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    return { data, error };
  }

  async function resetPassword(email) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const isKr = window.location.pathname.includes('/kr/');
    const redirectTo = window.location.origin + (isKr ? '/kr/reset-password.html' : '/en/reset-password.html');
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { data, error };
  }

  async function updatePassword(newPassword) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  }

  async function signInWithProvider(provider) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    return { data, error };
  }

  /* ── Profile Data (from profiles table) ── */
  async function getProfile() {
    if (!supabase) return null;
    const user = await getUser();
    if (!user) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  }

  async function updateProfileData(updates) {
    if (!supabase) return { error: { message: 'Auth not configured' } };
    const user = await getUser();
    if (!user) return { error: { message: 'Not authenticated' } };
    const { data, error } = await supabase.from('profiles').upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() });
    return { data, error };
  }

  /* ── Nav UI Update ── */
  function updateNavUI(user) {
    const isKr = window.location.pathname.includes('/kr/');

    // Update all auth nav elements
    document.querySelectorAll('.nav-auth-link').forEach(el => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
        el.href = isKr ? 'mypage.html' : 'mypage.html';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        el.title = name;
      } else {
        el.href = isKr ? 'login.html' : 'login.html';
        el.innerHTML = isKr ? '로그인' : 'Sign In';
        el.title = '';
      }
    });
  }

  /* ── Route Protection ── */
  async function requireAuth() {
    const user = await getUser();
    if (!user) {
      const isKr = window.location.pathname.includes('/kr/');
      window.location.href = isKr ? 'login.html?redirect=' + encodeURIComponent(window.location.pathname) : 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return null;
    }
    return user;
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ── */
  window.JoveAuth = {
    signUp,
    signIn,
    signOut,
    getUser,
    getSession,
    updateProfile,
    resetPassword,
    updatePassword,
    signInWithProvider,
    getProfile,
    updateProfileData,
    requireAuth,
    get supabase() { return supabase; }
  };

})();
