// Use throughout your app instead of plain `useDispatch` and `useSelector`

import { AppDispatch, RootState } from "@app/store";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
