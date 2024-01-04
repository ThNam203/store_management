"use client";

import { disablePreloader } from "@/reducers/preloaderReducer";
import AboutSectionOne from "./reason/AboutSectionOne";
import AboutSectionTwo from "./reason/reason-choose";
import Features from "./features";
import Hero from "./first-section/first-section";
import ScrollUp from "./components/scroll-up";
import { useDispatch } from "react-redux";
import Header from "./header";
import Footer from "./footer";

export default function HomePage() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
}
