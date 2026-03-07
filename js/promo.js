/* JOVE THE SCENT — Promo Code Module */

var JovePromo = (function() {
  'use strict';

  var client = null;

  function ensureClient() {
    if (client) return client;
    if (typeof supabase === 'undefined' || !JOVE_CONFIG) {
      console.warn('[Promo] Supabase not loaded');
      return null;
    }
    client = supabase.createClient(JOVE_CONFIG.SUPABASE_URL, JOVE_CONFIG.SUPABASE_ANON_KEY);
    return client;
  }

  /**
   * Validate a promo code for a specific product
   * @param {string} code - The promo code
   * @param {string} productId - Product ID (e.g., 'genesis-i')
   * @param {number} orderAmount - Order total in KRW
   * @returns {Promise<{valid: boolean, discount_amount?: number, error?: string}>}
   */
  async function validate(code, productId, orderAmount) {
    var sb = ensureClient();
    if (!sb) return { valid: false, error: 'system_error' };

    try {
      var { data, error } = await sb.rpc('validate_promo_code', {
        p_code: code,
        p_product_id: productId,
        p_order_amount: orderAmount || 0
      });

      if (error) {
        console.error('[Promo] Validation error:', error);
        return { valid: false, error: 'system_error' };
      }

      return data;
    } catch (e) {
      console.error('[Promo] Error:', e);
      return { valid: false, error: 'system_error' };
    }
  }

  /**
   * Redeem a promo code (mark as used)
   * @param {string} code
   * @returns {Promise<{success: boolean, discount_amount?: number}>}
   */
  async function redeem(code) {
    var sb = ensureClient();
    if (!sb) return { success: false, error: 'system_error' };

    var { data: { user } } = await sb.auth.getUser();
    if (!user) return { success: false, error: 'not_authenticated' };

    try {
      var { data, error } = await sb.rpc('redeem_promo_code', {
        p_code: code,
        p_user_id: user.id
      });

      if (error) {
        console.error('[Promo] Redeem error:', error);
        return { success: false, error: 'system_error' };
      }

      return data;
    } catch (e) {
      console.error('[Promo] Error:', e);
      return { success: false, error: 'system_error' };
    }
  }

  /**
   * Get error message in Korean/English
   */
  function getErrorMessage(errorCode, lang) {
    var messages = {
      ko: {
        invalid_or_expired: '유효하지 않거나 만료된 코드입니다.',
        product_not_eligible: '이 상품에는 적용할 수 없는 코드입니다.',
        min_amount_not_met: '최소 주문 금액을 충족하지 않습니다.',
        not_authenticated: '로그인이 필요합니다.',
        system_error: '시스템 오류가 발생했습니다.',
        invalid_or_used: '이미 사용된 코드이거나 유효하지 않습니다.'
      },
      en: {
        invalid_or_expired: 'Invalid or expired code.',
        product_not_eligible: 'This code cannot be applied to this product.',
        min_amount_not_met: 'Minimum order amount not met.',
        not_authenticated: 'Please sign in first.',
        system_error: 'A system error occurred.',
        invalid_or_used: 'Code already used or invalid.'
      }
    };

    var l = lang || (location.pathname.includes('/kr/') ? 'ko' : 'en');
    return (messages[l] && messages[l][errorCode]) || messages.en[errorCode] || errorCode;
  }

  // Public API
  return {
    validate: validate,
    redeem: redeem,
    getErrorMessage: getErrorMessage
  };
})();
