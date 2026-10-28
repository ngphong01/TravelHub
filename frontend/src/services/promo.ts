import api from '../lib/api';

export interface PromoCode {
  id: number;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  applicableTo: string;
  createdAt: string;
  updatedAt: string;
}

export const getActivePromos = async (limit?: number): Promise<PromoCode[]> => {
  const response = await api.get('/promo/active', {
    params: { limit }
  });
  return response.data;
};

export const validatePromoCode = async (code: string, amount: number): Promise<{ valid: boolean; code?: string; discountAmount?: number; message?: string }> => {
  const response = await api.get(`/promo/validate/${encodeURIComponent(code)}`, { params: { amount } });
  return response.data;
};

export const applyPromoCode = async (code: string, amount: number): Promise<{ success: boolean; discountAmount: number }> => {
  const response = await api.post('/promo/apply', { code, amount });
  return response.data;
};

export const getAllPromos = async (): Promise<PromoCode[]> => {
  const response = await api.get('/promo/active');
  return response.data;
};

