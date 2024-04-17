import { createReducer } from '@reduxjs/toolkit';
import { DefaultLocations } from '../mocks/location';
import { DefaultOffers } from '../mocks/offer';
import { OfferProps } from '../types/offer';
import { City } from '../types/location';
import { filterOffers, pickCity } from './action';
import { store } from '../store/index';

const INIT_LOCATION = DefaultLocations[3];

type initialStateType = {
    city: City;
    offers: OfferProps[];
}

const initialState: initialStateType = {
  city: INIT_LOCATION,
  offers: DefaultOffers
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(pickCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(filterOffers, (state, action) => {
      state.offers = action.payload;
    });
});

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
