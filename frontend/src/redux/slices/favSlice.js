import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const favSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.favItems.find(
        (item) => item.id === newItem.id
      );

      state.totalQuantity++;

      if (!existingItem) {
        state.favItems.push({
          id: newItem.id,
          label: newItem.label,
          dishType: newItem.dishType,
          cuisineType: newItem.cuisineType,
          image: newItem.image,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }

      state.totalAmount = state.favItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.favItems.find((item) => item.id === id);

      if (existingItem) {
        state.favItems = state.favItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.favItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },
  },
});

export const favActions = favSlice.actions;

export default favSlice.reducer;
