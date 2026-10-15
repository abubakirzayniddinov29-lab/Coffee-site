import { createContext, useContext } from 'react';

type OrderCtx = { openOrder: (drinkId?: string) => void };

export const OrderContext = createContext<OrderCtx>({ openOrder: () => {} });
export const useOrder = () => useContext(OrderContext);
