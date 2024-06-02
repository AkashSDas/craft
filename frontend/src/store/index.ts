import { UnknownAction, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { editorSlice } from "./editor/slice";

export const store = configureStore({
    reducer: {
        editor: editorSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    UnknownAction
>;
